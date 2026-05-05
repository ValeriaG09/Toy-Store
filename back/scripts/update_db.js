const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('👷 Iniciando actualización de base de datos...');
    
    // Añadir columna fecha_nacimiento si no existe
    const [columns] = await connection.query('SHOW COLUMNS FROM usuarios LIKE "fecha_nacimiento"');
    if (columns.length === 0) {
      await connection.query('ALTER TABLE usuarios ADD COLUMN fecha_nacimiento DATE AFTER email');
      console.log('✅ Columna fecha_nacimiento añadida con éxito.');
    } else {
      console.log('ℹ️ La columna fecha_nacimiento ya existe.');
    }

  } catch (error) {
    console.error('❌ Error al actualizar la base de datos:', error);
  } finally {
    await connection.end();
    process.exit();
  }
}

updateDB();
