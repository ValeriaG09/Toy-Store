const db = require('../src/config/db');

async function syncImages() {
  console.log('🔄 Sincronizando nombres de archivos con la DB...');
  try {
    // Mapeo manual de lo que hay en disco vs lo que hay en DB
    const corrections = [
      { nombre: 'Picardías Pastorcita Bo Peep', imagen: '/img/productos/lenceria_bo.jpeg' },
      { nombre: 'Conjunto Lencería Bo Peep', imagen: '/img/productos/lenceria_bo.jpeg' },
      { nombre: 'Kit Aventura Rodeo', imagen: '/img/productos/caja_sorpresa.jpeg' },
      { nombre: 'Body Jessie Western', imagen: '/img/productos/lenceria_roja.webp' },
      { nombre: 'Conjunto Vaquera Jessie', imagen: '/img/productos/lenceria_jessi.webp' },
    ];

    for (const item of corrections) {
      await db.query('UPDATE productos SET imagen = ? WHERE nombre = ?', [item.imagen, item.nombre]);
      console.log(`✅ Corregido: ${item.nombre} -> ${item.imagen}`);
    }

    // Opcional: Eliminar duplicados si el usuario quiere uno solo
    // Pero por ahora solo arreglamos las rutas.

    console.log('✨ Sincronización completada.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit();
}

syncImages();
