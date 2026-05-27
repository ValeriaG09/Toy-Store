const db = require('./src/config/db');

async function setupReviewsTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS resenas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        producto_id INT NOT NULL,
        usuario VARCHAR(255) DEFAULT 'Vaquero Anónimo',
        texto TEXT NOT NULL,
        medalla VARCHAR(100),
        icono VARCHAR(50),
        color VARCHAR(100),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(createTableQuery);
    console.log('✅ Tabla "resenas" creada o ya existente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear la tabla "resenas":', error);
    process.exit(1);
  }
}

setupReviewsTable();
