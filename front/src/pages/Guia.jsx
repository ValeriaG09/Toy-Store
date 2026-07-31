import React, { useState } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useNavigate } from 'react-router-dom';

const videoTutorials = [
  {
    id: 1,
    title: "Misión: Protección Estelar",
    description: "Aprende paso a paso cómo colocar correctamente un preservativo para un viaje seguro al infinito.",
    thumbnail: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    videoUrl: "https://youtu.be/3zOEnMF8F6Y"
  },
  {
    id: 2,
    title: "Combustible de Nave: Lubricantes",
    description: "Todo fluye mejor con el lubricante adecuado. Descubre cuándo usar a base de agua o silicona.",
    thumbnail: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    videoUrl: "https://youtu.be/lDKIiE-cG8Y?si=bBYCj-SK5U8e-2zB"
  }
];

const toyGuides = [
  {
    id: 1,
    title: "Vibradores y Balas",
    icon: "🚀",
    description: "Perfectos para iniciar. Las balas son pequeñas, precisas y amigables. Como los Marcianitos: ¡siempre dispuestos a ayudar!",
    tip: "Usa lubricante a base de agua para mantener el material de tu juguete en perfectas condiciones."
  },
  {
    id: 2,
    title: "Succionadores",
    icon: "🌪️",
    description: "Una tecnología de otro planeta. Usan ondas de aire para estimular sin contacto directo. ¡Una sensación a velocidad luz!",
    tip: "Empieza en el nivel de intensidad más bajo, ¡el Comando Estelar recomienda ir de menos a más!"
  },
  {
    id: 3,
    title: "Juguetes en Pareja",
    icon: "🤝",
    description: "¡Hay un amigo en mí! Juguetes diseñados para compartir la diversión, como anillos vibradores o juguetes con control remoto.",
    tip: "La comunicación es la mejor herramienta de su baúl. Hablen de lo que les gusta y lo que no."
  }
];

export default function Guia() {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <RoomWrapper 
      theme="lotso" 
      fullWallpaper={false} 
      showFooter={true}
    >
      <div className="px-4 md:px-10 pt-12 pb-24 relative z-10 max-w-6xl mx-auto font-sans">
        
        {/* Header Section */}
        <div className="text-center mb-20 mt-10">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] mb-6 uppercase tracking-wider" style={{ WebkitTextStroke: '2px #be185d' }}>
            Guía de Exploración
          </h1>
          <p className="text-xl md:text-2xl text-white font-bold max-w-4xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-relaxed bg-pink-600/40 p-8 rounded-3xl backdrop-blur-sm border-2 border-pink-300/50 shadow-xl">
            Bienvenido al Comando del Amor. Aquí hablamos sin tabúes, porque conocerte a ti mismo y cuidar de tu bienestar es la misión más dulce de la galaxia. 💖🚀
          </p>
        </div>

        {/* Mitos y Tabúes - Purple / Pink Theme */}
        <section className="mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="bg-[#fdf4ff] rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-8 border-fuchsia-400 relative">
            <div className="absolute -top-12 -left-8 md:-left-12 w-28 h-28 bg-fuchsia-500 rounded-full flex items-center justify-center shadow-2xl transform -rotate-12 border-4 border-white">
              <span className="text-6xl">✨</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-fuchsia-800 mb-8 uppercase tracking-tight md:ml-16">
              "¡Despidamos los Mitos!"
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-fuchsia-100">
                <h3 className="font-black text-2xl text-fuchsia-600 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🚫</span> Mito: Hablar de sexo es vergonzoso
                </h3>
                <p className="text-fuchsia-900 text-lg leading-relaxed">
                  <strong className="text-fuchsia-700">Realidad:</strong> La sexualidad es una parte natural y hermosa. Hablar abiertamente mejora tus relaciones, tu confianza y tu salud. ¡No hay nada de qué avergonzarse en el cuarto de Andy!
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-fuchsia-100">
                <h3 className="font-black text-2xl text-fuchsia-600 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🧩</span> Mito: Los juguetes son porque algo falta
                </h3>
                <p className="text-fuchsia-900 text-lg leading-relaxed">
                  <strong className="text-fuchsia-700">Realidad:</strong> ¡Falso! Los juguetes no reemplazan a nadie; son como los accesorios, están aquí para potenciar la diversión, explorar y hacer todo más emocionante.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Educativos - Pink/Purple Space Theme */}
        <section className="mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
          <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)] mb-4 text-center uppercase" style={{ WebkitTextStroke: '1px #d946ef' }}>
            💖 Academia Estelar del Amor 💖
          </h2>
          <p className="text-center text-white font-bold mb-12 text-xl drop-shadow-md bg-fuchsia-900/40 max-w-3xl mx-auto p-4 rounded-2xl backdrop-blur-sm border border-fuchsia-300/30">
            Instrucciones visuales para asegurar que todas tus misiones espaciales sean 100% seguras, cómodas y placenteras.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {videoTutorials.map((video) => (
              <div key={video.id} className="bg-fuchsia-50 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-fuchsia-300 group hover:border-pink-500 transition-all duration-300 hover:-translate-y-2">
                <div 
                  className="h-72 bg-pink-900 relative cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 mix-blend-overlay" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.6)] group-hover:scale-110 group-hover:bg-pink-400 transition-all duration-300">
                      <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <span className="mt-4 text-white font-bold uppercase tracking-widest text-sm bg-pink-900/50 px-4 py-1 rounded-full">Ver Tutorial</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-pink-600 mb-3 uppercase tracking-tight">{video.title}</h3>
                  <p className="text-pink-900 text-lg leading-relaxed">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guía de Productos - El Baúl (Lotso Pink Theme) */}
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <div className="bg-pink-100 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-8 border-pink-400">
            <h2 className="text-4xl md:text-5xl font-black text-pink-700 mb-12 text-center uppercase tracking-wider drop-shadow-sm">
              🧸 El Baúl de Juguetes 🧸
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {toyGuides.map((guide) => (
                <div key={guide.id} className="bg-white rounded-[2rem] p-8 shadow-xl border-4 border-pink-300 hover:shadow-pink-400/40 hover:border-pink-500 transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="text-7xl mb-6 text-center relative z-10 transform group-hover:scale-110 transition-transform">{guide.icon}</div>
                  <h3 className="text-2xl font-black text-pink-600 mb-4 text-center uppercase relative z-10">{guide.title}</h3>
                  <p className="text-gray-600 mb-8 text-center text-[15px] leading-relaxed relative z-10">
                    {guide.description}
                  </p>
                  
                  <div className="bg-pink-50 p-5 rounded-2xl border-2 border-pink-200 relative z-10">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                      💡
                    </div>
                    <p className="text-[11px] text-pink-500 font-black uppercase tracking-widest text-center mt-3 mb-2">Consejo de Rex:</p>
                    <p className="text-sm text-pink-800 font-medium text-center italic">{guide.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* Video Modal - Actual Embed */}
      {activeVideo && (
        <div className="fixed inset-0 z-[200] bg-pink-900/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-pink-50 p-3 md:p-4 rounded-[2rem] w-full max-w-5xl relative shadow-[0_0_80px_rgba(236,72,153,0.4)] border-4 border-pink-400 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute -top-6 -right-6 md:-top-8 md:-right-8 text-white hover:bg-pink-500 hover:scale-110 text-2xl font-bold transition-all duration-300 bg-pink-600 border-4 border-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-10"
            >
              ✕
            </button>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center relative border-4 border-pink-200 shadow-inner">
              <iframe 
                width="100%" 
                height="100%" 
                src={activeVideo.videoUrl} 
                title={activeVideo.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
            <div className="p-4 mt-2 text-center">
              <h3 className="text-pink-600 font-black text-2xl uppercase">{activeVideo.title}</h3>
            </div>
          </div>
        </div>
      )}
    </RoomWrapper>
  );
}