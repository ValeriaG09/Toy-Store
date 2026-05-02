import React from 'react';
import PixarBall from './PixarBall';
import ToyBlocks from './ToyBlocks';
import Navbar from './Navbar';
import LotsoFurImg from '../assets/lotso_fur_texture.png';
import ProductSidebar from './ProductSidebar';
import PurposeSidebar from './PurposeSidebar';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';

/**
 * RoomWrapper: Provee la estructura de "Maqueta" (Diorama 3D)
 * @param {string} theme - 'andy', 'woody', 'buzz', 'aliens', 'lotso'
 * @param {React.ReactNode} children - Contenido de la página
 */
export default function RoomWrapper({ 
  children, 
  theme = 'andy', 
  wallpaperContent, 
  isBlurred = false, 
  showFooter = false, 
  fullWallpaper = false,
  onHeartClick,
  onStarClick
}) {
  const { usuario } = useContext(AuthContext);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [showPurposeSidebar, setShowPurposeSidebar] = useState(false);

  // Sobrescribimos los clics para que activen las sidebars globales
  const handleHeartClick = () => {
    if (onHeartClick) {
      onHeartClick(); // Ejecutamos la lógica original por si acaso (e.j. analytics)
    }
    if (usuario) {
      setShowFilterSidebar(true);
    }
  };

  const handleStarClick = () => {
    if (onStarClick) {
      onStarClick();
    }
    setShowPurposeSidebar(true);
  };
  
  const getThemeStyles = () => {
    switch (theme) {
      case 'woody':
        return {
          wall: 'bg-[#FDE68A] bg-opacity-90', // Amarillo Woody
          floor: 'bg-[#92400E]', // Madera oscura
          accent: 'border-[#F87171]', // Rojo pañuelo
          wallpaper: 'bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px]',
        };
      case 'buzz':
        return {
          wall: 'bg-[#F3F4F6] border-purple-200', // Blanco/Gris espacial
          floor: 'bg-[#1F2937]', // Metal oscuro / Carbono
          accent: 'border-lime-400', // Verde Buzz
          wallpaper: 'bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_50%,#e5e7eb_50%,#e5e7eb_75%,transparent_75%,transparent)] [background-size:40px_40px]',
        };
      case 'aliens':
        return {
          wall: 'bg-[#1E1B4B]', // Azul noche profundo
          floor: 'bg-[#064E3B]', // Verde pizza planet
          accent: 'border-green-400',
          wallpaper: 'bg-[radial-gradient(#4ADE80_1px,transparent_1px)] [background-size:30px_30px]',
        };
      case 'lotso':
        return {
          wall: 'bg-[#ff0080]', // Rosa base
          floor: 'bg-[#4c0519]', // Frambuesa muy oscuro (piso)
          accent: 'border-[#ff0080]',
          wallpaper: 'lotso-fur-pattern',
        };
      default: // andy
        return {
          wall: 'bg-[#87CEEB]', // Azul Cielo Andy
          floor: 'bg-[#B45309]', // Madera oscura original
          accent: 'border-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]',
          wallpaper: 'andy-clouds-pattern',
        };
    }
  };

  const styles = getThemeStyles();
  const activeBlur = isBlurred || showFilterSidebar || showPurposeSidebar;

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      
      {/* 
      ========================================================================
      🛑 CAPA DE FONDO ESTÁTICO (Z-0) - DIORAMA PARALLAX 🛑
      ¡ADVERTENCIA DE ESTRUCTURA INTOCABLE!

      ESTA ES LA ARQUITECTURA VISUAL DEL CUARTO. Dibuja EXACTAMENTE tres franjas:
      1. La Pared (flex-1)
      2. El Zócalo de Madera Blanca (fixed 25vh/30vh)
      3. El Suelo de Madera Oscura (fixed min 480px / 40vh)
      
      Las 3 franjas están ancladas de forma ABSOLUTA a la pantalla (absolute inset-0).
      NUNCA SE DEBE ELIMINAR NI CAMBIAR EL HEIGHT DE ESTAS 3 PARTES, DE LO CONTRARIO
      EL FRONTEND QUE HACE SCROLL POR ENCIMA (Z-10) DESTROZARÁ LA ESTÉTICA EN
      DIFERENTES PANTALLAS Y LOS ELEMENTOS SE SUPERPONDRÁN.
      ========================================================================
      */}
      <div className={`absolute inset-0 z-0 transition-all duration-700 ${activeBlur ? 'blur-[6px]' : ''} pointer-events-none`}>
        {fullWallpaper && wallpaperContent ? (
          /* MODO FONDO COMPLETO (E.j. Tienda Woody) */
          <div className="absolute inset-0 z-0">
            {wallpaperContent}
          </div>
        ) : (
          /* MODO DIORAMA (E.j. Inicio Andy - Las nubes van en la pared) */
          <div className="absolute inset-0 flex flex-col">
            {/* 1. PARED (Wall - Blue Sky, Fur, etc.) */}
            <div 
              className={`relative flex-1 ${styles.wall} ${theme === 'andy' ? '' : styles.wallpaper}`}
              style={theme === 'lotso' ? { 
                backgroundImage: `url(${LotsoFurImg})`, 
                backgroundSize: '400px auto', 
                backgroundRepeat: 'repeat',
                backgroundBlendMode: 'multiply' // Mezcla el rosa base con el pelaje
              } : {}}
            >
               {wallpaperContent}
               <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5"></div>
            </div>

            {/* 2. ZÓCALO / MADERA BLANCA (Mid Section) */}
            <div className={`h-[25vh] md:h-[30vh] bg-[#fcf8f2] relative border-t-8 border-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)]`}>
              <div className="absolute inset-0 opacity-10" 
                   style={{ backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '150px 100%' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
            </div>

            {/* 3. SUELO COORDINADO CON EL TEMA (Bottom Section) */}
            <div className={`min-h-[480px] md:h-[40vh] ${styles.floor} relative shadow-[inset_0_20px_40px_rgba(0,0,0,0.4)] transition-colors duration-700`}>
               <div className="absolute inset-0 opacity-20" 
                    style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 80px, rgba(0,0,0,0.5) 81px)' }}>
               </div>
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>

               {/* 🛑 LOS JUGUETES 3D ESTÁN FUSIONADOS ESTÁTICAMENTE AL HORIZONTE DEL PISO 🛑 */}
               <div className="absolute top-0 left-0 w-full h-0 z-40">
                  <div className="max-w-7xl mx-auto relative w-full h-0 pointer-events-auto">
                      <PixarBall />
                      <ToyBlocks />
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
      {/* ======================= FIN CAPA DE FONDO ESTÁTICA ======================= */}

      {/* 
      ========================================================================
      🟢 CONTENIDO INTERACTIVO FRONTAL (Z-10) 🟢
      ESTA ES LA ÚNICA PARTE QUE DEBE HACER SCROLL. LOS ELEMENTOS AQUÍ ESTÁN
      TRANSPARENTES PARA QUE SE REVELE EL FONDO ESTÁTICO DE ATRÁS.
      ========================================================================
      */}
      <div className="relative z-10 flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        
        {/* NAVBAR GLOBAL INTEGRADA (Solo aparece si no es vistaAdmin, ya que admin tiene su propia Nav) */}
        <Navbar onHeartClick={handleHeartClick} onStarClick={handleStarClick} />

        <div className="flex-1 shrink-0 relative flex flex-col">
           {children}
        </div>

        {/* 🛑 SIDEBARS GLOBALES (Ahora dentro del scroll principal) 🛑 */}
        <ProductSidebar 
          isOpen={showFilterSidebar} 
          onClose={() => setShowFilterSidebar(false)} 
        />
        <PurposeSidebar 
          isOpen={showPurposeSidebar} 
          onClose={() => setShowPurposeSidebar(false)} 
        />
        
        {/* Espaciador para no tapar el suelo */}
        {showFooter && <div className="h-[25vh]"></div>}

        {/* FOOTER TEXTUAL PURO */}
        {showFooter && (
          <footer className={`w-full mt-auto px-6 py-12 md:px-12 pt-20 pb-16 relative z-20 text-white/90 min-h-[480px] md:min-h-[40vh] flex flex-col justify-end transition-all duration-700 shrink-0 ${activeBlur ? 'blur-[6px]' : ''} pointer-events-none`}>
             <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8 pointer-events-auto">
                
                {/* Columna 1: Contacto y Redes */}
                <div className="flex flex-col gap-6">
                   <h4 className="font-bold text-lg">Contáctanos</h4>
                   <ul className="text-[15px] flex flex-col gap-3 opacity-80">
                      <li className="flex items-center gap-3">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                         </svg>
                         toystorexoxo@gmail.com
                      </li>
                      <li className="flex items-center gap-3">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                         </svg>
                         xxx-xxx-xx
                      </li>
                   </ul>
                   <div className="flex flex-col gap-4">
                      <span className="text-[10px] uppercase tracking-[3px] font-black opacity-40">Síguenos</span>
                      <div className="flex gap-4">
                         <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                         </a>
                         <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                         </a>
                         <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                         </a>
                      </div>
                   </div>
                </div>
  
                {/* Columna 2: Más Información */}
                <div className="flex flex-col gap-6">
                   <h4 className="font-bold text-lg">Más Información</h4>
                   <ul className="text-[15px] flex flex-col gap-3 opacity-80 cursor-pointer">
                      <li className="hover:text-white transition">Inicio</li>
                      <li className="hover:text-white transition">Ofertas Relámpago</li>
                      <li className="hover:text-white transition">Lo Nuevo en el Baúl</li>
                      <li className="hover:text-white transition">Formas de Pago</li>
                      <li className="hover:text-white transition">Historias del Baúl (Relatos)</li>
                      <li className="hover:text-white transition">Puntos de Entrega</li>
                   </ul>
                </div>
  
                {/* Columna 3: Categorías Ingeniosas */}
                <div className="flex flex-col gap-6">
                   <h4 className="font-bold text-lg">Categorías</h4>
                   <ul className="text-[15px] flex flex-col gap-3 opacity-80 cursor-pointer text-[#FDE68A]">
                      <li className="hover:text-white transition">Cohetes de Buzz</li>
                      <li className="hover:text-white transition">Hilos Secretos de Bo Peep</li>
                      <li className="hover:text-white transition">Herramientas Pro de Rex</li>
                      <li className="hover:text-white transition">Aceites para Slinky</li>
                      <li className="hover:text-white transition">El Té de la Sra. Nesbitt (BDSM)</li>
                   </ul>
                </div>
  
                {/* Columna 4: Boletín */}
                <div className="flex flex-col gap-6">
                   <h4 className="font-bold text-lg">Boletín</h4>
                   <div className="flex flex-col gap-4 text-[15px]">
                      <p className="opacity-80">Suscríbete y recibe ofertas al e-mail</p>
                      <div className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl border border-white/10">
                         <input 
                           type="email" 
                           placeholder="Tu correo electrónico" 
                           className="bg-white/5 px-4 py-3 outline-none flex-1 text-sm border-0 focus:bg-white/10 transition"
                         />
                         <button className="bg-red-500 hover:bg-red-600 font-bold px-6 py-3 transition text-sm">
                            Suscríbete
                         </button>
                      </div>
                   </div>
                </div>
  
             </div>
  
             {/* Barra Inferior Optimizada */}
             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 text-[11px] font-medium tracking-wider text-white/40 border-t border-white/5 pt-8">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
                   <a href="#" className="hover:text-white transition whitespace-nowrap">Buscar</a>
                   <div className="hidden lg:block w-[1px] h-3 bg-white/10"></div>
                   <a href="#" className="hover:text-white transition whitespace-nowrap">Garantías y confidencialidad</a>
                   <div className="hidden lg:block w-[1px] h-3 bg-white/10"></div>
                   <a href="#" className="hover:text-white transition whitespace-nowrap">Información para mayoristas</a>
                   <div className="hidden lg:block w-[1px] h-3 bg-white/10"></div>
                   <a href="#" className="hover:text-white transition whitespace-nowrap">Trabaja con nosotros</a>
                   <div className="hidden lg:block w-[1px] h-3 bg-white/10"></div>
                   <a href="#" className="hover:text-white transition whitespace-nowrap">Política de tratamiento de datos</a>
                </div>
                <div className="text-center lg:text-right uppercase whitespace-nowrap">
                   Propiedad artística © 2024 TOY STORE • EL LEGADO DE ANDY
                </div>
             </div>
          </footer>
        )}
      </div>

      {/* Estilos Extra */}
      <style dangerouslySetInnerHTML={{ __html: `
        .maqueta-card {
          background: white;
          border-radius: 20px;
          box-shadow: 10px 10px 20px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .maqueta-relief {
          box-shadow: inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.8);
        }
        .lotso-fur-pattern {
          background-image: url('/src/assets/lotso_fur_texture.png');
          background-size: 400px auto;
          background-repeat: repeat;
        }
      `}} />

    </div>
  );
}
