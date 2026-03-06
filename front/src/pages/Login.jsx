import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", contrasena: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar token y datos del usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        navigate("/inicio");
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

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-yellow-400 
                         drop-shadow-[2px_2px_0px_#1d4ed8]">
            TOY STORE
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Donde tus juguetes sí cobran vida 🌟
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-700 mb-6">
          Iniciar sesión
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-gray-600">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition"
          />

          <label className="text-sm font-semibold text-gray-600">
            Contraseña
          </label>
          <input
            type="password"
            name="contrasena"
            placeholder="••••••••"
            value={form.contrasena}
            onChange={handleChange}
            required
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-2
                       focus:outline-none focus:border-yellow-400 transition"
          />

          {/* Enlace recuperar contraseña */}
          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-sky-500 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800
                       font-bold py-3 rounded-xl transition text-lg"
          >
            {cargando ? "Entrando..." : "Entrar 🚀"}
          </button>
        </form>

        {/* Enlace a registro */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-sky-500 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  );
}