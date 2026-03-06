const express = require('express');
const router = express.Router();
const { registro, login, forgotPassword, resetPassword } = require('../controllers/auth.controller');

router.post('/registro', registro);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;