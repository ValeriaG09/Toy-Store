import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomWrapper from '../components/RoomWrapper';
import WoodyBuzzImg from '../assets/woody_buzz_nobg.png';
import JessyImg from '../assets/jessy_heart.png';

export default function Vestier() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isNotified, setIsNotified] = useState(false);
  const [sargeMessage, setSargeMessage] = useState('');
  const [sargeAnim, setSargeAnim] = useState(false);
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' | 'sneakpeek'

  useEffect(() => {
    const saved = localStorage.getItem('vestier_notified_toy');
    if (saved) setIsNotified(true);
  }, []);

  const handleNotify = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    localStorage.setItem('vestier_notified_toy', email);
    setIsNotified(true);
  };

  const sargeQuotes = [
    "«¡Atención tropa! Buzz está calibrando el láser probador. ¡Nadie se mueva!»",
    "«¡Por todos los cielos! ¡Rex casi tira la cinta métrica con la cola! ¡Soldados, al rescate!»",
    "«¡Misión prioritaria: El vestidor debe quedar más reluciente que la insignia de Woody!»",
    "«¡Slinky está probando la elasticidad de los corsets vaqueros! ¡Todo bajo control!»",
    "«¡Hamm ya tiene listos los cupones de descuento para el día de la inauguración!»"
  ];

  const triggerSargeQuote = () => {
    const random = sargeQuotes[Math.floor(Math.random() * sargeQuotes.length)];
    setSargeMessage(random);
    setSargeAnim(true);
    setTimeout(() => setSargeAnim(false), 600);
  };

  return (
    <RoomWrapper theme="andy" showFooter={true}>
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-20 relative z-10 flex flex-col items-center justify-center">

        {/* 🚧 CINTA DE PRECAUCIÓN SUPERIOR ANIMADA 🚧 */}
        <div className="w-full max-w-5xl mb-8 relative overflow-hidden rounded-2xl shadow-xl border-4 border-amber-950/20 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
          <div 
            className="py-3 px-4 font-black text-xs sm:text-sm md:text-base tracking-widest text-slate-900 uppercase flex items-center gap-6 whitespace-nowrap select-none"
            style={{
              background: 'repeating-linear-gradient(45deg, #FACC15, #FACC15 25px, #1E293B 25px, #1E293B 50px)',
              color: '#FACC15'
            }}
          >
            <div className="flex gap-8 items-center animate-marquee font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span>🚧 ¡ALTO AHÍ, VAQUERO!</span>
              <span>⚠️ PROBADOR EN MANTENIMIENTO</span>
              <span>🪖 SARGENTO EN OPERACIÓN ESPECIAL</span>
              <span>✨ VESTIDOR VIRTUAL IA EN CONSTRUCCIÓN</span>
              <span>🤠 JUGUETES TRABAJANDO</span>
              <span>🚧 ¡ALTO AHÍ, VAQUERO!</span>
              <span>⚠️ PROBADOR EN MANTENIMIENTO</span>
              <span>🪖 SARGENTO EN OPERACIÓN ESPECIAL</span>
              <span>✨ VESTIDOR VIRTUAL IA EN CONSTRUCCIÓN</span>
              <span>🤠 JUGUETES TRABAJANDO</span>
            </div>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: Cartel de Madera / Diorama de Obra */}
        <div className="w-full max-w-4xl relative">
          
          {/* CUERDAS QUE SOSTIENEN EL CARTEL (Efecto Colgante 3D) */}
          <div className="hidden md:flex justify-between px-16 absolute -top-12 left-0 right-0 z-20 pointer-events-none">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 via-gray-200 to-gray-600 border-2 border-gray-700 shadow-md"></div>
              <div className="w-2 h-14 bg-gradient-to-b from-[#8B5A2B] via-[#CD853F] to-[#8B5A2B] shadow-sm"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 via-gray-200 to-gray-600 border-2 border-gray-700 shadow-md"></div>
              <div className="w-2 h-14 bg-gradient-to-b from-[#8B5A2B] via-[#CD853F] to-[#8B5A2B] shadow-sm"></div>
            </div>
          </div>

          {/* TABLÓN DE MADERA PRINCIPAL */}
          <div className="bg-[#FFFDF7] rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.25)] border-[8px] sm:border-[12px] border-[#D97706] relative overflow-hidden">
            
            {/* Esquinas con tornillos/remaches dorados de juguete */}
            <div className="absolute top-4 left-4 w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-800 shadow-inner flex items-center justify-center">
              <div className="w-3 h-0.5 bg-amber-900 rotate-45"></div>
            </div>
            <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-800 shadow-inner flex items-center justify-center">
              <div className="w-3 h-0.5 bg-amber-900 -rotate-45"></div>
            </div>
            <div className="absolute bottom-4 left-4 w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-800 shadow-inner flex items-center justify-center">
              <div className="w-3 h-0.5 bg-amber-900 -rotate-12"></div>
            </div>
            <div className="absolute bottom-4 right-4 w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-800 shadow-inner flex items-center justify-center">
              <div className="w-3 h-0.5 bg-amber-900 rotate-75"></div>
            </div>

            {/* MARCA DE AGUA TOY STORY SUTIL EN EL FONDO */}
            <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none select-none">
              <svg className="w-96 h-96 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>

            {/* CABECERA CON CUBOS DE LETRAS 'VESTIER' */}
            <div className="flex flex-col items-center text-center relative z-10 mb-6 sm:mb-8">
              
              {/* Cubitos de juguete de colores */}
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 mb-4">
                {[
                  { l: 'V', bg: 'bg-[#E52521]', shadow: 'border-[#991B1B]' },
                  { l: 'E', bg: 'bg-[#2563EB]', shadow: 'border-[#1E40AF]' },
                  { l: 'S', bg: 'bg-[#F59E0B]', shadow: 'border-[#B45309]' },
                  { l: 'T', bg: 'bg-[#10B981]', shadow: 'border-[#065F46]' },
                  { l: 'I', bg: 'bg-[#8B5CF6]', shadow: 'border-[#5B21B6]' },
                  { l: 'E', bg: 'bg-[#EC4899]', shadow: 'border-[#9D174D]' },
                  { l: 'R', bg: 'bg-[#06B6D4]', shadow: 'border-[#0E7490]' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`w-9 h-9 sm:w-12 sm:h-12 ${item.bg} rounded-xl border-b-4 ${item.shadow} shadow-lg flex items-center justify-center transform transition-transform hover:-translate-y-2 hover:rotate-6 cursor-pointer select-none`}
                    style={{
                      transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * (idx * 2.5)}deg)`
                    }}
                  >
                    <span className="font-black text-lg sm:text-2xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
                      {item.l}
                    </span>
                  </div>
                ))}
              </div>

              {/* TÍTULO PRINCIPAL ESTILO TOY STORY */}
              <div className="inline-block bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-transparent bg-clip-text">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-[1000] uppercase tracking-tight italic drop-shadow-sm">
                  ¡Zona En Remodelación!
                </h1>
              </div>

              <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 font-extrabold text-xs sm:text-sm tracking-wide shadow-inner">
                <span className="animate-spin text-base">⚙️</span>
                <span>OPERACIÓN SECRETA DEL CUARTEL GENERAL</span>
                <span className="animate-pulse">✨</span>
              </div>

              <p className="mt-4 text-slate-700 font-medium text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                ¡Alto ahí, vaquero! El <span className="font-bold text-red-600">Vestier Virtual con Inteligencia Artificial</span> está recibiendo una actualización intergaláctica.
                Nuestros juguetes están midiendo telas, afinando espejos mágicos y probando outfits para que te queden perfectos.
              </p>
            </div>

            {/* SECCIÓN CENTRAL: PERSONAJES Y ESTADO DE LA OBRA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10 mb-8">
              
              {/* LADO IZQUIERDO: ILUSTRACIÓN DE JUGUETES TRABAJANDO (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                
                <div className="relative group">
                  {/* Círculo de fondo con efecto diorama */}
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 border-4 border-white shadow-2xl flex items-center justify-center relative overflow-hidden">
                    
                    {/* Nubes dentro del círculo */}
                    <div className="absolute top-4 left-6 w-16 h-6 bg-white rounded-full opacity-80 animate-float"></div>
                    <div className="absolute top-12 right-6 w-20 h-7 bg-white rounded-full opacity-60"></div>
                    
                    {/* Silueta de cinta de construcción */}
                    <div className="absolute bottom-4 left-0 right-0 h-8 bg-amber-400/80 -rotate-6 flex items-center justify-center font-black text-[9px] text-black tracking-widest uppercase border-y-2 border-black/20">
                      ZONA DE CONSTRUCCIÓN
                    </div>

                    {/* Imagen de Soldaditos de Toy Story */}
                    <img 
                      src="/images/soldiers.png" 
                      alt="Soldaditos en misión" 
                      className={`w-44 sm:w-52 h-auto object-contain drop-shadow-2xl z-10 transition-transform duration-300 ${sargeAnim ? 'scale-110 -rotate-3' : 'group-hover:scale-105'}`}
                      onError={(e) => {
                        // Fallback elegante si no carga la imagen de soldados
                        e.target.style.display = 'none';
                      }}
                    />

                    {/* Sticker Woody/Buzz flotando como respaldo */}
                    <img 
                      src={WoodyBuzzImg} 
                      alt="Woody y Buzz" 
                      className="absolute -bottom-4 right-0 w-24 h-auto object-contain opacity-90 drop-shadow-lg z-20 pointer-events-none" 
                    />
                  </div>

                  {/* Cono de Tráfico de Juguete en 3D (SVG Puro) */}
                  <div className="absolute -bottom-3 -left-2 w-14 h-14 drop-shadow-xl animate-bounce">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Base cuadrada */}
                      <path d="M10,85 L90,85 L80,95 L20,95 Z" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
                      {/* Cono naranja */}
                      <polygon points="50,10 25,85 75,85" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
                      {/* Franja blanca reflectiva */}
                      <polygon points="50,35 38,60 62,60" fill="#FFFFFF" opacity="0.9" />
                      <polygon points="50,50 34,70 66,70" fill="#FFFFFF" opacity="0.9" />
                    </svg>
                  </div>

                  {/* Estrella de Sheriff flotante */}
                  <div className="absolute -top-3 -right-2 w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-100 border-2 border-amber-600 shadow-lg flex items-center justify-center transform rotate-12 hover:rotate-45 transition-transform cursor-pointer">
                    <span className="text-amber-900 font-black text-xs">SHERIFF</span>
                  </div>
                </div>

                {/* Botón interactivo: Preguntar al Sargento */}
                <button
                  type="button"
                  onClick={triggerSargeQuote}
                  className="mt-5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 border-2 border-emerald-400"
                >
                  <span>🪖</span>
                  <span>Reporte del Sargento</span>
                  <span className="bg-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full">¡Clic!</span>
                </button>

                {/* Globo de diálogo del Sargento */}
                {sargeMessage && (
                  <div className="mt-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 shadow-md max-w-xs text-center animate-in fade-in zoom-in duration-300">
                    <p className="text-emerald-900 font-bold text-xs italic">
                      {sargeMessage}
                    </p>
                  </div>
                )}

              </div>

              {/* LADO DERECHO: LA CARPETA DE NOTAS DE ANDY (7 cols) */}
              <div className="lg:col-span-7">
                
                {/* CLIPBOARD / CARPETA CON HOJA DE CUADERNO */}
                <div className="bg-[#FEFCE8] rounded-3xl p-5 sm:p-6 border-4 border-[#CA8A04] shadow-xl relative overflow-hidden">
                  
                  {/* Pinza dorada superior de la carpeta */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-7 bg-gradient-to-b from-gray-200 via-gray-400 to-gray-600 rounded-b-xl border-2 border-gray-700 shadow-md flex items-center justify-center">
                    <div className="w-12 h-2 bg-gray-800 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📋</span>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-amber-950 uppercase tracking-tight">
                          Bitácora de Remodelación
                        </h3>
                        <p className="text-[11px] font-bold text-amber-700">Responsable: Andy & la Pandilla</p>
                      </div>
                    </div>

                    <span className="text-xs font-black bg-amber-500 text-white px-2.5 py-1 rounded-full uppercase shadow-sm">
                      Paso 4 de 5
                    </span>
                  </div>

                  {/* LISTA DE CHECKS DE LOS JUGUETES */}
                  <div className="flex flex-col gap-3">
                    
                    <div className="flex items-start gap-3 bg-white/80 p-2.5 rounded-xl border border-amber-100 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-xs sm:text-sm text-slate-800">
                            🧵 Atuendos de Jessie & Vaquero
                          </h4>
                          <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            100% Listo
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">Bordados vaqueros cosidos y planchados con almidón de juguete.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/80 p-2.5 rounded-xl border border-amber-100 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow animate-pulse">
                        ⚡
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-xs sm:text-sm text-slate-800">
                            🚀 Espejo Probador Láser de Buzz
                          </h4>
                          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            88% Calibrando
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">Alineando sensores cuánticos para proyectar la prenda en tu silueta.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/80 p-2.5 rounded-xl border border-amber-100 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow">
                        🦖
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-xs sm:text-sm text-slate-800">
                            🦖 Maniobras de Rex en el Perchero
                          </h4>
                          <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Con Cuidado
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">Sosteniendo los ganchos de ropa sin tropezarse con su cola.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/80 p-2.5 rounded-xl border border-amber-100 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow">
                        ✨
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-xs sm:text-sm text-slate-800">
                            🪞 Gran Reapertura con Sorpresas
                          </h4>
                          <span className="text-[10px] font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                            Próximamente
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">Descuentos exclusivos del baúl y regalos para los primeros en probarse.</p>
                      </div>
                    </div>

                  </div>

                  {/* BARRA DE PROGRESO DE LA MISIÓN */}
                  <div className="mt-5 pt-4 border-t-2 border-dashed border-amber-200">
                    <div className="flex justify-between items-center text-xs font-black text-amber-950 mb-1.5">
                      <span className="flex items-center gap-1">
                        <span>🔋</span> Progreso de Remodelación
                      </span>
                      <span className="text-red-600 font-extrabold text-sm">88%</span>
                    </div>

                    <div className="w-full h-4 bg-amber-200 rounded-full overflow-hidden p-0.5 border border-amber-300 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-lime-500 rounded-full shadow-md transition-all duration-1000 relative overflow-hidden"
                        style={{ width: '88%' }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* CAJA INTERACTIVA: NOTIFICACIÓN DE APERTURA */}
            <div className="relative z-10 bg-gradient-to-br from-amber-500 via-red-500 to-amber-600 p-6 sm:p-8 rounded-3xl shadow-xl text-white border-4 border-amber-200">
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                    <span>💌</span> Libreta Secreta de Andy
                  </div>
                  <h3 className="text-xl sm:text-2xl font-[1000] uppercase tracking-tight">
                    ¿Quieres ser el primero en probarte los trajes?
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-100 font-medium mt-1 max-w-lg">
                    Déjanos tu correo y te enviaremos una contraseña secreta cuando el vestidor abra sus puertas con un 15% de descuento especial.
                  </p>
                </div>

                <div className="w-full md:w-auto shrink-0">
                  {isNotified ? (
                    <div className="bg-white text-slate-900 px-6 py-4 rounded-2xl shadow-lg border-2 border-amber-300 flex items-center gap-3 animate-in zoom-in">
                      <span className="text-3xl">🤠</span>
                      <div>
                        <h4 className="font-black text-sm uppercase text-green-700">¡Yee-Haw! ¡Anotado en la lista!</h4>
                        <p className="text-xs text-slate-600 font-semibold">Te avisaremos apenas el sargento dé la orden de apertura.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu-correo@ejemplo.com"
                        className="px-4 py-3 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm font-bold border-2 border-white focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-md flex-1"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-slate-900 font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg border-2 border-yellow-200 transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
                      >
                        <span>⭐</span>
                        <span>¡Avisarme!</span>
                      </button>
                    </form>
                  )}
                </div>

              </div>

            </div>

            {/* BOTONES DE NAVEGACIÓN Y ACCIÓN INMEDIATA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              
              <button
                type="button"
                onClick={() => navigate('/tienda')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-[1000] text-base uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-red-400 flex items-center justify-center gap-3"
              >
                <span>🎁</span>
                <span>Explorar el Baúl de Juguetes (Tienda)</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-800 font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-slate-300 flex items-center justify-center gap-2"
              >
                <span>🏠</span>
                <span>Volver a la Habitación</span>
              </button>

            </div>

          </div>

        </div>

        {/* CINTA DE PRECAUCIÓN INFERIOR */}
        <div className="w-full max-w-3xl mt-8 opacity-75">
          <div 
            className="py-2 px-4 rounded-xl text-[11px] font-black tracking-widest text-slate-900 uppercase flex items-center justify-center gap-4 text-center shadow-md select-none"
            style={{
              background: 'repeating-linear-gradient(-45deg, #FACC15, #FACC15 15px, #0F172A 15px, #0F172A 30px)',
              color: '#FACC15'
            }}
          >
            <span className="bg-slate-900/90 px-4 py-1 rounded-md">
              🛠️ PROPIEDAD DE ANDY • VESTIER VIRTUAL 2.0 EN PREPARACIÓN • HASTA EL INFINITO Y MÁS ALLÁ 🚀
            </span>
          </div>
        </div>

      </div>

      {/* ESTILOS DE ANIMACIÓN MARQUEE Y DETALLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }
      `}} />

    </RoomWrapper>
  );
}
