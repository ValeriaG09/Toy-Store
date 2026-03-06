import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.message);
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

        <h2 className="text-2xl font-bold text-red-600 mb-2">
          🔑 ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Ingresa tu correo y te enviaremos un enlace para recuperarla.
        </p>

        {mensaje ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center">
            ✅ {mensaje}
            <div className="mt-4">
              <Link to="/login" className="text-sky-600 underline text-sm">
                Volver al login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm">
                ⚠️ {error}
              </div>
            )}
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {cargando ? "Enviando..." : "Enviar enlace 📨"}
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