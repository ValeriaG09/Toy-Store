import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useNavigate } from 'react-router-dom';

/**
 * JessieOutfitBg: Recreación PREMIUM del traje de Jessie.
 */
const JessieOutfitBg = () => (
  <div className="absolute inset-0 flex flex-col overflow-hidden bg-white">
    {/* 1. PARTE SUPERIOR: Camisa Amarilla con Bordado de Lazo */}
    <div className="h-[300px] md:h-[35%] bg-[#FFD100] relative z-20 shadow-lg">
      <svg className="absolute bottom-[-40px] left-0 w-full h-[150px]" viewBox="0 0 1000 150" preserveAspectRatio="none">
        {/* Borde Festoneado (Scalloped edge) */}
        <path 
          d="M0,0 L1000,0 L1000,60 Q850,140 700,80 Q550,20 400,80 Q250,140 100,80 Q50,60 0,80 Z" 
          fill="#FFD100" 
        />
        {/* Bordado Rojo Estilizado (Red Swirls) */}
        <path 
          d="M0,75 Q100,125 200,75 T400,75 T600,75 T800,75 T1000,75" 
          fill="none" stroke="#D0021B" strokeWidth="4" strokeLinecap="round" className="opacity-80"
        />
        <path 
          d="M50,40 Q70,70 90,40 Q70,10 50,40 M250,50 Q270,80 290,50 Q270,20 250,50 M450,40 Q470,70 490,40 Q470,10 450,40 M650,50 Q670,80 690,50 Q670,20 650,50" 
          fill="none" stroke="#D0021B" strokeWidth="3" className="opacity-40"
        />
      </svg>
    </div>

    {/* 2. PECHERA: Botones de Perla en Vertical */}
    <div className="flex-1 bg-[#F9F9FB] relative flex flex-col justify-center items-center gap-12 z-10 pt-20">
      {[1, 2].map((i) => (
        <div key={i} className="w-14 h-14 bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-full border-[6px] border-white shadow-xl flex items-center justify-center">
          <div className="w-5 h-5 bg-gray-200 rounded-full border border-gray-100 shadow-inner"></div>
        </div>
      ))}
    </div>

    {/* 3. CINTURÓN: Mezclilla + Cuero + Hebilla de Toro */}
    <div className="h-[100px] md:h-[12%] bg-[#0056B3] relative flex justify-center items-center z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] border-t-8 border-[#0047AB]">
      {/* Tira de cuero marrón */}
      <div className="absolute w-full h-8 md:h-10 bg-[#8B4513] shadow-inner opacity-90 border-y border-[#5E2F0D]"></div>
      
      {/* Hebilla Dorada Detallada */}
      <div className="w-32 h-24 md:w-36 md:h-28 bg-gradient-to-b from-[#FFD700] via-[#FDB931] to-[#67440E] rounded-[48%] border-[5px] border-[#8B4513] shadow-2xl relative z-10 flex items-center justify-center transform hover:scale-105 transition-transform duration-500 overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-black/10 mix-blend-overlay"></div>
         <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            {/* Cabeza de Toro Grabada */}
            <path fill="#5E2F0D" d="M20,35 Q50,15 80,35 L85,45 Q75,40 65,45 L60,70 Q50,85 40,70 L35,45 Q25,40 15,45 Z" />
            <path fill="#5E2F0D" d="M30,30 Q10,10 5,40 L15,35 Q18,20 30,30 M70,30 Q90,10 95,40 L85,35 Q82,20 70,30" />
            <circle cx="50" cy="55" r="4" fill="#8B4513" />
         </svg>
      </div>
    </div>

    {/* 4. CHAPERAS: Patrón de Vaca Orgánico */}
    <div className="h-[25vh] md:h-[30vh] bg-white relative z-0">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="cowSpots" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
            <path d="M50,100 C70,80 120,90 140,110 C160,130 150,170 130,190 C110,210 60,200 40,180 C20,160 30,120 50,100" fill="black" />
            <path d="M220,40 C240,20 280,30 290,60 C300,90 280,120 250,130 C220,140 200,110 210,80 C220,50 200,60 220,40" fill="black" />
            <path d="M10,250 C30,230 80,240 90,270 C100,300 80,330 50,340 C20,350 0,320 0,290 C0,260 0,270 10,250" fill="black" />
            <path d="M250,220 C270,200 320,210 330,240 C340,270 320,300 290,310 C260,320 240,290 250,260" fill="black" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cowSpots)" />
      </svg>
      {/* Sombra de profundidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
    </div>
  </div>
);

export default function Vestier() {
  const navigate = useNavigate();
  return (
    <RoomWrapper 
      theme="jessie" 
      fullWallpaper={true} 
      wallpaperContent={<JessieOutfitBg />}
    >
      <div className="p-10 pt-44 relative z-10">
        {/* Contenido vacío según solicitud del usuario */}
      </div>
    </RoomWrapper>
  );
}
