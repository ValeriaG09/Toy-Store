import React, { useState, useEffect } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import WoodyWallpaper from '../components/WoodyWallpaper';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logoOfficialImg from '../assets/logo_official.png';
import logoNewImg from '../assets/logo_toystore_new.png';

/**
 * Helper para generar los claims, colores y diseño del empaque coleccionable estilo "YOUTOOZ".
 */
function getBoxClaims(producto, index) {
  const cat = (producto.categoria || '').toLowerCase();
  const seriesNum = String(index + 1).padStart(3, '0');
  
  // Colores Youtooz (Box Color Theme)
  let boxColor = 'bg-[#f43f5e]';      // Tono de caja principal (Vibradores - Ketnipz Pink Style)
  let boxColorDark = 'bg-[#be123c]';  // Lado derecho (sombra)
  let boxColorDarker = 'bg-[#9f1239]';// Lado izquierdo (sombra profunda)
  let boxColorLight = 'bg-[#ffe4e6]'; // Tapa superior (brillo)
  let boxBorderColor = 'border-[#f43f5e]'; // Borde decorativo
  let boxText = 'text-[#f43f5e]';
  let brandLogoText = 'TOYTOOZ';
  let categoryLabelText = 'VINYL FIGURE';

  if (cat.includes('vibra')) {
    boxColor = 'bg-[#f43f5e]';
    boxColorDark = 'bg-[#be123c]';
    boxColorDarker = 'bg-[#9f1239]';
    boxColorLight = 'bg-[#ffe4e6]';
    boxBorderColor = 'border-[#f43f5e]';
    boxText = 'text-[#f43f5e]';
    brandLogoText = 'VIBRA';
    categoryLabelText = 'VIBRATOR';
  } else if (cat.includes('lence')) {
    boxColor = 'bg-[#7e22ce]';
    boxColorDark = 'bg-[#6b21a8]';
    boxColorDarker = 'bg-[#581c87]';
    boxColorLight = 'bg-[#f3e8ff]';
    boxBorderColor = 'border-[#7e22ce]';
    boxText = 'text-[#7e22ce]';
    brandLogoText = 'LACE';
    categoryLabelText = 'LINGERIE';
  } else if (cat.includes('cosme')) {
    boxColor = 'bg-[#db2777]';
    boxColorDark = 'bg-[#9d174d]';
    boxColorDarker = 'bg-[#831843]';
    boxColorLight = 'bg-[#fce7f3]';
    boxBorderColor = 'border-[#db2777]';
    boxText = 'text-[#db2777]';
    brandLogoText = 'GLIDE';
    categoryLabelText = 'COSMETIC';
  } else if (cat.includes('access') || cat.includes('accesor')) {
    boxColor = 'bg-[#0f766e]';
    boxColorDark = 'bg-[#115e59]';
    boxColorDarker = 'bg-[#134e4a]';
    boxColorLight = 'bg-[#ccfbf1]';
    boxBorderColor = 'border-[#0f766e]';
    boxText = 'text-[#0f766e]';
    brandLogoText = 'ACCS';
    categoryLabelText = 'ACCESSORY';
  } else if (cat.includes('anal')) {
    boxColor = 'bg-[#2563eb]';
    boxColorDark = 'bg-[#1d4ed8]';
    boxColorDarker = 'bg-[#1e40af]';
    boxColorLight = 'bg-[#dbeafe]';
    boxBorderColor = 'border-[#2563eb]';
    boxText = 'text-[#2563eb]';
    brandLogoText = 'ANALS';
    categoryLabelText = 'ANAL TOY';
  } else if (cat.includes('pene') || cat.includes('dildo') || cat.includes('dildos')) {
    boxColor = 'bg-[#ca8a04]';
    boxColorDark = 'bg-[#a16207]';
    boxColorDarker = 'bg-[#854d0e]';
    boxColorLight = 'bg-[#fef9c3]';
    boxBorderColor = 'border-[#ca8a04]';
    boxText = 'text-[#ca8a04]';
    brandLogoText = 'DILDO';
    categoryLabelText = 'DILDO TOY';
  } else if (cat.includes('kit')) {
    boxColor = 'bg-[#dc2626]';
    boxColorDark = 'bg-[#b91c1c]';
    boxColorDarker = 'bg-[#991b1b]';
    boxColorLight = 'bg-[#fee2e2]';
    boxBorderColor = 'border-[#dc2626]';
    boxText = 'text-[#dc2626]';
    brandLogoText = 'KITS';
    categoryLabelText = 'SURPRISE KIT';
  }

  return {
    boxColor,
    boxColorDark,
    boxColorDarker,
    boxColorLight,
    boxBorderColor,
    boxText,
    brandLogoText,
    categoryLabelText,
    seriesNum
  };
}

/**
 * Resolutor inteligente de imágenes fotorrealistas del producto.
 * Si el producto tiene una imagen cargada en base de datos la usa,
 * de lo contrario mapea a los hermosos PNGs 3D fotorrealistas ya existentes.
 */
const getProductImage = (producto) => {
  if (producto.imagen && producto.imagen !== '/images/default.png') {
    return producto.imagen;
  }
  
  const cat = (producto.categoria || '').toLowerCase();
  if (cat.includes('vibra')) return '/images/toy_vibrator.png';
  if (cat.includes('lence')) return '/images/lenceria_andy.png';
  if (cat.includes('anal')) return '/images/plug_anal.png';
  if (cat.includes('kit')) return '/images/mystery_box.png';
  
  // Fallbacks de alta calidad
  if (cat.includes('cosme')) return '/images/vibrador_cowgirl.png';
  if (cat.includes('pene') || cat.includes('dildo')) return '/images/plug_anal.png';
  
  return '/images/toy_vibrator.png';
};

/**
 * Dibuja un sticker de precio retro estilo explosión/ovalado (Sawtooth Starburst)
 * adaptado a pesos colombianos (formato $XX.000 COP)
 */
const renderPriceSticker = (precio) => {
  const numericPrice = Number(precio);
  const thousands = Math.floor(numericPrice / 1000);
  const digits = String(thousands);
  
  const spikes = 22;
  const cx = 65;
  const cy = 45;
  const rx_out = 52;
  const ry_out = 32;
  const rx_in = 46;
  const ry_in = 28;
  const pointsArr = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI / spikes) * i;
    const isEven = i % 2 === 0;
    const rx = isEven ? rx_out : rx_in;
    const ry = isEven ? ry_out : ry_in;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    pointsArr.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const starPoints = pointsArr.join(' ');

  const isLargePrice = digits.length > 2;
  const mainFontSize = isLargePrice ? "28" : "36";
  const mainX = isLargePrice ? "32" : "36";
  const mainY = isLargePrice ? "54" : "56";
  
  const dollarX = isLargePrice ? "20" : "22";
  const dollarY = isLargePrice ? "40" : "42";
  const dollarSize = isLargePrice ? "12" : "15";

  const superX = isLargePrice ? "84" : "82";
  const superY = isLargePrice ? "38" : "37";
  const superSize = isLargePrice ? "9" : "12";

  const labelX = isLargePrice ? "82" : "80";
  const labelY1 = isLargePrice ? "50" : "51";
  const labelY2 = isLargePrice ? "56" : "58";

  return (
    <svg className="w-[105px] h-[75px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] filter rotate-12" viewBox="0 0 130 90">
      {/* Oval rojo exterior con borde negro */}
      <ellipse cx="65" cy="45" rx="60" ry="40" fill="#dc2626" stroke="#1e293b" strokeWidth="2.5" />
      
      {/* Estrella amarilla interior con borde negro fino */}
      <polygon points={starPoints} fill="#facc15" stroke="#1e293b" strokeWidth="1.2" />
      
      {/* Símbolo de pesos */}
      <text x={dollarX} y={dollarY} fontSize={dollarSize} fontWeight="900" fill="#1e293b" fontFamily="Fredoka" textAnchor="middle">
        $
      </text>
      
      {/* Dígitos principales */}
      <text x={mainX} y={mainY} fontSize={mainFontSize} fontWeight="900" fill="#1e293b" fontFamily="Fredoka">
        {digits}
      </text>
      
      {/* Superscript .000 */}
      <text x={superX} y={superY} fontSize={superSize} fontWeight="900" fill="#1e293b" fontFamily="Fredoka">
        .000
      </text>
      
      {/* Textos descriptivos estilo vintage */}
      <text x={labelX} y={labelY1} fontSize="5.5" fontWeight="900" fill="#1e293b" fontFamily="Fredoka" textAnchor="start">
        OFERTA
      </text>
      <text x={labelX} y={labelY2} fontSize="4.5" fontWeight="700" fill="#dc2626" fontFamily="Fredoka" textAnchor="start">
        COP
      </text>
    </svg>
  );
};

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get('cat') || 'todos';
  const busqueda = (searchParams.get('buscar') || searchParams.get('q') || '').toLowerCase().trim();
  const [pagina, setPagina] = useState(1);

  const ITEMS_POR_PAGINA = 12;

  useEffect(() => {
    fetchProductos();
  }, [categoriaActiva]);

  useEffect(() => {
    setPagina(1);
  }, [categoriaActiva, busqueda]);

  const fetchProductos = async () => {
    try {
      setCargando(true);
      const url = categoriaActiva === 'todos' 
        ? '/productos'
        : `/productos?categoria=${categoriaActiva}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProductos(data);
      } else {
        console.error("Los productos no se devolvieron como un arreglo:", data);
        setProductos([]);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  const productosFiltrados = productos.filter(p => {
    if (!busqueda) return true;
    const nombre = (p.nombre || '').toLowerCase();
    const desc = (p.descripcion || '').toLowerCase();
    const cat = (p.categoria || '').toLowerCase();
    return nombre.includes(busqueda) || desc.includes(busqueda) || cat.includes(busqueda);
  });

  const inicio = (pagina - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const productosVisibles = productosFiltrados.slice(inicio, fin);
  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);

  const chunkProducts = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    while (chunks.length < 3) {
      chunks.push([]);
    }
    return chunks;
  };

  const estantes = chunkProducts(productosVisibles, 4);

  // Dibujos de stickers de personajes 2D en esquina inferior izquierda
  // Añadida línea de troquelado blanco gruesa (stroke="white" strokeWidth="6") y sombra para efecto "sticker despegable" auténtico de Youtooz
  const renderYoutoozCartoonVector = (categoria, insideLeftPanel = false) => {
    const cat = (categoria || '').toLowerCase();
    
    // Si se dibuja dentro del panel izquierdo, omitimos el borde de troquelado blanco
    const strokeColor = insideLeftPanel ? "#1e293b" : "white";
    const strokeWidth = insideLeftPanel ? "5.5" : "7.5";
    
    if (cat.includes('vibra')) {
      return (
        <svg className="w-[115px] h-[115px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transform -rotate-6" viewBox="0 0 100 100" fill="none">
           {/* Contorno de troquelado blanco del sticker */}
           <path d="M42 90V28c0-8 6-14 13-14s13 6 13 14v62c0 5-4 8-8 8h-10c-5 0-8-3-8-8z" fill="#fda4af" stroke={strokeColor} strokeWidth={strokeWidth} />
           <path d="M42 90V28c0-8 6-14 13-14s13 6 13 14v62c0 5-4 8-8 8h-10c-5 0-8-3-8-8z" fill="#fda4af" stroke="#1e293b" strokeWidth="3" />
           <path d="M50 48c0-3.5 3-6.5 6.5-6.5s6.5 3 6.5 6.5-3 6.5-6.5 6.5-6.5-3-6.5-6.5z" fill="#f43f5e" stroke="#1e293b" strokeWidth="2.5" />
           <ellipse cx="49" cy="25" rx="3.5" ry="5.5" fill="#1e293b" />
           <ellipse cx="61" cy="25" rx="3.5" ry="5.5" fill="#1e293b" />
           <circle cx="48" cy="23" r="1.2" fill="white" />
           <circle cx="60" cy="23" r="1.2" fill="white" />
           <path d="M53 31c2 1 4 1 5 0" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    } else if (cat.includes('lence')) {
      return (
        <svg className="w-[115px] h-[115px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transform -rotate-6" viewBox="0 0 100 100" fill="none">
           <path d="M30 18c12 4 20-3 20-3s8 7 20 3c0 12-4 30-8 38l-4 12H42l-4-12c-4-8-8-26-8-38z" fill="#d8b4fe" stroke={strokeColor} strokeWidth={strokeWidth} />
           <path d="M30 18c12 4 20-3 20-3s8 7 20 3c0 12-4 30-8 38l-4 12H42l-4-12c-4-8-8-26-8-38z" fill="#d8b4fe" stroke="#1e293b" strokeWidth="3" />
           <path d="M42 28h16M38 40h24M35 52h30" stroke="#7e22ce" strokeWidth="3" strokeLinecap="round" />
           <ellipse cx="44" cy="20" rx="3.5" ry="5.5" fill="#1e293b" />
           <ellipse cx="56" cy="20" rx="3.5" ry="5.5" fill="#1e293b" />
        </svg>
      );
    } else if (cat.includes('cosme')) {
      return (
        <svg className="w-[115px] h-[115px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transform -rotate-6" viewBox="0 0 100 100" fill="none">
           <rect x="35" y="42" width="30" height="42" rx="7" fill="#fbcfe8" stroke={strokeColor} strokeWidth={strokeWidth} />
           <rect x="35" y="42" width="30" height="42" rx="7" fill="#fbcfe8" stroke="#1e293b" strokeWidth="3" />
           <path d="M42 42V22c0-3 2-5 5-5h6c3 0 5 2 5 5v20H42z" fill="#db2777" stroke={strokeColor} strokeWidth={strokeWidth} />
           <path d="M42 42V22c0-3 2-5 5-5h6c3 0 5 2 5 5v20H42z" fill="#db2777" stroke="#1e293b" strokeWidth="3" />
           <ellipse cx="44" cy="55" rx="3.5" ry="5.5" fill="#1e293b" />
           <ellipse cx="56" cy="55" rx="3.5" ry="5.5" fill="#1e293b" />
        </svg>
      );
    } else if (cat.includes('access') || cat.includes('accesor')) {
      return (
        <svg className="w-[115px] h-[115px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transform -rotate-6" viewBox="0 0 100 100" fill="none">
           <circle cx="36" cy="50" r="16" fill="#99f6e4" stroke={strokeColor} strokeWidth={strokeWidth} />
           <circle cx="64" cy="50" r="16" fill="#99f6e4" stroke={strokeColor} strokeWidth={strokeWidth} />
           <circle cx="36" cy="50" r="16" fill="#99f6e4" stroke="#1e293b" strokeWidth="3" />
           <circle cx="64" cy="50" r="16" fill="#99f6e4" stroke="#1e293b" strokeWidth="3" />
           <path d="M48 50h4" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
           <ellipse cx="32" cy="48" rx="2.5" ry="4.5" fill="#1e293b" />
           <ellipse cx="40" cy="48" rx="2.5" ry="4.5" fill="#1e293b" />
        </svg>
      );
    } else if (cat.includes('anal')) {
      return (
        <svg className="w-[115px] h-[115px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transform -rotate-6" viewBox="0 0 100 100" fill="none">
           <path d="M50 16c-11 0-18 11-18 24 0 14 18 32 18 32s18-18 18-32c0-13-7-24-18-24z" fill="#c7d2fe" stroke={strokeColor} strokeWidth={strokeWidth} />
           <rect x="32" y="72" width="36" height="10" rx="3.5" fill="#6366f1" stroke={strokeColor} strokeWidth={strokeWidth} />
           <path d="M50 16c-11 0-18 11-18 24 0 14 18 32 18 32s18-18 18-32c0-13-7-24-18-24z" fill="#c7d2fe" stroke="#1e293b" strokeWidth="3" />
           <rect x="32" y="72" width="36" height="10" rx="3.5" fill="#6366f1" stroke="#1e293b" strokeWidth="3" />
           <ellipse cx="44" cy="28" rx="3.5" ry="5.5" fill="#1e293b" />
           <ellipse cx="56" cy="28" rx="3.5" ry="5.5" fill="#1e293b" />
        </svg>
      );
    } else if (cat.includes('pene') || cat.includes('dildo') || cat.includes('dildos')) {
      return (
        <svg className="w-[115px] h-[115px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transform -rotate-6" viewBox="0 0 100 100" fill="none">
           <path d="M38 82V28c0-6 5-11 11-11s11 5 11 11v54c0 4-3 7-7 7H45c-4 0-7-3-7-7z" fill="#fef9c3" stroke={strokeColor} strokeWidth={strokeWidth} />
           <path d="M38 82V28c0-6 5-11 11-11s11 5 11 11v54c0 4-3 7-7 7H45c-4 0-7-3-7-7z" fill="#fef9c3" stroke="#1e293b" strokeWidth="3" />
           <ellipse cx="44" cy="38" rx="3.5" ry="5.5" fill="#1e293b" />
           <ellipse cx="56" cy="38" rx="3.5" ry="5.5" fill="#1e293b" />
        </svg>
      );
    } else {
      return (
        <svg className="w-[115px] h-[115px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] transform -rotate-6" viewBox="0 0 100 100" fill="none">
           <rect x="26" y="38" width="48" height="48" rx="5" fill="#fee2e2" stroke={strokeColor} strokeWidth={strokeWidth} />
           <path d="M20 38h60v12H20V38z" fill="#dc2626" stroke={strokeColor} strokeWidth={strokeWidth} />
           <rect x="26" y="38" width="48" height="48" rx="5" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
           <path d="M20 38h60v12H20V38z" fill="#dc2626" stroke="#1e293b" strokeWidth="3" />
           <ellipse cx="44" cy="56" rx="3.5" ry="5.5" fill="#1e293b" />
           <ellipse cx="56" cy="56" rx="3.5" ry="5.5" fill="#1e293b" />
        </svg>
      );
    }
  };

  return (
    <RoomWrapper 
      theme="woody" 
      wallpaperContent={<WoodyWallpaper />}
      fullWallpaper={true}
    >
      <style>{`
        .perspective-3d {
          perspective: 1600px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>

      <div className="p-4 md:p-10 min-h-screen flex flex-col items-center max-w-7xl mx-auto w-full">
        
        {/* Estantería Principal Vaquera */}
        <div className="w-full max-w-[1250px] bg-[#5a361c] rounded-[2.5rem] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-[20px] border-[#3e2723] relative mt-16">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-25 rounded-[1.8rem] pointer-events-none"></div>

           {cargando ? (
              <div className="flex flex-col items-center justify-center p-36 bg-[#b5865a]">
                 <div className="w-12 h-12 border-4 border-white/20 border-t-amber-950 rounded-full animate-spin"></div>
                 <p className="text-[#3e2723] text-xs font-black uppercase tracking-widest mt-4">Cargando mercancía...</p>
              </div>
           ) : (
              <div className="flex-1 flex flex-col bg-[#b5865a] relative">
                 <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(90deg, transparent 24.5%, rgba(0,0,0,0.12) 25%, transparent 25.5%, transparent 49.5%, rgba(0,0,0,0.12) 50%, transparent 50.5%, transparent 74.5%, rgba(0,0,0,0.12) 75%, transparent 75.5%)',
                    backgroundSize: '100% 100%'
                 }}></div>

                 {estantes.map((estante, idx) => (
                    <div 
                      key={idx}
                      className="relative pt-16 pb-16 px-10 flex flex-col justify-end shadow-[inset_0_15px_25px_rgba(0,0,0,0.15)] min-h-[460px]"
                    >
                       <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/25 to-transparent pointer-events-none"></div>

                       {/* Fila de Cajas de Juguetes en 3D Real (Isométrico y Rotable) */}
                       {/* Esquinas más cuadradas (diseño Youtooz recto) y mayor profundidad (110px) */}
                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 relative z-20 items-end">
                          {estante.map((producto, pIdx) => {
                             const globalIndex = inicio + (idx * 4) + pIdx;
                             const box = getBoxClaims(producto, globalIndex);
                             const imageSrc = getProductImage(producto);
                             
                             return (
                                <div 
                                  key={producto.id} 
                                  className="w-[230px] h-[330px] mx-auto relative group perspective-3d animate-shine-hover"
                                >
                                   {/* Contenedor preserve-3d e inclinación isométrica inicial */}
                                   <div 
                                     className="w-full h-full relative preserve-3d transition-transform duration-500 ease-out cursor-pointer"
                                     style={{
                                       transform: 'rotateY(-16deg) rotateX(8deg) translateZ(0px)',
                                     }}
                                     onMouseEnter={(e) => {
                                       e.currentTarget.style.transform = 'rotateY(-36deg) rotateX(12deg) scale(1.06) translateZ(10px)';
                                     }}
                                     onMouseLeave={(e) => {
                                       e.currentTarget.style.transform = 'rotateY(-16deg) rotateX(8deg) translateZ(0px)';
                                     }}
                                   >
                                      
                                      {/* ====================================================
                                          INTERIOR DIORAMA BACKCARD (translateZ(-50px) - Mayor Profundidad)
                                          El fondo de color dentro de la caja de juguete
                                          ==================================================== */}
                                      <div 
                                        className={`absolute inset-0 rounded-md p-4 flex flex-col justify-between overflow-hidden shadow-inner ${box.boxColor.replace('bg-[', 'bg-[')}`}
                                        style={{
                                          transform: 'translateZ(-50px)',
                                          backfaceVisibility: 'hidden',
                                          boxShadow: 'inset 0 16px 40px rgba(0,0,0,0.8)',
                                        }}
                                      >
                                         {/* Patrón halftone en el fondo interior de la caja */}
                                         <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:14px_14px] opacity-20 pointer-events-none"></div>
                                      </div>

                                      {/* ====================================================
                                          INTERIOR TOY IMAGE (translateZ(10px))
                                          El juguete fotorrealista físico flotando dentro del blíster
                                          ==================================================== */}
                                      <div 
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                                        style={{
                                          transform: 'translateZ(10px)',
                                          backfaceVisibility: 'hidden',
                                        }}
                                      >
                                         <div className="absolute left-[30%] right-0 top-[56px] bottom-[76px] flex items-center justify-center">
                                            <img 
                                               src={imageSrc} 
                                               alt={producto.nombre} 
                                               className="h-[115%] max-w-[95%] object-contain relative z-10"
                                            />
                                         </div>
                                      </div>

                                      {/* ====================================================
                                          1. CARA FRONTAL (El Blíster Youtooz Recto y Cuadrado sin bordes negros - translateZ(55px))
                                          ==================================================== */}
                                      <div 
                                        className="absolute inset-0 rounded-md p-3.5 pointer-events-none z-20"
                                        style={{
                                          transform: 'translateZ(55px)',
                                          backfaceVisibility: 'hidden',
                                        }}
                                      >
                                         {/* Textura de cartón impreso real sobre el frente */}
                                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-linen.png')] opacity-10 z-0 rounded-[4px]"></div>

                                         {/* El marco de cartón de color Youtooz sólido en el frente */}
                                         {/* Hecho con overlays para lograr la ventana L-shaped transparente perfecta (SIN BORDES NEGROS) */}
                                         <div className={`absolute top-0 inset-x-0 h-[56px] rounded-t-[4px] ${box.boxColor} z-10`}></div>
                                         <div className={`absolute bottom-0 inset-x-0 h-[76px] rounded-b-[4px] ${box.boxColor} z-10`}></div>
                                         <div className={`absolute top-[56px] bottom-[76px] left-0 w-[30%] ${box.boxColor} z-10`}></div>

                                         {/* El Acetato Plástico de la Ventana en la zona restante */}
                                         <div className="absolute left-[30%] right-0 top-[56px] bottom-[76px] bg-white/5 border-l border-r border-white/15 shadow-[inset_0_6px_15px_rgba(0,0,0,0.75)] z-0">
                                            {/* Reflejo de softbox de estudio sobre el acetato */}
                                            <div className="absolute top-1.5 left-1.5 w-[85%] h-[30%] border-t-[1.5px] border-l-[1.5px] border-white/20 rounded-tl-[16px] pointer-events-none z-25"></div>
                                         </div>

                                         {/* Número de Colección con diseño de insignia (Badge) en la esquina superior izquierda */}
                                         <div className="absolute top-3 left-3 z-20 transform -rotate-6">
                                            <div className={`relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)] border-[2px] ${box.boxBorderColor}`}>
                                               {/* Aro interior decorativo punteado */}
                                               <div className={`absolute inset-[3px] rounded-full border border-dashed ${box.boxBorderColor} opacity-40`}></div>
                                               <span className={`relative z-10 text-[13px] font-black tracking-tighter ${box.boxText} leading-none mt-0.5`}>
                                                  #{box.seriesNum}
                                               </span>
                                            </div>
                                         </div>

                                         {/* Logotipo de Marca TOY STORE oficial (Estilo Pegatina Diagonal) */}
                                         <div className="absolute top-3.5 right-3.5 z-20 w-[85px] h-[52px] flex items-center justify-center transform -rotate-12 hover:scale-105 transition-transform duration-300">
                                            <img 
                                               src={logoNewImg} 
                                               alt="Toy Store" 
                                               className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                                            />
                                         </div>

                                         {/* Sticker de precio retro estilo etiqueta de oferta (Explosión Ovalada) */}
                                         <div className="absolute bottom-[45px] -right-[15px] z-30 pointer-events-none">
                                            {renderPriceSticker(producto.precio)}
                                         </div>

                                         {/* Warning Safety Label en la base del cartón (Detalle Premium Real) */}
                                         <div className="absolute bottom-[58px] left-[34%] z-20 text-[4px] font-black tracking-widest uppercase text-white/50 leading-none">
                                            WARNING: ADULT COLLECTIBLE. 18+ ONLY.
                                         </div>

                                            {/* Nombre del Juguete en la Base */}
                                            <div className="absolute bottom-3 left-4 right-4 text-left z-20 flex flex-col justify-end">
                                               <h3 className="text-white font-black text-[13px] tracking-tight uppercase leading-none line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                                  {producto.nombre.split(' ')[0]}
                                               </h3>
                                            </div>
                                         </div>

                                      {/* ====================================================
                                          2. CARA DERECHA (Ventana lateral wrap-around + panel de especificaciones)
                                          ==================================================== */}
                                      <div 
                                        className="absolute top-0 bottom-0 w-[110px] pointer-events-none z-20"
                                        style={{
                                          left: '50%',
                                          marginLeft: '-55px',
                                          transform: 'rotateY(90deg) translateZ(115px)',
                                          backfaceVisibility: 'hidden',
                                        }}
                                      >
                                         {/* Tapas sólidas superior e inferior del lateral */}
                                         <div className={`absolute top-0 inset-x-0 h-[56px] ${box.boxColor} z-10`} />
                                         <div className={`absolute bottom-0 inset-x-0 h-[76px] ${box.boxColor} z-10`} />
                                         
                                         {/* Ventana de Acetato Lateral (ocupa el 55% frontal) */}
                                         <div className="absolute left-0 w-[55%] top-[56px] bottom-[76px] bg-white/5 border-l border-r border-white/15 shadow-[inset_6px_0_15px_rgba(0,0,0,0.75)] z-0">
                                            {/* Reflejo inclinado en el acetato */}
                                            <div className="absolute top-1.5 right-1.5 w-[80%] h-[30%] border-t-[1.5px] border-r-[1.5px] border-white/20 rounded-tr-[12px] pointer-events-none z-25"></div>
                                         </div>

                                         {/* Panel de especificaciones y Toy Facts en la parte trasera (ocupa el 45% restante) */}
                                         <div className="absolute right-0 w-[45%] top-[56px] bottom-[76px] bg-white p-2 flex flex-col justify-between items-center z-10 border-l border-zinc-300">
                                            <div className="w-full text-center">
                                               <h4 className="text-[7px] font-black text-zinc-950 uppercase tracking-tighter border-b-2 border-zinc-950 pb-0.5 mt-0.5 text-left font-mono leading-none">
                                                  TOY FACTS
                                               </h4>
                                               <p className="text-[4px] text-zinc-600 text-left font-mono scale-90 origin-left">Size: 1 Premium Unit</p>
                                               <div className="w-full h-[1px] bg-zinc-950 my-1"></div>
                                               
                                               <div className="text-[4px] font-mono text-zinc-800 text-left scale-90 origin-left flex flex-col gap-0.5">
                                                  <div>• Fun Index: 100%</div>
                                                  <div>• Fit: Premium</div>
                                                  <div>• Safe: 100%</div>
                                               </div>
                                            </div>

                                            {/* Código de barras miniatura */}
                                            <div className={`w-[90%] p-1 bg-white border border-zinc-400 rounded shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center mb-0.5`}>
                                               <svg className="w-full h-4 text-zinc-900" viewBox="0 0 100 30" fill="currentColor">
                                                  <rect x="5" y="0" width="3" height="20" />
                                                  <rect x="10" y="0" width="1" height="20" />
                                                  <rect x="13" y="0" width="4" height="20" />
                                                  <rect x="20" y="0" width="2" height="20" />
                                                  <rect x="24" y="0" width="1" height="20" />
                                                  <rect x="27" y="0" width="3" height="20" />
                                                  <rect x="33" y="0" width="2" height="20" />
                                                  <rect x="38" y="0" width="4" height="20" />
                                                  <rect x="44" y="0" width="1" height="20" />
                                                  <rect x="47" y="0" width="3" height="20" />
                                                  <rect x="53" y="0" width="2" height="20" />
                                                  <rect x="57" y="0" width="1" height="20" />
                                                  <rect x="60" y="0" width="4" height="20" />
                                                  <rect x="66" y="0" width="2" height="20" />
                                                  <rect x="70" y="0" width="1" height="20" />
                                                  <rect x="73" y="0" width="3" height="20" />
                                                  <rect x="78" y="0" width="2" height="20" />
                                                  <rect x="82" y="0" width="4" height="20" />
                                                  <rect x="88" y="0" width="1" height="20" />
                                               </svg>
                                            </div>
                                         </div>
                                      </div>

                                      {/* ====================================================
                                          3. CARA IZQUIERDA (Ilustración cómic full-bleed Youtooz - Sin bordes negros)
                                          ==================================================== */}
                                      <div 
                                        className={`absolute top-0 bottom-0 w-[110px] p-2 flex flex-col justify-between items-center rounded-l-md z-0 overflow-hidden ${box.boxColorLight}`}
                                        style={{
                                          left: '50%',
                                          marginLeft: '-55px',
                                          transform: 'rotateY(-90deg) translateZ(115px)',
                                          backfaceVisibility: 'hidden',
                                          boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.1)',
                                        }}
                                      >
                                         {/* Escena cómic de fondo (nubes, estrellas y corazones) */}
                                         <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
                                            <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                                            <div className="absolute bottom-6 right-2 text-2xl">💖</div>
                                            <div className="absolute top-12 right-4 text-xl">⭐</div>
                                            <div className="absolute bottom-12 left-4 text-2xl">✨</div>
                                         </div>

                                         <div className="w-full text-center z-10 relative">
                                            <div className="bg-yellow-400 text-amber-950 font-black text-[5.5px] py-1 px-1.5 rounded shadow border border-amber-950/20 uppercase tracking-tight inline-block">
                                               COLLECT THEM ALL!
                                            </div>

                                            {/* Personaje en la ilustración del panel lateral */}
                                            <div className="mt-8 flex justify-center scale-90">
                                               {renderYoutoozCartoonVector(producto.categoria, true)}
                                            </div>
                                         </div>

                                         <div className="text-[5px] font-black text-zinc-600 uppercase tracking-widest text-center border-t border-zinc-400/20 pt-1.5 w-full mb-1 z-10 relative">
                                            TOYSTORE CO.
                                         </div>
                                      </div>

                                      {/* ====================================================
                                          4. TAPA SUPERIOR (Lid de la caja con pliegues - Sin bordes negros)
                                          ==================================================== */}
                                      <div 
                                        className={`absolute left-0 right-0 h-[110px] flex items-center justify-center rounded-t-md z-0 ${box.boxColorLight}`}
                                        style={{
                                          top: '50%',
                                          marginTop: '-55px',
                                          transform: 'rotateX(90deg) translateZ(165px)',
                                          backfaceVisibility: 'hidden',
                                          boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.2)',
                                        }}
                                      >
                                         {/* Circular cardboard notch (die-cut tab) */}
                                         <div className="absolute top-1 w-8 h-2 bg-zinc-900/5 rounded-b-full"></div>
                                         
                                         <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-black text-[8px] text-white">
                                            TS
                                         </div>
                                      </div>

                                      {/* ====================================================
                                          5. TAPA INFERIOR (Soporte)
                                          ==================================================== */}
                                      <div 
                                        className={`absolute left-0 right-0 h-[110px] rounded-b-md z-0 ${box.boxColorDarker}`}
                                        style={{
                                          top: '50%',
                                          marginTop: '-55px',
                                          transform: 'rotateX(-90deg) translateZ(165px)',
                                          backfaceVisibility: 'hidden',
                                        }}
                                      />
                                      
                                   </div>
                                </div>
                             );
                          })}
                       </div>

                       {/* Estante de Madera 3D */}
                       <div className="absolute bottom-0 inset-x-0 h-7 bg-gradient-to-b from-[#a07147] to-[#704624] border-t-[3px] border-[#d7a778]/40 shadow-[0_6px_12px_rgba(0,0,0,0.35)] z-10">
                          <div className="w-full h-[1px] bg-white/20 absolute top-0"></div>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {/* Cajonera Inferior */}
           <div className="h-36 bg-[#8c5e37] border-t-8 border-[#6b4221] p-4 flex gap-4 shadow-[inset_0_12px_15px_rgba(0,0,0,0.2)] relative z-20">
              <div className="flex-1 bg-[#7b502e] border-[3px] border-[#5a361c] rounded-xl shadow-md flex items-center justify-center relative group overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
                 <div className="w-24 h-4 bg-gradient-to-b from-[#3a200f] to-[#1e1007] rounded-md shadow border border-[#2b170a] group-hover:scale-105 transition-transform"></div>
              </div>
              <div className="flex-1 bg-[#7b502e] border-[3px] border-[#5a361c] rounded-xl shadow-md flex items-center justify-center relative group overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
                 <div className="w-24 h-4 bg-gradient-to-b from-[#3a200f] to-[#1e1007] rounded-md shadow border border-[#2b170a] group-hover:scale-105 transition-transform"></div>
              </div>
           </div>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
           <div className="flex items-center gap-6 mt-10 bg-[#7c4d29] px-6 py-4 rounded-3xl border-4 border-[#5a361c] shadow-[0_15px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none z-10"></div>
              
              <button 
                onClick={() => setPagina(p => Math.max(p - 1, 1))}
                disabled={pagina === 1}
                className="z-20 px-5 py-2.5 bg-[#d7a778] hover:bg-[#ffe082] disabled:opacity-40 disabled:hover:bg-[#d7a778] text-[#3e2723] font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#805430] shadow-[0_3px_6px_rgba(0,0,0,0.15)] transition-all active:scale-95 flex items-center gap-2"
              >
                 <span>◀</span>
                 <span>Atrás</span>
              </button>

              <div className="z-20 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-[#ffca28] text-amber-950 font-black text-xs px-6 py-3 rounded-2xl border-2 border-[#b07d4b] shadow-md relative uppercase tracking-wider">
                 <span>Estante {pagina} de {totalPaginas}</span>
              </div>

              <button 
                onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))}
                disabled={pagina === totalPaginas}
                className="z-20 px-5 py-2.5 bg-[#d7a778] hover:bg-[#ffe082] disabled:opacity-40 disabled:hover:bg-[#d7a778] text-[#3e2723] font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-[#805430] shadow-[0_3px_6px_rgba(0,0,0,0.15)] transition-all active:scale-95 flex items-center gap-2"
              >
                 <span>Siguiente</span>
                 <span>▶</span>
              </button>
           </div>
        )}

      </div>
    </RoomWrapper>
  );
}
