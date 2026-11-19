import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PurposeSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-[360px] h-screen bg-white border-r border-[#e9e9e9] z-[250] flex flex-col select-none overflow-hidden transition-all duration-300 text-left shadow-[10px_0_30px_rgba(0,0,0,0.06)]">
      
      {/* Cabecera idéntica a Confesiones y Notificaciones */}
      <div className="p-5 pb-3.5 flex items-center justify-between border-b border-gray-100 flex-shrink-0 bg-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center flex-shrink-0">
            {/* Icono Estrella SVG minimalista */}
            <svg className="w-5 h-5 fill-current stroke-current" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#1e3a8a] tracking-tight leading-tight truncate">
              Propósito y Misión
            </h2>
            <p className="text-[11px] text-[#717171] leading-none mt-0.5 truncate">
              El corazón y los valores de Toy Store
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#111111] transition-colors cursor-pointer text-base font-bold flex-shrink-0"
          title="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5 text-sm">
        
        {/* Tarjeta 1: Nuestro Propósito */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1e3a8a]"></span>
            <h3 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
              Nuestro Propósito
            </h3>
          </div>
          <p className="text-xs text-[#111111] leading-relaxed font-normal">
            En Toy Store creemos que el placer es un derecho fundamental y natural. Nuestro propósito es crear una plataforma segura, inclusiva y divertida donde todxs puedan explorar su sexualidad desde el consentimiento pleno, la libertad y la curiosidad.
          </p>
        </div>

        {/* Tarjeta 2: Nuestra Misión */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
            <h3 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
              Nuestra Misión
            </h3>
          </div>
          <p className="text-xs text-[#111111] leading-relaxed font-normal">
            Romper los tabúes cotidianos a través del juego, la discreción y el goce. Conectamos cuerpo y mente desde la risa y el deseo íntimo, garantizando experiencias de alta calidad que despiertan sensaciones únicas.
          </p>
        </div>

        {/* Tarjeta 3: Los 3 Compromisos de Oro */}
        <div>
          <div className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-2.5">
            Nuestros 3 Compromisos
          </div>

          <div className="space-y-2.5">
            
            {/* 1. Empaque discreto */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1e3a8a] shadow-2xs flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1e3a8a]">
                  Empaque 100% Discreto
                </h4>
                <p className="text-[11px] text-[#717171] font-normal leading-snug mt-0.5">
                  Caja neutral sin logos, marcas ni descripciones. Nadie sabrá lo que hay dentro.
                </p>
              </div>
            </div>

            {/* 2. Silicona médica */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1e3a8a] shadow-2xs flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1e3a8a]">
                  Seguridad y Grado Médico
                </h4>
                <p className="text-[11px] text-[#717171] font-normal leading-snug mt-0.5">
                  Materiales hipoalergénicos, libres de ftalatos y seguros para el contacto con la piel.
                </p>
              </div>
            </div>

            {/* 3. Confidencialidad */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1e3a8a] shadow-2xs flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1e3a8a]">
                  Secretos y Datos Seguros
                </h4>
                <p className="text-[11px] text-[#717171] font-normal leading-snug mt-0.5">
                  Tus tableros privados, secretos guardados y confesiones cuentan con máxima protección.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Botón inferior a la tienda */}
      <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/guia');
          }}
          className="w-full py-2.5 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
        >
          Conocer nuestra Guía de Exploración
        </button>
      </div>

    </div>
  );
}
