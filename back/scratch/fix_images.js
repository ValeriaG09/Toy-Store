const db = require('../src/config/db');

async function fixImagePaths() {
  console.log('🔧 Corrigiendo rutas de imágenes en la base de datos...');
  try {
    // Reemplazar espacios por guiones bajos en la columna imagen
    await db.query(`
      UPDATE productos 
      SET imagen = REPLACE(imagen, ' ', '_')
      WHERE imagen LIKE '% %'
    `);
    console.log('✅ Rutas de imágenes corregidas en la DB.');
  } catch (err) {
    console.error('❌ Error corrigiendo rutas:', err.message);
  }
  process.exit();
}

fixImagePaths();
