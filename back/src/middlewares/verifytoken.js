const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  // Intentar obtener token de cookies o de headers
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Sesión requerida.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Guardamos en req.user para consistencia (id, email, rol)
    req.user = {
      id_usuario: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Sesión inválida o expirada.' });
  }
};

module.exports = verifyToken;