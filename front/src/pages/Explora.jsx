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
  const [jugando, setJugando] = React.useState(false);
  const [premio, setPremio] = React.useState(null);

  const premios = [
    { titulo: "¡Hasta el clímax y más allá!", desc: "15% de descuento en tu próxima compra de vibradores.", codigo: "BUZZ15" },
    { titulo: "¡Hay un amigo en ti!", desc: "Envío gratis en todos los juguetes de silicón.", codigo: "WOODYFREE" },
    { titulo: "¡El elegido!", desc: "Lleva 2 y paga 1 en la sección de lencería intergaláctica.", codigo: "LAGARRA2X1" },
    { titulo: "¡Al infinito y más rico!", desc: "Regalo sorpresa (lubricante cósmico) en compras mayores a $50.", codigo: "SORPRESATEXAS" }
  ];

  const invocarGarra = () => {
    if (jugando) return;
    setJugando(true);
    setPremio(null);
    
    // Simular el tiempo de bajada de la garra
    setTimeout(() => {
      const premioRandom = premios[Math.floor(Math.random() * premios.length)];
      setPremio(premioRandom);
      setJugando(false);
    }, 2500); // 2.5 segundos de animación
  };

  return (
    <RoomWrapper 
      theme="aliens" 
      fullWallpaper={true} 
      wallpaperContent={<AlienSpaceBg />}
    >
      <div className="min-h-screen relative z-10 flex flex-col items-center justify-center text-center overflow-hidden pb-20">
        
        {/* LA GARRA */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 transition-transform ease-in-out z-20 ${
            jugando ? 'translate-y-[45vh] duration-[2500ms]' : '-translate-y-[15%] duration-700'
          }`}
        >
          {/* Cable */}
          <div className="w-3 h-[40vh] bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 mx-auto border-x-2 border-gray-600 shadow-xl"></div>
          
          {/* Base Garra */}
          <div className="w-28 h-10 bg-gradient-to-b from-gray-500 to-gray-700 rounded-t-2xl border-b-8 border-gray-900 mx-auto relative shadow-2xl flex items-center justify-center">
            <div className="w-6 h-6 bg-red-600 rounded-full shadow-[0_0_15px_red] animate-pulse border-2 border-red-800"></div>
          </div>
          
          {/* Brazos de la garra */}
          <div className="flex justify-between w-48 -mt-2 mx-auto drop-shadow-2xl">
            {/* Brazo Izquierdo */}
            <div className={`w-16 h-28 border-l-[12px] border-b-[12px] border-gray-400 rounded-bl-full transition-transform duration-500 origin-top-right bg-gradient-to-br from-transparent to-black/20 ${jugando ? 'rotate-[25deg]' : '-rotate-12'}`}>
              <div className="absolute -bottom-[12px] -right-2 w-6 h-6 bg-gray-800 rounded-full"></div>
            </div>
            {/* Brazo Derecho */}
            <div className={`w-16 h-28 border-r-[12px] border-b-[12px] border-gray-400 rounded-br-full transition-transform duration-500 origin-top-left bg-gradient-to-bl from-transparent to-black/20 ${jugando ? '-rotate-[25deg]' : 'rotate-12'}`}>
               <div className="absolute -bottom-[12px] -left-2 w-6 h-6 bg-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="relative z-30 mt-44 md:mt-64 px-4 w-full max-w-4xl">
          <h1 
            className="text-5xl md:text-7xl font-black text-yellow-400 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-6 tracking-widest uppercase italic" 
            style={{ fontFamily: "'Arial Black', sans-serif", WebkitTextStroke: '3px #E11D48' }}
          >
            ¡La Garra del Placer!
          </h1>
          
          <div className="bg-black/60 px-6 py-4 rounded-3xl backdrop-blur-md inline-block shadow-2xl mb-12 border-2 border-[#7FFF00]">
            <p className="text-xl md:text-2xl text-white font-bold">
              Los marcianitos han hablado... <br/> <span className="text-[#7FFF00]">¿Serás el elegido de esta noche?</span>
            </p>
          </div>

          {!premio ? (
            <button 
              onClick={invocarGarra}
              disabled={jugando}
              className={`block mx-auto px-8 py-6 md:px-12 md:py-8 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white font-black text-2xl md:text-4xl rounded-full border-4 border-white shadow-[0_0_30px_rgba(219,39,119,0.8)] transition-all ${
                jugando 
                  ? 'opacity-60 cursor-not-allowed scale-95' 
                  : 'hover:scale-110 active:scale-95 hover:shadow-[0_0_60px_rgba(236,72,153,1)] hover:border-yellow-300 animate-pulse'
              }`}
            >
              {jugando ? 'LA GARRA ESTÁ DECIDIENDO...' : '¡INVOCAR A LA GARRA!'}
            </button>
          ) : (
             <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-purple-500 max-w-xl mx-auto transform animate-[bounceIn_0.6s_ease-out]">
                <div className="text-7xl md:text-8xl mb-6 drop-shadow-lg">🎁</div>
                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-4 uppercase">
                  {premio.titulo}
                </h2>
                <p className="text-xl text-gray-800 font-bold mb-8">
                  {premio.desc}
                </p>
                <div className="bg-gray-100 p-6 rounded-3xl border-4 border-dashed border-gray-300 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 text-9xl opacity-5">👽</div>
                  <span className="text-sm text-gray-500 font-bold uppercase tracking-widest block mb-2">Tu código secreto:</span>
                  <span className="text-3xl md:text-4xl font-black text-pink-600 tracking-widest block select-all">
                    {premio.codigo}
                  </span>
                </div>
                <button 
                  onClick={() => setPremio(null)}
                  className="mt-8 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 border-2 border-transparent hover:border-white"
                >
                  ¡Volver a intentar!
                </button>
             </div>
          )}
        </div>

        <style>{`
          @keyframes bounceIn {
            0% { transform: scale(0.1); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            80% { transform: scale(0.95); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </RoomWrapper>
  );
}
