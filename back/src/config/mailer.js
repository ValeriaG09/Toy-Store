const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Probar conexión al iniciar
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error correo:', error.message);
  } else {
    console.log('✅ Correo listo para enviar');
  }
});

module.exports = transporter;