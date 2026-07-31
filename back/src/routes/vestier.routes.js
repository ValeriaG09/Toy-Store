const express = require('express');
const router = express.Router();
const multer = require('multer');
const tryonController = require('../controllers/tryon.controller');

// Configuración básica de Multer en memoria (no guarda archivos físicos)
// Esto es ideal para procesar y enviar directamente a Fal.ai
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo por imagen
});

// POST /vestier/probar
router.post('/probar', upload.fields([
  { name: 'persona', maxCount: 1 },
  { name: 'prenda', maxCount: 1 }
]), tryonController.processTryOnFormData);

module.exports = router;
