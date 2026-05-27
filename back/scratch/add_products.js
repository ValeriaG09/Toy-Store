const db = require('../src/config/db');

const nuevosProductos = [
  // 🍆 VIBRADORES (id_categoria: 1)
  {
    nombre: 'Slinky Flex Pro',
    descripcion: 'Inspirado en el perro más flexible del cuarto. Se estira y vibra en todas las direcciones para alcanzar cualquier rincón de tu patio de juegos.',
    precio: 75000,
    id_categoria: 1,
    nivel_discrecion: 2,
    imagen: '/img/productos/slinky_vibra.png',
    stock: 15
  },
  {
    nombre: 'Cohete Espacial XL',
    descripcion: '¡Al infinito y al clímax! Este potente motor de doble turbina te hará despegar de la cama más rápido que Buzz Lightyear.',
    precio: 120000,
    id_categoria: 1,
    nivel_discrecion: 3,
    imagen: '/img/productos/cohete_buzz.png',
    stock: 10
  },

  // 👙 LENCERÍA (id_categoria: 2)
  {
    nombre: 'Conjunto Vaquera Jessie',
    descripcion: 'Pura adrenalina de rodeo. Con detalles de vaca y encaje rojo pasión. ¡Yee-haw! Prepárate para el duelo al sol.',
    precio: 85000,
    id_categoria: 2,
    nivel_discrecion: 1,
    imagen: '/img/productos/lenceria_jessi.webp',
    stock: 20
  },
  {
    nombre: 'Picardías Pastorcita Bo Peep',
    descripcion: 'No has perdido a tus ovejas, estás buscando a tu pastor. Seda blanca con lazos azules para una noche de cuento.',
    precio: 95000,
    id_categoria: 2,
    nivel_discrecion: 1,
    imagen: '/img/productos/lenceria_bo.jpeg',
    stock: 12
  },

  // 🍑 ANALES (id_categoria: 3)
  {
    nombre: 'Plug Marcianito Elegido',
    descripcion: '¡El Ganchooo! Ha sido elegido para llevarte a un universo de sensaciones profundas. Suave silicona de otro planeta.',
    precio: 42000,
    id_categoria: 3,
    nivel_discrecion: 3,
    imagen: '/img/productos/plug_marcianito.png',
    stock: 25
  },
  {
    nombre: 'Dilatador Dinosaurio Rex',
    descripcion: 'No dejes que su cara de miedo te engañe. Es grande, es fuerte y está listo para una aventura jurásica en el baúl.',
    precio: 68000,
    id_categoria: 3,
    nivel_discrecion: 4,
    imagen: '/img/productos/rex_anal.png',
    stock: 8
  },

  // 📦 KITS (id_categoria: 4)
  {
    nombre: 'Caja Misión Pizza Planeta',
    descripcion: 'Todo lo que un cadete espacial necesita para una entrega a domicilio muy especial. Incluye 3 juguetes sorpresa y un lubricante estelar.',
    precio: 180000,
    id_categoria: 4,
    nivel_discrecion: 2,
    imagen: '/img/productos/kit_pizza.png',
    stock: 5
  },
  {
    nombre: 'Kit Rodeo en la Noche',
    descripcion: 'El set completo del Sheriff. Esposas, antifaz y un vibrador bala para mantener el orden en el condado.',
    precio: 145000,
    id_categoria: 4,
    nivel_discrecion: 3,
    imagen: '/img/productos/kit_rodeo.png',
    stock: 7
  },

  // 🧪 LUBRICANTES (id_categoria: 5)
  {
    nombre: 'Aceite de Carreras RC',
    descripcion: 'Acelera de 0 a 100 en sensaciones. Lubricante a base de agua de larga duración para que nada se detenga en la pista.',
    precio: 35000,
    id_categoria: 5,
    nivel_discrecion: 1,
    imagen: '/img/productos/lub_rc.png',
    stock: 30
  },
  {
    nombre: 'Gel de Masaje Nubes de Andy',
    descripcion: 'Tan suave como el papel tapiz de la habitación. Relaja tus músculos antes de que empiece la verdadera acción.',
    precio: 48000,
    id_categoria: 5,
    nivel_discrecion: 1,
    imagen: '/img/productos/gel_nubes.png',
    stock: 22
  },

  // ✨ ACCESORIOS (id_categoria: 6)
  {
    nombre: 'Esposas Sheriff Woody',
    descripcion: '¡Estás arrestado! Por exceso de belleza. Metal resistente con recubrimiento de peluche para detenciones suaves.',
    precio: 38000,
    id_categoria: 6,
    nivel_discrecion: 2,
    imagen: '/img/productos/esposas_woody.png',
    stock: 18
  },
  {
    nombre: 'Antifaz Señor Cara de Papa',
    descripcion: 'Para cuando no quieres que te vean... o para que no veas lo que viene. Bloquea la luz y potencia tus otros sentidos.',
    precio: 25000,
    id_categoria: 6,
    nivel_discrecion: 1,
    imagen: '/img/productos/antifaz_papa.png',
    stock: 40
  }
];

async function addProducts() {
  console.log('🚀 Iniciando inserción de nuevos productos...');
  for (const p of nuevosProductos) {
    try {
      await db.query(
        'INSERT INTO productos (nombre, descripcion, precio, id_categoria, nivel_discrecion, imagen, stock, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
        [p.nombre, p.descripcion, p.precio, p.id_categoria, p.nivel_discrecion, p.imagen, p.stock]
      );
      console.log(`✅ Añadido: ${p.nombre}`);
    } catch (err) {
      console.error(`❌ Error con ${p.nombre}:`, err.message);
    }
  }
  console.log('✨ ¡Misión completada! El baúl de Andy está lleno.');
  process.exit();
}

addProducts();
