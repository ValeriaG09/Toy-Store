import React, { useState, useEffect, useMemo } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import WoodyWallpaper from '../components/WoodyWallpaper';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductDetailsModal from '../components/ProductDetailsModal';
import LenceriaWoodyImg from '../assets/lenceria_woody.png';

// Imágenes placeholder por categoría
const CATEGORY_IMAGES = {
  vibradores: [
    'https://images.unsplash.com/photo-1616627577385-5c0c4dab55a5?w=400&h=400&fit=crop',
  ],
  lencerias: [
    LenceriaWoodyImg,
  ],
  anales: [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
  ],
  kits: [
    'https://images.unsplash.com/photo-1549488344-cbb6c34cf1ac?w=400&h=400&fit=crop',
  ],
  accesorios: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  ],
};

// Catálogo hardcoded como fallback
const PRODUCTOS_FALLBACK = [
  { id: 1, nombre: 'Vibrador Vaquera Deluxe', descripcion: 'Se graduó con honores en la universidad del placer; no habla mucho, pero hace el trabajo duro por ti. Experta en rodeos nocturnos.', precio: 89900, categoria: 'vibradores', nivel_juego: 2, imagen_url: '/img/productos/vibrador.jpeg', dimensiones: { largo: 18, ancho: 3.5 } },
  { id: 2, nombre: 'Conjunto Lencería Bo Peep', descripcion: 'No ha perdido a sus ovejas, solo busca a alguien que las ayude a contar... o a no dormir. Pura seda con intenciones pecaminosas.', precio: 65000, categoria: 'lencerias', nivel_juego: 1, imagen_url: '/img/productos/lenceria_bo.jpeg' },
  { id: 3, nombre: 'Plug Anal Estrella Fugaz', descripcion: 'Pide un deseo antes de usarlo. Brilla más que el cinturón de Orión y se queda donde lo necesitas para guiarte al infinito y más allá.', precio: 45000, categoria: 'anales', nivel_juego: 3, imagen_url: '/img/productos/plug_estrella.jpeg', dimensiones: { largo: 8, ancho: 2.8 } },
  { id: 4, nombre: 'Kit Aventura Rodeo', descripcion: 'Todo lo que un sheriff necesita para una noche de patrulla apasionada. Incluye accesorios para arrestos preventivos y masajes de paz.', precio: 120000, categoria: 'kits', nivel_juego: 2, imagen_url: '/img/productos/caja_sorpresa.jpeg' },
  { id: 5, nombre: 'Vibrador Buzz Espacial', descripcion: 'Este comando estelar tiene una misión clara: llevarte al espacio sin salir de tu cuarto. ¡Al infinito y al éxtasis!', precio: 55000, categoria: 'vibradores', nivel_juego: 1, imagen_url: '/img/productos/balita.jpg', dimensiones: { largo: 12, ancho: 2.5 } },
  { id: 6, nombre: 'Body Jessie Western', descripcion: 'Para las vaqueras que saben que el rojo es el color de la pasión y del peligro. Ajustable para cualquier duelo al sol.', precio: 78000, categoria: 'lencerias', nivel_juego: 2, imagen_url: '/img/productos/lenceria_roja.webp' },
  { id: 12, nombre: 'Esposas de Peluche Sheriff', descripcion: 'Porque la ley también puede ser suave. Ideales para arrestos por exceso de velocidad... o por ser demasiado sexy.', precio: 28000, categoria: 'accesorios', nivel_juego: 2, imagen_url: '/img/productos/esposas_sheriff.png' },
  { id: 7, nombre: 'Set Dilatadores Galaxy', descripcion: 'Un viaje progresivo por los agujeros negros más placenteros del universo. Tres niveles de exploración profunda.', precio: 95000, categoria: 'anales', nivel_juego: 4, imagen_url: '/img/productos/dilatadores.webp', dimensiones: { largo: 15, ancho: 4 } },
  { id: 8, nombre: 'Kit Tu Primera Vez', descripcion: 'Como tu primer juguete de Andy, pero con mucha más vibración. Básico, tierno y listo para que pierdas el miedo a las cosquillas.', precio: 150000, categoria: 'kits', nivel_juego: 1, imagen_url: '/img/productos/kit.jpeg' },
  { id: 9, nombre: 'Succionador Clitorial Nebula', descripcion: 'Tecnología de ondas de aire que succionan hasta tus preocupaciones. Es como un beso de un marciano, pero mucho mejor.', precio: 135000, categoria: 'vibradores', nivel_juego: 3, imagen_url: '/img/productos/succionador.jpeg', dimensiones: { largo: 14, ancho: 5 } },
  { id: 10, nombre: 'Arnés Cowgirl Premium', descripcion: 'Para las que prefieren llevar las riendas del carruaje. Cuero vegano resistente para galopar toda la noche sin cansarse.', precio: 110000, categoria: 'accesorios', nivel_juego: 4, imagen_url: '/img/productos/arnes.webp' },
  { id: 11, nombre: 'Lubricante Galaxia Dorada', descripcion: 'El aceite oficial de la nave espacial. Resbala más que una cáscara de banana, pero con hermosos brillitos de oro.', precio: 32000, categoria: 'accesorios', nivel_juego: 1, imagen_url: '/img/productos/lubricante.jpeg' },
];

const CATEGORIAS = [
  { id: 'vibradores', label: 'Vibradores', emoji: '🍆', color: 'from-purple-400 to-purple-600' },
  { id: 'lencerias', label: 'Lencería', emoji: '👙', color: 'from-pink-400 to-pink-600' },
  { id: 'anales', label: 'Anales', emoji: '🍑', color: 'from-orange-400 to-orange-600' },
  { id: 'kits', label: 'Kits', emoji: '📦', color: 'from-blue-400 to-blue-600' },
  { id: 'accesorios', label: 'Accesorios', emoji: '✨', color: 'from-emerald-400 to-emerald-600' },
];

const MISSIONS = [
  { id: 'todos', label: 'Todo el Baúl', emoji: '🤠', color: 'from-amber-400 to-amber-600', mood: '¡Listo para cualquier aventura, Vaquero!' },
  { id: 'romance', label: 'Cita Romántica', emoji: '🌹', color: 'from-red-400 to-rose-600', mood: 'Hilos secretos y velas... una noche de pura seda.', categories: ['lencerias', 'kits'] },
  { id: 'solitario', label: 'Misión Solitaria', emoji: '🕵️‍♂️', color: 'from-indigo-400 to-purple-600', mood: 'Solo tú y tu baúl de tesoros espaciales.', categories: ['vibradores'] },
  { id: 'aventura', label: 'Rodeo Salvaje', emoji: '🔥', color: 'from-orange-500 to-red-700', mood: '¡Arre! Prepárate para la acción más intensa.', categories: ['anales', 'accesorios'] },
  { id: 'regalo', label: 'Misión: Sorpresa', emoji: '🎁', color: 'from-emerald-400 to-teal-600', mood: 'El regalo perfecto para tu persona favorita.', categories: ['kits', 'accesorios'] },
];

const formatCOP = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
};

const NivelBadge = ({ nivel }) => {
  const colors = ['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-red-600'];
  const labels = ['Suave', 'Moderado', 'Intenso', 'Extremo', 'Ultra'];
  const idx = Math.min(Math.max((nivel || 1) - 1, 0), 4);
  return (
    <span className={`${colors[idx]} text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm`}>
      {labels[idx]}
    </span>
  );
};

// Genera un color de fondo pastel según categoría para la card
const getCategoryGradient = (cat) => {
  const map = {
    vibradores: 'from-purple-100 to-pink-50',
    lencerias: 'from-pink-100 to-rose-50',
    anales: 'from-orange-100 to-amber-50',
    kits: 'from-blue-100 to-sky-50',
    accesorios: 'from-emerald-100 to-teal-50',
  };
  return map[cat] || 'from-gray-100 to-white';
};

const getCategoryEmoji = (cat) => {
  const map = { vibradores: '🍆', lencerias: '👙', anales: '🍑', kits: '📦', accesorios: '✨' };
  return map[cat] || '🎁';
};

/**
 * Tienda (Elite Woody Edition): Catálogo del Sex Shop
 */
export default function Tienda() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaURL = searchParams.get('cat') || 'todos';

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [misionActiva, setMisionActiva] = useState(categoriaURL);
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('recientes');
  const [hoveredId, setHoveredId] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useCart();

  // SEO & Meta Tags
  useEffect(() => {
    document.title = "Toy Store | Bazar Erótico | Aprende y Explora el Placer Vaquero 🤠";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Descubre el bazar del Lejano Oeste. Guía educativa de juguetes eróticos, lencería premium y misiones de exploración nocturna. ¡Al infinito y al placer!");
    }
  }, []);

  // Fetch productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const queryParams = searchParams.toString();
        const res = await fetch(`/productos?${queryParams}`);
        if (!res.ok) throw new Error('Error al cargar productos');
        const data = await res.json();
        console.log('📦 Productos recibidos:', data.length);
        if (data && data.length > 0) {
          setProductos(data);
        } else {
          console.warn('⚠️ API devolvió lista vacía');
          setProductos(PRODUCTOS_FALLBACK);
        }
      } catch (err) {
        console.warn('⚠️ API no disponible, usando catálogo de demostración:', err.message);
        setProductos(PRODUCTOS_FALLBACK);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [searchParams]);

  // Sync URL param con estado
  useEffect(() => {
    setMisionActiva(categoriaURL);
  }, [categoriaURL]);

  const handleMisionChange = (misionId) => {
    setMisionActiva(misionId);
    if (misionId === 'todos') {
      setSearchParams({});
    } else {
      setSearchParams({ cat: misionId });
    }
  };

  // Filtrar y ordenar
  const productosFiltrados = useMemo(() => {
    let list = [...productos];
    if (misionActiva !== 'todos') {
      const mision = MISSIONS.find(m => m.id === misionActiva);
      const targetCats = mision?.categories || [misionActiva];
      list = list.filter(p => {
        const pCat = String(p.categoria || p.id_categoria).toLowerCase();
        return targetCats.some(tc => pCat.includes(tc.toLowerCase()));
      });
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter(p =>
        p.nombre?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q)
      );
    }
    switch (ordenar) {
      case 'precio_asc': list.sort((a, b) => a.precio - b.precio); break;
      case 'precio_desc': list.sort((a, b) => b.precio - a.precio); break;
      case 'nombre': list.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      default: break;
    }
    return list;
  }, [productos, misionActiva, busqueda, ordenar]);

  const getActiveMission = () => {
    const mision = MISSIONS.find(m => m.id === misionActiva);
    if (mision) return mision;

    // Si no es misión, es una categoría directa
    const cat = CATEGORIAS.find(c => c.id === misionActiva);
    if (cat) return { ...cat, mood: `Explorando la colección de ${cat.label}` };

    return MISSIONS[0];
  };

  return (
    <RoomWrapper
      theme={
        misionActiva === 'romance' ? 'lotso' :
          misionActiva === 'solitario' ? 'buzz' :
            misionActiva === 'regalo' ? 'aliens' :
              'woody'
      }
      wallpaperContent={<WoodyWallpaper />}
      fullWallpaper={true}
    >
      <div className="min-h-screen relative z-10">

        {/* ═══════ HERO BANNER ═══════ */}
        <div className="relative overflow-hidden pt-20 md:pt-32 pb-12 px-4 md:px-12">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#451a03] px-6 py-2 rounded-full mb-6 shadow-xl border-2 border-white/20">
              <span className="text-[11px] font-black text-white uppercase tracking-[4px]">🤠 El Bazar del Lejano Oeste</span>
            </div>
            <h1 className={`text-4xl md:text-6xl font-[1000] uppercase tracking-tight leading-none mb-3 transition-colors duration-500 ${misionActiva !== 'todos' ? 'text-white' : 'text-[#451a03]'}`} style={{ textShadow: misionActiva === 'todos' ? '2px 2px 0px rgba(255,255,255,0.4)' : 'none' }}>
              {getActiveMission().label}
            </h1>
            <p className={`text-sm md:text-base font-bold transition-colors duration-500 max-w-lg mx-auto ${misionActiva !== 'todos' ? 'text-white/90' : 'text-[#451a03]'}`}>
              {getActiveMission().mood}
            </p>
          </div>
        </div>

        {/* ═══════ BARRA DE FILTROS ═══════ */}
        <div className="sticky top-[64px] md:top-[80px] z-[50] bg-white/80 backdrop-blur-xl border-b-4 border-white/40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">

            {/* Misiones (Gamification) - Mobile optimized scroll */}
            <div className="flex flex-col gap-1 mb-6">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] ml-2 mb-2">Elige tu Aventura</span>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2 snap-x snap-mandatory">
                {MISSIONS.map(mision => (
                  <button
                    key={mision.id}
                    onClick={() => handleMisionChange(mision.id)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-500 border-2 shrink-0 snap-center
                      ${misionActiva === mision.id
                        ? `bg-gradient-to-r ${mision.color} text-white border-white/30 shadow-2xl scale-105 -rotate-1`
                        : 'bg-white/60 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300'
                      }`}
                  >
                    <span className={`text-2xl transition-transform duration-500 ${misionActiva === mision.id ? 'scale-125 rotate-12' : ''}`}>{mision.emoji}</span>
                    {mision.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorías Directas - Thumb-friendly layout */}
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] ml-2 mb-2">O busca por Colección</span>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
                {CATEGORIAS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleMisionChange(cat.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-300 border shrink-0
                      ${misionActiva === cat.id
                        ? `bg-gray-800 text-white border-gray-800 shadow-xl scale-105`
                        : 'bg-white/40 text-gray-500 border-gray-100 hover:bg-white hover:text-gray-700'
                      }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 border-2 border-gray-200 outline-none focus:border-amber-400 focus:bg-white transition-all text-sm font-bold text-gray-700 placeholder:text-gray-400"
                />
              </div>
              <select
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
                className="px-5 py-3 rounded-2xl bg-white/70 border-2 border-gray-200 outline-none focus:border-amber-400 text-sm font-bold text-gray-700 cursor-pointer"
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══════ GRID DE PRODUCTOS ═══════ */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-24">

          {/* Contador */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-black text-[#451a03]/80 uppercase tracking-[3px]">
              {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>

          {loading ? (
            /* ─── LOADING STATE ─── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/60 rounded-[2rem] overflow-hidden shadow-md animate-pulse">
                  <div className="h-56 bg-gray-200/60"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200/80 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-200/60 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-200/60 rounded-full w-1/2"></div>
                    <div className="h-8 bg-gray-200/80 rounded-full w-1/3 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            /* ─── EMPTY STATE ─── */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 bg-white/40 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <span className="text-6xl">🤷</span>
              </div>
              <h3 className="text-2xl font-black text-[#92400E] uppercase mb-2">¡Vaya, Vaquero!</h3>
              <p className="text-sm font-bold text-[#92400E]/50 mb-6">No encontramos productos que coincidan con tu búsqueda</p>
              <button
                onClick={() => { setBusqueda(''); handleMisionChange('todos'); }}
                className="bg-gradient-to-r from-amber-400 to-amber-600 text-white font-black text-xs uppercase tracking-widest px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                Volver al Cuarto de Andy
              </button>
            </div>
          ) : (
            /* ─── PRODUCT GRID ─── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto, idx) => (
                <div
                  key={producto.id || idx}
                  className="group relative bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 border-4 border-white cursor-pointer"
                  onMouseEnter={() => setHoveredId(producto.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Imagen */}
                  <div className={`relative h-56 bg-gradient-to-br ${getCategoryGradient(producto.categoria)} overflow-hidden`}>
                    {producto.imagen_url ? (
                      <img
                        src={producto.imagen_url}
                        alt={`Juguete erótico ${producto.nombre} - Guía de placer vaquero`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl opacity-30 group-hover:scale-125 group-hover:opacity-50 transition-all duration-500">
                          {getCategoryEmoji(producto.categoria)}
                        </span>
                      </div>
                    )}

                    {/* Badge categoría */}
                    <div className="absolute top-4 left-4">
                      <NivelBadge nivel={producto.nivel_juego} />
                    </div>

                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Quick view btn */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductoSeleccionado(producto);
                          setIsModalOpen(true);
                        }}
                        className="bg-white/90 backdrop-blur-sm text-gray-800 font-black text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-amber-800 transition-colors">
                        {producto.nombre}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-700 font-medium leading-relaxed line-clamp-2 mb-4">
                      {producto.descripcion}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-[1000] text-[#451a03]">
                          {formatCOP(producto.precio)}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">COP</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(producto);
                        }}
                        className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all active:scale-95 group/btn"
                      >
                        <svg className="w-5 h-5 text-white group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8l-1.5 6h13M8 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Decoración: Etiqueta de categoría */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-base">
                    {getCategoryEmoji(producto.categoria)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <ProductDetailsModal
          product={productoSeleccionado}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      {/* Estilos extra para scrollbar oculto */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}} />
    </RoomWrapper>
  );
}
