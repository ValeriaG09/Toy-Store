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

const preguntas = [
  {
    texto: "Es viernes en la noche, ¿qué prefieres?",
    opciones: [
      { texto: "Reunir a los amigos y liderar el plan", tipo: "woody" },
      { texto: "Ir a lo desconocido, sin miedo", tipo: "buzz" },
      { texto: "Salir a explorar algo nuevo, sola/o si toca", tipo: "jessie" },
      { texto: "Quedarme en casa, tranquilo", tipo: "rex" },
    ],
  },
  {
    texto: "¿Cómo describirías tu estilo?",
    opciones: [
      { texto: "Clásico, de confianza", tipo: "woody" },
      { texto: "Futurista y llamativo", tipo: "buzz" },
      { texto: "Salvaje, con actitud", tipo: "jessie" },
      { texto: "Cómodo, sin complicarme", tipo: "rex" },
    ],
  },
  {
    texto: "En una situación nueva, tú...",
    opciones: [
      { texto: "Tomas el control de la situación", tipo: "woody" },
      { texto: "Te lanzas sin pensarlo dos veces", tipo: "buzz" },
      { texto: "Te emocionas y contagias a los demás", tipo: "jessie" },
      { texto: "Prefieres observar antes de actuar", tipo: "rex" },
    ],
  },
  {
    texto: "¿Qué buscas en este momento de tu vida?",
    opciones: [
      { texto: "Estabilidad y algo seguro", tipo: "woody" },
      { texto: "Aventura, algo que no haya probado", tipo: "buzz" },
      { texto: "Libertad para ser quien soy", tipo: "jessie" },
      { texto: "Algo relajado, sin presión", tipo: "rex" },
    ],
  },
];

const resultados = {
  woody: {
    titulo: "Eres Woody 🤠",
    desc: "Leal, confiable y siempre listo para cuidar a los tuyos. Los marcianitos vieron en ti a un líder de confianza.",
    categoria: "Kits de Aventura",
    link: "/tienda?cat=kits",
    color: "from-amber-500 to-red-600",
  },
  buzz: {
    titulo: "Eres Buzz Lightyear 🚀",
    desc: "Al infinito y más allá. Los marcianitos reconocen en ti a alguien que no le teme a lo nuevo.",
    categoria: "Vibradores",
    link: "/tienda?cat=vibradores",
    color: "from-purple-600 to-indigo-600",
  },
  jessie: {
    titulo: "Eres Jessie 🤠✨",
    desc: "Libre, espontánea y con muchísima energía. Los marcianitos sintieron tu chispa desde la garra.",
    categoria: "Accesorios",
    link: "/tienda?cat=accesorios",
    color: "from-pink-500 to-rose-600",
  },
  rex: {
    titulo: "Eres Rex 🦖",
    desc: "Sensible, curioso y sin prisa. Los marcianitos te eligieron por tu calma cósmica.",
    categoria: "Lencería",
    link: "/tienda?cat=lencerias",
    color: "from-emerald-500 to-teal-600",
  },
};

export default function Explora() {
  const [paso, setPaso] = React.useState(0);
  const [respuestas, setRespuestas] = React.useState([]);
  const [resultado, setResultado] = React.useState(null);

  const responder = (tipo) => {
    const nuevasRespuestas = [...respuestas, tipo];
    setRespuestas(nuevasRespuestas);

    if (paso + 1 < preguntas.length) {
      setPaso(paso + 1);
    } else {
      const conteo = nuevasRespuestas.reduce((acc, t) => {
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {});
      const ganador = Object.keys(conteo).reduce((a, b) =>
        conteo[a] >= conteo[b] ? a : b
      );
      setResultado(resultados[ganador]);
    }
  };

  const reiniciar = () => {
    setPaso(0);
    setRespuestas([]);
    setResultado(null);
  };

  return (
    <RoomWrapper
      theme="aliens"
      fullWallpaper={true}
      wallpaperContent={<AlienSpaceBg />}
    >
      <div className="min-h-screen relative z-10 flex flex-col items-center justify-center text-center px-4 pt-[42vh] md:pt-[38vh] pb-20">
        <div className="text-6xl mb-4 drop-shadow-2xl">👽</div>

        <h1
          className="text-4xl md:text-6xl font-black text-yellow-400 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-4 tracking-widest uppercase italic"
          style={{ fontFamily: "'Arial Black', sans-serif", WebkitTextStroke: '2px #E11D48' }}
        >
          ¿Qué personaje eres?
        </h1>
        <div className="bg-black/60 px-6 py-3 rounded-3xl backdrop-blur-md inline-block shadow-2xl mb-10 border-2 border-[#7FFF00]">
          <p className="text-lg md:text-xl text-white font-bold">
            Los marcianitos preparan su veredicto... <br />
            <span className="text-[#7FFF00]">responde y descubre tu destino cósmico</span>
          </p>
        </div>

        {!resultado ? (
          <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 max-w-xl w-full border-2 border-[#7FFF00]/40 shadow-2xl">
            {/* Barra de progreso estilo "ojitos" marcianos */}
            <div className="flex gap-3 mb-8 justify-center">
              {preguntas.map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    i <= paso
                      ? 'bg-[#7FFF00] border-white scale-110'
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${i <= paso ? 'bg-black' : 'bg-white/20'}`} />
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              {preguntas[paso].texto}
            </h2>

            <div className="grid gap-4">
              {preguntas[paso].opciones.map((op, i) => (
                <button
                  key={i}
                  onClick={() => responder(op.tipo)}
                  className="w-full text-left px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all border border-white/10 hover:border-[#7FFF00] hover:scale-[1.02] active:scale-95"
                >
                  {op.texto}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-[#7FFF00] max-w-xl w-full relative overflow-hidden transform animate-[bounceIn_0.6s_ease-out]">
            <div className="absolute -right-8 -top-8 text-9xl opacity-5">👽</div>

            <div className="text-6xl mb-2">👽</div>
            <h2 className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${resultado.color} mb-4`}>
              {resultado.titulo}
            </h2>
            <p className="text-lg text-gray-700 font-medium mb-8">
              {resultado.desc}
            </p>

            <div className="bg-gray-100 p-6 rounded-3xl border-4 border-dashed border-gray-300 mb-8 relative overflow-hidden">
              <span className="text-sm text-gray-500 font-bold uppercase tracking-widest block mb-2">
                Tu categoría recomendada:
              </span>
              <span className="text-2xl md:text-3xl font-black text-purple-700">
                {resultado.categoria}
              </span>
            </div>

            <a
              href={resultado.link}
              className={`block w-full py-4 bg-gradient-to-r ${resultado.color} text-white font-black text-xl rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 mb-3`}
            >
              Ver mi colección →
            </a>
            <button
              onClick={reiniciar}
              className="w-full py-3 text-gray-500 font-bold hover:text-gray-800 transition-all"
            >
              Volver a intentar
            </button>
          </div>
        )}

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