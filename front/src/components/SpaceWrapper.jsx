import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../SpaceTheme.css';

/**
 * SpaceWrapper: La base de la Nave Espacial de Buzz Lightyear (Versión ELITE).
 * Provee la atmósfera de espacio profundo con HUD avanzado.
 */
export default function SpaceWrapper({ children }) {
  const { usuario, logout, vistaAdmin, setVistaAdmin } = useContext(AuthContext);
  const [stars, setStars] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Generar estrellas dinámicamente al azar
  useEffect(() => {
    const starArray = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 1000, 
      size: Math.random() * 2 + 1,
      blinkDuration: Math.random() * 3 + 2,
    }));
    setStars(starArray);
  }, []);

  return (
    <div className="min-h-screen bg-black relative flex flex-col overflow-hidden select-none">
      
      {/* 🛑 CAPA DE FONDO: ESPACIO PROFUNDO ELITE 🛑 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#020617] transition-all duration-1000"></div>
        
        {/* Grilla 3D de Navegación (Elite Detail) */}
        <div className="absolute inset-0 opacity-[0.07] animate-grid-drift pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Estrellas estáticas en el fondo */}
        <div className="absolute inset-0 opacity-40">
           {stars.slice(0, 50).map((star, i) => (
             <div 
               key={`star-bg-${i}`}
               className="absolute bg-white rounded-full"
               style={{
                 left: `${star.x}%`,
                 top: `${star.y % 100}%`,
                 width: `${star.size * 0.5}px`,
                 height: `${star.size * 0.5}px`,
                 opacity: 0.3
               }}
             />
           ))}
        </div>

        {/* Estrellas animadas (Parallax Float) */}
        <div className="absolute inset-x-0 top-0 h-[400%] animate-space-star-float pointer-events-none">
          {stars.map((star, i) => (
            <div 
              key={`star-float-${i}`}
              className="absolute bg-white rounded-full animate-space-star-blink"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                '--blink-duration': `${star.blinkDuration}s`
              }}
            />
          ))}
        </div>

        {/* Gradiente sutil del universo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-[#020617]"></div>
      </div>

      {/* 🛑 NAVBAR SUPERIOR (ELITE HUD) 🛑 */}
      <div className="fixed top-0 left-0 w-full z-50 h-16 cockpit-frame border-t-0 flex justify-between items-center px-6 md:px-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <div className="flex gap-1.5 h-4 items-end">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1 bg-lime-500 rounded-full" 
                       style={{ height: '100%', animation: `signal-wave ${0.5 + i/10}s ease-in-out infinite alternate` }}></div>
                ))}
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] text-lime-400 hud-text uppercase tracking-widest font-black leading-none">Buzz OS V.Elite</span>
               <span className="text-[7px] text-lime-400/40 font-bold uppercase tracking-[2px] mt-1">Signal Stable - Sector 12</span>
            </div>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <div className="text-[10px] text-lime-400 hud-text uppercase tracking-[8px] opacity-80 hidden sm:block animate-glitch-text">
              ZONA DE ADMINISTRADOR
            </div>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-lime-500/30 to-transparent mt-1"></div>
          </div>

          <div className="flex items-center gap-8 relative">
            {/* Metadata bits (Premium Feel) */}
            <div className="hidden lg:flex flex-col items-end gap-1">
               <span className="hud-metadata">COORD: [28.45N, 10.32W]</span>
               <span className="hud-metadata">TRUST_LVL: MAXIMUM</span>
            </div>
            
            {/* User Avatar & Helmet (Buzz Elite style) */}
            <div className="relative group/user">
                <div className="relative w-12 h-12 flex items-center justify-center cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {/* SVG del Casco Espacial de Buzz ELITE */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(163,230,53,0.3)] animate-bounce-subtle">
                       <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          {/* Casco Base */}
                          <path d="M50 15 C25 15 10 32 10 55 L10 68 L90 68 L90 55 C90 32 75 15 50 15 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                          <path d="M15 65 L85 65 L85 75 C85 78 80 82 50 82 C20 82 15 78 15 75 Z" fill="#84cc16" />
                          {/* Visor de Cristal con Brillo ELITE */}
                          <path d="M50 20 C32 20 18 32 18 50 L18 64 L82 64 L82 50 C82 32 68 20 50 20 Z" fill="url(#visor-elite)" fillOpacity="0.5" stroke="#a855f7" strokeWidth="1.5" />
                          <defs>
                            <linearGradient id="visor-elite" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="50%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                          </defs>
                          {/* Brillos dinámicos */}
                          <rect x="25" y="28" width="12" height="3" rx="1.5" fill="white" fillOpacity="0.6" transform="rotate(-10, 25, 28)" />
                          <circle cx="50" cy="74" r="3" fill="#ef4444" className="animate-pulse" /> 
                       </svg>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-slate-800 border-[3px] border-lime-500/50 flex items-center justify-center overflow-hidden transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] relative z-10 group-hover/user:scale-110">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${usuario?.nombre.replace(" ", "+")}&background=a855f7&color=ffffff`} 
                        alt="Admin" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                </div>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-0 bg-transparent" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-6 w-64 bg-slate-900/98 backdrop-blur-3xl border border-lime-500/30 rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200 cursor-default">
                      {/* Interactive edge animation */}
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-lime-400 to-transparent"></div>
                      
                      <div className="flex flex-col p-3 gap-1 relative z-10">
                          
                          <button 
                            onClick={() => { setVistaAdmin(false); navigate("/"); }}
                            className="flex items-center gap-4 px-4 py-3.5 text-[10px] font-black text-lime-400 hover:bg-lime-500/10 rounded-xl transition-all uppercase tracking-widest group cursor-pointer border border-transparent hover:border-lime-500/20"
                          >
                            <div className="w-6 h-6 flex items-center justify-center bg-lime-500/20 rounded-lg border border-lime-500/30">
                               <svg className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </div>
                            Modo Cliente
                          </button>


                          <button 
                            onClick={() => { logout(); navigate("/login"); }}
                            className="flex items-center gap-4 px-4 py-3.5 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest mt-1 cursor-pointer border border-transparent hover:border-red-500/20"
                          >
                            <div className="w-6 h-6 flex items-center justify-center bg-red-500/20 rounded-lg border border-red-500/30">
                               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </div>
                            Cerrar Sesión
                          </button>
                      </div>
                      <div className="absolute inset-0 pointer-events-none opacity-[0.1] bg-gradient-to-b from-transparent via-lime-400 to-transparent h-4 animate-space-hud-scan"></div>
                    </div>
                  </>
                )}
            </div>
          </div>
      </div>

      {/* 🛑 CAPA DE CABINA (HUD AVANZADO) 🛑 */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between overflow-hidden animate-ship-shake">
        
        {/* Espaciador superior */}
        <div className="h-16 w-full"></div>

        {/* HUD: Metadata Labels across corners (Elite Detail) */}
        <div className="absolute top-24 left-10 hidden md:flex flex-col gap-2">
           <span className="hud-metadata">SYS: BUZZ_OS_V4.2</span>
           <span className="hud-metadata">ENTROPY: 0.00032</span>
           <span className="hud-metadata animate-pulse text-red-500/40">WARP: READY</span>
        </div>
        <div className="absolute top-24 right-10 hidden md:flex flex-col gap-2 text-right">
           <span className="hud-metadata">SCAN: NO_HOSTILES</span>
           <span className="hud-metadata">LIFE_SUPPORT: 100%</span>
           <span className="hud-metadata">ENCR: AES_INFINITE</span>
        </div>

        {/* Estructura de Ventana de la Nave (HUD) */}
        <div className="flex-1 px-4 py-8 flex items-center justify-center relative overflow-hidden">
           {/* HUD: Digital Scan lines */}
           <div className="fixed inset-0 pointer-events-none opacity-[0.04] animate-space-hud-scan bg-gradient-to-b from-lime-400/0 via-lime-400 to-lime-400/0"></div>

           {/* Marcos de la cabina (Hexagonal glass look - PROFESIONAL) */}
           <div className="absolute inset-0 border-[30px] md:border-[60px] border-transparent">
              <div className="w-full h-full border-[1px] border-white/5 rounded-[50px] relative">
                 {/* Crosshair (Afinado) */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-[1px] border-lime-500/5 rounded-full"></div>
                 <div className="absolute top-1/2 left-0 w-12 h-[1px] bg-lime-500/10"></div>
                 <div className="absolute top-1/2 right-0 w-12 h-[1px] bg-lime-500/10"></div>
                 <div className="absolute top-0 left-1/2 w-[1px] h-12 bg-lime-500/10"></div>
                 <div className="absolute bottom-0 left-1/2 w-[1px] h-12 bg-lime-500/10"></div>
                 
                 {/* Esquinas tácticas */}
                 <div className="absolute top-8 left-8 w-6 h-6 border-t-[2px] border-l-[2px] border-lime-500/20 rounded-tl-xl"></div>
                 <div className="absolute top-8 right-8 w-6 h-6 border-t-[2px] border-r-[2px] border-lime-500/20 rounded-tr-xl"></div>
                 <div className="absolute bottom-8 left-8 w-6 h-6 border-b-[2px] border-l-[2px] border-lime-500/20 rounded-bl-xl"></div>
                 <div className="absolute bottom-8 right-8 w-6 h-6 border-b-[2px] border-r-[2px] border-lime-500/20 rounded-br-xl"></div>
              </div>
           </div>
        </div>

        {/* 🚀 EL TABLERO DE MANDOS (ELITE REFINEMENT) 🚀 */}
        <div className="h-[30vh] lg:h-[35vh] w-full cockpit-frame border-b-0 relative rounded-t-[100px] p-8 flex justify-center items-end overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
           
           <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-12 relative z-20 pb-6">
              {/* Sección Izquierda: Pantallas de Estado */}
              <div className="hidden md:flex flex-col justify-end gap-5 pb-4">
                 <div className="w-full space-y-3">
                    <div className="flex justify-between text-[11px] text-lime-400 hud-text uppercase font-black tracking-tighter">
                       <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-lime-500 animate-ping rounded-full"></div>
                          FUEL_CELLS
                       </span>
                       <span className="animate-pulse">98.4%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                       <div className="w-[98%] h-full bg-gradient-to-r from-lime-600 to-lime-400 relative">
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="w-3 h-8 bg-slate-900 border border-lime-500/20 rounded-sm shadow-md flex items-center justify-center group cursor-help">
                         <div className="w-1 h-4 bg-lime-500/40 group-hover:bg-lime-500 transition-colors"></div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Sección Central: Radar de Navegación ELITE */}
              <div className="flex flex-col items-center justify-end relative h-full">
                 <div className="relative w-44 h-44 group mb-4">
                    <div className="absolute inset-0 border-[1px] border-lime-500/10 rounded-full"></div>
                    <div className="absolute inset-4 border-[1px] border-lime-500/20 rounded-full"></div>
                    <div className="absolute inset-10 border-[1px] border-lime-500/30 rounded-full"></div>
                    <div className="absolute inset-16 border-[2px] border-lime-500/40 rounded-full animate-pulse"></div>
                    
                    {/* El Puntero del Radar (Elite Animation) */}
                    <div className="absolute inset-0 animate-[spin_6s_linear_infinite] opacity-40">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-1/2 bg-gradient-to-t from-transparent via-lime-500/50 to-lime-500 origin-bottom"></div>
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-lime-500/10 blur-[30px] rounded-full"></div>
                    </div>

                    {/* Objetos en radar (Intermitentes) */}
                    <div className="absolute top-12 left-10 w-2.5 h-2.5 bg-lime-500 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute bottom-16 right-12 w-2 h-2 bg-purple-500 rounded-full animate-pulse opacity-60"></div>
                 </div>
                 <div className="text-[13px] font-black text-gray-500 hud-text uppercase tracking-[4px] text-center opacity-80">Telemetry_Active</div>
              </div>

              {/* Sección Derecha: Botones de Comando ELITE */}
              <div className="hidden md:flex flex-col justify-end items-end gap-8 pb-4">
                 <div className="grid grid-cols-4 gap-4">
                    {['PWR', 'DEF', 'SPD', 'LOG'].map(id => (
                      <div key={id} className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border-[2px] border-slate-800 shadow-[4px_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer hover:border-lime-500/50 transition-all active:scale-95 group">
                           <div className={`w-3.5 h-3.5 rounded-full ${id === 'PWR' ? 'bg-lime-500 shadow-[0_0_12px_#84cc16]' : 'bg-slate-800 group-hover:bg-lime-900'} transition-all`}></div>
                        </div>
                        <span className="text-[8px] text-gray-600 font-black tracking-tighter">{id}</span>
                      </div>
                    ))}
                 </div>
                 <div className="w-full text-right flex flex-col items-end">
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                       <div className="w-1/2 h-full bg-lime-500/20"></div>
                    </div>
                    <p className="text-[9px] font-black text-gray-600 hud-text tracking-[4px] uppercase">BUZZ-UNIT-001</p>
                 </div>
              </div>
           </div>

           {/* Luz del panel sobre el piso metálico (Sutil pero cinemática) */}
           <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black via-lime-500/10 to-transparent"></div>
        </div>
      </div>

      {/* 🛑 CONTENIDO FRONTAL (Con Glassmorphism 2.0) 🛑 */}
      <div className="relative z-20 flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="flex-1 shrink-0 relative flex flex-col pt-28 px-4 overflow-x-hidden">
           {children}
        </div>
        
        {/* Espaciador base */}
        <div className="h-[30vh] lg:h-[35vh]"></div>
      </div>
    </div>
  );
}
