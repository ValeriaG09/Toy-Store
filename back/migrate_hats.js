const mysql = require('mysql2/promise');
require('dotenv').config({ path: './back/.env' });

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'toystore',
    port: process.env.DB_PORT || 3307
  });

  const [cols] = await conn.execute('DESCRIBE usuarios');
  const colNames = cols.map(c => c.Field);

  if (!colNames.includes('avatar_hat')) {
    await conn.execute("ALTER TABLE usuarios ADD COLUMN avatar_hat VARCHAR(50) DEFAULT 'woody'");
    console.log('✅ Added column avatar_hat');
  } else {
    console.log('ℹ️ Column avatar_hat already exists');
  }

  if (!colNames.includes('gorritos_desbloqueados')) {
    await conn.execute("ALTER TABLE usuarios ADD COLUMN gorritos_desbloqueados TEXT");
    console.log('✅ Added column gorritos_desbloqueados');
  } else {
    console.log('ℹ️ Column gorritos_desbloqueados already exists');
  }

  // Actualizar usuarios existentes que no tengan gorritos inicializados
  await conn.execute(`
    UPDATE usuarios 
    SET gorritos_desbloqueados = '["woody","jessie","none"]' 
    WHERE (gorritos_desbloqueados IS NULL OR gorritos_desbloqueados = '') AND id_rol != 1
  `);

  await conn.execute(`
    UPDATE usuarios 
    SET gorritos_desbloqueados = '["potato","woody","jessie","buzz","lotso","alien","rex","hamm","bopeep","none"]' 
    WHERE id_rol = 1
  `);

  console.log('✅ Initialized existing users hats');
  await conn.end();
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
