const db = require('../src/config/db');

async function checkReviewsTable() {
  try {
    const [rows] = await db.query("SHOW TABLES LIKE 'resenas'");
    if (rows.length === 0) {
      console.log('⚠️ La tabla "resenas" NO existe. Creándola...');
      await db.query(`
        CREATE TABLE resenas (
          id_resena INT AUTO_INCREMENT PRIMARY KEY,
          producto_id INT NOT NULL,
          usuario VARCHAR(100) DEFAULT 'Vaquero Anónimo',
          texto TEXT NOT NULL,
          medalla VARCHAR(50),
          icono VARCHAR(10),
          color VARCHAR(20),
          fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (producto_id) REFERENCES productos(id_producto)
        )
      `);
      console.log('✅ Tabla "resenas" creada con éxito.');
    } else {
      console.log('✅ La tabla "resenas" ya existe.');
      const [columns] = await db.query("DESCRIBE resenas");
      console.log('Columnas:', columns.map(c => c.Field));
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit();
}

checkReviewsTable();
