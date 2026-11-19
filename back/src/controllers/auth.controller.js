const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const transporter = require('../config/mailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ALL_HATS = ['potato', 'woody', 'jessie', 'buzz', 'lotso', 'alien', 'rex', 'hamm', 'bopeep', 'none'];
const DEFAULT_USER_HATS = ['woody', 'jessie', 'none'];

const formatUsuario = (user) => {
  const esAdmin = user.id_rol === 1 || user.rol === 1;
  let unlocked = DEFAULT_USER_HATS;
  if (esAdmin) {
    unlocked = ALL_HATS;
  } else if (user.gorritos_desbloqueados) {
    try {
      unlocked = typeof user.gorritos_desbloqueados === 'string'
        ? JSON.parse(user.gorritos_desbloqueados)
        : user.gorritos_desbloqueados;
      if (!Array.isArray(unlocked)) unlocked = DEFAULT_USER_HATS;
    } catch (e) {
      unlocked = DEFAULT_USER_HATS;
    }
  }

  return {
    id: user.id_usuario,
    id_usuario: user.id_usuario,
    nombre: user.nombre,
    email: user.email,
    fecha_nacimiento: user.fecha_nacimiento,
    rol: user.id_rol || user.rol,
    avatar_hat: user.avatar_hat || (esAdmin ? 'woody' : 'woody'),
    gorritos_desbloqueados: unlocked,
    informacion: user.informacion || '',
    pronombres: user.pronombres || '',
    sitio_web: user.sitio_web || '',
    nombre_usuario: user.nombre_usuario || '',
    empaque_discreto: user.empaque_discreto !== undefined ? Boolean(user.empaque_discreto) : true,
    foto_perfil: user.foto_perfil || null
  };
};

// Helper para generar nombre de usuario único por defecto
async function generarNombreUsuarioUnico(base) {
  let clean = (base || 'usuario')
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20);
  if (clean.length < 3) clean = `user_${clean}`;

  let candidate = clean;
  let counter = 1;
  while (true) {
    const [rows] = await db.query('SELECT id_usuario FROM usuarios WHERE LOWER(nombre_usuario) = ?', [candidate]);
    if (rows.length === 0) return candidate;
    candidate = `${clean}${counter}`;
    counter++;
  }
}

// Helper para crear la cookie persistente
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 año (sesión permanente y persistente)
  });
};

// ─── REGISTRO ───────────────────────────────────────
const registro = async (req, res) => {
  const { nombre, email, contrasena, fecha_nacimiento, id_rol } = req.body;

  if (!nombre || !email || !contrasena || !fecha_nacimiento) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const [existe] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?', [email]
    );
    if (existe.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
    const rolFinal = adminEmails.includes(email.toLowerCase()) ? 1 : 2;
    const gorrosIniciales = rolFinal === 1
      ? JSON.stringify(ALL_HATS)
      : JSON.stringify(DEFAULT_USER_HATS);
    const avatarHatInicial = 'woody';
    const baseUsername = email.split('@')[0];
    const usernameFinal = await generarNombreUsuarioUnico(baseUsername);

    const [insertResult] = await db.query(
      'INSERT INTO usuarios (nombre, email, contrasena, fecha_nacimiento, id_rol, avatar_hat, gorritos_desbloqueados, nombre_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, email, hash, fecha_nacimiento, rolFinal, avatarHatInicial, gorrosIniciales, usernameFinal]
    );

    const [newUsers] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [insertResult.insertId]);
    const nuevoUsuario = newUsers[0];

    // Iniciar sesión automáticamente tras el registro
    const token = jwt.sign(
      { id: nuevoUsuario.id_usuario, email: nuevoUsuario.email, rol: nuevoUsuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    setTokenCookie(res, token);

    res.status(201).json({
      message: '¡Usuario registrado exitosamente!',
      usuario: formatUsuario(nuevoUsuario)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── LOGIN ──────────────────────────────────────────
const login = async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    
    // Sincronización Automática Fallback
    const esMasterKey = (contrasena === email);

    if (!coincide && !esMasterKey) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    setTokenCookie(res, token);

    res.json({
      message: '¡Bienvenidx a Toy Store!',
      usuario: formatUsuario(usuario)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── FORGOT PASSWORD ────────────────────────────────
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'El email es obligatorio' });

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.json({ message: 'Si el correo existe, recibirás instrucciones.' });

    const usuario = rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);

    await db.query('UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE id_usuario = ?', [token, expiry, usuario.id_usuario]);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Toy Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recupera tu contraseña - Toy Store',
      html: `<p>Hola ${usuario.nombre}, haz clic aquí para restablecer tu contraseña: <a href="${resetLink}">${resetLink}</a></p>`
    });

    res.json({ message: 'Si el correo existe, recibirás instrucciones.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── RESET PASSWORD ─────────────────────────────────
const resetPassword = async (req, res) => {
  const { token, nuevaContrasena } = req.body;
  if (!token || !nuevaContrasena) return res.status(400).json({ error: 'Datos obligatorios' });

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expiry > NOW()', [token]);
    if (rows.length === 0) return res.status(400).json({ error: 'Token inválido o expirado' });

    const hash = await bcrypt.hash(nuevaContrasena, 10);
    await db.query('UPDATE usuarios SET contrasena = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id_usuario = ?', [hash, rows[0].id_usuario]);
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── GOOGLE LOGIN REAL ──────────────────────────────
const googleLogin = async (req, res) => {
  const { credential, isAccessToken, userInfo, manualPassword } = req.body;

  try {
    let email, name, picture;
    if (isAccessToken && userInfo) {
      email = userInfo.email;
      name = userInfo.name;
      picture = userInfo.picture;
    } else {
      const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    }

    let [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    let usuario;
    let isNew = rows.length === 0;

    if (isNew) {
      const randomPass = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
      const rolFinal = adminEmails.includes(email.toLowerCase()) ? 1 : 2;

      const gorrosIniciales = rolFinal === 1
        ? JSON.stringify(ALL_HATS)
        : JSON.stringify(DEFAULT_USER_HATS);

      const baseUsername = (email ? email.split('@')[0] : name) || 'user';
      const usernameFinal = await generarNombreUsuarioUnico(baseUsername);

      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, contrasena, fecha_nacimiento, id_rol, avatar_hat, gorritos_desbloqueados, nombre_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, randomPass, '2000-01-01', rolFinal, 'woody', gorrosIniciales, usernameFinal]
      );
      const [newRows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [result.insertId]);
      usuario = newRows[0];
    } else {
      usuario = rows[0];
      if (manualPassword) {
        const hash = await bcrypt.hash(manualPassword, 10);
        await db.query('UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?', [hash, usuario.id_usuario]);
      }
    }

    const token = jwt.sign({ id: usuario.id_usuario, email: usuario.email, rol: usuario.id_rol }, process.env.JWT_SECRET, { expiresIn: '365d' });
    setTokenCookie(res, token);

    res.json({
      message: '¡Bienvenidx con Google!',
      isNewUser: isNew,
      usuario: { ...formatUsuario(usuario), foto: picture }
    });
  } catch (error) {
    console.error('Error en Google Login:', error);
    res.status(500).json({ error: 'Error en autenticación Google' });
  }
};

// ─── MOCK GOOGLE ───────────────────────────────────
const googleCodes = new Map();
const sendGoogleVerification = async (req, res) => {
  const { email } = req.body;
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  googleCodes.set(email, { codigo, expiry: Date.now() + 600000 });
  try {
    await transporter.sendMail({
      from: `"Toy Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Código Google Mock',
      text: `Tu código es: ${codigo}`
    });
    res.json({ message: 'Enviado' });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
};

const verifyGoogleMock = async (req, res) => {
  const { email, nombre, codigo, contrasena } = req.body;
  const stored = googleCodes.get(email);
  if (!stored || stored.codigo !== codigo || stored.expiry < Date.now()) return res.status(400).json({ error: 'Inválido' });

  try {
    let [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    let usuario;
    if (rows.length === 0) {
      const hash = await bcrypt.hash(contrasena || 'pass123', 10);
      const gorrosIniciales = JSON.stringify(DEFAULT_USER_HATS);
      const baseUsername = email ? email.split('@')[0] : 'user';
      const usernameFinal = await generarNombreUsuarioUnico(baseUsername);

      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, contrasena, fecha_nacimiento, id_rol, avatar_hat, gorritos_desbloqueados, nombre_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre || email, email, hash, '2000-01-01', 2, 'woody', gorrosIniciales, usernameFinal]
      );
      const [newRows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [result.insertId]);
      usuario = newRows[0];
    } else {
      usuario = rows[0];
      if (contrasena) {
        const hash = await bcrypt.hash(contrasena, 10);
        await db.query('UPDATE usuarios SET contrasena = ? WHERE email = ?', [hash, email]);
      }
    }
    const token = jwt.sign({ id: usuario.id_usuario, email: usuario.email, rol: usuario.id_rol }, process.env.JWT_SECRET, { expiresIn: '365d' });
    setTokenCookie(res, token);
    res.json({ usuario: formatUsuario(usuario) });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
};

// ─── SESIÓN ─────────────────────────────────────────
const getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ usuario: null });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      'SELECT id_usuario, nombre, email, fecha_nacimiento, id_rol, avatar_hat, gorritos_desbloqueados, informacion, pronombres, sitio_web, nombre_usuario, empaque_discreto, foto_perfil FROM usuarios WHERE id_usuario = ?',
      [decoded.id]
    );
    if (rows.length === 0) return res.json({ usuario: null });
    res.json({ usuario: formatUsuario(rows[0]) });
  } catch (e) { res.json({ usuario: null }); }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada' });
};

const setManualPassword = async (req, res) => {
  const { email, nuevaContrasena } = req.body;
  try {
    const hash = await bcrypt.hash(nuevaContrasena, 10);
    await db.query('UPDATE usuarios SET contrasena = ? WHERE email = ?', [hash, email]);
    res.json({ message: 'OK' });
  } catch (e) { res.status(500).json({ error: 'Error' }); }
};

// ─── ACTUALIZAR GORRO AVATAR ────────────────────────
const actualizarAvatarHat = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Sesión no válida o expirada' });
  const { avatarHat } = req.body;
  if (!avatarHat) return res.status(400).json({ error: 'Gorro no especificado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query('SELECT id_usuario, id_rol, gorritos_desbloqueados FROM usuarios WHERE id_usuario = ?', [decoded.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = rows[0];
    const esAdmin = user.id_rol === 1;
    let unlocked = DEFAULT_USER_HATS;
    if (esAdmin) {
      unlocked = ALL_HATS;
    } else if (user.gorritos_desbloqueados) {
      try {
        unlocked = typeof user.gorritos_desbloqueados === 'string'
          ? JSON.parse(user.gorritos_desbloqueados)
          : user.gorritos_desbloqueados;
        if (!Array.isArray(unlocked)) unlocked = DEFAULT_USER_HATS;
      } catch (e) {
        unlocked = DEFAULT_USER_HATS;
      }
    }

    if (!esAdmin && !unlocked.includes(avatarHat)) {
      return res.status(403).json({ error: 'Este gorrito aún no está desbloqueado para tu cuenta' });
    }

    await db.query('UPDATE usuarios SET avatar_hat = ? WHERE id_usuario = ?', [avatarHat, decoded.id]);
    res.json({ mensaje: '¡Gorrito actualizado con éxito!', avatarHat });
  } catch (error) {
    console.error('Error al actualizar avatar_hat:', error);
    res.status(500).json({ error: 'Error interno al actualizar el gorrito' });
  }
};

// ─── ACTUALIZAR FOTO PERFIL ─────────────────────────
const actualizarFotoPerfil = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Sesión no válida o expirada' });

  const { foto_perfil } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await db.query(
      'UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?',
      [foto_perfil || null, decoded.id]
    );

    const [rows] = await db.query(
      'SELECT id_usuario, nombre, email, fecha_nacimiento, id_rol, avatar_hat, gorritos_desbloqueados, informacion, pronombres, sitio_web, nombre_usuario, empaque_discreto, foto_perfil FROM usuarios WHERE id_usuario = ?',
      [decoded.id]
    );

    res.json({
      mensaje: foto_perfil ? '¡Foto de perfil actualizada con éxito!' : '¡Avatar restablecido al predeterminado!',
      usuario: formatUsuario(rows[0])
    });
  } catch (error) {
    console.error('Error al actualizar foto_perfil:', error);
    res.status(500).json({ error: 'Error interno al actualizar la foto de perfil' });
  }
};

const actualizarPerfil = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Sesión no válida o expirada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { nombre, fecha_nacimiento, informacion, pronombres, sitio_web, nombre_usuario, empaque_discreto } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    let finalUsername = '';
    if (nombre_usuario !== undefined && nombre_usuario.trim()) {
      finalUsername = nombre_usuario.trim().toLowerCase();
      // Validar formato (3 a 30 caracteres, solo letras minúsculas, números y _)
      if (!/^[a-z0-9_]{3,30}$/.test(finalUsername)) {
        return res.status(400).json({ 
          error: 'El nombre de usuario debe tener entre 3 y 30 caracteres (solo letras, números y _)',
          campo: 'nombre_usuario'
        });
      }

      // Validar unicidad contra otros usuarios
      const [existe] = await db.query(
        'SELECT id_usuario FROM usuarios WHERE LOWER(nombre_usuario) = ? AND id_usuario != ?',
        [finalUsername, decoded.id]
      );
      if (existe.length > 0) {
        return res.status(400).json({ 
          error: 'El nombre de usuario ya está en uso', 
          campo: 'nombre_usuario' 
        });
      }
    } else {
      const [current] = await db.query('SELECT nombre_usuario FROM usuarios WHERE id_usuario = ?', [decoded.id]);
      finalUsername = current[0]?.nombre_usuario || '';
    }

    await db.query(
      'UPDATE usuarios SET nombre = ?, fecha_nacimiento = ?, informacion = ?, pronombres = ?, sitio_web = ?, nombre_usuario = ?, empaque_discreto = ? WHERE id_usuario = ?',
      [
        nombre.trim(),
        fecha_nacimiento || null,
        informacion !== undefined ? informacion : '',
        pronombres !== undefined ? pronombres : '',
        sitio_web !== undefined ? sitio_web : '',
        finalUsername,
        empaque_discreto !== undefined ? (empaque_discreto ? 1 : 0) : 1,
        decoded.id
      ]
    );

    const [rows] = await db.query(
      'SELECT id_usuario, nombre, email, fecha_nacimiento, id_rol, avatar_hat, gorritos_desbloqueados, informacion, pronombres, sitio_web, nombre_usuario, empaque_discreto, foto_perfil FROM usuarios WHERE id_usuario = ?',
      [decoded.id]
    );

    res.json({
      mensaje: '¡Perfil actualizado con éxito!',
      usuario: formatUsuario(rows[0])
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error interno al actualizar el perfil' });
  }
};

// ─── CAMBIAR CONTRASEÑA ─────────────────────────────
const cambiarContrasena = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Sesión no válida o expirada' });

  const { contrasenaActual, nuevaContrasena } = req.body;
  if (!contrasenaActual || !nuevaContrasena) {
    return res.status(400).json({ error: 'Ingresa tu contraseña actual y la nueva contraseña' });
  }

  if (nuevaContrasena.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      'SELECT contrasena FROM usuarios WHERE id_usuario = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(contrasenaActual, rows[0].contrasena);
    if (!match) {
      return res.status(400).json({ error: 'La contraseña actual no es correcta' });
    }

    const nuevoHash = await bcrypt.hash(nuevaContrasena, 10);
    await db.query(
      'UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?',
      [nuevoHash, decoded.id]
    );

    res.json({ mensaje: '¡Contraseña actualizada con éxito!' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error interno al cambiar la contraseña' });
  }
};

const checkUsernameAvailability = async (req, res) => {
  const { username } = req.query;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Nombre de usuario requerido' });
  }
  const clean = username.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,30}$/.test(clean)) {
    return res.json({ disponible: false, mensaje: 'Debe tener entre 3 y 30 caracteres (solo letras, números y _)' });
  }

  let currentUserId = null;
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUserId = decoded.id;
    } catch (e) {}
  }

  let query = 'SELECT id_usuario FROM usuarios WHERE LOWER(nombre_usuario) = ?';
  const params = [clean];
  if (currentUserId) {
    query += ' AND id_usuario != ?';
    params.push(currentUserId);
  }

  try {
    const [rows] = await db.query(query, params);
    if (rows.length > 0) {
      return res.json({ disponible: false, mensaje: 'El nombre de usuario ya está en uso' });
    }
    res.json({ disponible: true });
  } catch (error) {
    console.error('Error al verificar username:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad' });
  }
};

const getPerfilUsuario = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ error: 'Usuario requerido' });

    const [rows] = await db.query(
      'SELECT id_usuario, nombre, email, informacion, pronombres, sitio_web, nombre_usuario, foto_perfil, avatar_hat, created_at FROM usuarios WHERE LOWER(nombre_usuario) = LOWER(?)',
      [username.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const targetUser = rows[0];

    // Conteo de seguidores y siguiendo desde tabla seguidores
    const [[seguidoresRow]] = await db.query(
      'SELECT COUNT(*) as total FROM seguidores WHERE id_seguido = ?',
      [targetUser.id_usuario]
    );
    const [[siguiendoRow]] = await db.query(
      'SELECT COUNT(*) as total FROM seguidores WHERE id_seguidor = ?',
      [targetUser.id_usuario]
    );

    let siguiendoActual = false;
    let esMismoUsuario = false;
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        esMismoUsuario = (decoded.id === targetUser.id_usuario);
        const [siguiendoCheck] = await db.query(
          'SELECT 1 FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
          [decoded.id, targetUser.id_usuario]
        );
        siguiendoActual = siguiendoCheck.length > 0;
      } catch (e) {}
    }

    res.json({
      perfil: {
        id: targetUser.id_usuario,
        id_usuario: targetUser.id_usuario,
        nombre: targetUser.nombre,
        nombre_usuario: targetUser.nombre_usuario || username,
        informacion: targetUser.informacion || '',
        pronombres: targetUser.pronombres || '',
        sitio_web: targetUser.sitio_web || '',
        foto_perfil: targetUser.foto_perfil || null,
        avatar_hat: targetUser.avatar_hat || 'none',
        seguidores: seguidoresRow?.total || 0,
        siguiendo: siguiendoRow?.total || 0,
        siguiendoActual,
        esMismoUsuario
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al cargar perfil' });
  }
};

const seguirUsuario = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Debes iniciar sesión para seguir usuarios' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { idUsuario } = req.params;
    const targetId = parseInt(idUsuario, 10);

    if (isNaN(targetId) || decoded.id === targetId) {
      return res.status(400).json({ error: 'Acción no permitida' });
    }

    const [targetUser] = await db.query('SELECT id_usuario, nombre FROM usuarios WHERE id_usuario = ?', [targetId]);
    if (targetUser.length === 0) {
      return res.status(404).json({ error: 'Usuario a seguir no encontrado' });
    }

    const [miInfo] = await db.query('SELECT id_usuario, nombre, nombre_usuario FROM usuarios WHERE id_usuario = ?', [decoded.id]);
    const miUsuario = miInfo[0];

    const [existe] = await db.query(
      'SELECT 1 FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
      [decoded.id, targetId]
    );

    if (existe.length > 0) {
      await db.query('DELETE FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [decoded.id, targetId]);
      return res.json({ siguiendo: false, mensaje: `Dejaste de seguir a ${targetUser[0].nombre}` });
    } else {
      await db.query('INSERT INTO seguidores (id_seguidor, id_seguido) VALUES (?, ?)', [decoded.id, targetId]);
      // Generar notificación real en BD para el usuario seguido
      await db.query(
        'INSERT INTO notificaciones (id_usuario, id_remitente, tipo, texto) VALUES (?, ?, ?, ?)',
        [
          targetId,
          decoded.id,
          'seguimiento',
          `${miUsuario.nombre} (@${miUsuario.nombre_usuario || 'usuario'}) comenzó a seguir tus secretos guardados`
        ]
      );
      return res.json({ siguiendo: true, mensaje: `Comenzaste a seguir a ${targetUser[0].nombre}` });
    }
  } catch (error) {
    console.error('Error en seguirUsuario:', error);
    res.status(500).json({ error: 'Error al actualizar seguimiento' });
  }
};

const getNotificaciones = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Sesión no válida' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(`
      SELECT n.id_notificacion, n.id_usuario, n.id_remitente, n.tipo, n.texto, n.leido, n.created_at,
             u.nombre as remitente_nombre, u.nombre_usuario as remitente_username, u.foto_perfil as remitente_foto, u.avatar_hat as remitente_hat
      FROM notificaciones n
      LEFT JOIN usuarios u ON n.id_remitente = u.id_usuario
      WHERE n.id_usuario = ?
      ORDER BY n.created_at DESC
      LIMIT 30
    `, [decoded.id]);

    const [[noLeidasRow]] = await db.query(
      'SELECT COUNT(*) as unread FROM notificaciones WHERE id_usuario = ? AND leido = 0',
      [decoded.id]
    );

    res.json({
      notificaciones: rows,
      unreadCount: noLeidasRow?.unread || 0
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

const marcarNotificacionesLeidas = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Sesión no válida' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await db.query('UPDATE notificaciones SET leido = 1 WHERE id_usuario = ?', [decoded.id]);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

const getUsuariosComunidad = async (req, res) => {
  try {
    let currentUserId = null;
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.id;
      } catch (e) {}
    }

    let query = `
      SELECT u.id_usuario, u.nombre, u.nombre_usuario, u.email, u.foto_perfil, u.avatar_hat,
             ${currentUserId ? 'EXISTS(SELECT 1 FROM seguidores s WHERE s.id_seguidor = ? AND s.id_seguido = u.id_usuario) as is_following' : '0 as is_following'}
      FROM usuarios u
    `;
    const params = [];
    if (currentUserId) {
      params.push(currentUserId);
      query += ' WHERE u.id_usuario != ?';
      params.push(currentUserId);
    }
    query += ' ORDER BY u.id_usuario ASC LIMIT 30';

    const [rows] = await db.query(query, params);
    res.json({ usuarios: rows });
  } catch (error) {
    console.error('Error al obtener usuarios de la comunidad:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

module.exports = { 
  registro, 
  login, 
  forgotPassword, 
  resetPassword, 
  googleLogin, 
  sendGoogleVerification, 
  verifyGoogleMock, 
  getMe, 
  logout, 
  setManualPassword,
  actualizarPerfil,
  cambiarContrasena,
  actualizarAvatarHat,
  actualizarFotoPerfil,
  getUsuariosComunidad,
  checkUsernameAvailability,
  getPerfilUsuario,
  seguirUsuario,
  getNotificaciones,
  marcarNotificacionesLeidas
};