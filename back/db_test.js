const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
    console.log('--- TEST DE CONEXIÓN ---');
    console.log('Host:', process.env.DB_HOST || '127.0.0.1');
    console.log('User:', process.env.DB_USER || 'root');
    console.log('DB:', process.env.DB_NAME || 'toystore');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'toystore',
            port: 3306
        });

        console.log('✅ CONEXIÓN EXITOSA');
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('Resultado Query:', rows[0].result);
        await connection.end();
    } catch (err) {
        console.error('❌ ERROR EN TEST:', err.message);
        console.error('Código:', err.code);
    }
}

test();
