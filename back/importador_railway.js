const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function importar() {
  // CONFIGURACIÓN DE TU RAILWAY (Copiada de lo que vimos antes)
  const connection = await mysql.createConnection({
    host: 'hopper.proxy.rlwy.net',
    user: 'root',
    password: 'SoCrILCBSUQNcBRqtBgcTsUlIXyKGDlq', // ¡OJO! Pon aquí la contraseña de Railway
    port: 48371,
    database: 'railway',
    multipleStatements: true // Esto permite ejecutar todo el archivo de una vez
  });

  try {
    console.log('🚀 Iniciando mudanza de juguetes a Railway...');

    // Leer el archivo SQL
    const sql = fs.readFileSync('./toystore.sql', 'utf8');

    // Ejecutarlo
    await connection.query(sql);

    console.log('✅ ¡Misión cumplida! Todos los juguetes están ahora en Railway.');
  } catch (error) {
    console.error('❌ Error en la mudanza:', error.message);
  } finally {
    await connection.end();
  }
}

importar();
