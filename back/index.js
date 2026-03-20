const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ─── Evita que el servidor se caiga por errores no controlados ───
process.on('uncaughtException', (err) => {
  console.error('⚠️ Excepción no capturada (el servidor sigue corriendo):', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Promesa rechazada no manejada (el servidor sigue corriendo):', reason);
});

const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

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