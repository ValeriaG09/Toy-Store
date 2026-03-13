const express = require('express');
const router = express.Router();
const { registro, login, forgotPassword, resetPassword, googleMock, sendGoogleVerification, verifyGoogleMock } = require('../controllers/auth.controller');

router.post('/registro', registro);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-mock', googleMock);
router.post('/google-send-code', sendGoogleVerification);
router.post('/google-register', verifyGoogleMock);

module.exports = router;