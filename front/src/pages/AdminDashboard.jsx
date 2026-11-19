import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RoomWrapper from '../components/RoomWrapper';
import AndyCloudsWallpaper from '../components/AndyCloudsWallpaper';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

import plantita from '../assets/plantita.png';
import libros from '../assets/libros.png';
import trofeo from '../assets/trofeo.png';
import silla from '../assets/silla.png';
import lampara from '../assets/lamparaRoja.png';
import cafe from '../assets/cafe.png';
import valeyyo from '../assets/valeyyo.jpeg';
import rosas from '../assets/rosas.png';
import alfombra from '../assets/alfombraRoja.png';
import camaPerro from '../assets/camaPerro.png';
import scud from '../assets/scud.png';

/**
 * DesktopAppIcon: Componente para los enlaces dentro del modal (Sistema Operativo).
 */
const DesktopAppIcon = ({ title, icon, link, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600 border-blue-600",
    red: "bg-red-500 hover:bg-red-600 border-red-600",
    green: "bg-green-500 hover:bg-green-600 border-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600",
    purple: "bg-purple-500 hover:bg-purple-600 border-purple-600",
  };
  return (
    <Link to={link} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-b-4 ${colorClasses[color]} transition-all hover:scale-105 active:scale-95 group no-underline w-32`}>
      <div className="text-4xl group-hover:rotate-12 transition-transform">{icon}</div>
      <span className="text-[10px] font-black text-white uppercase tracking-widest text-center">{title}</span>
    </Link>
  );
};

/**
 * WallClock: Reloj de pared con sincronización perfecta por milisegundos.
 */
const WallClock = () => {
  const secRef = useRef(null);
  const minRef = useRef(null);
  const hrRef = useRef(null);

  useEffect(() => {
    let requestRef;
    
    const updateClock = () => {
      const now = new Date();
      const medellinTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
      
      const ms = medellinTime.getMilliseconds();
      const s = medellinTime.getSeconds();
      const m = medellinTime.getMinutes();
      const h = medellinTime.getHours() % 12;

      const sDeg = (s + ms / 1000) * 6;
      const mDeg = (m + s / 60) * 6;
      const hDeg = (h + m / 60) * 30;

      if (secRef.current) secRef.current.style.transform = `rotate(${sDeg}deg) translateZ(0)`;
      if (minRef.current) minRef.current.style.transform = `rotate(${mDeg}deg) translateZ(0)`;
      if (hrRef.current) hrRef.current.style.transform = `rotate(${hDeg}deg) translateZ(0)`;

      requestRef = requestAnimationFrame(updateClock);
    };

    requestRef = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(requestRef);
  }, []);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40">
       <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-white border-[14px] md:border-[18px] border-[#d32f2f] flex items-center justify-center overflow-visible">
          <div className="absolute inset-[-14px] md:inset-[-18px] rounded-full border-t-4 border-white/30 z-30 pointer-events-none"></div>
          <div className="absolute inset-[-14px] md:inset-[-18px] rounded-full border-b-2 border-black/10 z-30 pointer-events-none"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent z-20 pointer-events-none shadow-inner"></div>
          
          {[...Array(60)].map((_, i) => (
            <div key={i} 
              className={`absolute ${i % 5 === 0 ? 'w-1 h-5 bg-slate-800' : 'w-0.5 h-2 bg-slate-300'}`}
              style={{ transform: `rotate(${i * 6}deg) translateY(-65px)` }}
            ></div>
          ))}

          <div ref={hrRef} className="w-1.5 h-12 bg-slate-900 rounded-full absolute origin-bottom bottom-1/2 z-10 will-change-transform"></div>
          <div ref={minRef} className="w-1 h-16 bg-slate-800 rounded-full absolute origin-bottom bottom-1/2 z-20 will-change-transform"></div>
          <div ref={secRef} className="w-0.5 h-[75px] bg-red-600 rounded-full absolute origin-bottom bottom-1/2 z-30 will-change-transform">
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full border border-white/20"></div>
          </div>
          <div className="w-4 h-4 bg-slate-900 rounded-full z-40 border border-white/20 flex items-center justify-center shadow-sm">
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
          </div>
       </div>
    </div>
  );
};

const AdminDashboard = () => {
  const location = useLocation();
  const [isComputerOpen, setIsComputerOpen] = useState(() => {
    return location.search.includes('pc=1') || location.search.includes('screen=computer');
  });
  const { usuario, logout, cargandoSesion, userNameHint, isLoggedInHint, setVistaAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isPrinting, setIsPrinting] = useState(false);
  const [flyingPapers, setFlyingPapers] = useState([]);
  const [isLampOn, setIsLampOn] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    // Lanzar varios papeles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const id = Date.now() + i;
        setFlyingPapers(prev => [...prev, { id, angle: (Math.random() - 0.5) * 40 }]);
        // Limpiar papel después de la animación
        setTimeout(() => {
          setFlyingPapers(prev => prev.filter(p => p.id !== id));
        }, 2000);
      }, i * 300);
    }
    
    setTimeout(() => setIsPrinting(false), 2000);
  };

  // --- COMPONENTES DE LA IMPRESORA ---
  const Printer = () => (
    <div 
      className={`absolute -top-[108px] left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 z-20 ${isPrinting ? 'animate-shake' : 'hover:scale-[1.02]'}`}
      onClick={handlePrint}
    >
      <div className="relative">
        {/* Papeles volando con más detalle */}
        {flyingPapers.map(paper => (
          <div 
            key={paper.id}
            className="absolute bottom-10 left-1/2 w-16 h-24 bg-white shadow-lg border border-slate-200 animate-paper-fly z-30 pointer-events-none"
            style={{ 
              '--fly-angle': `${paper.angle}deg`,
              '--fly-delay': `${Math.random() * 0.2}s`
            }}
          >
             <div className="p-2 space-y-2 opacity-30">
                <div className="w-full h-0.5 bg-slate-300"></div>
                <div className="w-[90%] h-0.5 bg-slate-300"></div>
                <div className="w-[80%] h-0.5 bg-slate-300"></div>
             </div>
          </div>
        ))}

        {/* Cuerpo Principal - Compacto y Muy Detallado */}
        <div className="w-60 h-28 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-300 rounded-lg shadow-2xl border-b-[10px] border-slate-400 relative overflow-visible group">
          {/* Logo Estilo Star Command */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40">
             <div className="w-4 h-4 bg-yellow-500 rounded-full border border-yellow-600 flex items-center justify-center">
                <span className="text-[6px] text-white">🚀</span>
             </div>
             <div className="text-[4px] font-bold text-slate-500 uppercase tracking-tighter">Star Command Print</div>
          </div>

          {/* Pantalla Digital con Reflejo */}
          <div className="absolute top-4 left-4 w-14 h-8 bg-slate-900 rounded border-2 border-slate-700 overflow-hidden shadow-inner">
             <div className={`w-full h-full bg-cyan-500/10 flex flex-col items-center justify-center gap-0.5 ${isPrinting ? 'animate-pulse' : ''}`}>
                <div className="w-6 h-0.5 bg-cyan-400/40 rounded-full"></div>
                <div className="w-4 h-0.5 bg-cyan-400/20 rounded-full"></div>
             </div>
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Botones Físicos */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5">
             <div className="flex gap-1.5">
                <div className={`w-3 h-3 rounded-full border-2 border-white/50 shadow-sm ${isPrinting ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                <div className="w-3 h-3 bg-slate-400 rounded-full border-2 border-white/50"></div>
             </div>
             <div className="w-8 h-2 bg-slate-400 rounded-sm"></div>
          </div>

          {/* Ranura de salida con Sombra Realista */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-2.5 bg-black/90 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border-t border-white/5"></div>
          
          {/* Bandeja de salida 3D */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-44 h-8 bg-slate-200/90 rounded-b-lg border-x border-b border-slate-300 transform perspective-1000 rotateX-25 z-[-1] shadow-md"></div>
        </div>

        {/* Bandeja de entrada superior */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-12 bg-slate-50 rounded-t-xl border-x border-t border-slate-200 shadow-sm z-[-2]">
          <div className="absolute bottom-0 left-2 right-2 h-16 bg-white border border-slate-100 rounded-t-md opacity-90 transform -skew-x-1"></div>
        </div>
      </div>

      {/* Sombra de contacto suave */}
      <div className="w-48 h-3 bg-black/25 blur-xl rounded-full mt-2"></div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50.5%) rotate(-0.3deg); }
          75% { transform: translateX(-49.5%) rotate(0.3deg); }
        }
        @keyframes paper-fly {
          0% { transform: translateX(-50%) translateY(0) rotate(0deg) scale(0.8); opacity: 0; }
          20% { opacity: 1; scale(1); }
          100% { transform: translateX(calc(-50% + var(--fly-angle) * 8)) translateY(-250px) rotate(calc(var(--fly-angle) * 6 + 180deg)); opacity: 0; }
        }
        .animate-shake { animation: shake 0.12s infinite; }
        .animate-paper-fly { animation: paper-fly 2.5s forwards cubic-bezier(0.2, 0.8, 0.2, 1); animation-delay: var(--fly-delay); }
      `}</style>
    </div>
  );

  const icons = {
    stock: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    orders: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-white stroke-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  };

  return (
    <RoomWrapper theme="andy" wallpaperContent={<AndyCloudsWallpaper />} showFooter={false} hideNavbar={true}>
      <div className="flex-1 flex flex-col items-center pt-2 px-6 relative min-h-[160vh] pb-60">
        
        <Navbar minimal={true} />

        <WallClock />

        {/* --- TABLERO DE TIZA/MARCADOR (ESTILO FIJO Y ESTABLE) --- */}
        <div className="z-30 text-center relative mt-32 animate-in fade-in slide-in-from-top-10 duration-1000">
          
          <div className="relative inline-block px-16 py-12 bg-white rounded-xl shadow-[0_40px_80px_rgba(0,0,0,0.3)] transform scale-110 transition-transform group mt-6">
            {/* Tornillos */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full border border-slate-600 shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-px bg-slate-700 rotate-45"></div>
            </div>
            <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full border border-slate-600 shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-px bg-slate-700 -rotate-12"></div>
            </div>
            <div className="absolute bottom-6 left-4 w-3 h-3 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full border border-slate-600 shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-px bg-slate-700 rotate-90"></div>
            </div>
            <div className="absolute bottom-6 right-4 w-3 h-3 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full border border-slate-600 shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-px bg-slate-700 rotate-12"></div>
            </div>

            {/* Marco de Aluminio */}
            <div className="absolute inset-[-12px] border-[12px] border-slate-300 rounded-2xl shadow-inner pointer-events-none"></div>
            <div className="absolute inset-[-10px] border-[2px] border-slate-100/50 rounded-xl pointer-events-none"></div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/50 rounded-lg overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-50%] group-hover:translate-x-[50%] transition-transform duration-1000"></div>
            </div>

            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-[#0d47a1] tracking-tight" style={{ fontFamily: '"Kalam", cursive', textShadow: '1px 1px 0px rgba(13, 71, 161, 0.1)' }}>
                Panel de Administración
              </h1>
              <div className="h-1 w-32 bg-blue-500/20 mx-auto mt-2 rounded-full blur-[1px]"></div>
            </div>
            
            {/* Repisa de Marcadores */}
            <div className="absolute -bottom-4 left-4 right-4 h-6 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-lg border-x-2 border-b-2 border-slate-500 shadow-lg z-20 flex items-center px-4 overflow-visible">
               <div className="absolute -bottom-4 inset-x-2 h-4 bg-black/20 blur-md rounded-full -z-10"></div>
               <div className="flex gap-6 items-center">
                  {/* Marcador Azul */}
                  <div className="relative w-24 h-4 bg-white rounded-sm shadow-md border border-slate-200 rotate-1 group/marker flex items-center overflow-hidden">
                     <div className="w-6 h-full bg-blue-600 rounded-r-sm"></div>
                     <div className="flex-1 px-2 flex flex-col justify-center">
                        <div className="w-full h-0.5 bg-blue-500/20 mb-0.5"></div>
                        <div className="text-[4px] font-black text-slate-400 uppercase tracking-tighter leading-none">Dry Erase Pro</div>
                     </div>
                  </div>

                  {/* Marcador Rojo */}
                  <div className="relative w-24 h-4 bg-white rounded-sm shadow-md border border-slate-200 -rotate-1 group/marker flex items-center overflow-hidden">
                     <div className="w-6 h-full bg-red-600 rounded-r-sm"></div>
                     <div className="flex-1 px-2 flex flex-col justify-center">
                        <div className="w-full h-0.5 bg-red-500/20 mb-0.5"></div>
                        <div className="text-[4px] font-black text-slate-400 uppercase tracking-tighter leading-none">Dry Erase Pro</div>
                     </div>
                  </div>
               </div>

               {/* Borrador */}
               <div className="ml-auto w-16 h-5 bg-slate-800 rounded-sm shadow-md border border-slate-900 flex flex-col items-center justify-center -rotate-2">
                  <div className="w-12 h-1 bg-slate-700 rounded-full mb-0.5"></div>
               </div>
            </div>

            {/* Notica Amarilla (Boceto) */}
            <div className="absolute -top-6 -right-10 w-24 h-24 bg-yellow-200 shadow-lg p-2 rotate-6 transform hover:rotate-0 transition-transform cursor-pin border-t-4 border-yellow-300 flex flex-col items-center justify-center overflow-hidden">
               <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-inner border border-red-600 z-20"></div>
               <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-70 relative z-10">
                 <path d="M10 70 Q 50 85, 90 70 Q 95 65, 80 60 Q 50 55, 20 60 Q 5 65, 10 70" fill="none" stroke="#4a5568" strokeWidth="1.5" />
                 <path d="M30 60 Q 30 30, 50 25 Q 70 30, 70 60" fill="none" stroke="#4a5568" strokeWidth="1.5" />
                 <path d="M32 52 Q 50 48, 68 52" fill="none" stroke="#4a5568" strokeWidth="1" />
               </svg>
            </div>
          </div>
          
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
          `}</style>
        </div>

        {/* === ESTANTERÍAS FLOTANTES COMPACTAS Y ASIMÉTRICAS === */}
        <div className="absolute top-[650px] w-full max-w-7xl flex justify-center items-start gap-40 pointer-events-none z-10">
           {/* Estantería Izquierda - Con Libros y Planta Detallada */}
           <div className="relative -mt-10">
              {/* Decoración: Imagen de Libros - El elemento más grande */}
              <div className="absolute -top-[108px] left-4 flex items-end z-20">
                 <div className="relative">
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[85%] h-2 bg-black/30 blur-md rounded-full"></div>
                    <img src={libros} alt="Libros" className="w-36 h-auto translate-y-1 brightness-[1.02] contrast-[1.05] saturate-[1.1] sepia-[0.05] drop-shadow-[10px_10px_15px_rgba(0,0,0,0.3)]" />
                 </div>
              </div>

              {/* Decoración: Imagen del Trofeo Real - Mediano y ajustado en profundidad */}
              <div className="absolute -top-[96px] left-[65%] -translate-x-1/2 flex flex-col items-center z-20">
                 <div className="relative">
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[80%] h-2 bg-black/30 blur-md rounded-full"></div>
                    <img src={trofeo} alt="Trofeo" className="w-18 h-auto translate-y-1 brightness-[1.02] contrast-[1.05] saturate-[1.1] sepia-[0.05] drop-shadow-[10px_10px_15px_rgba(0,0,0,0.3)]" />
                 </div>
              </div>

              {/* Imagen de la Planta Real - La más pequeña (Suculenta) */}
              <div className="absolute -top-[58px] right-4 flex flex-col items-center z-20">
                 <div className="relative">
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[75%] h-2 bg-black/30 blur-md rounded-full"></div>
                    <img src={plantita} alt="Plantita" className="w-16 h-auto translate-y-1 brightness-[1.02] contrast-[1.05] saturate-[1.1] sepia-[0.05] drop-shadow-[12px_12px_18px_rgba(0,0,0,0.3)]" />
                 </div>
              </div>

              <div className="w-80 h-6 bg-[#d2a679] rounded-sm shadow-[0_12px_24px_rgba(0,0,0,0.3)] border-b-4 border-[#b58a5d] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20"></div>
                 <div className="absolute top-0 left-0 w-full h-px bg-white/30"></div>
              </div>
              <div className="flex justify-between px-10 -mt-1">
                 <div className="w-2.5 h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b shadow-md origin-top skew-x-[-15deg]"></div>
                 <div className="w-2.5 h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b shadow-lg origin-top skew-x-[15deg]"></div>
              </div>
           </div>

           {/* Estantería Derecha - IMPRESORA INTERACTIVA */}
           <div className="relative mt-4 pointer-events-auto">
              <Printer />
              <div className="w-80 h-6 bg-[#d2a679] rounded-sm shadow-[0_12px_24px_rgba(0,0,0,0.3)] border-b-4 border-[#b58a5d] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20"></div>
                 <div className="absolute top-0 left-0 w-full h-px bg-white/30"></div>
              </div>
              <div className="flex justify-between px-10 -mt-1">
                 <div className="w-2.5 h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b shadow-md origin-top skew-x-[-15deg]"></div>
                 <div className="w-2.5 h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b shadow-md origin-top skew-x-[15deg]"></div>
              </div>
           </div>
        </div>

        {/* Monitor y Escritorio */}
        {/* === NUEVO DISEÑO DE ESCRITORIO Y ENTORNO (Inspirado en la Imagen) === */}
        {/* === ESCRITORIO PLANO (Estilo Ilustración) === */}
        <div className="relative w-full max-w-7xl z-20 mt-[400px] mx-auto flex flex-col items-center">
          
          {/* Monitor Estilo Plano */}
          <div className="relative z-30 mb-[-10px] flex flex-col items-center">
            <div 
              className="w-[480px] h-[300px] bg-white rounded-xl p-4 shadow-xl border-4 border-slate-200 relative cursor-pointer group/monitor transition-transform hover:scale-[1.02]"
              onClick={() => setIsComputerOpen(true)}
            >
               {/* Pantalla con Fondo de Escritorio Organizado (Estilo Windows 11) */}
               <div 
                  className="w-full h-full bg-[#0078d4] rounded-lg overflow-hidden relative shadow-inner flex flex-col group/screen"
                  style={{ backgroundImage: 'linear-gradient(135deg, #0b2e5a 0%, #0078d4 50%, #0b2e5a 100%)' }}
               >
                  {/* Papel Tapiz Detallado */}
                  <div className="absolute inset-0 overflow-hidden opacity-40">
                     <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-white/10 rounded-[40%] rotate-45 blur-[80px]"></div>
                     <div className="absolute bottom-[-30%] right-[-10%] w-[100%] h-[100%] bg-blue-300/10 rounded-[50%] -rotate-12 blur-[100px]"></div>
                  </div>

                  {/* Iconos Organizados con Etiquetas */}
                  <div className="relative z-10 p-4 grid grid-cols-1 gap-5 w-24">
                     {[
                        { label: 'Equipo', color: 'bg-blue-400' },
                        { label: 'Archivos', color: 'bg-yellow-500' },
                        { label: 'Tienda', color: 'bg-green-500' },
                        { label: 'Papelera', color: 'bg-slate-400' }
                     ].map((icon, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 group/icon cursor-default hover:bg-white/10 p-1 rounded transition-colors">
                           <div className={`w-8 h-8 ${icon.color} rounded shadow-lg border border-white/20 flex items-center justify-center relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                           </div>
                           <span className="text-[7px] font-medium text-white shadow-sm">{icon.label}</span>
                        </div>
                     ))}
                  </div>

                  {/* Ventana Abierta de Ejemplo (Para más detalle) */}
                  <div className="absolute top-10 right-10 w-64 h-44 bg-white/90 backdrop-blur-md rounded-lg shadow-2xl border border-white/40 flex flex-col overflow-hidden animate-in slide-in-from-right-5 duration-700">
                     <div className="h-6 bg-slate-100/50 border-b border-black/5 flex items-center px-2 justify-between">
                        <div className="flex gap-1">
                           <div className="w-2 h-2 rounded-full bg-red-400"></div>
                           <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                           <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                        <span className="text-[8px] font-bold text-slate-500">Admin Control</span>
                        <div className="w-4"></div>
                     </div>
                     <div className="flex-1 p-3 space-y-2">
                        <div className="w-full h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-[80%] h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-[90%] h-12 bg-blue-500/10 rounded border border-blue-500/20"></div>
                     </div>
                  </div>

                  {/* Barra de Tareas Detallada */}
                  <div className="absolute bottom-0 w-full h-10 bg-white/10 backdrop-blur-2xl border-t border-white/20 flex items-center justify-between px-4 z-20">
                     {/* Centro: Apps */}
                     <div className="absolute left-1/2 -translate-x-1/2 flex gap-1">
                        <div className="w-7 h-7 bg-blue-600 rounded-sm shadow-lg flex items-center justify-center border border-white/20 cursor-pointer hover:scale-110 transition-transform">
                           <div className="w-3 h-3 border-2 border-white"></div>
                        </div>
                        {[1, 2, 3, 4].map(i => (
                           <div key={i} className="w-7 h-7 bg-white/10 rounded-sm hover:bg-white/20 transition-all border border-white/5 cursor-pointer flex items-center justify-center relative">
                              <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-orange-400' : i === 2 ? 'bg-blue-400' : 'bg-slate-300'} opacity-60`}></div>
                              {i === 1 && <div className="absolute bottom-0.5 w-3 h-0.5 bg-blue-400 rounded-full"></div>}
                           </div>
                        ))}
                     </div>

                     {/* Derecha: Sistema */}
                     <div className="flex items-center gap-3 text-white/80">
                        <div className="flex flex-col items-end leading-none">
                           <span className="text-[8px] font-bold">22:09</span>
                           <span className="text-[7px]">13/05/2025</span>
                        </div>
                        <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                     </div>
                  </div>

                  {/* Capa de Interacción */}
                  {!isComputerOpen && (
                     <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500 z-30 group-hover/screen:bg-transparent flex items-center justify-center">
                        <div className="px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover/screen:opacity-100 transition-all transform scale-90 group-hover/screen:scale-100">
                           Abrir Sistema
                        </div>
                     </div>
                  )}
               </div>
            </div>
            {/* Soporte Plano */}
            <div className="w-32 h-16 bg-slate-200 relative rounded-b-lg shadow-md flex items-center justify-center">
               <div className="w-44 h-3 bg-slate-300 rounded-full shadow-md"></div>
            </div>
          </div>

          {/* Superficie del Escritorio Plana */}
          <div className="w-full h-10 bg-[#d2a679] rounded-xl shadow-lg relative z-20 flex items-center border-t-2 border-white/20 border-b-4 border-[#b58a5d]">
             
             {/* Rosas Decorativas (Tamaño Real y al Frente) - Ajustadas a la mesa */}
             <div className="absolute -top-[260px] left-[-10px] w-56 h-80 z-40 pointer-events-none group/roses">
                <div className="relative w-full h-full transition-transform group-hover/roses:scale-105 duration-300">
                   <img 
                     src={rosas} 
                     alt="Rosas" 
                     className="w-full h-full object-contain drop-shadow-2xl" 
                   />
                </div>
                {/* Sombra de contacto */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/20 blur-xl rounded-full z-[-1]"></div>
             </div>

             {/* Retrato Personal con Profundidad y Sombras */}
             <div className="absolute -top-[178px] left-[100px] w-36 h-44 group/frame cursor-default z-30 pointer-events-auto">
                {/* Sombra proyectada hacia atrás (Perspectiva) */}
                <div 
                   className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[110%] h-12 bg-black/20 blur-xl rounded-t-full origin-bottom"
                   style={{ transform: 'perspective(500px) rotateX(60deg)' }}
                ></div>
                
                {/* Marco Principal con inclinación hacia atrás */}
                <div 
                   className="relative w-full h-full bg-white rounded-sm shadow-2xl border-[8px] border-slate-50 flex flex-col items-center justify-center p-1"
                   style={{ 
                      transform: 'perspective(1000px) rotateX(12deg)',
                      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
                   }}
                >
                   {/* Foto Real */}
                   <div className="w-full h-full bg-slate-100 overflow-hidden relative rounded-sm shadow-inner">
                      <img 
                        src={valeyyo} 
                        alt="Foto Personal" 
                        className="w-full h-full object-cover"
                      />
                      {/* Efecto de degradado de profundidad en la foto */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
                      {/* Brillo de cristal premium */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/5 opacity-40"></div>
                   </div>
                   
                   {/* Bisel del marco */}
                   <div className="absolute inset-0 border border-black/10 pointer-events-none"></div>
                </div>

                {/* Sombra de contacto inmediata */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30 blur-[1px]"></div>
             </div>

             {/* Mouse en Relieve Detallado */}
             <div className="absolute -top-10 right-[400px] w-14 h-10 bg-gradient-to-b from-white to-slate-100 rounded-t-full z-30 shadow-md border-b-2 border-slate-300/50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1/2 bg-slate-300"></div>
                <div className="absolute top-2 left-3 w-4 h-2 bg-white rounded-full opacity-60 blur-[1px]"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/5"></div>
             </div>

             {/* Taza de Café (Imagen) con Humo Animado (Failsafe SVG) */}
             <div className="absolute -top-[120px] left-[280px] w-40 h-40 group/mug cursor-pointer pointer-events-auto z-40">
                {/* Humo (Nubes SVG) - Centrado sobre la taza */}
                <div className="absolute -top-36 left-[46%] -translate-x-1/2 w-48 h-48 pointer-events-none z-50">
                   <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                      {[0, 1, 2, 3].map((i) => (
                         <circle key={i} cx="50" cy="90" r="8" fill="white" filter="url(#blurMe)">
                            <animate 
                               attributeName="cy" 
                               from="90" to="-20" 
                               dur="4s" 
                               begin={`${i * 1}s`} 
                               repeatCount="indefinite" 
                            />
                            <animate 
                               attributeName="cx" 
                               values="50;55;45;50" 
                               dur="4s" 
                               begin={`${i * 1}s`} 
                               repeatCount="indefinite" 
                            />
                            <animate 
                               attributeName="r" 
                               from="8" to="20" 
                               dur="4s" 
                               begin={`${i * 1}s`} 
                               repeatCount="indefinite" 
                            />
                            <animate 
                               attributeName="opacity" 
                               values="0;0.7;0.3;0" 
                               dur="4s" 
                               begin={`${i * 1}s`} 
                               repeatCount="indefinite" 
                            />
                         </circle>
                      ))}
                      <defs>
                         <filter id="blurMe">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                         </filter>
                      </defs>
                   </svg>
                </div>

                {/* Imagen de la Taza */}
                <div className="relative w-full h-full transition-transform group-active:scale-95 duration-200">
                   <img 
                     src={cafe} 
                     alt="Café" 
                     className="w-full h-full object-contain drop-shadow-2xl" 
                   />
                </div>
                
                {/* Sombra de contacto */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/20 blur-xl rounded-full z-[-1]"></div>
             </div>

             {/* Lámpara Interactiva - POSICIÓN FINAL AJUSTADA */}
             <div 
               className="absolute -top-[355px] right-[90px] w-[380px] h-[440px] flex flex-col items-center pointer-events-auto cursor-pointer z-30 group/lamp"
               onClick={() => setIsLampOn(!isLampOn)}
             >
                {/* Imagen de la Lámpara con el nuevo Asset Rojo */}
                <div className="relative w-full h-full transition-transform group-active:scale-95 duration-200">
                   <img 
                     src={lampara} 
                     alt="Lámpara" 
                     className="w-full h-full object-contain drop-shadow-xl" 
                   />
                   
                   {/* Resplandor natural cuando está encendida */}
                   {isLampOn && (
                      <div className="absolute top-[15%] left-[5%] w-60 h-60 bg-orange-400/20 blur-[50px] rounded-full animate-pulse pointer-events-none mix-blend-screen"></div>
                   )}
                </div>

                {/* Beam de luz proyectado sobre el escritorio */}
                {isLampOn && (
                   <div className="absolute top-20 left-[-300px] w-[600px] h-[700px] bg-yellow-100/10 blur-[100px] rounded-full pointer-events-none z-0 animate-in fade-in duration-1000 transform rotate-[-25deg] origin-top"></div>
                )}
             </div>
          </div>

          {/* Alfombra en el suelo (POSICIÓN FINAL - FOOTER) */}
          <div className="absolute bottom-0 left-1/2 translate-x-[calc(-50%+120px)] w-[950px] h-auto z-5 opacity-95 pointer-events-none translate-y-1/2">
             <img 
               src={alfombra} 
               alt="Alfombra" 
               className="w-full h-auto drop-shadow-xl" 
             />
          </div>


          {/* Cama del Perro (POSICIÓN FINAL - POR ENCIMA DE TODO) */}
          <div className="absolute bottom-0 left-1/2 translate-x-[calc(-50%+120px)] w-[950px] h-auto z-50 pointer-events-none translate-y-1/2">
             <div className="absolute bottom-[-80px] right-[-100px] w-80 h-auto">
                <img src={camaPerro} alt="Cama Perro" className="w-full h-auto drop-shadow-2xl" />
             </div>
          </div>

          {/* Cuerpo del Escritorio (Cajonera y Pata Delgada) */}
          <div className="w-full h-[420px] flex px-4 relative z-10 -mt-1">
             {/* Cajonera 4 Cajones */}
             <div className="w-72 h-full bg-[#d2a679] shadow-2xl border-r-4 border-[#b58a5d] flex flex-col p-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                   <div key={i} className="flex-1 bg-[#c48e58] rounded shadow-inner border border-black/5 flex items-center justify-center group cursor-pointer hover:bg-[#d2a679] transition-colors">
                      <div className="w-16 h-1 bg-black/20 rounded-full"></div>
                   </div>
                ))}
             </div>

             {/* Espacio Central */}
             <div className="flex-1 h-full relative">
             </div>

             {/* Pata Delgada Derecha (Estilo Ilustración) */}
             <div className="w-6 h-full bg-[#d2a679] shadow-xl relative border-x border-[#b58a5d]/30">
             </div>
          </div>

          {/* Silla (Imagen proporcionada por el usuario) - AHORA AL FRENTE Y TAMAÑO MEDIO */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[420px] h-auto z-40 transition-transform hover:scale-[1.02] pointer-events-none">
             <img src={silla} alt="Silla" className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
          </div>

          {/* Scud (El perro de Sid) - POSICIÓN FINAL AL FRENTE (BAJO ++) */}
          <div className="absolute bottom-[-320px] left-[0%] w-[450px] h-auto z-[100] pointer-events-none group/scud">
             <img 
               src={scud} 
               alt="Scud" 
               className="w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)] transition-transform group-hover/scud:scale-105 duration-300" 
             />
          </div>
        </div>

        {isComputerOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="absolute inset-0" onClick={() => setIsComputerOpen(false)}></div>
            <div className="bg-[#f0f0f0] w-full max-w-4xl h-[80vh] md:h-[600px] rounded-xl shadow-2xl flex flex-col relative z-10 border-2 border-slate-400 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="h-10 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] border-b border-slate-300 flex items-center px-4 justify-between shrink-0">
                <div className="flex gap-2">
                  <button onClick={() => setIsComputerOpen(false)} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center group/btn hover:bg-[#ff5f56]">
                     <span className="opacity-0 group-hover/btn:opacity-100 text-[8px] font-black text-slate-800">x</span>
                  </button>
                  <button className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></button>
                  <button className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></button>
                </div>
                <div className="font-bold text-xs text-slate-600 tracking-wider">OS</div>
                <div className="w-16"></div>
              </div>

              <div className="flex-1 bg-[#1a4a75] relative overflow-hidden flex flex-col" style={{ backgroundImage: 'radial-gradient(circle at center, #2b6da0 0%, #1a4a75 100%)' }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                   <span className="text-8xl md:text-9xl font-black text-white text-center leading-none">TOY<br/>STORE</span>
                </div>
                <div className="relative z-10 p-10 grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center items-start">
                   <DesktopAppIcon title="Inventario" icon={icons.stock} link="/admin/productos" color="blue" />
                   <DesktopAppIcon title="Pedidos" icon={icons.orders} link="/admin/pedidos" color="red" />
                   <DesktopAppIcon title="Usuarios" icon={icons.users} link="/admin/usuarios" color="green" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoomWrapper>
  );
};

export default AdminDashboard;
