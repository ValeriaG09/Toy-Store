const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./src/config/db');

async function run() {
  try {
    // 1. Asignar nombre_usuario único a cada cuenta existente
    await db.query(
      "UPDATE usuarios SET nombre_usuario = 'alvarezfrancomariana', nombre = 'Mariana Alvarez' WHERE email = 'alvarezfrancomariana@gmail.com'"
    );
    await db.query(
      "UPDATE usuarios SET nombre_usuario = 'mfranco090393', nombre = 'Mariana Franco' WHERE email = 'mfranco090393@gmail.com'"
    );
    await db.query(
      "UPDATE usuarios SET nombre_usuario = 'saraguevara', nombre = 'Sara Guevara' WHERE email = 'saraguevara192@gmail.com'"
    );

    // 2. Crear tabla seguidores si no existe
    await db.query(`
      CREATE TABLE IF NOT EXISTS seguidores (
        id_seguidor INT NOT NULL,
        id_seguido INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id_seguidor, id_seguido)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Crear tabla notificaciones si no existe
    await db.query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_remitente INT NULL,
        tipo VARCHAR(50) DEFAULT 'seguimiento',
        texto TEXT NOT NULL,
        leido TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Añadir índice único a nombre_usuario
    try {
      await db.query('ALTER TABLE usuarios ADD UNIQUE KEY uq_nombre_usuario (nombre_usuario)');
      console.log('✅ Índice único añadido con éxito');
    } catch (e) {
      console.log('ℹ️ Índice único ya configurado:', e.message);
    }

    const [users] = await db.query('SELECT id_usuario, nombre, email, nombre_usuario FROM usuarios');
    console.log('👥 Usuarios finales en BD:', users);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en setup_social:', err);
    process.exit(1);
  }
}

run();
