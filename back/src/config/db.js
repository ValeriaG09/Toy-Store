const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión al arrancar
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado a MySQL (XAMPP)');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error MySQL: No se pudo conectar a la base de datos local.');
    console.error('   Asegúrate de que XAMPP Apache y MySQL estén encendidos.');
    console.error(`   Detalle: ${err.message}`);
  });

// Wrapper opcional para mantener compatibilidad si algunas consultas usaban db.query sin await [rows]
// Aunque mysql2/promise devuelve [rows, fields] nativamente en pool.query()
const db = {
  query: async (text, params) => {
    // Si la aplicación destructureaba con const [rows] = await db.query(...), esto devolverá directamente un arreglo.
    return await pool.query(text, params);
  }
};

module.exports = db;

module.exports = db;