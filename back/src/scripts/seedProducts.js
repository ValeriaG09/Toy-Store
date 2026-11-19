const db = require('../config/db');

/**
 * Script de Semillero Expandido: Carga masiva de 35+ productos para Toy Store.
 * Categorías: Vibradores, Lencería, Cosméticos, Accesorios, Anales, Penes y Kits.
 */

const initialProducts = [
  // 1. VIBRADORES
  { nombre: 'Vibrador Conejo Dual', precio: 185000, categoria: 'vibradores', nivel_juego: 2, stock: 12, descripcion: 'Estimulación simultánea de clítoris y punto G. Doble motor y silicona médica.' },
  { nombre: 'Bala Vibradora Recargable', precio: 65000, categoria: 'vibradores', nivel_juego: 1, stock: 20, descripcion: 'Potente y silenciosa, con carga USB y 12 modos rítmicos.' },
  { nombre: 'Masajeador Wand Pro', precio: 220000, categoria: 'vibradores', nivel_juego: 2, stock: 8, descripcion: 'Clásico masajeador de cabeza flexible para estimulación externa intensa.' },
  { nombre: 'Vibrador de Dedo Silicona', precio: 35000, categoria: 'vibradores', nivel_juego: 1, stock: 30, descripcion: 'Discreto y texturizado para masajes íntimos precisos.' },
  { nombre: 'Succionador de Clítoris Air-Pulse', precio: 195000, categoria: 'vibradores', nivel_juego: 3, stock: 10, descripcion: 'Tecnología de ondas de presión para orgasmos intensos y rápidos.' },

  // 2. LENCERÍA
  { nombre: 'Body de Encaje Floral Negro', precio: 95000, categoria: 'lencerias', nivel_juego: 1, stock: 15, descripcion: 'Diseño elegante con espalda descubierta y detalles transparentes.' },
  { nombre: 'Conjunto Liguero Rojo Pasión', precio: 110000, categoria: 'lencerias', nivel_juego: 1, stock: 12, descripcion: 'Set completo de 3 piezas: brasier, panty y liguero ajustable.' },
  { nombre: 'Medias de Red con Encaje', precio: 25000, categoria: 'lencerias', nivel_juego: 1, stock: 40, descripcion: 'Medias clásicas de malla con banda de encaje siliconada.' },
  { nombre: 'Baby-doll Seda Blanco Novia', precio: 130000, categoria: 'lencerias', nivel_juego: 1, stock: 6, descripcion: 'Seda premium con detalles en tul, ideal para noches especiales.' },
  { nombre: 'Disfraz Enfermera Picante', precio: 85000, categoria: 'lencerias', nivel_juego: 2, stock: 10, descripcion: 'Incluye vestido corto, cofia y estetoscopio de juguete.' },

  // 3. COSMÉTICOS
  { nombre: 'Lubricante Sabor Fresa 50ml', precio: 22000, categoria: 'cosmeticos', nivel_juego: 1, stock: 45, descripcion: 'Base agua con delicioso aroma y sabor a fresa natural.' },
  { nombre: 'Gel Multiorgásmico Femenino', precio: 45000, categoria: 'cosmeticos', nivel_juego: 2, stock: 20, descripcion: 'Aumenta la sensibilidad y produce oleadas de calor estimulante.' },
  { nombre: 'Aceite de Masaje Comestible Chocolate', precio: 38000, categoria: 'cosmeticos', nivel_juego: 1, stock: 18, descripcion: 'Aceite sedoso con sabor a chocolate belga para masajes eróticos.' },
  { nombre: 'Retardante Masculino en Spray', precio: 32000, categoria: 'cosmeticos', nivel_juego: 2, stock: 25, descripcion: 'Fórmula ligera para prolongar el encuentro y el placer.' },
  { nombre: 'Polvos de Hada Sensuales', precio: 28000, categoria: 'cosmeticos', nivel_juego: 1, stock: 15, descripcion: 'Talco perfumado con destellos para iluminar la piel.' },

  // 4. ACCESORIOS
  { nombre: 'Esposas de Cuero con Cadena', precio: 55000, categoria: 'accesorios', nivel_juego: 2, stock: 14, descripcion: 'Resistentes y ajustables, con forro suave para evitar marcas.' },
  { nombre: 'Antifaz de Satin y Encaje', precio: 18000, categoria: 'accesorios', nivel_juego: 1, stock: 35, descripcion: 'Bloqueo total de luz con tacto de seda para juegos sensoriales.' },
  { nombre: 'Látigo de Flecos Suaves', precio: 42000, categoria: 'accesorios', nivel_juego: 2, stock: 10, descripcion: 'Palas y flecos de cuero sintético para caricias o impactos suaves.' },
  { nombre: 'Mordaza de Bola Silicona', precio: 38000, categoria: 'accesorios', nivel_juego: 3, stock: 8, descripcion: 'Correa de cuero ajustable con bola de silicona ergonómica.' },
  { nombre: 'Plumas de Caricia Erótica', precio: 12000, categoria: 'accesorios', nivel_juego: 1, stock: 50, descripcion: 'Accesorio clásico para despertar la piel y los sentidos.' },

  // 5. ANALES
  { nombre: 'Set de 3 Plugs de Acero', precio: 125000, categoria: 'anales', nivel_juego: 3, stock: 7, descripcion: 'Diferentes tamaños con gema decorativa en la base. Material hipoalergénico.' },
  { nombre: 'Cuentas Anales de Silicona', precio: 32000, categoria: 'anales', nivel_juego: 2, stock: 15, descripcion: 'Rosario anal flexible con anillo de extracción de seguridad.' },
  { nombre: 'Lubricante Anal Relajante 100ml', precio: 35000, categoria: 'anales', nivel_juego: 2, stock: 20, descripcion: 'Fórmula densa con extractos naturales para una mayor comodidad.' },
  { nombre: 'Plug Anal Vibrador', precio: 78000, categoria: 'anales', nivel_juego: 3, stock: 9, descripcion: 'Silicona sedosa con motor interno de 7 velocidades.' },

  // 6. PENES (Dildos)
  { nombre: 'Dildo Realista con Ventosa', precio: 110000, categoria: 'penes', nivel_juego: 2, stock: 11, descripcion: 'Textura Cyberskin ultra realista con base de succión potente.' },
  { nombre: 'Dildo de Cristal de Borosilicato', precio: 140000, categoria: 'penes', nivel_juego: 2, stock: 5, descripcion: 'Elegante, hipoalergénico y compatible con temperaturas frío/calor.' },
  { nombre: 'Arnés Ajustable Universal', precio: 85000, categoria: 'penes', nivel_juego: 3, stock: 6, descripcion: 'Correas de nylon reforzado compatible con la mayoría de dildos.' },
  { nombre: 'Dildo Doble para Parejas', precio: 125000, categoria: 'penes', nivel_juego: 3, stock: 4, descripcion: 'Diseñado para uso simultáneo, flexible y resistente.' },

  // 7. KITS SORPRESA (Al final)
  { nombre: 'Kit Sorpresa: Noche de BDSM', precio: 280000, categoria: 'kits', nivel_juego: 3, stock: 5, descripcion: 'Incluye esposas, mordaza, látigo y antifaz de alta calidad.' },
  { nombre: 'Kit Sorpresa: Spa Erótico', precio: 155000, categoria: 'kits', nivel_juego: 1, stock: 10, descripcion: 'Vela de masaje, aceite comestible y pétalos aromáticos.' },
  { nombre: 'Kit Sorpresa: Viajero Discreto', precio: 95000, categoria: 'kits', nivel_juego: 1, stock: 15, descripcion: 'Bala vibradora, sobres de lubricante y estuche de viaje.' },
  { nombre: 'Kit Sorpresa: Despedida de Soltera', precio: 190000, categoria: 'kits', nivel_juego: 2, stock: 8, descripcion: 'Accesorios divertidos, juegos de cartas eróticos y un juguete sorpresa.' },
  { nombre: 'Kit Sorpresa: "Caja de Pandora"', precio: 450000, categoria: 'kits', nivel_juego: 3, stock: 3, descripcion: 'Nuestra caja más exclusiva con 2 juguetes de alta gama y lencería de lujo.' }
];

const seed = async () => {
  console.log('🌱 Iniciando carga masiva de productos (35+ ítems)...');
  
  try {
    await db.query('DELETE FROM productos');
    console.log('🧹 Inventario anterior borrado.');

    for (const p of initialProducts) {
      const query = `
        INSERT INTO productos (nombre, precio, categoria, nivel_juego, imagen, descripcion, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(query, [
        p.nombre, 
        p.precio, 
        p.categoria, 
        p.nivel_juego || 1, 
        '/images/default.png', 
        p.descripcion, 
        p.stock
      ]);
      console.log(`✅ Añadido: [${p.categoria.toUpperCase()}] ${p.nombre}`);
    }

    console.log('\n🚀 ¡Gran Inventario cargado con éxito! La tienda está llena.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal en el semillero:', error);
    process.exit(1);
  }
};

seed();
