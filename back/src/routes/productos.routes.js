const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const { validateProduct } = require('../middlewares/productValidator');
const verifyToken = require('../middlewares/verifytoken');

/**
 * Rutas de Productos
 * Algunas rutas están protegidas por token para asegurar que solo 
 * personal autorizado (admin) realice cambios en el inventario.
 */

// Obtener todos los productos (Público)
router.get('/', productosController.getProductos);

// Obtener un producto por ID (Público)
router.get('/:id', productosController.getProductoById);

// Crear un producto (Privado - Requiere Token)
router.post('/', verifyToken, validateProduct, productosController.createProducto);

// Actualizar un producto (Privado - Requiere Token)
router.put('/:id', verifyToken, validateProduct, productosController.updateProducto);

// Eliminar un producto (Privado - Requiere Token)
router.delete('/:id', verifyToken, productosController.deleteProducto);

module.exports = router;