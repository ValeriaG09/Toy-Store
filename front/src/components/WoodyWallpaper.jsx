import React from 'react';

/**
 * WoodyWallpaper: Recreación premium del atuendo de Woody.
 * Diseñado con manchas de vaca orgánicas de alta fidelidad, 100% fluidas y sin cortes abruptos.
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

      {/* 🛑 CAPA 3: EL CHALECO (Patrón de Vaca Orgánico Premium) 🛑 */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {/* Patrón de Manchas de Vaca con SVG diseñado para evitar cortes rectos y pixelación */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-90">
          <defs>
            <pattern id="cow_spots_premium" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
              {/* Mancha 1: Centro-Izquierda (Curvas suavizadas) */}
              <path d="M 100,100 C 130,80 180,90 190,130 C 200,170 140,210 110,190 C 80,170 70,120 100,100 Z" fill="#18181b" />
              
              {/* Mancha 2: Centro-Derecha */}
              <path d="M 280,120 C 320,100 350,130 340,170 C 330,210 270,220 250,190 C 230,160 240,140 280,120 Z" fill="#18181b" />
              
              {/* Mancha 3: Abajo-Centro */}
              <path d="M 180,260 C 210,230 260,250 280,290 C 300,330 230,370 190,360 C 150,350 150,290 180,260 Z" fill="#18181b" />
              
              {/* Mancha 4: Arriba-Derecha */}
              <path d="M 300,30 C 330,10 370,20 380,50 C 390,80 340,110 310,90 C 280,70 270,50 300,30 Z" fill="#18181b" />
              
              {/* Mancha 5: Izquierda-Abajo */}
              <path d="M 50,280 C 80,260 110,290 100,320 C 90,350 40,360 30,330 C 20,300 20,300 50,280 Z" fill="#18181b" />
              
              {/* Mancha 6: Arriba-Izquierda */}
              <path d="M 60,30 C 80,10 110,30 100,60 C 90,90 40,80 30,60 C 20,40 40,50 60,30 Z" fill="#18181b" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cow_spots_premium)" />
        </svg>
        
        {/* Degradado para integrar con el suelo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>

    </div>
  );
}
