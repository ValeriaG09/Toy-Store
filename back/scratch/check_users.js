const db = require('../src/config/db');

async function checkUserTable() {
  try {
    const [columns] = await db.query("DESCRIBE usuarios");
    console.log('📦 Columnas de USUARIOS:', columns.map(c => c.Field));
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit();
}

checkUserTable();
