const db = require('../src/config/db');

async function removeDuplicate() {
  console.log('🗑️ Eliminando producto duplicado de Bo Peep...');
  try {
    // Eliminamos el que tiene el nombre "Picardías Pastorcita Bo Peep"
    const [result] = await db.query("DELETE FROM productos WHERE nombre = 'Picardías Pastorcita Bo Peep'");
    if (result.affectedRows > 0) {
      console.log('✅ Duplicado eliminado con éxito.');
    } else {
      console.log('⚠️ No se encontró el producto duplicado.');
    }
  } catch (err) {
    console.error('❌ Error al eliminar:', err.message);
  }
  process.exit();
}

removeDuplicate();
