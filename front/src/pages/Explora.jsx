import React from 'react';
import RoomWrapper from '../components/RoomWrapper';

/**
 * AlienSpaceBg: Recreación del traje y cara de los Aliens (Marcianos).
 */
const AlienSpaceBg = () => (
  <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#1E3A8A]">
    {/* PARTE SUPERIOR: Piel Verde y 3 Ojos */}
    <div className="h-[40%] bg-[#7FFF00] relative z-20 shadow-lg">
      <div className="absolute inset-0 flex justify-center items-end pb-8 gap-4 md:gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-16 h-16 md:w-24 md:h-24 bg-white rounded-full border-4 border-gray-200 shadow-2xl flex items-center justify-center relative overflow-hidden ${i === 2 ? 'mb-6' : ''}`}>
             <div className="w-6 h-6 md:w-10 md:h-10 bg-black rounded-full shadow-inner animate-pulse"></div>
             {/* Animación de parpadeo (Blink) */}
             <div className="absolute inset-0 bg-[#7FFF00] animate-[blink_5s_infinite] origin-top"></div>
          </div>
        ))}
      </div>
      {/* Sombra de profundidad en la base de la cara */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>

    {/* CUELLO: Banda Púrpura */}
    <div className="h-[10%] bg-[#9333EA] relative z-10 shadow-md">
       <svg className="absolute top-0 left-0 w-full h-[30px]" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M0,0 C250,100 750,100 1000,0 L1000,0 L0,0 Z" fill="#7FFF00" />
       </svg>
    </div>

    {/* CUERPO: Traje Azul Espacial con Logo Pizza Planet */}
    <div className="flex-1 bg-[#1E3A8A] relative flex items-center justify-center">
       {/* Marca de agua Pizza Planet */}
       <svg viewBox="0 0 200 200" className="w-64 h-64 opacity-10 fill-white drop-shadow-2xl">
          <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="8" fill="none" />
          <ellipse cx="100" cy="100" rx="90" ry="30" stroke="white" strokeWidth="6" fill="none" transform="rotate(-30 100 100)" />
          <path d="M70,80 L130,80 L100,130 Z" /> {/* Pizza Slice / Rocket */}
       </svg>
       {/* Estrellas decorativas */}
       <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
    </div>

    <style>{`
      @keyframes blink {
        0%, 90%, 100% { transform: scaleY(0); }
        95% { transform: scaleY(1); }
      }
    `}</style>
  </div>
);

export default function Explora() {
  return (
    <RoomWrapper 
      theme="aliens" 
      fullWallpaper={true} 
      wallpaperContent={<AlienSpaceBg />}
    >
      <div className="p-10 pt-44 relative z-10">
        {/* Contenido vacío según solicitud */}
      </div>
    </RoomWrapper>
  );
}
