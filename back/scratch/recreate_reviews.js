const db = require('../src/config/db');

async function recreateReviewsTable() {
  console.log('🏗️ Recreando tabla de reseñas con el esquema gamificado...');
  try {
    // 1. Eliminar la tabla antigua
    await db.query("DROP TABLE IF EXISTS resenas");
    
    // 2. Crear la tabla nueva
    await db.query(`
      CREATE TABLE resenas (
        id_resena INT AUTO_INCREMENT PRIMARY KEY,
        producto_id INT NOT NULL,
        usuario VARCHAR(100) DEFAULT 'Vaquero Anónimo',
        texto TEXT NOT NULL,
        medalla VARCHAR(50),
        icono VARCHAR(10),
        color VARCHAR(50),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (producto_id) REFERENCES productos(id_producto)
      )
    `);
    
    console.log('✅ Tabla "resenas" recreada con éxito.');
  } catch (err) {
    console.error('❌ Error al recrear tabla:', err.message);
  }
  process.exit();
}

recreateReviewsTable();
