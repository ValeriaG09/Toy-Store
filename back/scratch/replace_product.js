const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('../src/config/db');

async function run() {
  try {
    const [res] = await db.query(
      `UPDATE productos 
       SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, stock = ? 
       WHERE nombre = ? OR id_producto = 22`,
      [
        'Lazo de Vaquero Woody (Cuerda de Restricción)',
        '¡Hay una serpiente en mi bota... y una cuerda en mi cama! Cuerda de algodón trenzada de alta resistencia para tus rodeos más atrevidos.',
        35000.00,
        '/img/productos/lazo_woody.jpeg',
        18,
        'Esposas Sheriff Woody'
      ]
    );
    console.log('✅ Woody Handcuffs duplicate successfully replaced in the database with Woody Lasso Rope!', res);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error replacing product:', err);
    process.exit(1);
  }
}
run();
