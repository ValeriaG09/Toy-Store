const express = require('express');
const router = express.Router();
const { procesarMensaje } = require('../controllers/chat.controller');

router.post('/mensaje', procesarMensaje);

module.exports = router;
