const db = require('../src/config/db');

async function upgradeUserTable() {
  console.log('🚀 Actualizando tabla de usuarios...');
  try {
    // 1. Agregar columnas si no existen
    await db.query(`
      ALTER TABLE usuarios 
      ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS preferencias TEXT DEFAULT NULL
    `);
    console.log('✅ Columnas avatar_url y preferencias añadidas.');
  } catch (err) {
    console.error('❌ Error al actualizar tabla:', err.message);
  }
  process.exit();
}

upgradeUserTable();
