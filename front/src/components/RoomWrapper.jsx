import React from 'react';

/**
 * RoomWrapper: Provee la estructura de "Maqueta" (Diorama 3D)
 * @param {string} theme - 'andy', 'woody', 'buzz', 'aliens'
 * @param {React.ReactNode} children - Contenido de la página
 */
export default function RoomWrapper({ children, theme = 'andy', wallpaperContent }) {
  
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
      default: // andy
        return {
          wall: 'bg-[#87CEEB]', // Azul Cielo Andy
          floor: 'bg-[#fcf8f2]', // Blanco "crema" para madera blanca
          accent: 'border-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]',
          wallpaper: 'andy-clouds-pattern',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      
      {/* --- ESTRUCTURA DE LA MAQUETA (DIORAMA 3D) --- */}
      <div className="absolute inset-0 z-0 flex flex-col">
        
        {/* 1. PARED (Wall - Blue Sky) */}
        <div className={`relative flex-1 ${styles.wall} ${theme === 'andy' ? '' : styles.wallpaper} overflow-hidden`}>
           {wallpaperContent}
           <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5"></div>
        </div>

        {/* 2. ZÓCALO / MADERA BLANCA (Mid Section) */}
        <div className={`h-[25vh] bg-[#fcf8f2] relative border-t-8 border-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)] overflow-hidden`}>
          {/* Relieve de Tablas Blancas */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '150px 100%' }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        </div>

        {/* 3. SUELO DE MADERA OSCURA / FOOTER (Bottom Section) */}
        <div className="h-[20vh] bg-[#B45309] relative shadow-[inset_0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Relieve de Madera Footer */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 80px, rgba(0,0,0,0.5) 81px)' }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* CONTENIDO (Children) */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
        
        {/* Espaciador para que el contenido no tape el footer de madera si es necesario */}
        <div className="h-[25vh]"></div>

        {/* FOOTER TEXT (Opcional, sobre la madera oscura) */}
        <footer className="mt-auto h-[15vh] flex items-center justify-center pointer-events-none">
           <p className="text-white/60 font-black text-xs uppercase tracking-[5px]">TOY STORE 2024 • EL LEGADO DE ANDY</p>
        </footer>
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
      `}} />

    </div>
  );
}
