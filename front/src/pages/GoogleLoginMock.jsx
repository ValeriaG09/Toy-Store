import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginMock() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1: Email, 2: Password, 3: Código
  const [form, setForm] = useState({ 
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

  const siguientePaso = async () => {
    if (paso === 1) {
      if (!form.email) return setError("Introduce un correo electrónico");
      if (!form.email.includes("@")) return setError("Introduce un correo válido");
      setCargando(true);
      setTimeout(() => {
        setPaso(2);
        setCargando(false);
      }, 800);
    } else if (paso === 2) {
      if (!form.contrasena) return setError("Introduce la contraseña");
      
      setCargando(true);
      try {
        const res = await fetch("http://localhost:5000/auth/google-send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setCargando(true);
          setTimeout(() => {
            setPaso(3);
            setCargando(false);
          }, 800);
        } else {
          setError(data.error || "Error al enviar código");
        }
      } catch {
        setError("Error de conexión con el servidor");
      } finally {
        setCargando(false);
      }
    }
  };

  const confirmarLogin = async () => {
    if (!form.codigo) return setError("Introduce el código de verificación");
    setCargando(true);
    try {
      const res = await fetch("http://localhost:5000/auth/google-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: form.email, 
          codigo: form.codigo
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        
        // Agregar a la lista de cuentas de Google Mock si no está
        const saved = JSON.parse(localStorage.getItem("google_accounts_mock") || "[]");
        if (!saved.find(a => a.email === data.usuario.email)) {
          const newAcc = { 
            id: Date.now(), 
            nombre: data.usuario.nombre, 
            email: data.usuario.email, 
            img: `https://ui-avatars.com/api/?name=${data.usuario.nombre.replace(" ", "+")}&background=random` 
          };
          localStorage.setItem("google_accounts_mock", JSON.stringify([...saved, newAcc]));
        }
        
        localStorage.setItem("show_save_pass_prompt", "true");
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
      <div className="bg-white p-10 rounded-lg shadow-sm w-full max-w-[450px] border border-gray-200 min-h-[500px] flex flex-col relative overflow-hidden">
        
        {/* Barra de carga mejorada */}
        {cargando && (
          <div className="google-loader-container">
            <div className="google-loader-bar-secondary"></div>
            <div className="google-loader-bar-primary"></div>
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
            alt="Google" 
            className="w-[75px] mb-4"
          />
          <h1 className="text-2xl font-normal text-gray-800">
            {paso === 1 ? "Iniciar sesión" : paso === 2 ? "Te damos la bienvenida" : "Verifica tu identidad"}
          </h1>
          <p className="text-[#202124] text-base mt-2">
            para continuar en <span className="text-blue-600 font-medium">Toy Store</span>
          </p>
          {paso > 1 && (
            <div className="mt-3 px-3 py-1 border border-gray-200 rounded-full flex items-center gap-2 text-sm text-gray-700 animate-step-in">
              <div className="w-5 h-5 rounded-full bg-gray-200 text-[10px] flex items-center justify-center">👤</div>
              {form.email}
            </div>
          )}
        </div>

        <div className="flex-1 mt-4">
          {error && <p className="text-red-600 text-[13px] mb-4 bg-red-50 p-3 rounded border border-red-100 flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </p>}

          {paso === 1 && (
            <div className="space-y-6 animate-step-in">
              <div className="relative">
                <input 
                  type="email" name="email" placeholder="Correo electrónico o teléfono" 
                  value={form.email} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-4 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">¿Has olvidado tu correo electrónico?</p>
              <p className="text-sm text-gray-600 leading-relaxed">¿No es tu ordenador? Usa una ventana privada para iniciar sesión. <a href="#" className="text-blue-600 font-medium hover:underline">Más información</a></p>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-6 animate-step-in">
              <input 
                type="password" name="contrasena" placeholder="Introduce tu contraseña" 
                value={form.contrasena} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-4 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
              <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">¿Has olvidado tu contraseña?</p>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-6 animate-step-in">
              <p className="text-sm text-gray-600 leading-relaxed">
                Por seguridad, Google necesita verificar que eres tú. Hemos enviado un código de 6 dígitos a <span className="font-medium">{form.email}</span>.
              </p>
              <input 
                type="text" name="codigo" placeholder="G- Codigo" 
                value={form.codigo} onChange={handleChange} maxLength="6"
                className="w-full border border-gray-300 rounded-md p-4 text-center text-2xl tracking-[8px] font-semibold focus:border-blue-500 outline-none"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-12">
          <button 
            type="button"
            className="text-blue-600 font-medium text-sm hover:bg-blue-50 px-3 py-2 rounded transition"
            onClick={() => navigate("/registro")}
          >
            Crear cuenta
          </button>
          <button 
            onClick={paso === 3 ? confirmarLogin : siguientePaso}
            disabled={cargando}
            className="bg-[#1a73e8] hover:bg-blue-700 text-white font-medium px-8 py-2 rounded transition disabled:bg-blue-300 shadow-sm"
          >
            {cargando ? "Cargando..." : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
