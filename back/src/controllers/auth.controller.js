const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const transporter = require('../config/mailer');
require('dotenv').config();

// Helper para crear la cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000 // 8 horas
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

    // Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // DETERMINAR ROL: Si el correo está en la lista de admin, es admin (1). Si no, es cliente (2).
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
    const rolFinal = adminEmails.includes(email.toLowerCase()) ? 1 : 2;

    await db.query(
      'INSERT INTO usuarios (nombre, email, contrasena, fecha_nacimiento, id_rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, hash, fecha_nacimiento, rolFinal]
    );

    res.status(201).json({ message: '¡Usuario registrado exitosamente!' });

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

    setTokenCookie(res, token);

    res.json({
      message: '¡Bienvenidx a Toy Store!',
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        fecha_nacimiento: usuario.fecha_nacimiento,
        rol: usuario.id_rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      detalle: error.message,
      stack: error.stack
    });
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

    await db.query(
      'UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE id_usuario = ?',
      [token, expiry, usuario.id_usuario]
    );

    // Enviar correo
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Toy Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recupera tu contraseña - Toy Store',
      html: `
        <div style="background-color: #f0f9ff; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #e0f2fe;">
            <!-- Header Decorativo -->
            <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; font-weight: 900;">Toy Store</h1>
              <p style="color: #bae6fd; margin-top: 10px; font-size: 14px; letter-spacing: 1px;">DONDE TUS JUGUETES COBRAN VIDA</p>
            </div>
            
            <!-- Contenido Principal -->
            <div style="padding: 40px;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">¡Hola, ${usuario.nombre}!</h2>
              <p style="color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. No te preocupes, estamos aquí para ayudarte a volver a la acción.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetLink}" 
                   style="display: inline-block; background-color: #ffd700; color: #1e293b; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 0 #b45309, 0 10px 20px rgba(0,0,0,0.1);">
                  Restablecer Contraseña
                </a>
              </div>
              
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-top: 30px; border-left: 4px solid #0284c7;">
                <p style="color: #64748b; font-size: 13px; margin: 0;">
                  <strong>Nota de seguridad:</strong> Este enlace expirará en 1 hora por tu protección. Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 30px; text-align: center; background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0; letter-spacing: 0.5px;">
                © 2026 Toy Store. Todos los derechos reservados.
              </p>
            </div>
          </div>
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

    await db.query(
      `UPDATE usuarios 
       SET contrasena = ?, reset_token = NULL, reset_token_expiry = NULL 
       WHERE id_usuario = ?`,
      [hash, usuario.id_usuario]
    );

    res.json({ message: '¡Contraseña actualizada exitosamente!' });

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
      // Si no existe, lo creamos
      const mockPass = await bcrypt.hash('google_mock_pass_123', 10);
      
      // DETERMINAR ROL AUTOMÁTICAMENTE
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
      const rolFinal = adminEmails.includes(email.toLowerCase()) ? 1 : 2;

      const [resultRows] = await db.query(
        'INSERT INTO usuarios (nombre, email, contrasena, fecha_nacimiento, id_rol) VALUES (?, ?, ?, ?, ?)',
        [nombre || 'Usuario Google', email, mockPass, '2000-01-01', rolFinal]
      );
      
      const [newRows] = await db.query(
        'SELECT * FROM usuarios WHERE id_usuario = ?', [resultRows.insertId]
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

    setTokenCookie(res, token);

    res.json({
      message: '¡Bienvenidx con Google!',
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        fecha_nacimiento: usuario.fecha_nacimiento,
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
  const { email, nombre, codigo, contrasena } = req.body;
  const stored = googleCodes.get(email);

  if (!stored || stored.codigo !== codigo || stored.expiry < Date.now()) {
    return res.status(400).json({ error: 'Código inválido o expirado' });
  }

  try {
    // Buscar si existe o crear
    let [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    let usuario;

    if (rows.length === 0) {
      // Usar la contraseña que el usuario escribió en el Mock de Google, o generar una si no hay
      const passwordToHash = contrasena || ('google_mock_pass_' + Date.now());
      const hash = await bcrypt.hash(passwordToHash, 10);
      const nombreFinal = nombre || email.split('@')[0]; 
      
      // DETERMINAR ROL AUTOMÁTICAMENTE
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
      const rolFinal = adminEmails.includes(email.toLowerCase()) ? 1 : 2;

      const [resultRows] = await db.query(
        'INSERT INTO usuarios (nombre, email, contrasena, fecha_nacimiento, id_rol) VALUES (?, ?, ?, ?, ?)',
        [nombreFinal, email, hash, '2000-01-01', rolFinal]
      );
      const [newRows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [resultRows.insertId]);
      usuario = newRows[0];
    } else {
      // Si el usuario ya existe y nos mandó la contraseña por el mock, se la actualizamos 
      // para que su contraseña estándar coincida con la que acaba de usar en el mock.
      if (contrasena) {
        const hash = await bcrypt.hash(contrasena, 10);
        await db.query('UPDATE usuarios SET contrasena = ? WHERE email = ?', [hash, email]);
      }
      usuario = rows[0];
    }

    googleCodes.delete(email);

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    setTokenCookie(res, token);

    res.json({
      usuario: { 
        id: usuario.id_usuario, 
        nombre: usuario.nombre, 
        email: usuario.email, 
        fecha_nacimiento: usuario.fecha_nacimiento,
        rol: usuario.id_rol 
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en registro' });
  }
};
// ─── SESIÓN CURRENT ─────────────────────────────────
const getMe = async (req, res) => {
  const token = req.cookies.token;
  // En lugar de devolver 401 (que pinta la consola de rojo), devolvemos 200 con un mensaje normal
  if (!token) return res.json({ usuario: null, message: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query('SELECT id_usuario, nombre, email, fecha_nacimiento, id_rol FROM usuarios WHERE id_usuario = ?', [decoded.id]);
    if (rows.length === 0) return res.json({ usuario: null, message: 'Usuario no encontrado' });
    
    res.json({ 
      usuario: { 
        id: rows[0].id_usuario, 
        nombre: rows[0].nombre, 
        email: rows[0].email, 
        fecha_nacimiento: rows[0].fecha_nacimiento,
        rol: rows[0].id_rol 
      } 
    });
  } catch (err) {
    // Retornamos 200 con usuario null para evitar el log de error de red nativo del navegador
    res.json({ usuario: null, message: 'Sesión inválida o expirada' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada exitosamente' });
};

module.exports = { registro, login, forgotPassword, resetPassword, googleMock, sendGoogleVerification, verifyGoogleMock, getMe, logout };