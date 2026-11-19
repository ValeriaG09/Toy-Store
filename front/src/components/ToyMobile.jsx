import React, { useState } from 'react';

const ToyMobile = ({ onHeartClick, onStarClick, onMoonClick }) => {
  const [activeSide, setActiveSide] = useState(null);

  const toys = [
    {
      id: 'heart',
      color: 'bg-gradient-to-tr from-[#ff2a5f] to-[#ff6b8b]', // Vibrant Toy Story Heart Red/Pink
      icon: '❤',
      side: 'left',
      shadow: 'shadow-[0_5px_15px_rgba(255,42,95,0.4)]',
      title: 'BUSCAR PRODUCTOS',
      content: 'Abre el catálogo completo con filtros personalizados.',
      footer: 'ABRIR FILTROS'
    },
    {
      id: 'moon',
      color: 'bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6]', // Luminous Purple/Indigo Night Sky
      icon: '🌙',
      side: 'right',
      shadow: 'shadow-[0_5px_15px_rgba(99,102,241,0.4)]',
      title: 'RINCÓN DE CONFESIONES',
      content: 'Historias, secretos y experiencias íntimas compartidas por la comunidad Toy Store.',
      footer: 'ABRIR CONFESIONES'
    },
    {
      id: 'star',
      color: 'bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24]', // Bright Sunny Golden Star
      icon: '⭐',
      side: 'right',
      shadow: 'shadow-[0_5px_15px_rgba(245,158,11,0.4)]',
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
      if (onMoonClick) onMoonClick();
      window.dispatchEvent(new CustomEvent('toy_open_confesiones'));
      return;
    }
    // Para otros botones
    setActiveSide(activeSide?.id === toy.id ? null : toy);
  };

  return (
    <div className="relative pointer-events-auto flex flex-col items-center">
      {/* Base del Móvil (Barra Azul Cian Luminosa) */}
      <div className="w-24 md:w-32 h-2.5 bg-gradient-to-r from-[#00AEEF] via-[#38bdf8] to-[#00AEEF] rounded-full shadow-[0_4px_0_#0084c7] relative z-10 border border-white/50"></div>

      {/* Hilos y Juguetes */}
      <div className="flex gap-4 md:gap-6 -mt-1 px-4 relative">
        {toys.map((toy, idx) => (
          <div key={toy.id} className="flex flex-col items-center group">
            {/* Hilo (String) */}
            <div className={`w-[1.5px] bg-slate-300/80 relative origin-top animate-pulse ${idx === 1 ? 'h-20' : 'h-12'}`}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-xs"></div>
            </div>

            {/* Juguete (Botón) */}
            <button
              onClick={() => handleToyClick(toy)}
              className={`${toy.color} ${toy.shadow} w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white text-lg md:text-xl border-2 border-white/90 hover:scale-125 hover:rotate-12 transition-all active:scale-90 animate-swing cursor-pointer`}
              style={{ animationDelay: `${idx * 0.7}s` }}
              title={toy.title}
            >
              <span className="drop-shadow-md">{toy.icon}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToyMobile;
