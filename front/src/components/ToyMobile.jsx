import React, { useState } from 'react';

const ToyMobile = ({ onHeartClick, onStarClick }) => {
  const [activeSide, setActiveSide] = useState(null);

  const toys = [
    {
      id: 'heart',
      color: 'bg-[#FF69B4]', // Pink Heart
      icon: '❤',
      side: 'left',
      title: 'BUSCAR PRODUCTOS',
      content: 'Abre el catálogo completo con filtros personalizados.',
      footer: 'ABRIR FILTROS'
    },
    {
      id: 'moon',
      color: 'bg-[#8B0000]', // Dark Red Moon
      icon: '🌙',
      side: 'right',
      title: 'MODO NOCTURNO',
      content: 'La luna ha salido en el cuarto de Andy. Es el momento perfecto para explorar nuestras guías de uso nocturno y tips de lubricación.',
      footer: 'LEER GUÍAS'
    },
    {
      id: 'star',
      color: 'bg-[#FFD700]', // Yellow Star
      icon: '⭐',
      side: 'right',
      title: 'PROPÓSITO Y MISIÓN',
      content: '¡Felicidades Soldado! Has encontrado el corazón de Toy Store. Descubre por qué hacemos lo que hacemos.',
      footer: 'VER MÁS'
    },
  ];

  const handleToyClick = (toy) => {
    if (toy.id === 'heart') {
      if (onHeartClick) onHeartClick();
      return;
    }
    if (toy.id === 'star') {
      if (onStarClick) onStarClick();
      return;
    }
    if (toy.id === 'moon') {
      return; // Completamente inoperativo por petición
    }
    // Para otros botones
    setActiveSide(activeSide?.id === toy.id ? null : toy);
  };

  return (
    <div className="relative pointer-events-auto flex flex-col items-center">
      {/* Base del Móvil (Barra Azul) */}
      <div className="w-24 md:w-32 h-2.5 bg-[#00AEEF] rounded-full shadow-[0_4px_0_#0084c7] relative z-10 border border-white/20"></div>

      {/* Hilos y Juguetes */}
      <div className="flex gap-4 md:gap-6 -mt-1 px-4 relative">
        {toys.map((toy, idx) => (
          <div key={toy.id} className="flex flex-col items-center group">
            {/* Hilo (String) */}
            <div className={`w-[1px] bg-gray-400 opacity-50 relative origin-top animate-pulse ${idx === 1 ? 'h-20' : 'h-12'}`}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            </div>

            {/* Juguete (Botón) */}
            <button
              onClick={() => handleToyClick(toy)}
              className={`${toy.color} w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white text-lg md:text-xl shadow-[0_5px_15px_rgba(0,0,0,0.2)] border-2 border-white/40 hover:scale-125 hover:rotate-12 transition-all active:scale-90 animate-swing cursor-pointer`}
              style={{ animationDelay: `${idx * 0.7}s` }}
              title={toy.title}
            >
              <span className="drop-shadow-md">{toy.icon}</span>
            </button>
          </div>
        ))}
      </div>

      {/* emergent Side Panels Area (For Moon & Star only) */}
      {(activeSide && activeSide.id !== 'heart') && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setActiveSide(null)}
          ></div>

          <div className={`fixed top-0 h-full w-[320px] md:w-[400px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.3)] z-[210] p-10 flex flex-col 
            ${activeSide.side === 'left'
              ? 'left-0 border-r-[12px] border-[#00AEEF] animate-in slide-in-from-left duration-500 rounded-r-[3rem]'
              : 'right-0 border-l-[12px] border-yellow-400 animate-in slide-in-from-right duration-500 rounded-l-[3rem]'
            }`}
          >
            <button onClick={() => setActiveSide(null)} className="absolute top-6 right-6 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-black text-2xl">×</button>
            <div className={`w-20 h-20 ${activeSide.color} rounded-[1.5rem] flex items-center justify-center text-5xl text-white mb-8 shadow-2xl rotate-3 border-4 border-white`}>{activeSide.icon}</div>
            <h2 className="text-3xl font-black text-[#0047AB] mb-2 tracking-tight uppercase leading-none">{activeSide.title}</h2>
            <div className="h-2 w-16 bg-yellow-400 rounded-full mb-8"></div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-gray-700 font-bold leading-relaxed text-lg mb-6">{activeSide.content}</p>
            </div>
            <div className="mt-8 pt-8 border-t-2 border-gray-50">
              <button className="w-full bg-[#E52521] text-white py-5 rounded-2xl font-black uppercase tracking-[2px] text-[13px] hover:brightness-110 shadow-[0_8px_0_#9b1b18] active:translate-y-1 active:shadow-[0_4px_0_#9b1b18]">{activeSide.footer}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ToyMobile;
