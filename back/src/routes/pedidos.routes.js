const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middlewares/verifytoken');

// Crear un nuevo pedido
router.post('/', verifyToken, async (req, res) => {
  let client;
  try {
    client = await db.connect();
    await client.query('BEGIN');

    const { items, total, direccion } = req.body;
    const id_usuario = req.user?.id_usuario;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // 1. Crear el registro en 'pedidos'
    const { rows: pedidoResult } = await client.query(
      'INSERT INTO pedidos (id_usuario, fecha, total, direccion_envio, id_estado) VALUES ($1, NOW(), $2, $3, $4) RETURNING id_pedido',
      [id_usuario, total, direccion || 'Recogida en tienda', 1]
    );

    const id_pedido = pedidoResult[0].id_pedido;

    // 2. Crear los detalles del pedido
    for (const item of items) {
      await client.query(
        'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [id_pedido, item.id, item.cantidad, item.precio, item.precio * item.cantidad]
      );

      // 3. Descontar stock
      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2',
        [item.cantidad, item.id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ 
      message: 'Pedido creado con éxito', 
      id_pedido,
      pago_url: `/pagar/${id_pedido}`
    });

  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error(' Error detallado al crear pedido:', {
      mensaje: error.message,
      codigo: error.code
    });
    res.status(500).json({ error: 'Fallo al procesar el pedido', detalle: error.message });
  } finally {
    if (client) client.release();
  }
});

// Obtener mis pedidos
router.get('/mis-pedidos', verifyToken, async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const { rows } = await db.query(`
      SELECT p.*, e.nombre as estado
      FROM pedidos p
      JOIN estados_pedido e ON p.id_estado = e.id_estado
      WHERE p.id_usuario = $1
      ORDER BY p.fecha DESC
    `, [id_usuario]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

module.exports = router;
