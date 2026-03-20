import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function resetPassword() {
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
      return setError("Las contraseñas no coinciden 😬");
    }
    if (nuevaContrasena.length < 8) {
      return setError("Mínimo 8 caracteres");
    }

    setCargando(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/reset-password", {
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
    <div className="min-h-screen bg-sky-200 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-red-600 mb-6">
          🔒 Nueva contraseña
        </h2>

        {mensaje ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center">
            ✅ {mensaje}
            <p className="text-sm mt-2">Redirigiendo al login en 3 segundos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm">
                ⚠️ {error}
              </div>
            )}
            <input
              type="password"
              placeholder="Nueva contraseña (mín. 8 caracteres)"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
              className="w-full border-2 border-sky-300 rounded-xl p-3 mb-3 
                         focus:outline-none focus:border-yellow-400 transition"
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              className="w-full border-2 border-sky-300 rounded-xl p-3 mb-4 
                         focus:outline-none focus:border-yellow-400 transition"
            />
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 
                         font-bold py-3 rounded-xl transition"
            >
              {cargando ? "Guardando..." : "Guardar contraseña 🎉"}
            </button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-sky-600 underline text-sm">
                ← Volver al login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}