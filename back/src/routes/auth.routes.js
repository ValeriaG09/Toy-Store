const express = require('express');
const router = express.Router();
const { registro, login, forgotPassword, resetPassword, googleLogin, sendGoogleVerification, verifyGoogleMock, getMe, logout } = require('../controllers/auth.controller');

router.post('/registro', registro);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-login', googleLogin);
router.post('/google-send-code', sendGoogleVerification);
router.post('/google-register', verifyGoogleMock);
router.get('/me', getMe);
router.post('/logout', logout);

module.exports = router;