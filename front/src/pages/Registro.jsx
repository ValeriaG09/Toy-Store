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
    fecha_nacimiento: "",
    contrasena: "",
    confirmar: ""
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "email") {
      value = value.replace(/\s/g, ""); // Quitar espacios
    } else if (name === "nombre" || name === "contrasena" || name === "confirmar") {
      // Evitar que el nombre o contraseña inicien con espacios (o sean puros espacios)
      if (value.startsWith(" ")) value = value.trimStart();
    }
    setForm({ ...form, [name]: value });
    if (error) setError(""); // Quitar la advertencia al intentar corregir
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "nombre" && !value.trim()) {
      setError("Por favor, dinos tu nombre válido (sin dejar solo espacios)");
    } else if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      setError("El formato del correo no es válido");
    } else if (name === "fecha_nacimiento" && value) {
      const hoy = new Date();
      // Resetear horas para comparar solo la fecha
      hoy.setHours(0, 0, 0, 0);
      
      const partes = value.split('-');
      if (partes.length === 3) {
        const cumple = new Date(partes[0], partes[1] - 1, partes[2]);
        
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
          edad--;
        }

        if (cumple > hoy) {
          setError("La fecha que ingresaste es mayor o inválida");
        } else if (edad < 18) {
          setError("La fecha no es apta para registrarse");
        }
      }
    } else if (name === "contrasena" && value) {
      if (value.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres");
      } else if (!/[a-zA-Z]/.test(value) || !/\d/.test(value) || !/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(value)) {
        setError("La contraseña debe incluir letras, números y caracteres especiales (ej: @, #, $, !) y no puede contener solo letras o solo números");
      }
    } else if (name === "confirmar" && value && form.contrasena !== value) {
      setError("¡Ups! Las contraseñas no coinciden");
    }
  };

  /* 
  useEffect(() => {
    if (usuario) navigate("/inicio", { replace: true });
  }, [usuario, navigate]); 
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación personalizada
    if (!form.nombre.trim()) {
      return setError("Por favor, dinos tu nombre válido (sin dejar solo espacios)");
    }
    if (!form.email) {
      return setError("El correo electrónico es obligatorio");
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError("El formato del correo no es válido");
    }
    if (!form.fecha_nacimiento) {
      return setError("Necesitamos saber tu fecha de nacimiento");
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const partes = form.fecha_nacimiento.split('-');
    if (partes.length === 3) {
      const cumple = new Date(partes[0], partes[1] - 1, partes[2]);
      
      let edad = hoy.getFullYear() - cumple.getFullYear();
      const m = hoy.getMonth() - cumple.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
        edad--;
      }

      if (cumple > hoy) {
        return setError("La fecha que ingresaste es mayor o inválida");
      } else if (edad < 18) {
        return setError("La fecha no es apta para registrarse");
      }
    }

    if (form.contrasena.length < 8) {
      return setError("La contraseña debe tener al menos 8 caracteres");
    }
    if (!/[a-zA-Z]/.test(form.contrasena) || !/\d/.test(form.contrasena) || !/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(form.contrasena)) {
      return setError("La contraseña debe incluir letras, números y caracteres especiales (ej: @, #, $, !) y no puede contener solo letras o solo números");
    }
    if (form.contrasena !== form.confirmar) {
      return setError("¡Ups! Las contraseñas no coinciden");
    }

    setCargando(true);

    try {
      const res = await fetch("/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          fecha_nacimiento: form.fecha_nacimiento,
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
        <ToyStoreLogo variant="new" scale={0.7} />

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
            onBlur={handleBlur}
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
            onBlur={handleBlur}
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition"
          />

          <label className="text-sm font-semibold text-gray-600">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => e.preventDefault()} // Bloquear números/letras manuales
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition text-gray-600 font-medium"
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
            onBlur={handleBlur}
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
            onBlur={handleBlur}
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