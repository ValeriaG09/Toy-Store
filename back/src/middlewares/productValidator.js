const { body, validationResult } = require('express-validator');

/**
 * Validaciones para la creación y actualización de productos.
 * Siguiendo las buenas prácticas SENA de validación en el Backend.
 */
const validateProduct = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del producto es obligatorio.')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres.'),
  
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio.')
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser un número mayor a 0.'),
  
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria.')
    .isIn(['vibradores', 'lencerias', 'anales', 'kits', 'accesorios', 'cosmeticos', 'penes'])
    .withMessage('La categoría seleccionada no es válida.'),
  
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio.')
    .isInt({ min: 0 }).withMessage('El stock no puede ser negativo.'),
  
  body('nivel_juego')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('El nivel de juego debe estar entre 1 y 5.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres.'),

  // Middleware para capturar los resultados de la validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Devolver error 400 (Bad Request) con el detalle de las validaciones fallidas
      return res.status(400).json({ 
        error: 'Error de validación en los campos del producto',
        detalles: errors.array().map(err => ({ campo: err.path, mensaje: err.msg }))
      });
    }
    next();
  }
];

module.exports = {
  validateProduct
};
