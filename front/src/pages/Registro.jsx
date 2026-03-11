import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FondoToyStory from "../components/FondoToyStory";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    confirmar: "",
    id_rol: "2", // Valor por defecto: Cliente
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.contrasena !== form.confirmar) {
      return setError("Las contraseñas no coinciden 😬");
    }
    if (form.contrasena.length < 8) {
      return setError("La contraseña debe tener mínimo 8 caracteres");
    }

    setCargando(true);

    try {
      const res = await fetch("http://localhost:5000/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          contrasena: form.contrasena,
          id_rol: parseInt(form.id_rol),
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
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full">

        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-yellow-400
                         drop-shadow-[2px_2px_0px_#1d4ed8]">
            TOY STORE
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Crea tu cuenta y explora 🎮
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-700 mb-6">
          Crear cuenta
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-gray-600">Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            required
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
            placeholder="Mínimo 8 caracteres"
            value={form.contrasena}
            onChange={handleChange}
            required
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
            required
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition"
          />

          <label className="text-sm font-semibold text-gray-600">
            ¿Quién eres?
          </label>
          <select
            name="id_rol"
            value={form.id_rol}
            onChange={handleChange}
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-6
                       focus:outline-none focus:border-yellow-400 transition bg-white"
          >
            <option value="2">Soy un Cliente 🧸</option>
            <option value="1">Soy un Administrador 🔑</option>
          </select>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800
                       font-bold py-3 rounded-xl transition text-lg"
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta 🎉"}
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