const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'back', '.env') });
const db = require('./back/src/config/db');

async function test() {
  try {
    console.log('--- Probando conexión ---');
    const [rows] = await db.query('SELECT current_database(), current_user');
    console.log('Database Info:', rows[0]);

    console.log('\n--- Columnas de la tabla usuarios ---');
    const [cols] = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios'
    `);
    console.table(cols);

    console.log('\n--- Primer usuario (si existe) ---');
    const [users] = await db.query('SELECT * FROM usuarios LIMIT 1');
    if (users.length > 0) {
      console.log('Columnas encontradas en el primer registro:', Object.keys(users[0]));
      console.log('Fila encontrada (JSON):', JSON.stringify(users[0], null, 2));
    } else {
      console.log('No hay usuarios en la tabla.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR FATAL:', err);
    process.exit(1);
  }
}

test();
