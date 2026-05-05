import { useNavigate } from "react-router-dom";
import woodyBuzz from "../assets/woody_buzz_nobg.png";
import logo from "../assets/logo_official.png";

export default function Home() {
  const navigate = useNavigate();

  const categorias = [
    {
      nombre: "Vibradores",
      svg: (
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <rect x="42" y="20" width="16" height="55" rx="8" fill="#9b59b6"/>
          <ellipse cx="50" cy="20" rx="8" ry="10" fill="#8e44ad"/>
          <rect x="44" y="68" width="12" height="5" rx="3" fill="#6c3483"/>
          <ellipse cx="50" cy="75" rx="9" ry="5" fill="#7d3c98"/>
          <ellipse cx="46" cy="22" rx="2" ry="4" fill="white" opacity="0.3"/>
          <path d="M 65 35 Q 72 40 65 45" stroke="#e056fd" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 68 30 Q 78 40 68 50" stroke="#e056fd" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
        </svg>
      ),
    },
    {
      nombre: "Lencerías",
      svg: (
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <path d="M 20 38 Q 18 55 35 58 Q 48 60 50 50 Q 40 35 20 38 Z" fill="#e91e8c"/>
          <path d="M 80 38 Q 82 55 65 58 Q 52 60 50 50 Q 60 35 80 38 Z" fill="#e91e8c"/>
          <path d="M 35 58 Q 50 65 65 58" stroke="#c2185b" strokeWidth="3" fill="none"/>
          <path d="M 20 38 Q 30 25 42 30" stroke="#e91e8c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 80 38 Q 70 25 58 30" stroke="#e91e8c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 44 50 Q 50 46 56 50 Q 50 54 44 50 Z" fill="#ff4081"/>
          <circle cx="30" cy="48" r="2" fill="#ff80ab" opacity="0.7"/>
          <circle cx="40" cy="52" r="1.5" fill="#ff80ab" opacity="0.7"/>
          <circle cx="70" cy="48" r="2" fill="#ff80ab" opacity="0.7"/>
          <circle cx="60" cy="52" r="1.5" fill="#ff80ab" opacity="0.7"/>
          <path d="M 35 62 Q 50 85 65 62 Q 55 68 50 67 Q 45 68 35 62 Z" fill="#e91e8c"/>
          <path d="M 35 62 Q 25 68 28 75" stroke="#e91e8c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 65 62 Q 75 68 72 75" stroke="#e91e8c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      nombre: "Anales",
      svg: (
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <ellipse cx="50" cy="40" rx="18" ry="22" fill="#9b59b6"/>
          <rect x="44" y="60" width="12" height="12" rx="3" fill="#7d3c98"/>
          <rect x="32" y="70" width="36" height="8" rx="4" fill="#8e44ad"/>
          <ellipse cx="43" cy="32" rx="5" ry="8" fill="white" opacity="0.25"/>
          <ellipse cx="50" cy="74" rx="7" ry="3" fill="#e056fd"/>
          <ellipse cx="50" cy="74" rx="4" ry="1.8" fill="#f8bfff"/>
        </svg>
      ),
    },
    {
      nombre: "Kit",
      svg: (
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <rect x="18" y="45" width="64" height="42" rx="4" fill="#e8a045"/>
          <rect x="15" y="38" width="70" height="12" rx="4" fill="#f0b429"/>
          <rect x="15" y="47" width="70" height="8" fill="#e05c2a"/>
          <rect x="46" y="38" width="8" height="49" fill="#e05c2a"/>
          <path d="M 50 38 Q 38 28 34 34 Q 30 40 42 40 Z" fill="#ff6b35"/>
          <path d="M 50 38 Q 62 28 66 34 Q 70 40 58 40 Z" fill="#ff6b35"/>
          <circle cx="50" cy="39" r="4" fill="#e05c2a"/>
          <rect x="22" y="52" width="18" height="3" rx="2" fill="white" opacity="0.2"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ── */}
      <nav className="bg-white shadow-sm px-8 py-3 flex justify-between items-center">
        <img src={logo} alt="Toy Store" className="h-16" />
        <div className="flex gap-6 items-center">
          {["Inicio", "Tienda", "Guía", "Explora tus deseos", "Noticias"].map((item) => (
            <span
              key={item}
              className="text-gray-700 font-medium cursor-pointer hover:text-purple-600 transition text-sm"
            >
              {item}
            </span>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-full text-sm transition"
          >
            Contacto
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="bg-sky-200 relative overflow-hidden">
        <div className="absolute top-6 left-10 text-3xl animate-bounce">⭐</div>
        <div className="absolute top-10 right-20 text-2xl">❤️</div>
        <div className="absolute bottom-10 left-32 text-2xl">🚀</div>
        <div className="absolute top-16 right-40 text-xl">😎</div>

        <div className="flex flex-col items-center justify-center py-10 px-4 relative">
          <div className="bg-yellow-400 px-10 py-2 rounded-full mb-4 shadow-md">
            <p className="font-black text-gray-800 text-lg tracking-wide">
              ¡DESCUBRE UN UNIVERSO DE PLACER!
            </p>
          </div>

          <img
            src={woodyBuzz}
            alt="Toy Store Heroes"
            className="h-64 object-contain my-2"
          />

          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 hover:bg-red-600 text-white font-black px-8 py-3 rounded-full text-lg shadow-lg transition transform hover:scale-105 mt-2"
          >
            VER CATÁLOGO
          </button>

          <div className="flex gap-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-red-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>

      {/* ── CATEGORÍAS ── */}
      <div className="bg-purple-700 py-10 px-8">
        <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
          {categorias.map((cat) => (
            <div
              key={cat.nombre}
              onClick={() => navigate(`/categoria/${cat.nombre}`)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <p className="text-white font-bold mb-3 text-lg">{cat.nombre}</p>
              <div className="bg-[#1a1a2e] rounded-2xl w-full aspect-square flex items-center justify-center shadow-lg group-hover:scale-105 transition transform">
                {cat.svg}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="bg-purple-900 text-center py-4">
        <p className="text-purple-300 text-sm">
          © 2024 Toy Store — Donde tus juguetes sí cobran vida 🌟
        </p>
      </div>

    </div>
  );
}