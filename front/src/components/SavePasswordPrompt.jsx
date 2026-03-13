import { useState, useEffect } from "react";

export default function SavePasswordPrompt() {
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    // Solo mostrar si el flag está en localStorage
    if (localStorage.getItem("show_save_pass_prompt") === "true") {
      const user = JSON.parse(localStorage.getItem("usuario") || "{}");
      if (user.nombre) setUserName(user.nombre);
      
      setTimeout(() => setShow(true), 1000);
      localStorage.removeItem("show_save_pass_prompt");
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-2 right-4 z-[9999] animate-in slide-in-from-top duration-300">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-[320px] p-4 flex flex-col gap-3">
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 p-2 rounded-full text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-800">¿Guardar contraseña?</h3>
            <p className="text-xs text-gray-500 mt-0.5">Google Password Manager</p>
          </div>
          <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="bg-gray-50 p-2 rounded flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Usuario</span>
            <span className="font-medium text-gray-800 truncate max-w-[150px]">{userName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Contraseña</span>
            <span className="font-medium text-gray-800">••••••••</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-1">
          <button 
            onClick={() => setShow(false)}
            className="px-3 py-1.5 text-xs text-blue-600 font-medium hover:bg-blue-50 rounded transition"
          >
            Nunca
          </button>
          <button 
            onClick={() => setShow(false)}
            className="px-4 py-1.5 text-xs bg-blue-600 text-white font-medium hover:bg-blue-700 rounded transition shadow-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
