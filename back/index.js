const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const productosRoutes = require('./src/routes/productos.routes');
const perfilRoutes = require('./src/routes/perfil.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes');

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://toy-store-red-mu.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/perfil', perfilRoutes);
app.use('/pedidos', pedidosRoutes);

// Servir archivos estáticos (Subidas)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});