import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SavePasswordPrompt() {
  const { usuario } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPass, setPendingPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("show_save_pass_prompt") === "true") {
      setPendingEmail(localStorage.getItem("pending_save_email") || usuario?.email || "");
      setPendingPass(localStorage.getItem("pending_save_pass") || "");
      
      setTimeout(() => setShow(true), 800);
      localStorage.removeItem("show_save_pass_prompt");
    }
  }, [usuario]);

  const handleSave = () => {
    if (pendingEmail && pendingPass) {
      const saved = JSON.parse(localStorage.getItem("mock_saved_passwords") || "{}");
      saved[pendingEmail] = pendingPass;
      localStorage.setItem("mock_saved_passwords", JSON.stringify(saved));
    }
    closePrompt();
  };

  const closePrompt = () => {
    localStorage.removeItem("pending_save_email");
    localStorage.removeItem("pending_save_pass");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 right-8 z-[9999] animate-in slide-in-from-top-4 fade-in duration-200 font-sans">
      {/* Pestañita del globo de Chrome (el triángulo apuntando a la barra de URLs) */}
      <div className="absolute -top-[5px] right-[45px] w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45 z-20"></div>
      
      <div className="bg-white rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-gray-200 w-[360px] flex flex-col relative z-10 overflow-hidden">
        
        {/* Botón de cierre superior (X) */}
        <button onClick={closePrompt} className="absolute top-3 right-3 text-gray-500 hover:bg-gray-100 rounded-full p-1.5 transition">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Header Content */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-[9px] rounded-full text-[#1a73e8]">
            <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.65 10C11.83 7.67 9.61 6 7 6a6 6 0 000 12c2.61 0 4.83-1.67 5.65-4h2.35l2 2 2-2 2 2 3-3V10h-8.35zM7 14a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-[#202124] tracking-tight leading-tight">¿Guardar contraseña?</h3>
          </div>
        </div>

        {/* Inputs (Chrome Style) */}
        <div className="px-5 py-4 flex items-start gap-3">
          <img 
             src={`https://ui-avatars.com/api/?name=${pendingEmail}&background=random&color=fff&size=40`} 
             alt="User" 
             className="w-10 h-10 rounded-full border border-gray-100 shrink-0 select-none grayscale-[20%]"
          />
          <div className="flex flex-col w-full gap-[10px]">
            {/* Username Input Box */}
            <div className="w-full border border-gray-300 rounded-[4px] focus-within:border-[#1a73e8] focus-within:outline-1 focus-within:outline-[#1a73e8] outline-none bg-white p-[1px]">
              <input 
                type="text" 
                readOnly 
                value={pendingEmail} 
                className="w-full text-[13px] text-[#202124] outline-none px-2 py-1.5 bg-transparent"
              />
            </div>
            {/* Password Input Box */}
            <div className="w-full border border-gray-300 rounded-[4px] focus-within:border-[#1a73e8] focus-within:outline-1 focus-within:outline-[#1a73e8] outline-none bg-white flex justify-between items-center pr-1 p-[1px]">
              <input 
                type={showPassword ? "text" : "password"} 
                readOnly 
                value={pendingPass} 
                className={`w-full text-[13px] text-[#202124] outline-none px-2 py-[7px] bg-transparent ${showPassword ? "" : "tracking-[3px]"}`}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full flex items-center justify-center transition-colors mr-0.5"
              >
                {showPassword ? (
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center bg-[#f8f9fa] border-t border-gray-100 py-3 px-5">
          <div className="flex items-center gap-[5px] cursor-pointer hover:bg-gray-200/50 py-1.5 px-2 rounded-[4px] -ml-2 transition">
            <img src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png" alt="Google" className="h-[14px]" />
            <span className="text-[12px] text-[#5f6368] font-[500] tracking-wide" style={{fontFamily: "Roboto, Arial, sans-serif"}}>Password Manager</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={closePrompt}
              className="px-4 py-[6px] text-[13px] text-[#1a73e8] font-medium hover:bg-[#e8f0fe] rounded-[4px] transition"
            >
              Nunca
            </button>
            <button 
              onClick={handleSave}
              className="px-5 py-[6px] text-[13px] bg-[#1a73e8] border border-transparent text-white font-medium hover:bg-[#1557b0] hover:shadow-[0_1px_2px_rgba(0,0,0,0.15)] rounded-[4px] transition"
            >
              Guardar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
