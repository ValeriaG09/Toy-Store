import React from 'react';
import RoomWrapper from '../components/RoomWrapper';

/**
 * BuzzSuitBg: Recreación del panel frontal del traje de Buzz Lightyear.
 */
const BuzzSuitBg = () => (
  <div className="absolute inset-0 flex flex-col overflow-hidden bg-white">
    {/* 1. PARTE SUPERIOR: Protector Púrpura */}
    <div className="h-[40%] bg-[#A855F7] relative z-20 shadow-xl border-b-[12px] border-black/10">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)]"></div>
    </div>

    {/* 2. PANEL DE MANDOS: Pecho Verde Lima */}
    <div className="h-[25%] bg-[#BEF264] relative z-30 flex items-center justify-between px-10 md:px-20 shadow-2xl border-y-8 border-black/5">
      {/* Botones de Colores (Izquierda) */}
      <div className="flex gap-4 md:gap-8">
        <div className="w-10 h-20 md:w-14 md:h-28 bg-[#3B82F6] rounded-2xl border-4 border-black/20 shadow-[inset_0_-8px_0_rgba(0,0,0,0.2)] animate-pulse"></div>
        <div className="w-10 h-20 md:w-14 md:h-28 bg-[#22C55E] rounded-2xl border-4 border-black/20 shadow-[inset_0_-8px_0_rgba(0,0,0,0.2)]"></div>
        <div className="w-10 h-20 md:w-14 md:h-28 bg-[#EF4444] rounded-2xl border-4 border-black/20 shadow-[inset_0_-8px_0_rgba(0,0,0,0.2)]"></div>
      </div>

      {/* Monitor Central */}
      <div className="w-[40%] h-[80%] bg-[#BAE6FD] rounded-3xl border-[12px] border-white shadow-2xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
        <div className="w-full h-[2px] bg-sky-400/30 absolute top-1/2"></div>
      </div>

      {/* Botones de Acción (Derecha) */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-6 md:w-28 md:h-10 bg-[#FDE047] rounded-full border-4 border-black/10 shadow-lg"></div>
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#DC2626] rounded-full border-8 border-white shadow-2xl flex items-center justify-center">
           <div className="w-4 h-4 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </div>

    {/* 3. PARTE INFERIOR: Correas y Soporte */}
    <div className="flex-1 bg-gray-50 relative z-10">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M0,0 L1000,0 L850,500 L150,500 Z" fill="#ffffff" />
        {/* Franjas Púrpuras Diagonales */}
        <path d="M100,0 L300,0 L500,500 L300,500 Z" fill="#A855F7" opacity="0.4" />
        <path d="M900,0 L700,0 L500,500 L700,500 Z" fill="#A855F7" opacity="0.4" />
      </svg>
      {/* Sombra de profundidad en la base */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>
  </div>
);

export default function Contacto() {
  return (
    <RoomWrapper 
      theme="buzz" 
      fullWallpaper={true} 
      wallpaperContent={<BuzzSuitBg />}
    >
      <div className="p-4 md:p-10 pt-20 md:pt-44 relative z-10">
        {/* Contenido vacío según solicitud del usuario */}
      </div>
    </RoomWrapper>
  );
}
