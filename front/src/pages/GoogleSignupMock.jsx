import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GoogleSignupMock() {
  const { usuario, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1: Info personal, 2: Email, 3: Código
  const [form, setForm] = useState({ 
    nombre: "", 
    apellido: "", 
    email: "", 
    contrasena: "", 
    codigo: "" 
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  useEffect(() => {
    if (usuario) {
      navigate("/inicio", { replace: true });
    }
  }, [usuario, navigate]);

  const siguientePaso = async () => {
    if (paso === 1) {
      if (!form.nombre || !form.apellido) return setError("Introduce tu nombre");
      setPaso(2);
    } else if (paso === 2) {
      if (!form.email || !form.contrasena) return setError("Introduce un correo y contraseña");
      if (!form.email.includes("@")) return setError("Introduce un correo válido");
      
      setCargando(true);
      try {
        const res = await fetch("http://127.0.0.1:5000/auth/google-send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: form.email }),
        });
        if (res.ok) setPaso(3);
        else setError("Error al enviar código");
      } catch {
        setError("Error de conexión");
      } finally {
        setCargando(false);
      }
    }
  };

  const confirmarRegistro = async () => {
    if (!form.codigo) return setError("Introduce el código");
    setCargando(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/google-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          email: form.email, 
          nombre: `${form.nombre} ${form.apellido}`,
          codigo: form.codigo
        }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.usuario);
        
        // Agregar a la lista de cuentas de Google Mock
        const saved = JSON.parse(localStorage.getItem("google_accounts_mock") || "[]");
        const newAcc = { 
          id: Date.now(), 
          nombre: data.usuario.nombre, 
          email: data.usuario.email, 
          img: `https://ui-avatars.com/api/?name=${data.usuario.nombre.replace(" ", "+")}&background=random` 
        };
        localStorage.setItem("google_accounts_mock", JSON.stringify([...saved, newAcc]));
        
        const savedPasswords = JSON.parse(localStorage.getItem("mock_saved_passwords") || "{}");
        if (!savedPasswords[data.usuario.email]) {
          localStorage.setItem("pending_save_email", data.usuario.email);
          localStorage.setItem("pending_save_pass", "google-oauth-mock");
          localStorage.setItem("show_save_pass_prompt", "true");
        }

        navigate("/inicio");
      } else {
        setError(data.error || "Código incorrecto");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
      <div className="bg-white p-10 rounded-lg shadow-sm w-full max-w-[450px] border border-gray-200 min-h-[500px] flex flex-col">
        
        <div className="flex flex-col items-start mb-8">
          <img 
            src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
            alt="Google" 
            className="w-[75px] mb-4"
          />
          <h1 className="text-2xl font-normal text-gray-800">
            {paso === 1 ? "Crea una cuenta de Google" : paso === 2 ? "Elige tu dirección de correo" : "Verifica tu correo"}
          </h1>
          <p className="text-[#202124] text-base mt-2">
            para continuar en <span className="text-blue-600 font-medium">Toy Store</span>
          </p>
        </div>

        <div className="flex-1">
          {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-100">⚠️ {error}</p>}

          {paso === 1 && (
            <div className="space-y-4">
              <input 
                type="text" name="nombre" placeholder="Nombre" 
                value={form.nombre} onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && siguientePaso()}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <input 
                type="text" name="apellido" placeholder="Apellido" 
                value={form.apellido} onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && siguientePaso()}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <input 
                type="email" name="email" placeholder="Email (ej. mariana@gmail.com)" 
                value={form.email} onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && siguientePaso()}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <input 
                type="password" name="contrasena" placeholder="Contraseña" 
                value={form.contrasena} onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && siguientePaso()}
                className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500">Usa 8 o más caracteres con una combinación de letras, números y símbolos.</p>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Introduce el código de 6 dígitos enviado a <span className="font-medium">{form.email}</span></p>
              <input 
                type="text" name="codigo" placeholder="Introduce el código" 
                value={form.codigo} onChange={handleChange} maxLength="6"
                onKeyDown={(e) => e.key === 'Enter' && confirmarRegistro()}
                className="w-full border border-gray-300 rounded-md p-3 text-center text-2xl tracking-[10px] focus:border-blue-500 outline-none"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end items-center mt-10">
          <button 
            onClick={paso === 3 ? confirmarRegistro : siguientePaso}
            disabled={cargando}
            className="bg-[#1a73e8] hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-md transition disabled:bg-blue-300"
          >
            {cargando ? "Cargando..." : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
