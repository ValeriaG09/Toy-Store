import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FondoToyStory from "../components/FondoToyStory";
import ToyStoreLogo from "../components/ToyStoreLogo";

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

    // Validación personalizada
    if (!form.email) {
      return setError("Por favor, ingresa tu correo electrónico");
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError("El formato del correo no es válido");
    }
    if (!form.contrasena) {
      return setError("La contraseña es obligatoria");
    }

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
    <FondoToyStory>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        {/* Logo de Toy Story */}
        <ToyStoreLogo />

        <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-100 pb-2">
          Iniciar sesión
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-200 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label className="text-sm font-semibold text-gray-600">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            placeholder="usuario@ejemplo.com"
            value={form.email}
            onChange={handleChange}
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
                       font-bold py-3 rounded-xl transition text-lg mb-4 shadow-md"
          >
            {cargando ? "Entrando..." : "Entrar"}
          </button>

          {/* Google Button Simulator */}
          <button
            type="button"
            className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-600
                       font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
            onClick={() => navigate("/google-auth-mock")}
          >
            <img 
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
              alt="Google" 
              className="w-5 h-5"
            />
            Continue with Google
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
    </FondoToyStory>
  );
}