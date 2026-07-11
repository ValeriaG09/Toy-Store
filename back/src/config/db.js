const { Pool } = require('pg');
require('dotenv').config();

// Usamos exclusivamente DATABASE_URL de Supabase/Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Requerido por Supabase/Render
});

// Probar la conexión al arrancar
pool.connect()
  .then(client => {
    console.log('✅ Conectado a PostgreSQL (Supabase/Render)');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error PostgreSQL: No se pudo conectar a la base de datos.');
    console.error('   Asegúrate de que DATABASE_URL esté correcta en .env.');
    console.error(`   Detalle: ${err.message}`);
  });

module.exports = pool;