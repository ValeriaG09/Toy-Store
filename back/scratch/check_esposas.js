const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('../src/config/db');

async function check() {
  try {
    const [rows] = await db.query("SELECT * FROM productos WHERE nombre LIKE '%esposas%' OR nombre LIKE '%Sheriff%'");
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
