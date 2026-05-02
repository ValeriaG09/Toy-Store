import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ToyStoreLogoImg from '../assets/logo_official.png';
import ToyMobile from './ToyMobile';
import NavHoverItem from './NavHoverItem';
import CowboyHat from './CowboyHat';

// El logo del corazón para la tienda
const woodyHeartPlaceholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0icmVkIj48cGF0aCBkPSJNMTIgMjEuMzVMMTAuNTUgMjAuMDNDNS40IDE1LjM2IDIgMTIuMjcgMiA4LjVDMiA1LjQyIDQuNDIgMyA3LjUgM0M5LjI0IDMgMTAuOTEgMy44MSAxMiA1LjA5QzEzLjA5IDMuODEgMTQuNzYgMyAxNi41IDNDMTkuNTggMyAyMiA1LjQyIDIyIDguNUMyMiAxMi4yNyAxOC42IDE1LjM2IDEzLjQ1IDIwLjA0TDEyIDIxLjM1WiIvPjwvc3ZnPg==";

/**
 * Navbar Global: Inteligente y Contextual
 * Muestra la versión Full en Inicio y otras páginas, y la versión Simple en Tienda.
 */
export default function Navbar({ onHeartClick, onStarClick }) {
  const { usuario, logout, cargandoSesion, isLoggedInHint, userNameHint, vistaAdmin, setVistaAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  const isSimple = location.pathname === '/tienda' || location.pathname === '/guia' || location.pathname === '/vestier' || location.pathname === '/explora' || location.pathname === '/contacto';
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setDropdownAbierto(false);
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-[100] w-full pointer-events-none pt-2">
      {/* Fondo de Nube SVG */}
      <div className="absolute top-0 left-0 w-full h-[160px] md:h-[200px] z-0 pointer-events-auto">
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.08))' }}>
          <defs>
            <filter id="cloudBorderUser" x="-10%" y="-10%" width="120%" height="120%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="DILATED" />
              <feFlood floodColor="#0284c7" />
              <feComposite in2="DILATED" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path fill="#ffffff" d="M0 0 v 60 Q 100 150 200 60 Q 300 150 400 60 Q 500 150 600 60 Q 700 150 800 60 Q 900 150 1000 60 v -60 z" />
        </svg>
      </div>

      <div className="px-4 md:px-12 h-[64px] md:h-[80px] flex justify-between items-center pointer-events-auto relative z-10 w-full max-w-[1536px] mx-auto">
        
        {/* LADO IZQUIERDO: LOGO (POSICIÓN UNIFICADA) */}
        <div 
          className="flex items-center mt-2 md:mt-4 translate-x-2 md:translate-x-8 relative cursor-pointer" 
          onClick={() => !isSimple && navigate('/')}
        >
          {isSimple ? (
            <div className="flex justify-center items-center md:min-w-[135px]">
              <img 
                src={
                location.pathname === '/guia' 
                  ? "/src/assets/lotso_bear.png" 
                  : location.pathname === '/vestier'
                    ? "/src/assets/jessy_heart.png"
                    : location.pathname === '/explora'
                      ? "/src/assets/aliens_friends.png"
                      : location.pathname === '/contacto'
                        ? "/src/assets/buzz_heart.png"
                        : "/src/assets/woody_heart.png"
              } 
                alt="Toy Store Simple Logo" 
                onError={(e) => { e.target.src = woodyHeartPlaceholder; }}
                className={
                  location.pathname === '/guia' 
                    ? "h-[65px] md:h-[95px] w-auto object-contain z-20 drop-shadow-sm transition-transform hover:scale-105 active:scale-95 translate-x-1 md:translate-x-3"
                    : location.pathname === '/vestier'
                      ? "h-[95px] md:h-[135px] w-auto object-contain z-20 drop-shadow-sm transition-transform hover:scale-105 active:scale-95 translate-x-1 md:translate-x-2"
                      : location.pathname === '/explora'
                        ? "h-[140px] md:h-[200px] w-auto object-contain z-20 drop-shadow-sm transition-transform hover:scale-105 active:scale-95 translate-x-[-10px] md:translate-x-[-20px]"
                        : location.pathname === '/contacto'
                          ? "h-[120px] md:h-[180px] w-auto object-contain z-20 drop-shadow-sm transition-transform hover:scale-105 active:scale-95 translate-x-[-5px] md:translate-x-[-10px]"
                          : "h-[95px] md:h-[135px] w-auto object-contain z-20 drop-shadow-sm transition-transform hover:scale-105 active:scale-95"
                } 
              />
            </div>
          ) : (
            <>
              <img src={ToyStoreLogoImg} alt="Toy Store Logo" className="h-[95px] md:h-[135px] w-auto object-contain z-20 drop-shadow-sm transition-transform hover:scale-105" />
              <div className="absolute top-[110px] md:top-[140px] left-1/2 -translate-x-1/2 z-10 scale-60 md:scale-75 lg:scale-80 origin-top">
                <ToyMobile onHeartClick={onHeartClick} onStarClick={onStarClick} />
              </div>
            </>
          )}
        </div>

        {/* CENTRO: NAVEGACIÓN (CENTRADO ABSOLUTO) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 lg:gap-10 text-blue-900 font-bold text-[13px] lg:text-[15px] uppercase tracking-widest z-30">
          <NavHoverItem label="Inicio" iconType="vagina" baseColorClass="text-blue-500" hoverColorClass="hover:text-blue-500" isActive={isActive('/')} onClick={() => navigate('/')} />
          <NavHoverItem label="Tienda" iconType="phallic" baseColorClass="text-yellow-500" hoverColorClass="hover:text-yellow-500" isActive={isActive('/tienda')} onClick={() => navigate('/tienda')} />
          <NavHoverItem label="Guía" iconType="handcuffs" baseColorClass="text-pink-600" hoverColorClass="hover:text-pink-600" isActive={isActive('/guia')} onClick={() => navigate('/guia')} />
          <NavHoverItem label="Vestier" iconType="rabbit" baseColorClass="text-red-500" hoverColorClass="hover:text-red-500" isActive={isActive('/vestier')} onClick={() => navigate('/vestier')} />
          <NavHoverItem label="Explora" iconType="whip" baseColorClass="text-green-500" hoverColorClass="hover:text-green-500" isActive={isActive('/explora')} onClick={() => navigate('/explora')} />
          <NavHoverItem label="Contacto" iconType="plug" baseColorClass="text-purple-600" hoverColorClass="hover:text-purple-600" isActive={isActive('/contacto')} onClick={() => navigate('/contacto')} />
        </div>

        {/* LADO DERECHO: PERFIL (SOLO SI NO ES SIMPLE) */}
        {!isSimple ? (
          <div className="flex items-center gap-6 border-l pl-6 md:pl-10 border-gray-200 relative">
            <div className="relative translate-x-2 md:translate-x-4">
              <button
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                className="w-10 h-10 md:w-[42px] md:h-[42px] rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center hover:border-blue-400 transition-colors relative"
              >
                <CowboyHat className="absolute -top-5 left-1/2 -translate-x-1/2 w-[45px] z-20 drop-shadow-sm pointer-events-none" />

                {(usuario || (cargandoSesion && isLoggedInHint)) ? (
                  <img
                    src={`https://ui-avatars.com/api/?name=${(usuario ? usuario.nombre : userNameHint).replace(" ", "+")}&background=0284c7&color=fff`}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center pt-1.5">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </button>

              {dropdownAbierto && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setDropdownAbierto(false)}></div>
                  {(usuario || (cargandoSesion && isLoggedInHint)) ? (
                    <div className="dropdown-container absolute right-2 top-[85px] w-[280px] z-[110] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
                      <style>{`
                        @keyframes float-cloud-user {
                          0%, 100% { transform: translateY(0px) rotate(0deg); }
                          50% { transform: translateY(-4px) rotate(-1deg); }
                        }
                        .animate-float-cloud-user { animation: float-cloud-user 4s ease-in-out infinite; }
                      `}</style>
                      
                      <div className="relative animate-float-cloud-user pointer-events-auto">
                        <div className="absolute -top-[18px] right-[45px] w-[18px] h-[18px] bg-white rounded-full drop-shadow-sm border-[1.5px] border-[#0284c7]"></div>
                        <div className="absolute -top-[38px] right-[30px] w-2.5 h-2.5 bg-white rounded-full drop-shadow-sm border-[1px] border-[#0284c7]"></div>
                        
                        <div className="relative drop-shadow-[0_10px_20px_rgba(2,132,199,0.15)] flex justify-center items-center p-2 pt-8 pb-3 min-h-[220px]">
                          <div className="absolute inset-0 z-[-1] flex justify-center items-center w-full h-[110%]">
                            <svg viewBox="0 0 240 180" className="w-[110%] h-full overflow-visible">
                              <defs>
                                {/* Filtro ya definido globalmente en el fondo de la Navbar */}
                              </defs>
                              <g filter="url(#cloudBorderUser)" fill="white">
                                <rect x="30" y="50" width="180" height="100" rx="40" />
                                <circle cx="120" cy="40" r="50" />
                                <circle cx="185" cy="65" r="50" />
                                <circle cx="55" cy="70" r="45" />
                                <circle cx="30" cy="115" r="45" />
                                <circle cx="210" cy="110" r="50" />
                                <circle cx="85" cy="150" r="45" />
                                <circle cx="155" cy="150" r="45" />
                              </g>
                            </svg>
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-center w-full px-5">
                            <div className="w-full h-8 mb-4 pointer-events-none">
                              <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
                                <path id="curveUserName" fill="transparent" d="M 15,40 Q 100,-10 185,40" />
                                <text width="200" className="text-[17px] font-black fill-[#0369a1] tracking-[1px] uppercase">
                                  <textPath href="#curveUserName" startOffset="50%" textAnchor="middle">
                                    ¡HOLA, {usuario ? usuario.nombre.split(' ')[0] : userNameHint.split(' ')[0]}!
                                  </textPath>
                                </text>
                              </svg>
                            </div>

                            <div className="flex flex-col gap-2 w-full max-w-[180px]">
                              {(usuario?.email === "alvarezfrancomariana@gmail.com" || 
                                usuario?.email === "saraguevara192@gmail.com" || 
                                usuario?.rol === 1) && (
                                <button
                                  onClick={() => { 
                                    const nuevaVista = !vistaAdmin;
                                    setVistaAdmin(nuevaVista); 
                                    setDropdownAbierto(false); 
                                    if (nuevaVista) navigate("/admin");
                                    else navigate("/");
                                  }}
                                  className="w-full bg-blue-50 hover:bg-blue-100 text-[#0369a1] font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase border-2 border-blue-200 flex items-center justify-center gap-2 group shadow-sm"
                                >
                                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                  {vistaAdmin ? 'Modo Cliente' : 'Modo Admin'}
                                </button>
                              )}

                              <button
                                onClick={() => { setDropdownAbierto(false); navigate("/configuracion"); }}
                                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase border-2 border-slate-200 flex items-center justify-center gap-2 shadow-sm"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Configuración
                              </button>

                              <button
                                onClick={(e) => {
                                  const container = e.currentTarget.closest('.dropdown-container');
                                  if(container) {
                                    container.style.transition = 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)';
                                    container.style.transformOrigin = 'top right';
                                    container.style.transform = 'scale(0.2)';
                                    container.style.opacity = '0';
                                    setTimeout(() => { handleLogout(); }, 380);
                                  } else {
                                    handleLogout();
                                  }
                                }}
                                className="w-full bg-red-50 hover:bg-red-500 hover:text-white text-red-500 font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase border-2 border-red-200 flex items-center justify-center gap-2 shadow-sm group"
                              >
                                <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Cerrar Sesión
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="dropdown-container absolute right-2 top-[85px] w-[280px] z-[110] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
                      <style>{`
                        @keyframes float-cloud-guest {
                          0%, 100% { transform: translateY(0px) rotate(0deg); }
                          50% { transform: translateY(-4px) rotate(-1deg); }
                        }
                        .animate-float-cloud-guest { animation: float-cloud-guest 4s ease-in-out infinite; }
                      `}</style>
                      
                      <div className="relative animate-float-cloud-guest pointer-events-auto">
                        <div className="absolute -top-[18px] right-[45px] w-[18px] h-[18px] bg-white rounded-full drop-shadow-sm border-[1.5px] border-[#0284c7]"></div>
                        <div className="absolute -top-[38px] right-[30px] w-2.5 h-2.5 bg-white rounded-full drop-shadow-sm border-[1px] border-[#0284c7]"></div>
                        
                        <div className="relative drop-shadow-[0_10px_20px_rgba(2,132,199,0.15)] flex justify-center items-center p-2 pt-8 pb-3 min-h-[220px]">
                          <div className="absolute inset-0 z-[-1] flex justify-center items-center w-full h-[110%]">
                            <svg viewBox="0 0 240 180" className="w-[110%] h-full overflow-visible">
                              <g filter="url(#cloudBorderUser)" fill="white">
                                <rect x="30" y="50" width="180" height="100" rx="40" />
                                <circle cx="120" cy="40" r="50" />
                                <circle cx="185" cy="65" r="50" />
                                <circle cx="55" cy="70" r="45" />
                                <circle cx="30" cy="115" r="45" />
                                <circle cx="210" cy="110" r="50" />
                                <circle cx="85" cy="150" r="45" />
                                <circle cx="155" cy="150" r="45" />
                              </g>
                            </svg>
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-center w-full px-5">
                            {/* Texto Curvo Idéntico */}
                            <div className="w-full h-8 mb-4 pointer-events-none">
                                <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
                                    <path id="curveGuestName" fill="transparent" d="M 15,40 Q 100,-10 185,40" />
                                    <text width="200" className="text-[17px] font-black fill-[#0369a1] tracking-[1px] uppercase">
                                        <textPath href="#curveGuestName" startOffset="50%" textAnchor="middle">
                                            ¡HOLA, INVITADO!
                                        </textPath>
                                    </text>
                                </svg>
                            </div>

                            <div className="flex flex-col gap-2 w-full max-w-[180px]">
                                <button
                                  onClick={() => { setDropdownAbierto(false); navigate('/login'); }}
                                  className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 shadow-md active:scale-95"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                  Iniciar Sesión
                                </button>

                                <button
                                  onClick={() => { setDropdownAbierto(false); navigate('/registro'); }}
                                  className="w-full bg-slate-50 hover:bg-slate-100 text-[#0284c7] font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase border-2 border-slate-200 flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                  Registrarse
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* ESPACIO VACÍO PARA BALANCER EL LOGO EN MODO SIMPLE */
          <div className="w-[100px] hidden md:block"></div>
        )}
      </div>
    </nav>
  );
}
