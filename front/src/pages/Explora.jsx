import React from 'react';
import RoomWrapper from '../components/RoomWrapper';

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
    desc: "Leal, confiable y siempre listo para cuidar a los tuyos. Te va bien lo clásico, lo que nunca falla.",
    categoria: "Clásicos y Bestsellers",
    link: "/catalogo?categoria=clasicos",
    color: "from-amber-500 to-red-600",
  },
  buzz: {
    titulo: "Eres Buzz Lightyear 🚀",
    desc: "Al infinito y más allá. Te atrae lo nuevo, lo intenso, lo que te saca de la zona de confort.",
    categoria: "Novedades y Ediciones Limitadas",
    link: "/catalogo?categoria=novedades",
    color: "from-purple-600 to-indigo-600",
  },
  jessie: {
    titulo: "Eres Jessie 🤠✨",
    desc: "Libre, espontánea y con muchísima energía. Buscas lo que te haga sentir viva y sin filtros.",
    categoria: "Colección Bold",
    link: "/catalogo?categoria=bold",
    color: "from-pink-500 to-rose-600",
  },
  rex: {
    titulo: "Eres Rex 🦖",
    desc: "Sensible, curioso y sin prisa. Prefieres lo cómodo y lo que te haga sentir en confianza.",
    categoria: "Línea Suave y Confort",
    link: "/catalogo?categoria=confort",
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
      // Calcular tipo con más votos
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
    <RoomWrapper theme="starcommand">
      <div className="min-h-screen relative z-10 flex flex-col items-center justify-center text-center px-4 py-16">
        
        <h1 className="text-4xl md:text-6xl font-black text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-4 uppercase tracking-wide">
          ¿Qué personaje eres?
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-semibold mb-10 max-w-xl">
          Responde 4 preguntas y descubre tu match perfecto en la tienda.
        </p>

        {!resultado ? (
          <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 max-w-xl w-full border-2 border-white/20 shadow-2xl">
            {/* Barra de progreso */}
            <div className="flex gap-2 mb-8 justify-center">
              {preguntas.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i <= paso ? 'w-10 bg-yellow-400' : 'w-6 bg-white/20'
                  }`}
                />
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
                  className="w-full text-left px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all border border-white/10 hover:border-yellow-400 hover:scale-[1.02] active:scale-95"
                >
                  {op.texto}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-purple-500 max-w-xl w-full transform animate-[bounceIn_0.6s_ease-out]">
            <h2 className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${resultado.color} mb-4`}>
              {resultado.titulo}
            </h2>
            <p className="text-lg text-gray-700 font-medium mb-8">
              {resultado.desc}
            </p>

            <div className="bg-gray-100 p-6 rounded-3xl border-4 border-dashed border-gray-300 mb-8">
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