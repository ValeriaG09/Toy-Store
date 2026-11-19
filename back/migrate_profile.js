const mysql = require('mysql2/promise');
require('dotenv').config({ path: './back/.env' });

async function migrateProfile() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'toystore',
    port: process.env.DB_PORT || 3307
  });

  const [cols] = await conn.execute('DESCRIBE usuarios');
  const colNames = cols.map(c => c.Field);

  if (!colNames.includes('informacion')) {
    await conn.execute("ALTER TABLE usuarios ADD COLUMN informacion TEXT");
    console.log('✅ Added column informacion');
  } else {
    console.log('ℹ️ Column informacion already exists');
  }

  if (!colNames.includes('pronombres')) {
    await conn.execute("ALTER TABLE usuarios ADD COLUMN pronombres VARCHAR(50) DEFAULT ''");
    console.log('✅ Added column pronombres');
  } else {
    console.log('ℹ️ Column pronombres already exists');
  }

  if (!colNames.includes('sitio_web')) {
    await conn.execute("ALTER TABLE usuarios ADD COLUMN sitio_web VARCHAR(255) DEFAULT ''");
    console.log('✅ Added column sitio_web');
  } else {
    console.log('ℹ️ Column sitio_web already exists');
  }

  if (!colNames.includes('nombre_usuario')) {
    await conn.execute("ALTER TABLE usuarios ADD COLUMN nombre_usuario VARCHAR(100) DEFAULT ''");
    console.log('✅ Added column nombre_usuario');
  } else {
    console.log('ℹ️ Column nombre_usuario already exists');
  }

  if (!colNames.includes('empaque_discreto')) {
    await conn.execute("ALTER TABLE usuarios ADD COLUMN empaque_discreto TINYINT(1) DEFAULT 1");
    console.log('✅ Added column empaque_discreto');
  } else {
    console.log('ℹ️ Column empaque_discreto already exists');
  }

  // Si nombre_usuario está vacío, inicializarlo con la parte previa al @ del email
  await conn.execute(`
    UPDATE usuarios 
    SET nombre_usuario = SUBSTRING_INDEX(email, '@', 1) 
    WHERE nombre_usuario IS NULL OR nombre_usuario = ''
  `);

  console.log('✅ Migration profile complete!');
  await conn.end();
}

migrateProfile().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
