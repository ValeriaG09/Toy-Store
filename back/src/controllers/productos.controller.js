const db = require('../config/db');

/**
 * Controlador de Productos: Gestión del inventario Toy Store.
 * Implementa el CRUD completo con manejo de errores robusto.
 */

// 1. Obtener todos los productos (con filtros opcionales)
const getProductos = async (req, res) => {
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
    console.error('💥 Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno al obtener los productos' });
  }
};

// 2. Obtener un producto por ID
const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('💥 Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno al obtener el producto' });
  }
};

// 3. Crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    const { nombre, precio, categoria, nivel_juego, imagen, descripcion, stock } = req.body;
    
    const query = `
      INSERT INTO productos (nombre, precio, categoria, nivel_juego, imagen, descripcion, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [
      nombre, 
      precio, 
      categoria, 
      nivel_juego || 1, 
      imagen || '/images/default.png', 
      descripcion || '', 
      stock || 0
    ]);
    
    res.status(201).json({ 
      message: '🚀 Producto creado con éxito', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('💥 Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno al crear el producto' });
  }
};

// 4. Actualizar un producto existente
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria, nivel_juego, imagen, descripcion, stock } = req.body;
    
    // Verificar si existe
    const [exists] = await db.query('SELECT id FROM productos WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }
    
    const query = `
      UPDATE productos 
      SET nombre = ?, precio = ?, categoria = ?, nivel_juego = ?, imagen = ?, descripcion = ?, stock = ?
      WHERE id = ?
    `;
    
    await db.query(query, [
      nombre, 
      precio, 
      categoria, 
      nivel_juego, 
      imagen, 
      descripcion, 
      stock, 
      id
    ]);
    
    res.json({ message: '✅ Producto actualizado correctamente' });
  } catch (error) {
    console.error('💥 Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno al actualizar el producto' });
  }
};

// 5. Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
    }
    
    res.json({ message: '🗑️ Producto eliminado del inventario' });
  } catch (error) {
    console.error('💥 Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno al eliminar el producto' });
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
