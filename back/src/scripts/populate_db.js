require('dotenv').config({ path: './back/.env' });
const db = require('../config/db');

const products = [
  {
    nombre: 'Vibrador Vaquera Deluxe',
    descripcion: 'Se graduó con honores en la universidad del placer; no habla mucho, pero hace el trabajo duro por ti. Experta en rodeos nocturnos.',
    precio: 89900,
    stock: 15,
    id_categoria: 1, // Vibradores
    imagen: '/img/productos/vibrador.jpeg',
    nivel_discrecion: 2
  },
  {
    nombre: 'Conjunto Lencería Bo Peep',
    descripcion: 'No ha perdido a sus ovejas, solo busca a alguien que las ayude a contar... o a no dormir. Pura seda con intenciones pecaminosas.',
    precio: 65000,
    stock: 10,
    id_categoria: 2, // Lencería
    imagen: '/img/productos/lenceria jessi.webp',
    nivel_discrecion: 1
  },
  {
    nombre: 'Plug Anal Estrella Fugaz',
    descripcion: 'Pide un deseo antes de usarlo. Brilla más que el cinturón de Orión y se queda donde lo necesitas para guiarte al infinito y más allá.',
    precio: 45000,
    stock: 20,
    id_categoria: 3, // Anales
    imagen: '/img/productos/plug_estrella.png',
    nivel_discrecion: 3
  },
  {
    nombre: 'Kit Aventura Rodeo',
    descripcion: 'Todo lo que un sheriff necesita para una noche de patrulla apasionada. Incluye accesorios para arrestos preventivos y masajes de paz.',
    precio: 120000,
    stock: 5,
    id_categoria: 4, // Kits
    imagen: '/img/productos/caja sorpresa.jpeg',
    nivel_discrecion: 2
  },
  {
    nombre: 'Vibrador Buzz Espacial',
    descripcion: 'Este comando estelar tiene una misión clara: llevarte al espacio sin salir de tu cuarto. ¡Al infinito y al éxtasis!',
    precio: 55000,
    stock: 25,
    id_categoria: 1, // Vibradores
    imagen: '/img/productos/balita.jpg',
    nivel_discrecion: 1
  },
  {
    nombre: 'Body Jessie Western',
    descripcion: 'Para las vaqueras que saben que el rojo es el color de la pasión y del peligro. Ajustable para cualquier duelo al sol.',
    precio: 78000,
    stock: 12,
    id_categoria: 2, // Lencería
    imagen: '/img/productos/lenceria roja.webp',
    nivel_discrecion: 2
  },
  {
    nombre: 'Esposas de Peluche Sheriff',
    descripcion: 'Porque la ley también puede ser suave. Ideales para arrestos por exceso de velocidad... o por ser demasiado sexy.',
    precio: 28000,
    stock: 30,
    id_categoria: 6, // Accesorios
    imagen: '/img/productos/esposas_sheriff.png',
    nivel_discrecion: 2
  },
  {
    nombre: 'Set Dilatadores Galaxy',
    descripcion: 'Un viaje progresivo por los agujeros negros más placenteros del universo. Tres niveles de exploración profunda.',
    precio: 95000,
    stock: 8,
    id_categoria: 3, // Anales
    imagen: '/img/productos/dilatadores.webp',
    nivel_discrecion: 4
  },
  {
    nombre: 'Kit Tu Primera Vez',
    descripcion: 'Como tu primer juguete de Andy, pero con mucha más vibración. Básico, tierno y listo para que pierdas el miedo a las cosquillas.',
    precio: 150000,
    stock: 7,
    id_categoria: 4, // Kits
    imagen: '/img/productos/kit.jpeg',
    nivel_discrecion: 1
  },
  {
    nombre: 'Succionador Clitorial Nebula',
    descripcion: 'Tecnología de ondas de aire que succionan hasta tus preocupaciones. Es como un beso de un marciano, pero mucho mejor.',
    precio: 135000,
    stock: 18,
    id_categoria: 1, // Vibradores
    imagen: '/img/productos/succionador.jpeg',
    nivel_discrecion: 3
  },
  {
    nombre: 'Arnés Cowgirl Premium',
    descripcion: 'Para las que prefieren llevar las riendas del carruaje. Cuero vegano resistente para galopar toda la noche sin cansarse.',
    precio: 110000,
    stock: 4,
    id_categoria: 6, // Accesorios
    imagen: '/img/productos/arnes.webp',
    nivel_discrecion: 4
  },
  {
    nombre: 'Lubricante Galaxia Dorada',
    descripcion: 'El aceite oficial de la nave espacial. Resbala más que una cáscara de banana, pero con hermosos brillitos de oro.',
    precio: 32000,
    stock: 50,
    id_categoria: 5, // Lubricantes
    imagen: '/img/productos/lubricante.jpeg',
    nivel_discrecion: 1
  }
];

async function populate() {
  try {
    console.log('🚀 Iniciando población de base de datos...');
    
    // Limpiar tabla productos
    await db.query('DELETE FROM productos');
    console.log('🗑️ Tabla productos limpiada.');

    for (const p of products) {
      await db.query(
        'INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria, imagen, nivel_discrecion) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [p.nombre, p.descripcion, p.precio, p.stock, p.id_categoria, p.imagen, p.nivel_discrecion]
      );
    }

    console.log('✅ Base de datos poblada con éxito.');
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    process.exit();
  }
}

populate();
