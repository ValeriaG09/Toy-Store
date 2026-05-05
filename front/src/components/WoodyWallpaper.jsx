import React from 'react';

/**
 * WoodyWallpaper: Recreación premium del atuendo de Woody.
 * Capas: Camisa (Grilla Amarilla), Banda Roja (Cinturón/Pañuelo), Chaleco (Vaca).
 */
export default function WoodyWallpaper() {
  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none select-none">
      
      {/* 🛑 CAPA 1: LA CAMISA (Amarillo con Grilla Roja) 🛑 */}
      <div className="relative flex-[1.5] bg-[#FBBF24] overflow-hidden">
        {/* Grilla de líneas rojas finas */}
        <div className="absolute inset-0 opacity-40" 
             style={{ 
               backgroundImage: `
                 repeating-linear-gradient(0deg, #E52521 0, #E52521 1px, transparent 1px, transparent 45px),
                 repeating-linear-gradient(90deg, #E52521 0, #E52521 1px, transparent 1px, transparent 45px)
               ` 
             }}>
        </div>
        {/* Sombreado sutil para dar volumen */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5"></div>
      </div>

      {/* 🛑 CAPA 2: LA BANDA ROJA (Divisor de Cinturón / Pañuelo) 🛑 */}
      <div className="h-4 md:h-6 bg-[#DC2626] relative shadow-[0_4px_10px_rgba(0,0,0,0.2),0_-4px_10px_rgba(0,0,0,0.1)] z-10">
        {/* Textura de costura sutil */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 100%' }}>
        </div>
      </div>

      {/* 🛑 CAPA 3: EL CHALECO (Patrón de Vaca) 🛑 */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {/* Patrón de Manchas de Vaca con SVG para máxima nitidez */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-90">
          <defs>
            <pattern id="cow_spots" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
              {/* Manchas irregulares vectorizadas */}
              <circle cx="50" cy="50" r="40" fill="#111" />
              <path d="M150,30 Q180,10 210,40 T250,90 Q220,130 180,110 T140,50 Z" fill="#111" />
              <path d="M40,180 Q80,150 120,190 T150,250 Q100,280 50,240 T40,180 Z" fill="#111" />
              <circle cx="260" cy="220" r="35" fill="#111" />
              <path d="M220,260 Q250,280 280,250 T290,200 Q260,180 230,210 T220,260 Z" fill="#111" />
              <path d="M10,290 Q30,260 60,280 T90,300 L0,300 Z" fill="#111" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cow_spots)" />
        </svg>
        
        {/* Degradado para integrar con el suelo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>

    </div>
  );
}
