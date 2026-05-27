const express = require('express');
const router = express.Router();
const db = require('../config/db');
const tryonController = require('../controllers/tryon.controller');

// Ruta para procesar el Virtual Try-On
router.post('/try-on', tryonController.processTryOn);

// Obtener todos los productos con filtros opcionales
router.get('/', async (req, res) => {
  try {
    const { minPrice, maxPrice, categoria, cat, nivelJuego } = req.query;
    const finalCat = categoria || cat;
    
    // Unimos con categorías para obtener el nombre de la categoría
    let query = `
      SELECT p.id_producto as id, p.nombre, p.descripcion, p.precio, p.stock, 
             p.imagen as imagen_url, p.nivel_discrecion as nivel_juego,
             c.nombre as categoria_nombre,
             CASE 
               WHEN p.id_categoria = 1 THEN 'vibradores'
               WHEN p.id_categoria = 2 THEN 'lencerias'
               WHEN p.id_categoria = 3 THEN 'anales'
               WHEN p.id_categoria = 4 THEN 'kits'
               WHEN p.id_categoria = 5 THEN 'lubricantes'
               WHEN p.id_categoria = 6 THEN 'accesorios'
               ELSE 'otros'
             END as categoria
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.activo = 1
    `;
    const params = [];

    if (minPrice) {
      query += ' AND p.precio >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND p.precio <= ?';
      params.push(maxPrice);
    }
    if (finalCat && finalCat !== 'todos' && finalCat !== 'null') {
      // Mapeo de slugs/misiones del frontend a IDs de la DB
      const catMap = {
        'vibrador': [1],
        'vibradores': [1],
        'lenceria': [2],
        'lencería': [2],
        'lencerias': [2],
        'anal': [3],
        'anales': [3],
        'kit': [4],
        'kits': [4],
        'lubricante': [5],
        'lubricantes': [5],
        'accesorio': [6],
        'accesorios': [6],
        // Misiones
        'romance': [2, 4],
        'solitario': [1],
        'aventura': [3, 6],
        'regalo': [4, 6]
      };
      
      const targetIds = catMap[finalCat.toLowerCase()] || [];
      
      if (targetIds.length > 0) {
        const placeholders = targetIds.map(() => '?').join(',');
        query += ` AND (p.id_categoria IN (${placeholders}) OR LOWER(p.nombre) LIKE ?)`;
        targetIds.forEach(id => params.push(id));
        params.push(`%${finalCat.toLowerCase()}%`);
      } else {
        // Si no hay mapeo, intentamos buscar por nombre directamente
        query += ` AND (LOWER(c.nombre) LIKE ? OR LOWER(p.nombre) LIKE ?)`;
        params.push(`%${finalCat.toLowerCase()}%`);
        params.push(`%${finalCat.toLowerCase()}%`);
      }
    }

    if (nivelJuego && nivelJuego !== 'todos') {
      query += ' AND p.nivel_discrecion >= ?';
      params.push(nivelJuego);
    }

    query += ' ORDER BY p.id_producto DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Endpoint para estadísticas del administrador (MEJORADO)
router.get('/admin/stats', async (req, res) => {
  try {
    // 1. Conteo por categorías
    const [catStock] = await db.query(`
      SELECT c.nombre, COUNT(p.id_producto) as cantidad
      FROM categorias c
      LEFT JOIN productos p ON c.id_categoria = p.id_categoria
      GROUP BY c.id_categoria
    `);

    // 2. Ventas por periodos (Incluimos todo lo que no sea 'cancelado' para el reporte del admin)
    const activeStatusQuery = 'id_estado != (SELECT id_estado FROM estados_pedido WHERE nombre = "cancelado")';
    
    const [totalSales] = await db.query(`SELECT SUM(total) as total FROM pedidos WHERE ${activeStatusQuery}`);
    const [weeklySales] = await db.query(`SELECT SUM(total) as total FROM pedidos WHERE ${activeStatusQuery} AND fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const [monthlySales] = await db.query(`SELECT SUM(total) as total FROM pedidos WHERE ${activeStatusQuery} AND fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    const [yearlySales] = await db.query(`SELECT SUM(total) as total FROM pedidos WHERE ${activeStatusQuery} AND fecha >= DATE_SUB(NOW(), INTERVAL 1 YEAR)`);

    // 3. Totales generales
    const [totalProducts] = await db.query('SELECT COUNT(*) as count FROM productos');
    const [lowStockItems] = await db.query('SELECT nombre, stock FROM productos WHERE stock > 0 AND stock < 5');

    res.json({
      total_productos: totalProducts[0].count,
      ventas_totales: totalSales[0].total || 0,
      ventas_semanales: weeklySales[0].total || 0,
      ventas_mensuales: monthlySales[0].total || 0,
      ventas_anuales: yearlySales[0].total || 0,
      stock_bajo_count: lowStockItems.length,
      stock_bajo_items: lowStockItems,
      categorias: catStock
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Endpoint para stock detallado
router.get('/admin/stock', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.nombre, p.stock, c.nombre as categoria 
      FROM productos p 
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria 
      ORDER BY p.stock ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener stock:', error);
    res.status(500).json({ error: 'Error al obtener stock' });
  }
});

// Obtener reseñas de un producto
router.get('/:id/resenas', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM resenas WHERE producto_id = ? ORDER BY fecha DESC', [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
});

// Guardar una nueva reseña
router.post('/:id/resenas', async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, texto, medalla, icono, color } = req.body;
    
    if (!texto) {
      return res.status(400).json({ error: 'El texto de la reseña es obligatorio' });
    }

    await db.query(
      'INSERT INTO resenas (producto_id, usuario, texto, medalla, icono, color) VALUES (?, ?, ?, ?, ?, ?)',
      [id, usuario || 'Vaquero Anónimo', texto, medalla, icono, color]
    );

    res.status(201).json({ message: 'Reseña guardada con éxito' });
  } catch (error) {
    console.error('Error al guardar reseña:', error);
    res.status(500).json({ error: 'Error al guardar reseña' });
  }
});

module.exports = router;