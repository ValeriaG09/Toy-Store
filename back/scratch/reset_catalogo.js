const db = require('../src/config/db');

const todosLosProductos = [
  // --- DEL CATALOGO BASE (Tienda.jsx) ---
  { id: 1, nombre: 'Vibrador Vaquera Deluxe', descripcion: 'Se graduó con honores en la universidad del placer; no habla mucho, pero hace el trabajo duro por ti. Experta en rodeos nocturnos.', precio: 89900, id_categoria: 1, nivel_discrecion: 2, imagen: '/img/productos/vibrador.jpeg', stock: 10 },
  { id: 2, nombre: 'Conjunto Lencería Bo Peep', descripcion: 'No ha perdido a sus ovejas, solo busca a alguien que las ayude a contar... o a no dormir. Pura seda con intenciones pecaminosas.', precio: 65000, id_categoria: 2, nivel_discrecion: 1, imagen: '/img/productos/lenceria_bo.jpeg', stock: 12 },
  { id: 3, nombre: 'Plug Anal Estrella Fugaz', descripcion: 'Pide un deseo antes de usarlo. Brilla más que el cinturón de Orión y se queda donde lo necesitas para guiarte al infinito y más allá.', precio: 45000, id_categoria: 3, nivel_discrecion: 3, imagen: '/img/productos/plug_estrella.jpeg', stock: 15 },
  { id: 4, nombre: 'Kit Aventura Rodeo', descripcion: 'Todo lo que un sheriff necesita para una noche de patrulla apasionada. Incluye accesorios para arrestos preventivos y masajes de paz.', precio: 120000, id_categoria: 4, nivel_discrecion: 2, imagen: '/img/productos/caja_sorpresa.jpeg', stock: 8 },
  { id: 5, nombre: 'Vibrador Buzz Espacial', descripcion: 'Este comando estelar tiene una misión clara: llevarte al espacio sin salir de tu cuarto. ¡Al infinito y al éxtasis!', precio: 55000, id_categoria: 1, nivel_discrecion: 1, imagen: '/img/productos/balita.jpg', stock: 20 },
  { id: 6, nombre: 'Body Jessie Western', descripcion: 'Para las vaqueras que saben que el rojo es el color de la pasión y del peligro. Ajustable para cualquier duelo al sol.', precio: 78000, id_categoria: 2, nivel_discrecion: 2, imagen: '/img/productos/lenceria_roja.webp', stock: 15 },
  { id: 7, nombre: 'Set Dilatadores Galaxy', descripcion: 'Un viaje progresivo por los agujeros negros más placenteros del universo. Tres niveles de exploración profunda.', precio: 95000, id_categoria: 3, nivel_discrecion: 4, imagen: '/img/productos/dilatadores.webp', stock: 6 },
  { id: 8, nombre: 'Kit Tu Primera Vez', descripcion: 'Como tu primer juguete de Andy, pero con mucha más vibración. Básico, tierno y listo para que pierdas el miedo a las cosquillas.', precio: 150000, id_categoria: 4, nivel_discrecion: 1, imagen: '/img/productos/kit.jpeg', stock: 5 },
  { id: 9, nombre: 'Succionador Clitorial Nebula', descripcion: 'Tecnología de ondas de aire que succionan hasta tus preocupaciones. Es como un beso de un marciano, pero mucho mejor.', precio: 135000, id_categoria: 1, nivel_discrecion: 3, imagen: '/img/productos/succionador.jpeg', stock: 10 },
  { id: 10, nombre: 'Arnés Cowgirl Premium', descripcion: 'Para las que prefieren llevar las riendas del carruaje. Cuero vegano resistente para galopar toda la noche sin cansarse.', precio: 110000, id_categoria: 6, nivel_discrecion: 4, imagen: '/img/productos/arnes.webp', stock: 4 },
  { id: 11, nombre: 'Lubricante Galaxia Dorada', descripcion: 'El aceite oficial de la nave espacial. Resbala más que una cáscara de banana, pero con hermosos brillitos de oro.', precio: 32000, id_categoria: 5, nivel_discrecion: 1, imagen: '/img/productos/lubricante.jpeg', stock: 30 },
  { id: 12, nombre: 'Esposas de Peluche Sheriff', descripcion: 'Porque la ley también puede ser suave. Ideales para arrestos por exceso de velocidad... o por ser demasiado sexy.', precio: 28000, id_categoria: 6, nivel_discrecion: 2, imagen: '/img/productos/esposas_peluditas.jpeg', stock: 18 },

  // --- ADICIONALES TEMÁTICOS ---
  { nombre: 'Slinky Flex Pro', descripcion: 'Inspirado en el perro más flexible del cuarto. Se estira y vibra en todas las direcciones.', precio: 75000, id_categoria: 1, nivel_discrecion: 2, imagen: '/img/productos/slinky.png', stock: 15 },
  { nombre: 'Cohete Espacial XL', descripcion: '¡Al infinito y al clímax! Este potente motor de doble turbina te hará despegar de la cama.', precio: 120000, id_categoria: 1, nivel_discrecion: 3, imagen: '/img/productos/cohete_vibrador.png', stock: 10 },
  { nombre: 'Conjunto Vaquera Jessie', descripcion: 'Pura adrenalina de rodeo. Con detalles de vaca y encaje rojo pasión.', precio: 85000, id_categoria: 2, nivel_discrecion: 1, imagen: '/img/productos/lenceria_jessi.webp', stock: 20 },
  { nombre: 'Plug Marcianito Elegido', descripcion: '¡El Ganchooo! Ha sido elegido para llevarte a un universo de sensaciones profundas.', precio: 42000, id_categoria: 3, nivel_discrecion: 3, imagen: '/img/productos/plug_marcianito.png', stock: 25 },
  { nombre: 'Dilatador Dinosaurio Rex', descripcion: 'Grande, fuerte y listo para una aventura jurásica en el baúl.', precio: 68000, id_categoria: 3, nivel_discrecion: 4, imagen: '/img/productos/rex.png', stock: 8 },
  { nombre: 'Caja Misión Pizza Planeta', descripcion: 'Todo lo que un cadete espacial necesita para una entrega a domicilio muy especial.', precio: 180000, id_categoria: 4, nivel_discrecion: 2, imagen: '/img/productos/kit_pizza.jpeg', stock: 5 },
  { nombre: 'Kit Rodeo en la Noche', descripcion: 'El set completo del Sheriff. Esposas, antifaz y un vibrador bala.', precio: 145000, id_categoria: 4, nivel_discrecion: 3, imagen: '/img/productos/kit_vaquero.jpeg', stock: 7 },
  { nombre: 'Aceite de Carreras RC', descripcion: 'Acelera de 0 a 100 en sensaciones. Lubricante a base de agua de larga duración.', precio: 35000, id_categoria: 5, nivel_discrecion: 1, imagen: '/img/productos/aceite_lubricante.jpeg', stock: 30 },
  { nombre: 'Gel de Masaje Nubes de Andy', descripcion: 'Tan suave como el papel tapiz de la habitación. Relaja tus músculos.', precio: 48000, id_categoria: 5, nivel_discrecion: 1, imagen: '/img/productos/aceite_masaje.jpeg', stock: 22 },
  { nombre: 'Esposas Sheriff Woody', descripcion: '¡Estás arrestado! Metal resistente con recubrimiento de peluche.', precio: 38000, id_categoria: 6, nivel_discrecion: 2, imagen: '/img/productos/esposas_peluditas.jpeg', stock: 18 },
  { nombre: 'Antifaz Señor Cara de Papa', descripcion: 'Bloquea la luz y potencia tus otros sentidos.', precio: 25000, id_categoria: 6, nivel_discrecion: 1, imagen: '/img/productos/antifaz_papa.jpeg', stock: 40 }
];

async function resetProducts() {
  console.log('🔄 Reiniciando catálogo de productos...');
  try {
    // 1. Limpiar tabla (Opcional: puedes borrar o solo actualizar)
    // Para asegurar que sea "un solo archivo", vamos a truncar y re-insertar
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE resenas'); // Borramos reseñas para evitar conflictos de FK
    await db.query('TRUNCATE TABLE productos');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('🗑️ Tabla vaciada.');

    for (const p of todosLosProductos) {
      await db.query(
        'INSERT INTO productos (nombre, descripcion, precio, id_categoria, nivel_discrecion, imagen, stock, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
        [p.nombre, p.descripcion, p.precio, p.id_categoria, p.nivel_discrecion, p.imagen, p.stock]
      );
      console.log(`✅ Insertado: ${p.nombre}`);
    }

    console.log('✨ Catálogo completo sincronizado con éxito.');
  } catch (err) {
    console.error('❌ Error fatal:', err.message);
  }
  process.exit();
}

resetProducts();
