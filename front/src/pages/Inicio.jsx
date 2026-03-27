import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import SavePasswordPrompt from "../components/SavePasswordPrompt";
import { AuthContext } from "../context/AuthContext";
import WoodyBuzzImg from "../assets/woody_buzz_nobg.png";
import ToyStoreLogoImg from "../assets/logo_official.png";
import ToyStoreLogo from "../components/ToyStoreLogo";
import CowboyHat from "../components/CowboyHat";
import RoomWrapper from "../components/RoomWrapper";
const ToyPlane = () => {
  const [drops, setDrops] = useState([]);
  const [smoke, setSmoke] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [direction, setDirection] = useState('right');
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (waiting) return;
    // Generar Humo (Cada 500ms)
    const smokeInterval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9);
      setSmoke(prev => [...prev, { id }]);
      setTimeout(() => setSmoke(prev => prev.filter(s => s.id !== id)), 2000);
    }, 400);

    // Generar Juguetes (Cada 2s)
    const toyInterval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9);
      setDrops(prev => [...prev, { id }]);
      setTimeout(() => setDrops(prev => prev.filter(d => d.id !== id)), 3000);
    }, 2000);

    return () => {
      clearInterval(smokeInterval);
      clearInterval(toyInterval);
    };
  }, [key, waiting]);

  const handleAnimationEnd = () => {
    setWaiting(true);
    setTimeout(() => {
      setDirection(prev => prev === 'right' ? 'left' : 'right');
      setKey(prev => prev + 1);
      setWaiting(false);
    }, 500); 
  };

  if (waiting) return null;

  return (
    <div className="absolute top-36 left-0 w-full h-[35vh] overflow-visible pointer-events-none z-[40]">
      <div 
        key={key}
        onAnimationEnd={handleAnimationEnd}
        className={`absolute flex items-center ${direction === 'right' ? 'flex-row animate-fly-right' : 'flex-row animate-fly-left'}`}
      >
        <div className="relative flex items-center">
           {/* Lógica de vuelo: Siempre el avión delante del cartel */}
           {direction === 'right' ? (
             <>
               <div className="plane-banner order-1">¡UN UNIVERSO DE PLACER TE ESPERA!</div>
               <div className="banner-rope order-2"></div>
               <div className="relative order-3">
                 <img src="/images/plane_right.png?v=14" className="w-32 md:w-48 h-auto" style={{ background: 'transparent' }} />
                 {smoke.map(s => (
                   <div key={s.id} className="absolute top-1/2 -translate-y-1/2 left-4 animate-smoke-puff">
                     <div className="w-8 h-8 bg-white/5 blur-md rounded-full"></div>
                   </div>
                 ))}
               </div>
             </>
           ) : (
             <>
               <div className="relative order-1">
                 <img src="/images/plane_left.png?v=14" className="w-32 md:w-48 h-auto" style={{ background: 'transparent' }} />
                 {smoke.map(s => (
                   <div key={s.id} className="absolute top-1/2 -translate-y-1/2 right-4 animate-smoke-puff">
                     <div className="w-8 h-8 bg-white/5 blur-md rounded-full"></div>
                   </div>
                 ))}
               </div>
               <div className="banner-rope order-2"></div>
               <div className="plane-banner order-3">¡UN UNIVERSO DE PLACER TE ESPERA!</div>
             </>
           )}
        </div>
        
        {/* Juguetes que caen (Sorpresas) */}
        {drops.map(drop => (
          <div 
            key={drop.id} 
            className="absolute top-24 left-1/2 -translate-x-1/2 animate-drop-fade text-4xl md:text-5xl opacity-40 blur-[1.5px]"
          >
            🍆
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Inicio() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  // Control de vista (solo para admins)
  const [vistaAdmin, setVistaAdmin] = useState(usuario?.rol === 1);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleLogout = () => {
    setDropdownAbierto(false);
    setCerrandoSesion(true);
    
    // Transición ultra rápida y natural
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 600);
  };

  const wallpaperAndy = (
    <div className="absolute inset-0 select-none pointer-events-none opacity-[0.15]">
       {/* Hilera 1 */}
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '5%', left: '5%', height: '170px', transform: 'rotate(-10deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '3%', left: '30%', height: '150px', transform: 'rotate(15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '6%', left: '55%', height: '160px', transform: 'rotate(-5deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '2%', left: '80%', height: '180px', transform: 'rotate(25deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       
       {/* Hilera 2 */}
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '22%', left: '15%', height: '190px', transform: 'rotate(50deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '18%', left: '42%', height: '175px', transform: 'rotate(-15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '20%', left: '68%', height: '165px', transform: 'rotate(-10deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '23%', left: '92%', height: '160px', transform: 'rotate(10deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

       {/* Hilera 3 */}
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '40%', left: '8%', height: '185px', transform: 'rotate(-25deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '38%', left: '33%', height: '210px', transform: 'rotate(15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '42%', left: '58%', height: '165px', transform: 'rotate(8deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '39%', left: '85%', height: '195px', transform: 'rotate(-30deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

       {/* Hilera 4 */}
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '58%', left: '18%', height: '170px', transform: 'rotate(20deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '54%', left: '46%', height: '180px', transform: 'rotate(-40deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '60%', left: '72%', height: '200px', transform: 'rotate(35deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '57%', left: '94%', height: '155px', transform: 'rotate(-10deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

       {/* Hilera 5 */}
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '76%', left: '6%', height: '175px', transform: 'rotate(12deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '74%', left: '29%', height: '190px', transform: 'rotate(-15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '78%', left: '52%', height: '205px', transform: 'rotate(25deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '72%', left: '81%', height: '170px', transform: 'rotate(-20deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

       {/* Hilera 6 */}
       <img src="/images/custom_pene.svg?v=18" className="absolute" style={{ top: '92%', left: '12%', height: '180px', transform: 'rotate(45deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=18" className="absolute" style={{ top: '89%', left: '40%', height: '165px', transform: 'rotate(-12deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_pene.svg?v=18" className="absolute" style={{ top: '91%', left: '65%', height: '190px', transform: 'rotate(15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
       <img src="/images/custom_vulva.svg?v=18" className="absolute" style={{ top: '88%', left: '88%', height: '175px', transform: 'rotate(-30deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
    </div>
  );

  return (
    <RoomWrapper theme={vistaAdmin ? 'woody' : 'andy'} wallpaperContent={wallpaperAndy}>
      <SavePasswordPrompt />
      {/* --- NAVBAR (Diseño de Nube - Andy's Room) --- */}
      <nav className="sticky top-0 z-[100] w-full pointer-events-none">
        {/* Navbar Original Restaurada (Estable y Limpia) */}
        <div className="bg-white px-8 py-4 flex justify-between items-center shadow-md shadow-black/5 pointer-events-auto relative">
          <div 
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200"
            onClick={() => navigate("/")}
          >
            <img src={ToyStoreLogoImg} alt="Toy Store Logo" className="h-[60px] md:h-[75px] w-auto object-contain" />
          </div>

          <div className="hidden lg:flex items-center gap-10 text-gray-700 font-bold text-[13px] uppercase tracking-wider">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Inicio</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={() => navigate('/tienda')}>Tienda</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={() => navigate('/guia')}>Guia</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={() => navigate('/explora')}>Explora</a>
            <a href="#" className="hover:text-blue-500 transition-colors" onClick={() => navigate('/contacto')}>Contacto</a>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 lg:border-l pl-2 lg:pl-8 border-gray-100 relative">
            {/* Hamburger Button (Mobile Only) */}
            <button 
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {usuario && (
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sargento al mando:</span>
                <span className="text-sm font-black text-blue-900 uppercase">{usuario.nombre}</span>
              </div>
            )}

            {/* Perfil Link */}
            <div className="relative">
              <button 
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                className="w-12 h-12 rounded-full bg-white border-2 border-blue-500 shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all relative"
              >
                {usuario?.nombre ? (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${usuario.nombre.replace(" ", "+")}&background=0284c7&color=fff`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center pt-2">
                    <CowboyHat className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 z-20 drop-shadow-md" />
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </button>

              {dropdownAbierto && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setDropdownAbierto(false)}></div>
                  <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl py-2 border border-blue-50 overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200">
                    {usuario ? (
                      <div className="flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50 text-center">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Estado Corporal</p>
                          <p className="text-xs font-bold text-blue-900 uppercase mt-1">{usuario.email}</p>
                        </div>
                        {usuario.rol === 1 && (
                          <button 
                            className="w-full text-left px-6 py-4 text-xs text-blue-600 hover:bg-blue-50 font-black flex items-center gap-3 transition"
                            onClick={() => { setVistaAdmin(!vistaAdmin); setDropdownAbierto(false); }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            {vistaAdmin ? 'VISTA CLIENTE' : 'VISTA ADMIN'}
                          </button>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-6 py-4 text-xs text-red-600 hover:bg-red-50 font-black flex items-center gap-3 transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          CERRAR SESIÓN
                        </button>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                         <button onClick={() => navigate("/login")} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition text-xs tracking-widest">INGRESAR</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuAbierto && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
            <a href="#" className="p-4 border-b border-gray-50 text-blue-600 font-bold uppercase text-center" onClick={() => setMenuAbierto(false)}>Inicio</a>
            <a href="#" className="p-4 border-b border-gray-50 text-gray-600 font-bold uppercase text-center hover:bg-gray-50 transition" onClick={() => { navigate('/tienda'); setMenuAbierto(false); }}>Tienda</a>
            <a href="#" className="p-4 border-b border-gray-50 text-gray-600 font-bold uppercase text-center hover:bg-gray-50 transition" onClick={() => { navigate('/guia'); setMenuAbierto(false); }}>Guia</a>
            <a href="#" className="p-4 border-b border-gray-50 text-gray-600 font-bold uppercase text-center hover:bg-gray-50 transition" onClick={() => { navigate('/explora'); setMenuAbierto(false); }}>Explora</a>
            <a href="#" className="p-4 text-gray-600 font-bold uppercase text-center hover:bg-gray-50 transition" onClick={() => { navigate('/contacto'); setMenuAbierto(false); }}>Contacto</a>
          </div>
        )}
      </nav>

      {/* --- HABITACIÓN DE ANDY / MAQUETA --- */}
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-6 relative">
        <div className="w-full max-w-2xl mt-44 z-30 relative group px-6 mx-auto">
          <div className="relative bg-[#fdfaf6] border-[8px] border-white rounded-t-[100px] rounded-b-xl shadow-[15px_15px_40px_rgba(0,0,0,0.08),inset_0_0_15px_rgba(0,0,0,0.03)] overflow-hidden min-h-[500px] flex flex-col border-b-[12px]">
            <div className="h-24 w-full flex items-center justify-center bg-white/50 border-b-2 border-white">
               <div className="px-6 py-1 border-2 border-blue-900/10 rounded-full">
                  <span className="text-[10px] font-black text-blue-900 tracking-[5px] uppercase opacity-40">COLECCIÓN PENSADA EN TI</span>
               </div>
            </div>
            {[
              { items: [{ name: "Vibradores", icon: "🍆", img: "/images/toy_vibrator.png", cat: "vibradores", color: "hover:drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]" }, { name: "Lencerias", icon: "👙", cat: "lencerias", color: "hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]" }] },
              { items: [{ name: "Anales", icon: "🍑", cat: "anales", color: "hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]" }, { name: "Kits", icon: "📦", cat: "kits", color: "hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" }] }
            ].map((shelf, sIdx) => (
              <div key={sIdx} className="relative w-full flex-1 flex flex-col justify-end pb-8 group/shelf border-b border-white last:border-b-0">
                <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>
                <div className="flex justify-around items-end px-10 relative z-10 mb-1">
                  {shelf.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex flex-col items-center group/toy cursor-pointer transition-all duration-500 hover:scale-105" onClick={() => !usuario ? setShowLoginPrompt(true) : navigate(`/tienda?cat=${item.cat}`)}>
                      <div className={`relative transition-all duration-700 ${item.color}`}>
                        {item.img ? ( <img src={item.img} alt={item.name} className="w-24 md:w-32 h-auto object-contain drop-shadow-xl animate-float" /> ) : ( <span className="text-6xl md:text-8xl drop-shadow-lg animate-float block">{item.icon}</span> )}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/5 blur-sm rounded-full opacity-40"></div>
                      </div>
                      <p className="mt-3 text-[9px] font-black text-blue-900/30 uppercase tracking-[2px] text-center">{item.name}</p>
                    </div>
                  ))}
                </div>
                <div className="h-4 w-full bg-gradient-to-b from-white to-[#f5f5f5] shadow-sm border-t border-gray-100"></div>
              </div>
            ))}
          </div>
          <div className="w-[102%] h-[102%] bg-black/5 blur-3xl absolute -top-1 -left-[1%] -z-10 rounded-t-[100px]"></div>
        </div>

        <div className="mt-16 mb-10 z-30">
          <button 
            onClick={() => !usuario ? setShowLoginPrompt(true) : navigate('/tienda')}
            className="btn-red-toystore"
          >
            VER CATÁLOGO
          </button>
        </div>

        <ToyPlane />

        <div className="absolute bottom-[-160px] left-[6%] w-48 h-48 group z-[100] hidden lg:block">
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-2 border-yellow-500 shadow-[25px_25px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-bounce-slow">
               <div className="absolute top-1/2 left-0 w-full h-[22%] -translate-y-1/2 bg-blue-600 border-y-2 border-blue-800/20"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-[55%] h-[55%] fill-red-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                     <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                  </svg>
               </div>
               <div className="absolute top-4 left-8 w-24 h-20 bg-white/30 blur-md rounded-[100%] -rotate-45"></div>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[110%] h-10 bg-black/40 blur-3xl rounded-full scale-y-50"></div>
        </div>

        <div className="absolute bottom-[-155px] right-[8%] pointer-events-none z-[100] hidden md:block scale-110">
            <div className="relative flex flex-col items-center">
               <div className="flex -mb-2 relative z-10 translate-y-1">
                  {[
                     { char: 'S', color: 'bg-red-500', side: 'bg-red-700' },
                     { char: 'E', color: 'bg-blue-600', side: 'bg-blue-800' },
                     { char: 'X', color: 'bg-yellow-400', side: 'bg-yellow-600', text: 'text-blue-900' }
                  ].map((block, i) => (
                     <div key={i} className="relative group/block pointer-events-auto mx-[1px]">
                        <div className={`absolute -top-[12px] left-0 w-full h-[12px] ${block.side} rounded-t-sm origin-bottom [transform:skewX(-45deg)] brightness-125`}></div>
                        <div className={`absolute top-0 -right-[12px] w-[12px] h-full ${block.side} rounded-r-sm origin-left [transform:skewY(-45deg)] brightness-75`}></div>
                        <div className={`w-16 h-16 ${block.color} rounded-sm shadow-lg border-t border-l border-white/20 flex items-center justify-center relative hover:brightness-110 transition-all`}>
                           <span className={`text-4xl font-black ${block.text || 'text-white'} drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]`}>{block.char}</span>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="flex">
                  {[
                     { char: 'S', color: 'bg-green-600', side: 'bg-green-800' },
                     { char: 'H', color: 'bg-orange-500', side: 'bg-orange-700' },
                     { char: 'O', color: 'bg-purple-600', side: 'bg-purple-800' },
                     { char: 'P', color: 'bg-pink-500', side: 'bg-pink-700' }
                  ].map((block, i) => (
                     <div key={i} className="relative group/block pointer-events-auto mx-[1px]">
                        <div className={`absolute top-0 -right-[12px] w-[12px] h-full ${block.side} rounded-r-sm origin-left [transform:skewY(-45deg)] brightness-75`}></div>
                        <div className={`w-16 h-16 ${block.color} rounded-sm shadow-xl border-t border-l border-white/20 flex items-center justify-center relative hover:brightness-110 transition-all`}>
                           <span className={`text-4xl font-black ${block.text || 'text-white'} drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]`}>{block.char}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-8 bg-black/40 blur-2xl rounded-full scale-y-50"></div>
        </div>
      </main>

      {/* --- EFECTO DE CIERRE SUTIL --- */}
      {cerrandoSesion && (
        <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
          <div className="h-1 bg-blue-100 overflow-hidden">
            <div className="h-full bg-blue-600 animate-google-loader"></div>
          </div>
          <div className="fixed inset-0 bg-white/10 backdrop-blur-[1px] animate-in fade-in duration-300"></div>
        </div>
      )}

      {/* --- MODAL LOGIN REQUIRED --- */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative animate-in zoom-in-95 duration-300 border-4 border-yellow-400">
            <button onClick={() => setShowLoginPrompt(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            <div className="text-center mb-6">
              <ToyStoreLogo scale={0.35} />
              <h3 className="text-2xl font-black text-blue-900 uppercase -mt-4">¡Únete a la Diversión!</h3>
              <p className="text-gray-500 text-sm mt-2">Para ver el catálogo completo necesitas una cuenta.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/login')} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 rounded-xl transition shadow-md">INICIAR SESIÓN</button>
              <button onClick={() => navigate('/registro')} className="w-full bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold py-3 rounded-xl transition">REGISTRARSE</button>
            </div>
          </div>
        </div>
      )}
    </RoomWrapper>
  );
}