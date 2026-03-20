import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import SavePasswordPrompt from "../components/SavePasswordPrompt";
import { AuthContext } from "../context/AuthContext";

export default function Inicio() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  // Control de vista (solo para admins)
  const [vistaAdmin, setVistaAdmin] = useState(usuario?.rol === 1);

  const handleLogout = () => {
    setDropdownAbierto(false);
    setCerrandoSesion(true);
    
    // Transición ultra rápida y natural
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SavePasswordPrompt />
      
      {/* --- NAVBAR --- */}
      <nav className="bg-white px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="flex flex-col items-center">
            <div className="text-2xl">🧸</div>
            <div className="text-[10px] font-bold text-blue-800 leading-tight text-center">
              TOY STORE<br/>
              <span className="text-red-500 font-normal">Donde tus juguetes<br/>cobran vida</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-600 font-semibold text-sm">
          <a href="#" className="hover:text-blue-500">Inicio</a>
          <a href="#" className="bg-white border-2 border-gray-100 px-4 py-1 rounded-full shadow-inner text-gray-800">Tienda</a>
          <a href="#" className="bg-yellow-400 text-white px-3 py-1 rounded-lg">Guia</a>
          <a href="#" className="hover:text-blue-500">Explora tus deseos</a>
          <a href="#" className="hover:text-blue-500">Noticias</a>
          <button className="bg-red-500 text-white px-5 py-2 rounded-full font-bold shadow-md hover:bg-red-600 transition">
            Contacto
          </button>
        </div>

        <div className="flex items-center gap-4 border-l pl-6 border-gray-200 relative">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold transition-all">
              {vistaAdmin ? 'Administrador' : 'Cliente'}
            </span>
            <span className="text-sm font-bold text-gray-700">
              {usuario?.nombre || 'Explorador'}
            </span>
          </div>

          {/* Botón de Perfil con Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownAbierto(!dropdownAbierto)}
              className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-all overflow-hidden"
            >
              {usuario?.nombre ? (
                <img 
                  src={`https://ui-avatars.com/api/?name=${usuario.nombre.replace(" ", "+")}&background=random&color=fff`} 
                  alt="Avatar" 
                />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </button>

            {/* Menú Desplegable */}
            {dropdownAbierto && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownAbierto(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  {/* Opción de cambiar vista (Solo si el usuario es Admin real) */}
                  {usuario?.rol === 1 && (
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-semibold flex items-center gap-2 border-b border-gray-50 transition"
                      onClick={() => {
                        setVistaAdmin(!vistaAdmin);
                        setDropdownAbierto(false);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {vistaAdmin ? 'Ver como Cliente' : 'Ver como Admin'}
                    </button>
                  )}
                  
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                    onClick={() => setDropdownAbierto(false)}
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configuración
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className={`relative flex-1 overflow-hidden flex flex-col items-center pt-10 pb-20 transition-colors duration-500 ${vistaAdmin ? 'bg-[#1e3a8a]' : 'bg-[#87CEEB]'}`}>
        {/* Cloudy Background elements (CSS Shapes) */}
        <div className="absolute top-10 left-10 w-32 h-12 bg-white/40 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-10 w-48 h-16 bg-white/40 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-14 bg-white/30 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>

        {/* Characters Placeholder (Buzz & Woody) */}
        <div className="flex items-center justify-center gap-8 mb-8 z-10 opacity-80 scale-110">
           {/* Woody Placeholder */}
           <div className="w-48 h-64 bg-yellow-200/50 rounded-b-full border-4 border-yellow-600 flex items-center justify-center relative shadow-lg">
             <div className="absolute top-[-20px] w-40 h-20 bg-amber-800 rounded-t-full"></div>
             <span className="text-5xl">🤠</span>
           </div>
           {/* Buzz Placeholder */}
           <div className="w-56 h-64 bg-purple-100/50 rounded-full border-4 border-purple-400 flex items-center justify-center relative shadow-lg">
             <div className="absolute top-[-10px] w-44 h-44 bg-blue-200/30 rounded-full border border-white"></div>
             <span className="text-5xl">🚀</span>
           </div>
        </div>

        {/* Banner Ribon */}
        <div className="relative z-20 flex flex-col items-center">
            <div className={`${vistaAdmin ? 'bg-blue-900/40 border-blue-400' : 'bg-[#FBECAB] border-yellow-200'} px-12 py-4 rounded-md shadow-xl transform -rotate-1 border-y-2 relative transition-all duration-500 overflow-visible`}>
              <div className={`absolute left-[-25px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-r-[25px] ${vistaAdmin ? 'border-r-blue-800' : 'border-r-[#d9ca82]'}`}></div>
              <div className={`absolute right-[-25px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-l-[25px] ${vistaAdmin ? 'border-l-blue-800' : 'border-l-[#d9ca82]'}`}></div>
              <h2 className={`${vistaAdmin ? 'text-white' : 'text-[#4F5B73]'} font-black text-xl md:text-2xl tracking-tight text-center`}>
                {vistaAdmin ? 'PANEL DE ADMINISTRACIÓN' : '¡DESCUBRE UN UNIVERSO DE PLACER!'}
              </h2>
            </div>
            
            <button className="mt-10 bg-[#E30020] hover:bg-[#c4001a] text-white px-10 py-4 rounded-full text-xl font-black shadow-[0_5px_0_#990016] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wide">
              VER CATÁLOGO
            </button>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="bg-[#4D3A7A] py-16 px-6 flex flex-col items-center">
        {/* Carousel Dots */}
        <div className="flex gap-3 mb-12">
          <div className="w-3 h-3 rounded-full bg-orange-300"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 scale-125"></div>
          <div className="w-3 h-3 rounded-full bg-white"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400 opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl w-full">
          {/* Category Cards */}
          {[
            { name: "Vibradores", icon: "🍆" },
            { name: "Lencerias", icon: "👙" },
            { name: "Anales", icon: "🍑" },
            { name: "Kit", icon: "📦" }
          ].map((cat, i) => (
            <div key={i} className="flex flex-col items-center group cursor-pointer">
              <h3 className="text-white font-bold text-xl mb-6 group-hover:text-yellow-300 transition uppercase tracking-wider">{cat.name}</h3>
              <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center p-10 shadow-xl overflow-hidden relative">
                <span className="text-7xl group-hover:scale-110 transition duration-300 transform drop-shadow-md">{cat.icon}</span>
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-10 scale-0 group-hover:scale-100 rounded-full transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- EFECTO DE CIERRE SUTIL (ESTILO GOOGLE) --- */}
      {cerrandoSesion && (
        <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
          <div className="h-1 bg-blue-100 overflow-hidden">
            <div className="h-full bg-blue-600 animate-google-loader"></div>
          </div>
          {/* Un desvanecimiento muy ligero */}
          <div className="fixed inset-0 bg-white/10 backdrop-blur-[1px] animate-in fade-in duration-300"></div>
        </div>
      )}

    </div>
  );
}