const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los productos con filtros opcionales
router.get('/', async (req, res) => {
  try {
    const { minPrice, maxPrice, categoria, nivelJuego } = req.query;
    
    let query = 'SELECT * FROM productos WHERE 1=1';
    const params = [];

    if (minPrice) {
      query += ' AND precio >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND precio <= ?';
      params.push(maxPrice);
    }
    if (categoria && categoria !== 'todos' && categoria !== 'null') {
      query += ' AND categoria = ?';
      params.push(categoria);
    }
    if (nivelJuego && nivelJuego !== 'todos') {
      query += ' AND nivel_juego >= ?';
      params.push(nivelJuego);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;