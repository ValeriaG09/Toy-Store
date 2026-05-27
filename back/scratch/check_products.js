const db = require('../src/config/db');

async function checkProducts() {
  try {
    const [rows] = await db.query("SELECT nombre, imagen FROM productos");
    console.log('📦 PRODUCTOS EN DB:');
    rows.forEach(r => console.log(`- ${r.nombre}: ${r.imagen}`));
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit();
}

checkProducts();
