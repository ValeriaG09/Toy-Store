import { useNavigate } from "react-router-dom";
import woodyBuzz from "../assets/woody-buzz.png";      // ← cambia el nombre
import vibrador from "../assets/vibrador.png";          // ← cambia el nombre
import lenceria from "../assets/lenceria.png";          // ← cambia el nombre
import anal from "../assets/anal.png";                  // ← cambia el nombre
import kit from "../assets/kit.png";                    // ← cambia el nombre
import logo from "../assets/logo toystore(2).png";                  // ← cambia el nombre

export default function Home() {
  const navigate = useNavigate();

  const categorias = [
    { nombre: "Vibradores", imagen: vibrador },
    { nombre: "Lencerías", imagen: lenceria },
    { nombre: "Anales", imagen: anal },
    { nombre: "Kit", imagen: kit },
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
              className="text-gray-700 font-medium cursor-pointer hover:text-purple-600 
                         transition text-sm"
            >
              {item}
            </span>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold 
                       px-5 py-2 rounded-full text-sm transition"
          >
            Contacto
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="bg-sky-200 relative overflow-hidden">
        
        {/* Elementos decorativos flotantes */}
        <div className="absolute top-6 left-10 text-3xl animate-bounce">⭐</div>
        <div className="absolute top-10 right-20 text-2xl">❤️</div>
        <div className="absolute bottom-10 left-32 text-2xl">🚀</div>
        <div className="absolute top-16 right-40 text-xl">😎</div>

        <div className="flex flex-col items-center justify-center py-10 px-4 relative">
          
          {/* Banner amarillo */}
          <div className="bg-yellow-400 px-10 py-2 rounded-full mb-4 shadow-md">
            <p className="font-black text-gray-800 text-lg tracking-wide">
              ¡DESCUBRE UN UNIVERSO DE PLACER!
            </p>
          </div>

          {/* Imagen principal Woody y Buzz */}
          <img
            src={woodyBuzz}
            alt="Toy Store Heroes"
            className="h-64 object-contain my-2"
          />

          {/* Botón Ver Catálogo */}
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 hover:bg-red-600 text-white font-black 
                       px-8 py-3 rounded-full text-lg shadow-lg transition 
                       transform hover:scale-105 mt-2"
          >
            VER CATÁLOGO
          </button>

          {/* Puntos de carrusel decorativos */}
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
              onClick={() => navigate("/login")}
              className="flex flex-col items-center cursor-pointer group"
            >
              <p className="text-white font-bold mb-3 text-lg">{cat.nombre}</p>
              <div className="bg-white rounded-2xl p-3 w-full aspect-square 
                              flex items-center justify-center shadow-lg
                              group-hover:scale-105 transition transform">
                <img
                  src={cat.imagen}
                  alt={cat.nombre}
                  className="h-28 object-contain"
                />
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