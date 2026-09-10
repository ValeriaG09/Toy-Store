import React, { useState, useEffect, useRef } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useNavigate } from 'react-router-dom';
import LotsoImg from '../assets/lotso_bear.png';
import JessyImg from '../assets/jessy_heart.png';
import BuzzImg from '../assets/buzz_heart.png';
import AliensImg from '../assets/aliens_friends.png';

// ── LOTSO CHAT RESPONSES ─────────────────────────────────────────────────────

const lotsoBrain = [
  {
    keywords: ['hola', 'buenas', 'hey', 'saludo', 'hi'],
    responses: [
      "¡Bienvenido a Sunnyside, amiguito! 🌸 Yo soy Lotso, el director personal de tu bienestar. ¿En qué puedo ayudarte hoy?",
      "¡Qué alegría verte por aquí! 🧸 Sunnyside está siempre abierto para los curiosos. ¿Qué quieres explorar?",
    ]
  },
  {
    keywords: ['lubricante', 'lubricación', 'gel', 'aceite', 'resbaladizo'],
    responses: [
      "🍓 ¡Ah, los lubricantes! Igual que mi pelaje, todo funciona mejor cuando hay suavidad. Usa a base de agua para juguetes de silicona, y de silicona para momentos más largos. ¡Slinky me lo enseñó!",
      "🌸 Como decía en Sunnyside: ¡sin lubricante no hay aventura que dure! El de agua es el más versátil. ¡Nunca juegues sin él, soldado!",
    ]
  },
  {
    keywords: ['vibrador', 'bala', 'vibra', 'vibración', 'estimulación'],
    responses: [
      "🚀 ¡Las balas! Pequeñas como los Marcianitos pero con una potencia galáctica. Perfectas para principiantes. Empieza en el nivel 1 y deja que la magia haga su trabajo.",
      "💜 Los vibradores son mis favoritos del baúl de Andy. Precisos, discretos y emocionantes. ¡Como una misión secreta de Buzz Lightyear!",
    ]
  },
  {
    keywords: ['succionador', 'succión', 'aire', 'ondas'],
    responses: [
      "🌪️ ¡Tecnología de otro planeta! Los succionadores no tocan directamente, usan ondas de presión de aire. Empieza en el nivel más bajo, igual que cuando entramos por primera vez a Sunnyside. ¡Paciencia, amiguito!",
      "✨ Esos aparatos son pura magia espacial. Recuerda: nada de apresurarse. Incluso el Sargento dice que la táctica lo es todo.",
    ]
  },
  {
    keywords: ['pareja', 'dos', 'compartir', 'juntos', 'novio', 'novia', 'amor'],
    responses: [
      "🤝 ¡Hay un amigo en mí! Los juguetes en pareja son de mis favoritos. Un anillo vibrador o uno con control remoto pueden hacer que la aventura sea compartida. ¡Comunicación primero, diversión después!",
      "💕 Como Woody y Bo Peep... ¡el amor se construye con confianza y complicidad! En Sunnyside creemos que la diversión en pareja empieza hablando de lo que ambos quieren.",
    ]
  },
  {
    keywords: ['miedo', 'vergüenza', 'nervioso', 'primera vez', 'nunca', 'nuevo'],
    responses: [
      "🌸 ¡Todos fuimos nuevos algún día! Hasta yo llegué a Sunnyside sin saber qué esperar. Lo importante es ir a tu propio ritmo, sin presiones. La curiosidad nunca está de más.",
      "🧸 Rex también le tenía miedo a todo al principio, ¡y míralo ahora! La primera vez siempre es especial. Elige algo sencillo, infórmate bien, y ¡lánzate a la aventura!",
    ]
  },
  {
    keywords: ['limpiar', 'higiene', 'lavar', 'cuidado', 'mantenimiento'],
    responses: [
      "🧼 ¡Fundamental! En Sunnyside todo debe estar impecable. Lava tus juguetes con agua tibia y jabón neutro antes y después de usarlos. Algunos son 100% impermeables, ¡una maravilla!",
      "✨ La higiene es tan importante como la diversión misma. Guarda cada juguete en su funda o bolsa, lejos de la luz solar directa. ¡Cuídalos y ellos te cuidarán!",
    ]
  },
  {
    keywords: ['recomendación', 'recomienda', 'qué comprar', 'empezar', 'inicio', 'principiante'],
    responses: [
      "🌟 Para empezar te recomiendo una bala vibradora pequeña. Son fáciles de usar, discretas y muy efectivas. ¡Los Marcianitos siempre dicen: 'La garra elige el camino correcto!'",
      "🎁 Si es tu primera vez, ve a lo clásico: vibrador pequeño + lubricante a base de agua. No te compliques, amiguito. ¡Sunnyside tiene todo lo que necesitas en la Tienda!",
    ]
  },
  {
    keywords: ['precio', 'costo', 'cuánto', 'barato', 'económico', 'descuento'],
    responses: [
      "💰 ¡En el baúl de Andy hay para todos los bolsillos! Desde las opciones más accesibles hasta las premium. Visita nuestra tienda y filtra por precio. ¡Hamm el cerdito dice que no tienes que gastarte todos los ahorros!",
      "🐷 Como diría Hamm: 'Lo barato sale caro... pero tampoco tienes que arruinarte.' Tenemos opciones súper completas en todos los rangos. ¡Explora la tienda!",
    ]
  },
  {
    keywords: ['lotso', 'oso', 'fresa', 'sunnyside', 'quien eres', 'quién eres'],
    responses: [
      "🍓 ¡Soy Lotso, el oso de fresa más famoso de Sunnyside Daycare! Protagonista de Toy Story 3 (2010). Aunque en la película tuve mis momentos... oscuros 😅 aquí me redimí siendo tu guía del amor. ¡Huelo a fresas todo el día!",
      "🧸 ¡El mismo! Lotso-Huggin' Bear, director de Sunnyside y ahora tu consejero de bienestar. Toy Story 3 fue mi debut estelar. No me juzgues por mis decisiones del pasado... ¡he cambiado, de verdad!",
    ]
  },
  {
    keywords: ['toy story', 'película', 'woody', 'buzz', 'andy', 'pixar'],
    responses: [
      "🎬 ¡Clásicos del cine! Toy Story (1995) empezó todo, luego la 2 (1999) y mi gloriosa aparición en la 3 (2010). Y Forky en la 4 (2019)... ¡qué personaje tan peculiar! Pero lo más importante: aquí usamos toda esa magia para hablar de bienestar contigo.",
      "🌟 ¡Ah, el universo Pixar! Nada como Sunnyside para poner en contexto la educación sexual. Woody sería un vaquero de la confianza, Buzz de la exploración... ¡y yo de la suavidad y el cuidado! 🍓",
    ]
  },
  {
    keywords: ['gracias', 'genial', 'perfecto', 'excelente', 'bien', 'chevere', 'chévere'],
    responses: [
      "🌸 ¡De nada, amiguito! Eso es lo que hacemos en Sunnyside: ¡cuidarte! Si tienes más preguntas, aquí estaré. ¡Recuerda que la información es poder y el bienestar es lo primero! 🧸",
      "✨ ¡Me alegra haber ayudado! Como siempre digo: 'El amor huele a fresas.' Cualquier duda más, ¡ya sabes dónde encontrarme! 🍓",
    ]
  },
  {
    keywords: ['adiós', 'chao', 'bye', 'hasta luego', 'nos vemos'],
    responses: [
      "🌸 ¡Hasta pronto! Vuelve cuando quieras a Sunnyside. Las puertas siempre están abiertas para ti. ¡Y recuerda explorar la tienda! 🧸",
      "🍓 ¡Cuídate mucho! Eso sí, antes de irte, pásate por la Tienda... Hamm dice que hay ofertas hoy. ¡Chao, amiguito! ✨",
    ]
  },
];

const defaultResponses = [
  "🤔 Mmm... esa pregunta me tiene pensando. Soy experto en bienestar íntimo y Toy Story, ¡pero eso se me escapó! Intenta preguntarme sobre lubricantes, vibradores, higiene o los personajes de la peli.",
  "🌸 ¡Buena pregunta! Aunque no tengo respuesta específica para eso, puedo ayudarte con todo sobre juguetes para el bienestar, cuidado e higiene. ¿Qué quieres saber?",
  "🧸 ¡Como diría Rex: 'No tengo manos pequeñas, sino conocimiento limitado en ese tema!' Prueba preguntarme sobre productos, cuidado o la película.",
];

function getLotsoResponse(input) {
  const lower = input.toLowerCase();
  for (const entry of lotsoBrain) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.responses[Math.floor(Math.random() * entry.responses.length)];
    }
  }
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// ── DATA ────────────────────────────────────────────────────────────────────

const videoTutorials = [
  {
    id: 1,
    title: "Misión: Protección Estelar",
    character: "Buzz Lightyear",
    movie: "Toy Story (1995)",
    movieEmoji: "🚀",
    quote: "«¡Al infinito y más allá! Pero primero… protección.»",
    description: "Aprende paso a paso cómo colocar correctamente un preservativo para un viaje seguro al infinito.",
    thumbnail: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    videoUrl: "https://www.youtube.com/embed/3zOEnMF8F6Y",
    color: { bg: 'from-purple-600 to-blue-600', border: 'border-purple-400', badge: 'bg-purple-500', text: 'text-purple-600' }
  },
  {
    id: 2,
    title: "Combustible de Nave: Lubricantes",
    character: "Buzz & Rex",
    movie: "Toy Story 2 (1999)",
    movieEmoji: "🦖",
    quote: "«¡No puedo creerlo! ¡Hay combustible en base de agua Y silicona!»",
    description: "Todo fluye mejor con el lubricante adecuado. Descubre cuándo usar a base de agua o silicona.",
    thumbnail: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    videoUrl: "https://www.youtube.com/embed/lDKIiE-cG8Y",
    color: { bg: 'from-emerald-600 to-teal-600', border: 'border-emerald-400', badge: 'bg-emerald-500', text: 'text-emerald-600' }
  }
];

const myths = [
  {
    icon: "🚫",
    myth: "Hablar de sexo es vergonzoso",
    reality: "¡En el cuarto de Andy todo se habla! La sexualidad es natural y hermosa. Hablar abiertamente mejora tus relaciones, tu confianza y tu salud.",
    character: "Woody",
    movie: "Toy Story 3 (2010)",
    quote: "«¡Hay un amigo en mí… y hablar es el primer paso!»",
    color: "from-red-500 to-rose-600"
  },
  {
    icon: "🧩",
    myth: "Los juguetes son porque algo falta",
    reality: "¡Falso, soldado! Los juguetes no reemplazan a nadie, son como los accesorios de Buzz: están aquí para potenciar la diversión y explorar.",
    character: "Sargento",
    movie: "Toy Story (1995)",
    quote: "«¡Misión completada: ¡Mitos derribados!»",
    color: "from-green-500 to-emerald-600"
  }
];

const toyGuides = [
  {
    id: 1,
    title: "Vibradores y Balas",
    icon: "🚀",
    character: "Buzz Lightyear",
    movie: "Toy Story (1995)",
    description: "Perfectos para iniciar. Las balas son pequeñas, precisas y amigables. Como los Marcianitos: ¡siempre dispuestos a ayudar!",
    tip: "Usa lubricante a base de agua para mantener el material de tu juguete en perfectas condiciones.",
    color: { border: 'border-purple-400', bg: 'bg-purple-50', badge: 'bg-purple-500', icon: 'bg-purple-100', btn: 'from-purple-500 to-purple-600' },
    level: "Principiante", levelColor: "bg-green-500"
  },
  {
    id: 2,
    title: "Succionadores",
    icon: "🌪️",
    character: "Lotso",
    movie: "Toy Story 3 (2010)",
    description: "Una tecnología de otro planeta. Usan ondas de aire para estimular sin contacto directo. ¡Una sensación a velocidad luz!",
    tip: "Empieza en el nivel de intensidad más bajo, ¡el Comando Estelar recomienda ir de menos a más!",
    color: { border: 'border-pink-400', bg: 'bg-pink-50', badge: 'bg-pink-500', icon: 'bg-pink-100', btn: 'from-pink-500 to-pink-600' },
    level: "Intermedio", levelColor: "bg-amber-500"
  },
  {
    id: 3,
    title: "Juguetes en Pareja",
    icon: "🤝",
    character: "Woody & Jessie",
    movie: "Toy Story 2 (1999)",
    description: "¡Hay un amigo en mí! Diseñados para compartir la diversión: anillos vibradores, control remoto y más.",
    tip: "La comunicación es la mejor herramienta de su baúl. Hablen de lo que les gusta y lo que no.",
    color: { border: 'border-amber-400', bg: 'bg-amber-50', badge: 'bg-amber-500', icon: 'bg-amber-100', btn: 'from-amber-500 to-amber-600' },
    level: "Aventurero", levelColor: "bg-red-500"
  }
];

const movies = [
  { title: "Toy Story", year: "1995", emoji: "🤠", color: "from-yellow-400 to-amber-500", desc: "El inicio de la aventura" },
  { title: "Toy Story 2", year: "1999", emoji: "🚀", color: "from-purple-500 to-indigo-600", desc: "Rescate estelar" },
  { title: "Toy Story 3", year: "2010", emoji: "🧸", color: "from-pink-500 to-rose-600", desc: "Sunnyside Daycare" },
  { title: "Toy Story 4", year: "2019", emoji: "🪢", color: "from-teal-400 to-cyan-600", desc: "Un nuevo camino" },
];

// ── LOTSO CHAT COMPONENT ─────────────────────────────────────────────────────

function LotsoChat({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'lotso',
      text: "¡Bienvenido a Sunnyside! 🌸 Soy Lotso, tu guía de bienestar personal. Pregúntame lo que quieras sobre juguetes, cuidado, higiene o cualquier duda. ¡Aquí no hay preguntas malas, amiguito! 🧸",
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    "¿Cómo empiezo?",
    "¿Qué lubricante usar?",
    "¿Quién eres?",
    "Tengo miedo 😅",
    "¿Cómo limpiarlos?",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: msg,
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Lotso "thinks" for a bit
    const delay = 900 + Math.random() * 800;
    setTimeout(() => {
      const response = getLotsoResponse(msg);
      const lotsoMsg = {
        id: Date.now() + 1,
        from: 'lotso',
        text: response,
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      };
      setIsTyping(false);
      setMessages(prev => [...prev, lotsoMsg]);
      // mini confetti on lotso reply
      const pieces = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 30,
        color: ['#ff0080','#ffd700','#a855f7','#22c55e','#00e5ff'][i % 5],
        delay: Math.random() * 0.3,
        size: 5 + Math.random() * 5,
      }));
      setConfetti(pieces);
      setTimeout(() => setConfetti([]), 2000);
    }, delay);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* confetti */}
      {confetti.map(p => (
        <div key={p.id} className="fixed z-[999] pointer-events-none rounded-full"
          style={{ left: `${p.x}%`, top: '60%', width: p.size, height: p.size, background: p.color,
            animation: `confettiFall 1.5s ease-out ${p.delay}s forwards` }} />
      ))}

      <div className="w-full sm:max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_-20px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-4 border-pink-400 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-400"
        style={{ maxHeight: '90vh', height: '620px' }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 p-4 flex items-center gap-4 shrink-0">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-pink-200 border-3 border-white shadow-lg flex items-center justify-center overflow-hidden">
              <img src={LotsoImg} alt="Lotso" className="w-12 h-12 object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-black text-base uppercase tracking-tight">Lotso 🧸</h3>
            <p className="text-pink-200 text-xs font-medium">Director de Sunnyside • En línea</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[10px] font-black border border-white/30">
              🍓 TS3
            </div>
            <button onClick={onClose}
              className="w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-lg transition-all hover:scale-110">
              ✕
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-pink-50 to-fuchsia-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {/* Avatar */}
              {msg.from === 'lotso' ? (
                <div className="w-9 h-9 rounded-full bg-pink-200 border-2 border-pink-400 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                  <img src={LotsoImg} alt="Lotso" className="w-8 h-8 object-contain" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white text-sm font-black">Tú</span>
                </div>
              )}
              <div className={`max-w-[75%] flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed font-medium ${
                  msg.from === 'lotso'
                    ? 'bg-white text-slate-800 rounded-tl-sm border border-pink-100'
                    : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <div className="w-9 h-9 rounded-full bg-pink-200 border-2 border-pink-400 flex items-center justify-center overflow-hidden shrink-0">
                <img src={LotsoImg} alt="Lotso" className="w-8 h-8 object-contain" />
              </div>
              <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-pink-100 shadow-sm flex items-center gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-4 py-2 bg-pink-50 border-t border-pink-100 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
          {quickQuestions.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              className="shrink-0 text-xs font-bold bg-white text-fuchsia-700 border-2 border-fuchsia-200 px-3 py-1.5 rounded-full hover:bg-fuchsia-50 hover:border-fuchsia-400 transition-all whitespace-nowrap shadow-sm">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t-2 border-pink-100 shrink-0">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-pink-50 rounded-2xl border-2 border-pink-200 focus-within:border-fuchsia-400 transition-colors overflow-hidden">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Escríbele a Lotso... 🍓"
                rows={1}
                className="w-full bg-transparent px-4 py-3 text-sm text-slate-800 placeholder-pink-300 font-medium resize-none outline-none leading-relaxed"
                style={{ maxHeight: '80px' }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="w-12 h-12 bg-gradient-to-br from-pink-500 to-fuchsia-600 disabled:from-pink-300 disabled:to-pink-300 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all shrink-0 border-2 border-white"
            >
              <svg className="w-5 h-5 text-white translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-pink-300 font-medium mt-2">
            🌸 Lotso responde con toda la magia de Sunnyside
          </p>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function Guia() {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);
  const [flippedMyths, setFlippedMyths] = useState({});
  const [hoveredToy, setHoveredToy] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [activePill, setActivePill] = useState(null);
  const [confetti, setConfetti] = useState([]);

  const triggerConfetti = () => {
    const pieces = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#ff0080','#ffd700','#00e5ff','#a855f7','#22c55e'][i % 5],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 2500);
  };

  const openChat = () => {
    triggerConfetti();
    setTimeout(() => setShowChat(true), 300);
  };

  const toggleMyth = (id) => {
    setFlippedMyths(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <RoomWrapper theme="lotso" showFooter={true}>

      {/* ── CONFETTI ─────────────────────────────────── */}
      {confetti.map(p => (
        <div key={p.id} className="fixed z-[999] pointer-events-none rounded-full"
          style={{ left: `${p.x}%`, top: '-20px', width: p.size, height: p.size, background: p.color,
            animation: `confettiFall 1.8s ease-in ${p.delay}s forwards` }} />
      ))}

      {/* ── LOTSO CHAT MODAL ─────────────────────────── */}
      {showChat && <LotsoChat onClose={() => setShowChat(false)} />}

      <div className="px-4 md:px-8 lg:px-12 pt-6 pb-24 relative z-10 max-w-6xl mx-auto font-sans">

        {/* ══ HERO ══════════════════════════════════════ */}
        <section className="text-center mb-16 mt-8 relative">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-fuchsia-500 rounded-[2rem] blur-xl opacity-60 animate-pulse" />
            <div className="relative bg-gradient-to-br from-yellow-300 via-amber-200 to-pink-200 rounded-[2rem] px-8 py-4 border-4 border-amber-400 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-[4px] text-amber-800">Sunnyside Daycare • Guía Oficial</span>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight"
                style={{ background: 'linear-gradient(135deg, #be185d, #7c3aed, #db2777)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                Guía de<br />Exploración
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {movies.map((m, i) => (
              <button key={i} onClick={() => setActivePill(activePill === i ? null : i)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all duration-300 ${
                  activePill === i
                    ? `bg-gradient-to-r ${m.color} text-white border-white scale-110 shadow-lg`
                    : 'bg-white/20 text-white border-white/40 hover:bg-white/30'
                }`}>
                {m.emoji} {m.title} <span className="opacity-70">({m.year})</span>
              </button>
            ))}
          </div>

          {activePill !== null && (
            <div className={`mx-auto max-w-md bg-gradient-to-r ${movies[activePill].color} text-white rounded-2xl px-6 py-4 shadow-xl border-4 border-white/40 mb-6 animate-in zoom-in duration-300`}>
              <p className="font-black text-lg">{movies[activePill].emoji} {movies[activePill].title} ({movies[activePill].year})</p>
              <p className="text-sm opacity-90 font-medium">{movies[activePill].desc}</p>
            </div>
          )}

          <p className="text-lg md:text-xl text-white font-semibold max-w-3xl mx-auto leading-relaxed bg-fuchsia-900/50 backdrop-blur-sm px-8 py-6 rounded-3xl border-2 border-fuchsia-300/40 shadow-xl">
            Bienvenido al Comando del Amor. Aquí hablamos sin tabúes, porque conocerte a ti mismo y cuidar de tu bienestar
            es la misión más dulce de la galaxia. 💖🚀
          </p>
        </section>

        {/* ══ LOTSO INTERACTIVO ══════════════════════════ */}
        <section className="mb-16">
          <div className="relative bg-gradient-to-br from-pink-600 via-fuchsia-700 to-purple-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-pink-300/60 overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Lotso clickeable */}
              <div className="relative shrink-0 group cursor-pointer" onClick={openChat}>
                <div className="absolute -inset-4 bg-pink-400/30 rounded-full blur-2xl group-hover:bg-pink-300/60 transition-all duration-500" />
                <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-pink-200 to-pink-400 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img src={LotsoImg} alt="Lotso" className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-2xl" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full border-2 border-yellow-600 shadow-lg whitespace-nowrap">
                  🌸 Director Sunnyside
                </div>
                <div className="absolute -top-2 -right-2 text-2xl animate-spin" style={{ animationDuration: '3s' }}>⭐</div>
                <div className="absolute -top-4 left-4 text-lg animate-bounce" style={{ animationDelay: '0.5s' }}>🍓</div>
                {/* Indicador "Chat" */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-400 text-green-900 text-[9px] font-black px-3 py-1 rounded-full border-2 border-green-600 flex items-center gap-1 shadow-md whitespace-nowrap group-hover:bg-green-300 transition-colors">
                  <div className="w-1.5 h-1.5 bg-green-700 rounded-full animate-pulse" />
                  En línea • Chatea conmigo
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                  <span className="text-xs font-black uppercase tracking-[3px] text-pink-200">Personaje Principal</span>
                  <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">Toy Story 3 (2010)</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-3 uppercase">
                  Lotso, tu<br />
                  <span className="text-yellow-300">Guía de Hoy</span> 🧸
                </h2>
                <p className="text-pink-100 font-medium text-base md:text-lg leading-relaxed mb-6 max-w-lg">
                  El oso de fresa más famoso de Sunnyside está listo para responder todas tus preguntas.
                  ¡Abre el chat y pregúntale lo que quieras!
                </p>

                <button onClick={openChat}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-black text-base uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-yellow-200 flex items-center gap-3 mx-auto md:mx-0">
                  <span className="text-2xl">💬</span>
                  <span>¡Chatear con Lotso!</span>
                  <span className="bg-amber-700/30 text-[11px] px-2 py-1 rounded-full">Nuevo ✨</span>
                </button>

                {/* Sugerencias rápidas */}
                <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                  {["¿Cómo empiezo?", "¿Qué lubricante usar?", "Tengo dudas 😅"].map((q, i) => (
                    <button key={i} onClick={() => { triggerConfetti(); setTimeout(() => setShowChat(true), 300); }}
                      className="text-xs font-bold bg-white/20 text-white border border-white/30 px-3 py-1.5 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ MITOS — FLIP 3D ══════════════════════════ */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-white/40 mb-4">
              <span>✨</span><span className="text-xs font-black uppercase tracking-[3px] text-white">Sección 1</span><span>✨</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-3" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              ¡Despidamos los Mitos!
            </h2>
            <p className="text-pink-100 font-medium max-w-xl mx-auto">Haz clic en cada tarjeta para revelar la verdad… ¡al estilo Toy Story!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {myths.map((myth, idx) => (
              <div key={idx} className="relative h-80 cursor-pointer group" style={{ perspective: '1000px' }}
                onClick={() => toggleMyth(idx)}>
                <div className="relative w-full h-full transition-all duration-700"
                  style={{ transformStyle: 'preserve-3d', transform: flippedMyths[idx] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-fuchsia-400" style={{ backfaceVisibility: 'hidden' }}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${myth.color}`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
                      <div className="text-6xl mb-4">{myth.icon}</div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-white/30">🎬 {myth.movie}</div>
                      <h3 className="text-2xl font-black uppercase mb-2">Mito:</h3>
                      <p className="text-lg font-bold opacity-90">"{myth.myth}"</p>
                      <div className="mt-6 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/30 group-hover:bg-white/30 transition-all">
                        <span className="text-lg">🔄</span>
                        <span className="text-xs font-black uppercase tracking-wider">¡Voltear para la verdad!</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-emerald-400 bg-[#f0fdf4]"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <div className="text-5xl mb-3">💡</div>
                      <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">✅ Realidad</div>
                      <p className="text-emerald-900 font-bold text-base leading-relaxed mb-4">{myth.reality}</p>
                      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-4 py-3 max-w-xs">
                        <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-1">🎭 {myth.character} dice:</p>
                        <p className="text-emerald-800 text-xs italic font-medium">{myth.quote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ VIDEOS ══════════════════════════════════ */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-white/40 mb-4">
              <span>💖</span><span className="text-xs font-black uppercase tracking-[3px] text-white">Sección 2</span><span>🚀</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-3" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              Academia Estelar del Amor
            </h2>
            <p className="text-pink-100 font-medium max-w-xl mx-auto">Instrucciones visuales para que todas tus misiones sean 100% seguras, cómodas y placenteras.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {videoTutorials.map((video) => (
              <div key={video.id}
                className={`group relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-4 ${video.color.border} hover:-translate-y-3 transition-all duration-500 cursor-pointer`}
                onClick={() => setActiveVideo(video)}>
                <div className={`bg-gradient-to-r ${video.color.bg} p-4 flex items-center gap-3`}>
                  <span className="text-3xl">{video.movieEmoji}</span>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-wider">{video.character}</p>
                    <p className="text-white/70 text-xs font-bold">{video.movie}</p>
                  </div>
                  <div className="ml-auto bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider border border-white/30">🎬 Tutorial</div>
                </div>
                <div className="h-56 bg-slate-900 relative overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${video.color.bg} rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 border-4 border-white`}>
                      <svg className="w-10 h-10 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <span className="mt-3 text-white font-black uppercase tracking-widest text-sm bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">Ver Tutorial</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${video.color.text}`}>{video.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{video.description}</p>
                  <div className={`rounded-2xl p-4 border-l-4 ${video.color.border} bg-slate-50`}>
                    <p className={`text-xs font-black uppercase tracking-wider ${video.color.text} mb-1`}>{video.character}:</p>
                    <p className="text-slate-700 text-xs italic font-medium leading-relaxed">{video.quote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ BAÚL DE JUGUETES ════════════════════════ */}
        <section className="mb-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-white/40 mb-4">
              <span>🧸</span><span className="text-xs font-black uppercase tracking-[3px] text-white">Sección 3</span><span>🎁</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-3" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              El Baúl de Juguetes
            </h2>
            <p className="text-pink-100 font-medium max-w-xl mx-auto">Pasa el cursor sobre cada juguete para ver el consejo de su personaje.</p>
          </div>

          <div className="relative mb-8 overflow-hidden rounded-3xl">
            <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 p-5 flex items-center gap-6 border-2 border-purple-500/40">
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <img src={BuzzImg} alt="Buzz" className="w-14 h-14 object-contain drop-shadow-lg" />
                <img src={JessyImg} alt="Jessy" className="w-14 h-14 object-contain drop-shadow-lg -ml-3" />
                <img src={AliensImg} alt="Aliens" className="w-14 h-14 object-contain drop-shadow-lg -ml-3" />
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-wider">🎬 Toda la pandilla de Andy te recomienda</p>
                <p className="text-purple-300 text-xs font-medium mt-0.5">Toy Story 1, 2, 3 y 4 • ¡Para todos los niveles!</p>
              </div>
              <div className="ml-auto flex gap-2 flex-wrap">
                {['🤠 Principiante', '🚀 Intermedio', '⭐ Aventurero'].map((l, i) => (
                  <span key={i} className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-white px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">{l}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {toyGuides.map((guide) => (
              <div key={guide.id}
                className={`relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-4 ${guide.color.border} transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] group`}
                onMouseEnter={() => setHoveredToy(guide.id)}
                onMouseLeave={() => setHoveredToy(null)}>
                <div className={`absolute top-4 right-4 z-10 ${guide.levelColor} text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg`}>
                  {guide.level}
                </div>
                <div className={`${guide.color.bg} p-5 border-b-4 ${guide.color.border} relative overflow-hidden`}>
                  <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`w-14 h-14 ${guide.color.icon} rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 ${guide.color.border}`}>{guide.icon}</div>
                    <div>
                      <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{guide.title}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-600">🎭 {guide.character}</span>
                        <span className="text-slate-400 text-[9px]">•</span>
                        <span className="text-slate-500 text-[10px] font-bold">{guide.movie}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{guide.description}</p>
                  <div className={`relative ${guide.color.bg} rounded-2xl p-5 border-2 ${guide.color.border}`}>
                    <div className={`absolute -top-5 left-6 ${guide.color.badge} text-white text-xl w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md`}>💡</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-center mt-3 mb-2 text-slate-500">Consejo de {guide.character}:</p>
                    <p className="text-sm text-slate-700 font-medium text-center italic leading-relaxed">"{guide.tip}"</p>
                  </div>
                </div>
                <div className={`px-6 pb-6 transition-all duration-300 ${hoveredToy === guide.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <button onClick={() => navigate('/tienda')}
                    className={`w-full py-3 bg-gradient-to-r ${guide.color.btn} text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2`}>
                    <span>🛒</span><span>Ver en el Baúl</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA FINAL ════════════════════════════════ */}
        <section className="text-center">
          <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 rounded-[3rem] p-10 md:p-16 shadow-2xl border-4 border-purple-400/60 overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
            <div className="relative z-10">
              <div className="flex justify-center gap-4 mb-6">
                <img src={BuzzImg} alt="Buzz" className="w-16 h-16 object-contain drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer" />
                <img src={JessyImg} alt="Jessy" className="w-16 h-16 object-contain drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                ¿Listo para la Aventura?
              </h2>
              <p className="text-purple-200 font-medium text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                El baúl de Andy está repleto de juguetes esperando ser descubiertos. ¡Empieza tu misión ahora!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate('/tienda')}
                  className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-black text-base uppercase tracking-wider rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-yellow-200 flex items-center justify-center gap-3">
                  <span className="text-xl">🎁</span><span>Ir a la Tienda</span>
                </button>
                <button onClick={openChat}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-pink-300 flex items-center justify-center gap-2">
                  <span>💬</span><span>Chatear con Lotso</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setActiveVideo(null)}>
          <div className={`bg-white rounded-[2.5rem] w-full max-w-5xl relative shadow-[0_0_100px_rgba(0,0,0,0.5)] border-4 ${activeVideo.color.border} animate-in zoom-in-95 duration-300 overflow-hidden`}
            onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-r ${activeVideo.color.bg} p-5 flex items-center gap-4`}>
              <span className="text-3xl">{activeVideo.movieEmoji}</span>
              <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight">{activeVideo.title}</h3>
                <p className="text-white/70 text-xs font-bold">{activeVideo.character} • {activeVideo.movie}</p>
              </div>
              <button onClick={() => setActiveVideo(null)}
                className="ml-auto w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white font-black text-xl transition-all hover:scale-110 border-2 border-white/30">✕</button>
            </div>
            <div className="aspect-video bg-black relative">
              <iframe width="100%" height="100%" src={activeVideo.videoUrl} title={activeVideo.title}
                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen className="absolute inset-0" />
            </div>
            <div className="p-5 bg-slate-50 border-t-4 border-slate-100">
              <p className={`text-xs font-black uppercase tracking-wider ${activeVideo.color.text} mb-1`}>{activeVideo.character} dice:</p>
              <p className="text-slate-700 text-sm italic font-medium">{activeVideo.quote}</p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </RoomWrapper>
  );
}