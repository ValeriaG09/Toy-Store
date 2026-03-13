const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const transporter = require('../config/mailer');
require('dotenv').config();

// ─── REGISTRO ───────────────────────────────────────
const registro = async (req, res) => {
  const { nombre, email, contrasena, id_rol } = req.body;

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el email ya existe
    const [existe] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?', [email]
    );
    if (existe.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Guardar usuario
    // Si no se envía id_rol, por defecto es 2 (cliente)
    const rolFinal = parseInt(id_rol) || 2;

    // RESTRICCIÓN: Solo el correo fijo puede ser Admin
    if (rolFinal === 1 && email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        error: 'No tienes permiso para registrarte como Administrador ✋'
      });
    }

    await db.query(
      'INSERT INTO usuarios (nombre, email, contrasena, id_rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rolFinal]
    );

    res.status(201).json({ message: '¡Usuario registrado exitosamente! 🎉' });

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
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?', [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: '¡Bienvenidx a Toy Store! 🧸',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.id_rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── FORGOT PASSWORD ────────────────────────────────
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es obligatorio' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?', [email]
    );

    // Siempre responde igual por seguridad
    if (rows.length === 0) {
      return res.json({
        message: 'Si el correo existe, recibirás instrucciones.'
      });
    }

    const usuario = rows[0];

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    await db.query(
      'UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE id_usuario = ?',
      [token, expiry, usuario.id_usuario]
    );

    // Enviar correo
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Toy Store 🧸🫦" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔑 Recupera tu contraseña - Toy Store',
      html: `
        <div style="font-family:Arial; max-width:500px; margin:auto; 
                    background:#a6d4f2; padding:30px; border-radius:16px;">
          <h2 style="color:#e30020; text-align:center;">¡Hola ${usuario.nombre}! ❤️💋</h2>
          <p style="color:#333;">
            Recibimos una solicitud para restablecer tu contraseña en 
            <strong>Toy Store</strong>.
          </p>
          <div style="text-align:center; margin:30px 0;">
            <a href="${resetLink}" 
               style="background:#ffd700; color:#333; padding:14px 28px; 
                      border-radius:10px; text-decoration:none; 
                      font-weight:bold; font-size:16px;">
              🔓 Restablecer contraseña
            </a>
          </div>
          <p style="color:#555; font-size:14px;">
            ⏰ Este enlace expira en <strong>1 hora</strong>.<br/>
            Si no solicitaste esto, ignora este mensaje.
          </p>
          <hr style="border:none; border-top:1px solid #ccc; margin:20px 0;"/>
          <p style="color:#888; font-size:12px; text-align:center;">
            © 2026 Toy Store — Donde tus juguetes sí cobran vida 🌟
          </p>
        </div>
      `
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

  if (!token || !nuevaContrasena) {
    return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios' });
  }

  if (nuevaContrasena.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
  }

  try {
    // Buscar token válido y no expirado
    const [rows] = await db.query(
      `SELECT * FROM usuarios 
       WHERE reset_token = ? AND reset_token_expiry > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        error: 'El enlace es inválido o ya expiró. Solicita uno nuevo.'
      });
    }

    const usuario = rows[0];

    // Encriptar nueva contraseña
    const hash = await bcrypt.hash(nuevaContrasena, 10);

    // Actualizar contraseña y limpiar token
    await db.query(
      `UPDATE usuarios 
       SET contrasena = ?, reset_token = NULL, reset_token_expiry = NULL 
       WHERE id_usuario = ?`,
      [hash, usuario.id_usuario]
    );

    res.json({ message: '¡Contraseña actualizada exitosamente! 🎉' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── GOOGLE MOCK ────────────────────────────────────
const googleMock = async (req, res) => {
  const { email, nombre } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email es obligatorio' });
  }

  try {
    // Buscar si el usuario ya existe
    let [rows] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?', [email]
    );

    let usuario;

    if (rows.length === 0) {
      // Si no existe, lo creamos (rol cliente)
      const mockPass = await bcrypt.hash('google_mock_pass_123', 10);
      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, contrasena, id_rol) VALUES (?, ?, ?, ?)',
        [nombre || 'Usuario Google', email, mockPass, 2]
      );
      
      const [newRows] = await db.query(
        'SELECT * FROM usuarios WHERE id_usuario = ?', [result.insertId]
      );
      usuario = newRows[0];
    } else {
      usuario = rows[0];
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: '¡Bienvenidx con Google! 🧸',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.id_rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor en Google Mock' });
  }
};

// Almacén temporal de códigos (en producción usar Redis o DB)
const googleCodes = new Map();

// ─── SEND GOOGLE VERIFICATION ───────────────────────
const sendGoogleVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  try {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    googleCodes.set(email, { codigo, expiry: Date.now() + 600000 }); // 10 min

    await transporter.sendMail({
      from: `"Google Accounts 🛡️" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${codigo} es tu código de verificación de Google`,
      html: `
        <div style="font-family: 'Roboto',Arial,sans-serif; border:1px solid #e0e0e0; padding:40px; max-width:500px; margin:auto; border-radius:8px;">
          <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" width="75" style="margin-bottom:20px;">
          <h2 style="font-size:24px; color:#202124; font-weight:400;">Verifica tu correo electrónico</h2>
          <p style="font-size:14px; color:#3c4043;">Usa este código para completar el registro en Toy Store a través de Google:</p>
          <div style="background:#f1f3f4; padding:20px; text-align:center; font-size:36px; font-weight:500; letter-spacing:8px; margin:20px 0; border-radius:4px; color:#1a73e8;">
            ${codigo}
          </div>
          <p style="font-size:12px; color:#70757a;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
        </div>
      `
    });
    res.json({ message: 'Código enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar email' });
  }
};

// ─── VERIFY GOOGLE MOCK ──────────────────────────────
const verifyGoogleMock = async (req, res) => {
  const { email, nombre, codigo } = req.body;
  const stored = googleCodes.get(email);

  if (!stored || stored.codigo !== codigo || stored.expiry < Date.now()) {
    return res.status(400).json({ error: 'Código inválido o expirado' });
  }

  try {
    // Buscar si existe o crear
    let [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    let usuario;

    if (rows.length === 0) {
      const hash = await bcrypt.hash('google_mock_pass_' + Date.now(), 10);
      const nombreFinal = nombre || email.split('@')[0]; // Usar parte del email si no hay nombre
      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, contrasena, id_rol) VALUES (?, ?, ?, 2)',
        [nombreFinal, email, hash]
      );
      const [newRows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [result.insertId]);
      usuario = newRows[0];
    } else {
      usuario = rows[0];
    }

    googleCodes.delete(email);

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { id: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email, rol: usuario.id_rol }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en registro' });
  }
};

module.exports = { registro, login, forgotPassword, resetPassword, googleMock, sendGoogleVerification, verifyGoogleMock };