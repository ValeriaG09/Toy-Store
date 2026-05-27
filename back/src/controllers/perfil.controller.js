const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Actualizar Contraseña
exports.updatePassword = async (req, res) => {
  try {
    const { actual, nueva } = req.body;
    const userId = req.user.id_usuario;

    // 1. Buscar usuario
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [userId]);
    if (usuarios.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const usuario = usuarios[0];

    // 2. Verificar contraseña actual
    const passOk = await bcrypt.compare(actual, usuario.contrasena);
    if (!passOk) return res.status(401).json({ error: 'La contraseña actual es incorrecta' });

    // 3. Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(nueva, salt);

    // 4. Guardar
    await db.query('UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?', [hash, userId]);

    res.json({ message: 'Contraseña actualizada con éxito 🤠' });
  } catch (err) {
    res.status(500).json({ error: 'Error al cambiar contraseña', detalle: err.message });
  }
};

// Actualizar Preferencias
exports.updatePreferencias = async (req, res) => {
  try {
    const { preferencias } = req.body;
    const userId = req.user.id_usuario;

    await db.query('UPDATE usuarios SET preferencias = ? WHERE id_usuario = ?', [JSON.stringify(preferencias), userId]);

    res.json({ message: 'Preferencias guardadas ✨' });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar preferencias', detalle: err.message });
  }
};

// Actualizar Avatar (Ruta del archivo ya subido por Multer)
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await db.query('UPDATE usuarios SET avatar_url = ? WHERE id_usuario = ?', [avatarUrl, userId]);

    res.json({ 
      message: 'Foto de perfil actualizada 📸',
      avatar_url: avatarUrl 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir foto', detalle: err.message });
  }
};
