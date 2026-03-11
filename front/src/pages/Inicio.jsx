import { useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate();

  // Leer datos del usuario guardados al hacer login
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-sky-200">

      {/* Navbar */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-yellow-400
                       drop-shadow-[2px_2px_0px_#1d4ed8]">
          TOY STORE 🧸
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            Hola, <strong>{usuario?.nombre}</strong> 👋
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white 
                       px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div className="flex flex-col items-center justify-center mt-20 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-lg">
          <h2 className="text-3xl font-black text-red-500 mb-2">
            ¡Bienvenidx, {usuario?.nombre}! 🎉
          </h2>
          <p className="text-gray-500 mb-6">
            Donde tus juguetes sí cobran vida 🌟
          </p>

          {/* Tarjetas de secciones (Contenido para todos) */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-sky-100 p-4 rounded-xl cursor-pointer 
                            hover:bg-sky-200 transition">
              <p className="text-2xl">🛍️</p>
              <p className="font-bold text-gray-700 mt-1">Tienda</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-xl cursor-pointer 
                            hover:bg-yellow-200 transition">
              <p className="text-2xl">📖</p>
              <p className="font-bold text-gray-700 mt-1">Guía</p>
            </div>
          </div>

          {/* Dashboard de Administrador (Solo visible para rol 1) */}
          {usuario?.rol === 1 && (
            <div className="mt-8 pt-8 border-t-2 border-dashed border-red-200 w-full">
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center justify-center gap-2">
                🔑 Panel de Administrador
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-500 text-white p-4 rounded-xl cursor-pointer 
                                hover:bg-red-600 transition shadow-md">
                  <p className="text-2xl">📦</p>
                  <p className="font-bold mt-1">Gestionar Juguetes</p>
                </div>
                <div className="bg-red-700 text-white p-4 rounded-xl cursor-pointer 
                                hover:bg-red-800 transition shadow-md">
                  <p className="text-2xl">👥</p>
                  <p className="font-bold mt-1">Ver Usuarios</p>
                </div>
                <div className="bg-gray-800 text-white p-4 rounded-xl cursor-pointer 
                                hover:bg-black transition shadow-md col-span-2">
                  <p className="text-2xl">📊</p>
                  <p className="font-bold mt-1">Reportes de Ventas</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}