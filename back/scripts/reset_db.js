const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function resetDB() {
  console.log('🔄 Iniciando el restablecimiento de la base de datos...');
  
  // Conectar sin especificar base de datos primero para poder droppearla/crearla
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
  });

  try {
    const dbName = process.env.DB_NAME || 'toystore';
    
    console.log(`✨ Asegurando que la base de datos existe: ${dbName}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    console.log(`🔌 Cambiando a la base de datos: ${dbName}...`);
    await connection.query(`USE ${dbName}`);

    console.log(`🗑️ Eliminando tablas existentes para evitar conflictos...`);
    await connection.query(`DROP TABLE IF EXISTS usuarios`);
    await connection.query(`DROP TABLE IF EXISTS productos`);

    // Leer y ejecutar schema.sql (tabla usuarios)
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('📋 Cargando esquema (usuarios)...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ Tabla usuarios creada.');
    } else {
      console.warn('⚠️ No se encontró schema.sql');
    }

    // Leer y ejecutar init_db.sql (tabla productos y datos iniciales)
    const initPath = path.join(__dirname, '..', 'init_db.sql');
    if (fs.existsSync(initPath)) {
      console.log('📦 Cargando datos iniciales (productos)...');
      const initSql = fs.readFileSync(initPath, 'utf8');
      await connection.query(initSql);
      console.log('✅ Tabla productos y datos iniciales cargados.');
    } else {
      console.warn('⚠️ No se encontró init_db.sql');
    }

    console.log('🎉 ¡Base de datos restablecida con éxito!');

  } catch (error) {
    console.error('❌ Error al restablecer la base de datos:', error);
  } finally {
    await connection.end();
  }
}

resetDB();
