const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

pool.getConnection()
  .then(() => console.log('✅ Conectado a MySQL'))
  .catch(err => {
    console.error('❌ Error MySQL: No se pudo conectar a la base de datos.');
    console.error('   Asegúrate de que MySQL esté corriendo y que los datos en .env sean correctos.');
    console.error(`   Detalle: ${err.message}`);
  });

module.exports = pool;