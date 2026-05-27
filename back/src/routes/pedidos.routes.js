const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middlewares/verifytoken');

// Crear un nuevo pedido
router.post('/', verifyToken, async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { items, total, direccion } = req.body;
    const id_usuario = req.user?.id_usuario;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // 1. Crear el registro en 'pedidos'
    const [pedidoResult] = await connection.query(
      'INSERT INTO pedidos (id_usuario, fecha, total, direccion_envio, id_estado) VALUES (?, NOW(), ?, ?, ?)',
      [id_usuario, total, direccion || 'Recogida en tienda', 1]
    );

    const id_pedido = pedidoResult.insertId;

    // 2. Crear los detalles del pedido
    for (const item of items) {
      await connection.query(
        'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [id_pedido, item.id, item.cantidad, item.precio, item.precio * item.cantidad]
      );

      // 3. Descontar stock
      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id]
      );
    }

    await connection.commit();
    res.status(201).json({ 
      message: 'Pedido creado con éxito', 
      id_pedido,
      pago_url: `/pagar/${id_pedido}`
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('💥 Error detallado al crear pedido:', {
      mensaje: error.message,
      codigo: error.code
    });
    res.status(500).json({ error: 'Fallo al procesar el pedido', detalle: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Obtener mis pedidos
router.get('/mis-pedidos', verifyToken, async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const [rows] = await db.query(`
      SELECT p.*, e.nombre as estado
      FROM pedidos p
      JOIN estados_pedido e ON p.id_estado = e.id_estado
      WHERE p.id_usuario = ?
      ORDER BY p.fecha DESC
    `, [id_usuario]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

module.exports = router;
