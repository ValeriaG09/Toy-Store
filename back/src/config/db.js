const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'toystore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((connection) => {
    console.log('✅ Conectado a MySQL (XAMPP)');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error MySQL: No se pudo conectar a la base de datos.');
    console.error('   Asegúrate de que XAMPP esté encendido y la DB exista.');
    console.error(`   Detalle: ${err.message}`);
  });

module.exports = pool;