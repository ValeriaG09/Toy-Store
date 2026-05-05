const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verificamos conexión de forma asíncrona para que NO detenga el servidor si falla
transporter.verify()
  .then(() => console.log('✅ Correo real listo para enviar'))
  .catch((error) => {
    console.error('❌ Error de conexión SMTP (Gmail):', error.message);
    console.log('⚠️  El servidor sigue funcionando, pero no se enviarán correos hasta corregir .env');
  });

module.exports = transporter;