import { useNavigate } from "react-router-dom";
import SavePasswordPrompt from "../components/SavePasswordPrompt";

export default function Inicio() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
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

        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
           <span className="text-xs text-gray-500 hidden md:block">
            Hola, <strong>{usuario?.nombre || 'Explorador'}</strong>
          </span>
          <button 
            onClick={handleLogout}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative flex-1 bg-[#87CEEB] overflow-hidden flex flex-col items-center pt-10 pb-20">
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
            <div className="bg-[#FBECAB] px-12 py-4 rounded-md shadow-xl transform -rotate-1 border-y-2 border-yellow-200 relative overflow-visible">
              <div className="absolute left-[-25px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-r-[25px] border-r-[#d9ca82]"></div>
              <div className="absolute right-[-25px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-l-[25px] border-l-[#d9ca82]"></div>
              <h2 className="text-[#4F5B73] font-black text-xl md:text-2xl tracking-tight text-center">
                ¡DESCUBRE UN UNIVERSO<br/>DE PLACER!
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

    </div>
  );
}