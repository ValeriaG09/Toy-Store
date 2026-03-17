const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Adding connection timeout and keepalive config
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});

pool.connect()
  .then(() => console.log('✅ Conectado a Supabase (PostgreSQL)'))
  .catch(err => {
    console.error('❌ Error Supabase: No se pudo conectar a la base de datos.');
    console.error('   Asegúrate de que los datos en .env sean correctos.');
    console.error(`   Detalle: ${err.message}`);
  });

// Wrapper to make it compatible with mysql2 `[rows]` destructuring
const db = {
  query: async (text, params) => {
    const result = await pool.query(text, params);
    // pg returns { rows: [...] }, mysql2 returns [rows, fields]
    return [result.rows, result.fields];
  }
};

module.exports = db;