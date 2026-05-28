import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ToyStoreLogoImg from '../assets/logo_official.png';
import ToyMobile from './ToyMobile';
import NavHoverItem from './NavHoverItem';
import CowboyHat from './CowboyHat';

const woodyHeartPlaceholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0icmVkIj48cGF0aCBkPSJNMTIgMjEuMzVMMTAuNTUgMjAuMDNDNS40IDE1LjM2IDIgMTIuMjcgMiA4LjVDMiA1LjQyIDQuNDIgMyA3LjUgM0M5LjI0IDMgMTAuOTEgMy44MSAxMiA1LjA5QzEzLjA5IDMuODEgMTQuNzYgMyAxNi41IDNDMTkuNTggMyAyMiA1LjQyIDIyIDguNUMyMiAxMi4yNyAxOC42IDE1LjM2IDEzLjQ1IDIwLjA0TDEyIDIxLjM1WiIvPjwvc3ZnPg==";

const NAV_ITEMS = [
  { label: 'Inicio',   iconType: 'vagina',    path: '/',            colorClass: 'text-blue-500' },
  { label: 'Tienda',   iconType: 'phallic',   path: '/tienda',      colorClass: 'text-yellow-500' },
  { label: 'Guía',     iconType: 'handcuffs', path: '/guia',        colorClass: 'text-pink-600' },
  { label: 'Vestier',  iconType: 'rabbit',    path: '/vestier',     colorClass: 'text-red-500' },
  { label: 'Explora',  iconType: 'whip',      path: '/explora',     colorClass: 'text-green-500' },
  { label: 'Contacto', iconType: 'plug',      path: '/contacto',    colorClass: 'text-purple-600' },
];

export default function Navbar({ onHeartClick, onStarClick }) {
  const auth = useContext(AuthContext);
  const {
    usuario, logout, cargandoSesion, isLoggedInHint,
    userNameHint, vistaAdmin, setVistaAdmin
  } = auth || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const isSimple = ['/tienda', '/guia', '/vestier', '/explora', '/contacto'].includes(location.pathname);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setDropdownAbierto(false);
    setMenuMovilAbierto(false);
    logout();
    navigate('/');
  };

  const handleNav = (path) => {
    setMenuMovilAbierto(false);
    navigate(path);
  };

  const getSimpleLogoSrc = () => {
    const map = {
      '/guia':     '/src/assets/lotso_bear.png',
      '/vestier':  '/src/assets/jessy_heart.png',
      '/explora':  '/src/assets/aliens_friends.png',
      '/contacto': '/src/assets/buzz_heart.png',
    };
    return map[location.pathname] || '/src/assets/woody_heart.png';
  };

  const getSimpleLogoClass = () => {
    const map = {
      '/guia':     'h-[55px] md:h-[95px]',
      '/vestier':  'h-[75px] md:h-[135px]',
      '/explora':  'h-[90px] md:h-[200px]',
      '/contacto': 'h-[80px] md:h-[180px]',
    };
    return `${map[location.pathname] || 'h-[75px] md:h-[135px]'} w-auto object-contain z-20 drop-shadow-sm transition-transform hover:scale-105 active:scale-95`;
  };

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full pointer-events-none pt-2">
        {/* Fondo Nube SVG */}
        <div className="absolute top-0 left-0 w-full h-[120px] md:h-[200px] z-0 pointer-events-auto">
          <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.08))' }}>
            <path fill="#ffffff" d="M0 0 v 60 Q 100 150 200 60 Q 300 150 400 60 Q 500 150 600 60 Q 700 150 800 60 Q 900 150 1000 60 v -60 z" />
          </svg>
        </div>

        <div className="px-4 md:px-12 h-[56px] md:h-[80px] flex justify-between items-center pointer-events-auto relative z-10 w-full max-w-[1536px] mx-auto">

          {/* LOGO IZQUIERDO */}
          <div
            className="flex items-center mt-1 md:mt-4 translate-x-1 md:translate-x-8 relative cursor-pointer"
            onClick={() => !isSimple && navigate('/')}
          >
            {isSimple ? (
              <div className="flex justify-center items-center">
                <img
                  src={getSimpleLogoSrc()}
                  alt="Toy Store Logo"
                  onError={(e) => { e.target.src = woodyHeartPlaceholder; }}
                  className={getSimpleLogoClass()}
                />
              </div>
            ) : (
              <>
                <img src={ToyStoreLogoImg} alt="Toy Store Logo" className="h-[75px] md:h-[135px] w-auto object-contain z-20 drop-shadow-sm transition-transform hover:scale-105" />
                <div className="absolute top-[88px] md:top-[140px] left-1/2 -translate-x-1/2 z-10 scale-50 md:scale-75 lg:scale-80 origin-top hidden md:block">
                  <ToyMobile onHeartClick={onHeartClick} onStarClick={onStarClick} />
                </div>
              </>
            )}
          </div>

          {/* NAVEGACIÓN DESKTOP (solo md en adelante) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-4 lg:gap-10 text-blue-900 font-bold text-[13px] lg:text-[15px] uppercase tracking-widest z-30">
            {NAV_ITEMS.map(item => (
              <NavHoverItem
                key={item.path}
                label={item.label}
                iconType={item.iconType}
                baseColorClass={item.colorClass}
                hoverColorClass={`hover:${item.colorClass}`}
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>

          {/* LADO DERECHO: Hamburguesa (móvil) + Avatar */}
          <div className="flex items-center gap-3">

            {/* BOTÓN HAMBURGUESA (solo móvil) */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl bg-white/80 border-2 border-gray-200 shadow-sm gap-[5px] active:scale-95 transition-transform"
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              aria-label="Menú"
            >
              <span className={`block w-5 h-0.5 bg-blue-900 rounded-full transition-all duration-300 ${menuMovilAbierto ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-blue-900 rounded-full transition-all duration-300 ${menuMovilAbierto ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-blue-900 rounded-full transition-all duration-300 ${menuMovilAbierto ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
            </button>

            {/* AVATAR / PERFIL */}
            <div className="flex items-center gap-4 border-l pl-3 md:pl-10 border-gray-200 relative">
              <div className="relative translate-x-1 md:translate-x-4">
                <button
                  onClick={() => setDropdownAbierto(!dropdownAbierto)}
                  className="w-9 h-9 md:w-[42px] md:h-[42px] rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center hover:border-blue-400 transition-colors relative"
                >
                  <CowboyHat className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 w-[38px] md:w-[45px] z-20 drop-shadow-sm pointer-events-none" />
                  {(usuario || (cargandoSesion && isLoggedInHint)) ? (
                    <img
                      src={usuario?.avatar_url || usuario?.avatar || `https://ui-avatars.com/api/?name=${(usuario ? usuario.nombre : userNameHint).replace(" ", "+")}&background=0284c7&color=fff`}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center pt-1.5">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </button>

                {dropdownAbierto && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setDropdownAbierto(false)}></div>
                    {(usuario || (cargandoSesion && isLoggedInHint)) ? (
                      <div className="dropdown-container absolute right-0 top-[70px] md:top-[85px] w-[240px] md:w-[280px] z-[110] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
                        <style>{`
                          @keyframes float-cloud-user { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
                          .animate-float-cloud-user { animation: float-cloud-user 4s ease-in-out infinite; }
                        `}</style>
                        <div className="relative animate-float-cloud-user pointer-events-auto">
                          <div className="absolute -top-[18px] right-[40px] w-[18px] h-[18px] bg-white rounded-full drop-shadow-sm border-[1.5px] border-[#0284c7]"></div>
                          <div className="absolute -top-[38px] right-[28px] w-2.5 h-2.5 bg-white rounded-full drop-shadow-sm border-[1px] border-[#0284c7]"></div>
                          <div className="relative drop-shadow-[0_10px_20px_rgba(2,132,199,0.15)] flex justify-center items-center p-2 pt-8 pb-3 min-h-[200px]">
                            <div className="absolute inset-0 z-[-1] flex justify-center items-center w-full h-[110%]">
                              <svg viewBox="0 0 240 180" className="w-[110%] h-full overflow-visible">
                                <defs>
                                  <filter id="cloudBorderUserDD">
                                    <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="DILATED" />
                                    <feFlood floodColor="#0284c7" />
                                    <feComposite in2="DILATED" operator="in" />
                                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                                  </filter>
                                </defs>
                                <g filter="url(#cloudBorderUserDD)" fill="white">
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
                            <div className="relative z-10 flex flex-col items-center w-full px-4">
                              <div className="w-full h-7 mb-3 pointer-events-none">
                                <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible">
                                  <path id="curveUserNameDD" fill="transparent" d="M 15,40 Q 100,-10 185,40" />
                                  <text width="200" className="text-[15px] font-black fill-[#0369a1] tracking-[1px] uppercase">
                                    <textPath href="#curveUserNameDD" startOffset="50%" textAnchor="middle">
                                      ¡HOLA, {usuario ? usuario.nombre.split(' ')[0] : (userNameHint || '').split(' ')[0]}!
                                    </textPath>
                                  </text>
                                </svg>
                              </div>
                              <div className="flex flex-col gap-2 w-full max-w-[170px]">
                                {(usuario?.email === "alvarezfrancomariana@gmail.com" || usuario?.email === "saraguevara192@gmail.com" || usuario?.rol === 1) && (
                                  <button
                                    onClick={() => { const v = !vistaAdmin; setVistaAdmin(v); setDropdownAbierto(false); if (v) navigate("/admin"); else navigate("/"); }}
                                    className="w-full bg-blue-50 hover:bg-blue-100 text-[#0369a1] font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase border-2 border-blue-200 flex items-center justify-center gap-2 shadow-sm"
                                  >
                                    {vistaAdmin ? 'Modo Cliente' : 'Modo Admin'}
                                  </button>
                                )}
                                <button onClick={() => { setDropdownAbierto(false); navigate("/configuracion"); }} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase border-2 border-slate-200 flex items-center justify-center gap-2 shadow-sm">
                                  Configuración
                                </button>
                                <button onClick={handleLogout} className="w-full bg-red-50 hover:bg-red-500 hover:text-white text-red-500 font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase border-2 border-red-200 flex items-center justify-center gap-2 shadow-sm">
                                  Cerrar Sesión
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="dropdown-container absolute right-0 top-[70px] md:top-[85px] w-[240px] md:w-[280px] z-[110] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
                        <style>{`
                          @keyframes float-cloud-guest { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
                          .animate-float-cloud-guest { animation: float-cloud-guest 4s ease-in-out infinite; }
                        `}</style>
                        <div className="relative animate-float-cloud-guest pointer-events-auto">
                          <div className="absolute -top-[18px] right-[40px] w-[18px] h-[18px] bg-white rounded-full drop-shadow-sm border-[1.5px] border-[#0284c7]"></div>
                          <div className="absolute -top-[38px] right-[28px] w-2.5 h-2.5 bg-white rounded-full drop-shadow-sm border-[1px] border-[#0284c7]"></div>
                          <div className="relative drop-shadow-[0_10px_20px_rgba(2,132,199,0.15)] flex justify-center items-center p-2 pt-8 pb-3 min-h-[180px]">
                            <div className="absolute inset-0 z-[-1] flex justify-center items-center w-full h-[110%]">
                              <svg viewBox="0 0 240 180" className="w-[110%] h-full overflow-visible">
                                <g filter="url(#cloudBorderUserDD)" fill="white">
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
                            <div className="relative z-10 flex flex-col items-center w-full px-4">
                              <div className="w-full h-7 mb-3 pointer-events-none">
                                <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible">
                                  <path id="curveGuestNameDD" fill="transparent" d="M 15,40 Q 100,-10 185,40" />
                                  <text width="200" className="text-[15px] font-black fill-[#0369a1] tracking-[1px] uppercase">
                                    <textPath href="#curveGuestNameDD" startOffset="50%" textAnchor="middle">¡HOLA, INVITADO!</textPath>
                                  </text>
                                </svg>
                              </div>
                              <div className="flex flex-col gap-2 w-full max-w-[170px]">
                                <button onClick={() => { setDropdownAbierto(false); navigate('/login'); }} className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 shadow-md active:scale-95">
                                  Iniciar Sesión
                                </button>
                                <button onClick={() => { setDropdownAbierto(false); navigate('/registro'); }} className="w-full bg-slate-50 hover:bg-slate-100 text-[#0284c7] font-black py-2 px-4 rounded-xl transition-all text-[10px] tracking-widest uppercase border-2 border-slate-200 flex items-center justify-center gap-2 shadow-sm active:scale-95">
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
          </div>
        </div>
      </nav>

      {/* ════════ MENÚ MÓVIL DESPLEGABLE ════════ */}
      {menuMovilAbierto && (
        <>
          {/* Fondo oscuro */}
          <div className="fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMenuMovilAbierto(false)}></div>

          {/* Panel lateral */}
          <div className="fixed top-0 right-0 h-full w-[78vw] max-w-[320px] z-[99] bg-white shadow-2xl flex flex-col md:hidden animate-in slide-in-from-right duration-300">
            {/* Cabecera del panel */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="text-lg font-black text-blue-900 uppercase tracking-widest">Menú</span>
              <button onClick={() => setMenuMovilAbierto(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg hover:bg-gray-200 active:scale-90 transition-all">×</button>
            </div>

            {/* Navegación */}
            <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-left transition-all active:scale-95 ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-xl">
                    {item.path === '/' ? '🏠' : item.path === '/tienda' ? '🛍️' : item.path === '/guia' ? '📖' : item.path === '/vestier' ? '👗' : item.path === '/explora' ? '🌟' : '📬'}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Pie con sesión */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              {(usuario || (cargandoSesion && isLoggedInHint)) ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-2xl border-2 border-blue-100 mb-2">
                    <img
                      src={usuario?.avatar_url || usuario?.avatar || `https://ui-avatars.com/api/?name=${(usuario ? usuario.nombre : userNameHint || '').replace(" ", "+")}&background=0284c7&color=fff`}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div>
                      <p className="text-xs font-black text-blue-900 uppercase">{usuario?.nombre || userNameHint}</p>
                      <p className="text-[10px] text-blue-400 font-bold">{usuario?.email}</p>
                    </div>
                  </div>
                  {(usuario?.email === "alvarezfrancomariana@gmail.com" || usuario?.email === "saraguevara192@gmail.com" || usuario?.rol === 1) && (
                    <button onClick={() => { const v = !vistaAdmin; setVistaAdmin(v); setMenuMovilAbierto(false); if (v) navigate("/admin"); else navigate("/"); }} className="w-full bg-blue-50 text-blue-700 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest border-2 border-blue-200">
                      {vistaAdmin ? 'Modo Cliente' : 'Modo Admin'}
                    </button>
                  )}
                  <button onClick={() => { setMenuMovilAbierto(false); navigate('/configuracion'); }} className="w-full bg-slate-50 text-slate-600 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest border-2 border-slate-200">
                    Configuración
                  </button>
                  <button onClick={handleLogout} className="w-full bg-red-50 text-red-500 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest border-2 border-red-200">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMenuMovilAbierto(false); navigate('/login'); }} className="w-full bg-[#0284c7] text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest shadow-md">
                    Iniciar Sesión
                  </button>
                  <button onClick={() => { setMenuMovilAbierto(false); navigate('/registro'); }} className="w-full bg-slate-50 text-[#0284c7] font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest border-2 border-slate-200">
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
