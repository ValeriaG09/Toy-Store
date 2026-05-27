import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FondoToyStory from "../components/FondoToyStory";
import ToyStoreLogo from "../components/ToyStoreLogo";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (nuevaContrasena !== confirmar) {
      return setError("Las contraseñas no coinciden");
    }
    if (nuevaContrasena.length < 8) {
      return setError("La contraseña debe tener al menos 8 caracteres");
    }
    if (!/[a-zA-Z]/.test(nuevaContrasena) || !/\d/.test(nuevaContrasena) || !/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(nuevaContrasena)) {
      return setError("La contraseña debe incluir letras, números y caracteres especiales (ej: @, #, $, !) y no puede contener solo letras o solo números");
    }

    setCargando(true);

    try {
      const res = await fetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaContrasena }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.error);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <FondoToyStory>
      {/* --- BARRA DE CARGA PROFESIONAL --- */}
      {cargando && (
        <>
          <div className="top-loading-bar"></div>
          <div className="loader-overlay-minimal"></div>
        </>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Logo de Toy Store Consistente */}
        <ToyStoreLogo variant="new" scale={0.7} />

        <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-100 pb-2">
          Nueva contraseña
        </h2>

        {mensaje ? (
          <div className="flex flex-col items-center justify-center text-center py-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border border-green-200">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="text-gray-700 font-bold mb-2 text-sm">{mensaje}</p>
            <p className="text-gray-500 text-xs mb-6 uppercase tracking-widest font-black animate-pulse text-blue-400">Redirigiendo al login...</p>
            <Link to="/login" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 rounded-xl transition text-lg shadow-md block text-center">
              Ir al Login ahora
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-200 animate-pulse">
                {error}
              </div>
            )}
            
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={nuevaContrasena}
              onChange={(e) => {
                let val = e.target.value;
                if (val.startsWith(" ")) val = val.trimStart();
                setNuevaContrasena(val);
              }}
              required
              className="w-full border-2 border-sky-300 rounded-xl p-3 mb-4 
                         focus:outline-none focus:border-yellow-400 transition"
            />

            <label className="text-sm font-semibold text-gray-600 block mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmar}
              onChange={(e) => {
                let val = e.target.value;
                if (val.startsWith(" ")) val = val.trimStart();
                setConfirmar(val);
              }}
              required
              className="w-full border-2 border-sky-300 rounded-xl p-3 mb-6 
                         focus:outline-none focus:border-yellow-400 transition"
            />
            
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 
                         font-bold py-3 rounded-xl transition text-lg mb-4 shadow-md"
            >
              {cargando ? "Guardando..." : "Guardar contraseña"}
            </button>
            
            <div className="text-center mt-2">
              <Link to="/login" className="text-sm text-sky-500 hover:underline flex items-center justify-center gap-1 font-semibold group">
                <svg className="w-4 h-4 inline transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Volver al login
              </Link>
            </div>
          </form>
        )}
      </div>
    </FondoToyStory>
  );
}