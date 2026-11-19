import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FondoToyStory from "../components/FondoToyStory";
import ToyStoreLogo from "../components/ToyStoreLogo";
import { AuthContext } from "../context/AuthContext";

export default function Registro() {
  const { usuario, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    fecha_nacimiento: "",
    contrasena: "",
    confirmar: ""
  });
  const [showContrasena, setShowContrasena] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Prevenir cualquier espacio en blanco en nombre, email y contraseñas
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "nombre" || name === "email" || name === "contrasena" || name === "confirmar") {
      val = value.replace(/\s+/g, "");
    }
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const preventSpace = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  // Reglas de complejidad para la contraseña
  const passRules = {
    length: form.contrasena.length >= 8,
    upper: /[A-Z]/.test(form.contrasena),
    lower: /[a-z]/.test(form.contrasena),
    number: /[0-9]/.test(form.contrasena),
    special: /[!@#$%^&*(),.?":{}|<>_\-#$^+=\[\]~]/.test(form.contrasena),
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
    if (!form.fecha_nacimiento) {
      return setError("Necesitamos saber tu fecha de nacimiento");
    }

    // Validar mayoría de edad (18+)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const cumple = new Date(form.fecha_nacimiento + "T00:00:00");

    if (isNaN(cumple.getTime())) {
      return setError("Por favor ingresa una fecha válida");
    }

    if (cumple > hoy) {
      return setError("La fecha de nacimiento no puede ser una fecha futura");
    }

    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    if (edad < 18) {
      return setError("Lo sentimos, debes ser mayor de 18 años para entrar al baúl.");
    }

    // Validaciones de contraseña
    if (!passRules.length) {
      return setError("La contraseña debe tener al menos 8 caracteres");
    }
    if (!passRules.upper || !passRules.lower) {
      return setError("La contraseña debe incluir letras mayúsculas y minúsculas");
    }
    if (!passRules.number) {
      return setError("La contraseña debe incluir al menos un número");
    }
    if (!passRules.special) {
      return setError("La contraseña debe incluir al menos un carácter especial (!@#$%^&*)");
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
        if (data.usuario && login) {
          login(data.usuario);
          navigate("/inicio", { replace: true });
        } else {
          navigate("/login");
        }
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
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md my-8">

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
            onKeyDown={preventSpace}
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
            onKeyDown={preventSpace}
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition"
          />

          <label className="text-sm font-semibold text-gray-600">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="fecha_nacimiento"
            max={new Date().toISOString().split("T")[0]}
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className="w-full border-2 border-sky-300 rounded-xl p-3 mt-1 mb-4
                       focus:outline-none focus:border-yellow-400 transition text-gray-600 font-medium cursor-pointer"
          />

          <label className="text-sm font-semibold text-gray-600">
            Contraseña
          </label>
          <div className="relative mb-2">
            <input
              type={showContrasena ? "text" : "password"}
              name="contrasena"
              placeholder="Mínimo 8 caracteres"
              value={form.contrasena}
              onChange={handleChange}
              onKeyDown={preventSpace}
              className="w-full border-2 border-sky-300 rounded-xl p-3 pr-11 mt-1
                         focus:outline-none focus:border-yellow-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowContrasena(!showContrasena)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition"
              title={showContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showContrasena ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.97 8.97 0 013.122-.563c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-3.14-3.14a3 3 0 11-4.243-4.243M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Indicador visual de requisitos de contraseña */}
          {form.contrasena.length > 0 && (
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 mb-4 text-xs space-y-1.5 transition-all">
              <p className="font-bold text-gray-700 mb-1">Requisitos de contraseña:</p>
              <div className={`flex items-center gap-1.5 ${passRules.length ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                <span>{passRules.length ? '✓' : '•'}</span> Mínimo 8 caracteres
              </div>
              <div className={`flex items-center gap-1.5 ${passRules.upper && passRules.lower ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                <span>{passRules.upper && passRules.lower ? '✓' : '•'}</span> Letras mayúsculas y minúsculas
              </div>
              <div className={`flex items-center gap-1.5 ${passRules.number ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                <span>{passRules.number ? '✓' : '•'}</span> Al menos un número (0-9)
              </div>
              <div className={`flex items-center gap-1.5 ${passRules.special ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                <span>{passRules.special ? '✓' : '•'}</span> Al menos un carácter especial (!@#$%^&*)
              </div>
            </div>
          )}

          <label className="text-sm font-semibold text-gray-600">
            Confirmar contraseña
          </label>
          <div className="relative mb-6">
            <input
              type={showConfirmar ? "text" : "password"}
              name="confirmar"
              placeholder="Repite tu contraseña"
              value={form.confirmar}
              onChange={handleChange}
              onKeyDown={preventSpace}
              className="w-full border-2 border-sky-300 rounded-xl p-3 pr-11 mt-1
                         focus:outline-none focus:border-yellow-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmar(!showConfirmar)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition"
              title={showConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmar ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.97 8.97 0 013.122-.563c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-3.14-3.14a3 3 0 11-4.243-4.243M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800
                       font-bold py-3 rounded-xl transition text-lg shadow-md disabled:opacity-50"
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-[#00AEEF] font-bold hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </FondoToyStory>
  );
}