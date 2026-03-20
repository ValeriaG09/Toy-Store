const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Permitir llamadas sin origin (postman) o desde localhost / 127.0.0.1
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🧸 API Toy Store funcionando' });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('💥 Error no controlado:', err);
  res.status(500).json({ error: 'Error interno en el servidor', detalle: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});