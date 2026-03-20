import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FondoToyStory from "../components/FondoToyStory";
import ToyStoreLogo from "../components/ToyStoreLogo";
import { AuthContext } from "../context/AuthContext";

export default function Registro() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    confirmar: ""
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (usuario) navigate("/inicio", { replace: true });
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación personalizada
    if (!form.nombre.trim()) {
      return setError("Por favor, dinos tu nombre");
    }
    if (!form.email) {
      return setError("El correo electrónico es obligatorio");
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError("El formato del correo no es válido");
    }
    if (form.contrasena.length < 8) {
      return setError("La contraseña debe tener al menos 8 caracteres");
    }
    if (form.contrasena !== form.confirmar) {
      return setError("¡Ups! Las contraseñas no coinciden");
    }

    setCargando(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          contrasena: form.contrasena
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login");
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
          Crear cuenta
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-200 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label className="text-sm font-semibold text-gray-600">Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition"
          />

          <label className="text-sm font-semibold text-gray-600">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            placeholder="tu@correo.com"
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
            placeholder="Mínimo 8 caracteres"
            value={form.contrasena}
            onChange={handleChange}
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition"
          />

          <label className="text-sm font-semibold text-gray-600">
            Confirmar contraseña
          </label>
          <input
            type="password"
            name="confirmar"
            placeholder="Repite tu contraseña"
            value={form.confirmar}
            onChange={handleChange}
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition"
          />



          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800
                       font-bold py-3 rounded-xl transition text-lg shadow-md"
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-sky-500 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>

      </div>
    </FondoToyStory>
  );
}