import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function GoogleAuthMock() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1: Seleccionar cuenta, 2: Procesando
  const [menuAbierto, setMenuAbierto] = useState(null); // ID de la cuenta con menú abierto

  // Cargar cuentas desde localStorage o usar por defecto
  const [cuentas, setCuentas] = useState(() => {
    const guardadas = localStorage.getItem("google_accounts_mock");
    if (guardadas) return JSON.parse(guardadas);
    return [
      { id: 1, nombre: "Usuario Ejemplo", email: "usuario@ejemplo.com", img: "https://ui-avatars.com/api/?name=Usuario+Ejemplo&background=random" },
      { id: 2, nombre: "Demo User", email: "demo@toystore.com", img: "https://ui-avatars.com/api/?name=Demo+User&background=random" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("google_accounts_mock", JSON.stringify(cuentas));
  }, [cuentas]);

  const handleSelect = async (cuenta) => {
    setPaso(2);
    
    // Simular retraso de red para ver la animación
    setTimeout(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/auth/google-mock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: cuenta.email, nombre: cuenta.nombre }),
        });

        const data = await res.json();

        if (res.ok) {
          const savedPasswords = JSON.parse(localStorage.getItem("mock_saved_passwords") || "{}");
          if (!savedPasswords[data.usuario.email]) {
            localStorage.setItem("pending_save_email", data.usuario.email);
            localStorage.setItem("pending_save_pass", "google-oauth-mock");
            localStorage.setItem("show_save_pass_prompt", "true");
          }

          login(data.usuario);
          navigate("/inicio");
        } else {
          alert("Error: " + data.error);
          setPaso(1);
        }
      } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
        setPaso(1);
      }
    }, 1200);
  };

  const eliminarCuenta = (id) => {
    console.log("Intentando eliminar cuenta con ID:", id);
    setCuentas(prev => {
      const filtradas = prev.filter(c => String(c.id) !== String(id));
      console.log("Cuentas después del filtro:", filtradas);
      return filtradas;
    });
    setMenuAbierto(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
      <div className="bg-white pt-10 pb-8 px-8 rounded-lg shadow-sm w-full max-w-[450px] border border-gray-200 relative overflow-hidden">
        
        {/* Barra de carga mejorada */}
        {paso === 2 && (
          <div className="google-loader-container">
            <div className="google-loader-bar-secondary"></div>
            <div className="google-loader-bar-primary"></div>
          </div>
        )}

        <div className="flex flex-col items-center mb-8 animate-step-in">
          <img 
            src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
            alt="Google" 
            className="w-[75px] mb-4"
          />
          <h1 className="text-2xl font-normal text-gray-800">
            {paso === 1 ? "Elige una cuenta" : "Verificando..."}
          </h1>
          <p className="text-[#202124] text-base mt-2">
            para continuar en <span className="text-blue-600 font-medium">Toy Store</span>
          </p>
        </div>

        <div className="mt-4 animate-step-in">
          {paso === 1 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-10">
              {cuentas.map((acc, index) => (
                <div key={acc.id} className="relative group">
                  <button 
                    onClick={() => handleSelect(acc)}
                    className={`w-full flex items-center gap-3 py-3 px-8 hover:bg-gray-50 transition text-left focus:outline-none ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <img src={acc.img} alt={acc.nombre} className="w-7 h-7 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{acc.nombre}</p>
                      <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                    </div>
                    
                    {/* Botón de eliminar directo (bote de basura) */}
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        eliminarCuenta(acc.id);
                      }}
                      title="Eliminar esta cuenta"
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group-hover:opacity-100 opacity-60 ml-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => navigate("/google-login-mock")}
                className="w-full flex items-center gap-3 py-4 px-8 hover:bg-gray-50 transition text-left focus:outline-none border-t border-gray-100 font-medium text-gray-700"
              >
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 border border-gray-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" strokeWidth="2" />
                  </svg>
                </div>
                Usar otra cuenta
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 animate-pulse">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Verificando tu cuenta...</p>
            </div>
          )}
        </div>

        {paso === 1 && (
          <div className="mt-10 text-[12px] text-gray-500 leading-normal border-t border-gray-100 pt-6">
            Para continuar, Google compartirá tu nombre, correo electrónico y foto con Toy Store. Antes de usar esta aplicación, puedes revisar su <a href="#" className="text-blue-600 font-medium hover:underline">Política de Privacidad</a>.
          </div>
        )}
      </div>
    </div>
  );
}
