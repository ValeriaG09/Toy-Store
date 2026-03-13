import React from 'react';

export default function ToyStoreLogo() {
  return (
    <div className="flex flex-col items-center select-none py-6 mb-4">
      {/* Container para el logo principal */}
      <div className="relative flex flex-col items-center">
        
        {/* PARTE: TOY */}
        <div className="relative z-10">
          <h1 className="text-[70px] font-black leading-none tracking-tight text-yellow-400"
              style={{
                textShadow: `
                  -4px -4px 0 #1d4ed8,  
                   4px -4px 0 #1d4ed8,
                  -4px  4px 0 #1d4ed8,
                   4px  4px 0 #1d4ed8,
                   8px  8px 0 rgba(0,0,0,0.15)
                `,
                fontFamily: "'Arial Black', sans-serif"
              }}>
            TOY
          </h1>
        </div>

        {/* PARTE: STORE (Bloque Rojo) */}
        <div className="relative -mt-4 transform -rotate-2">
          {/* Bloque Rojo con Skew */}
          <div className="bg-red-600 px-6 py-1 transform skew-x-[-15deg] shadow-lg border-2 border-red-700">
            <h1 className="text-[42px] font-black leading-none tracking-widest text-yellow-400 transform skew-x-[15deg]"
                style={{
                  textShadow: `
                    -3px -3px 0 #1d4ed8,  
                     3px -3px 0 #1d4ed8,
                    -3px  3px 0 #1d4ed8,
                     3px  3px 0 #1d4ed8
                  `,
                  fontFamily: "'Arial Black', sans-serif"
                }}>
              STORE
            </h1>
          </div>
        </div>

      </div>
    </div>
  );
}
