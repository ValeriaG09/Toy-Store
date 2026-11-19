import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfiguracionSoporteDrawer({ 
  isOpen, 
  onClose,
  onSelectTab,
  showToast 
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (label, actionType) => {
    if (actionType === 'perfil') {
      if (onSelectTab) onSelectTab('perfil');
      else navigate('/configuracion');
      onClose();
    } else if (actionType === 'hoy') {
      if (onSelectTab) onSelectTab('hoy');
      else navigate('/configuracion?tab=hoy');
      onClose();
    } else if (actionType === 'cuenta') {
      if (onSelectTab) onSelectTab('cuenta');
      else navigate('/configuracion?tab=cuenta');
      onClose();
    } else if (actionType === 'privacidad') {
      if (onSelectTab) onSelectTab('privacidad');
      else navigate('/configuracion?tab=privacidad');
      onClose();
    } else if (actionType === 'copy_link') {
      navigator.clipboard?.writeText(window.location.origin);
      if (showToast) showToast('Enlace de Toy Store copiado al portapapeles');
    } else if (actionType === 'info') {
      if (showToast) showToast(`Sección "${label}" en desarrollo para Toy Store`);
    }
  };

  return (
    <div className="fixed top-0 left-[82px] w-[320px] h-screen bg-white border-r border-[#e9e9e9] z-20 flex flex-col select-none overflow-hidden transition-all duration-300 text-left shadow-[10px_0_30px_rgba(0,0,0,0.06)]">
      
      {/* Cabecera idéntica a Pinterest (con título en azul oscuro) */}
      <div className="p-5 pb-3 flex items-center justify-between border-b border-gray-100 flex-shrink-0 bg-white">
        <h2 className="text-xl font-bold text-[#1e3a8a] tracking-tight">
          Configuración y soporte
        </h2>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#111111] transition-colors cursor-pointer text-base font-bold"
          title="Cerrar panel"
        >
          ✕
        </button>
      </div>

      {/* Contenido con scroll tipo Pinterest */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 text-[#111111] text-sm">
        
        {/* SECCIÓN 1: CONFIGURACIÓN */}
        <div>
          <h3 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider px-2 mb-2">
            Configuración
          </h3>
          <div className="space-y-0.5">
            <button
              onClick={() => handleAction('Configuración', 'perfil')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer"
            >
              <span>Configuración</span>
            </button>

            <button
              onClick={() => handleAction('Ajusta las recomendaciones', 'hoy')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer"
            >
              <span>Ajusta las recomendaciones</span>
            </button>

            <button
              onClick={() => handleAction('Enlace a Toy Store', 'copy_link')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer"
            >
              <span>Enlace a Toy Store</span>
            </button>

            <button
              onClick={() => handleAction('Centro para denuncias e infracciones', 'privacidad')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer"
            >
              <span>Centro para denuncias e infracciones</span>
            </button>

            <button
              onClick={() => handleAction('Instalar la aplicación de Windows', 'info')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer"
            >
              <span>Instalar la aplicación de Windows</span>
            </button>

            <button
              onClick={() => handleAction('Sé un evaluador beta', 'info')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer group"
            >
              <span>Sé un evaluador beta</span>
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1e3a8a] stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>
          </div>
        </div>

        {/* SECCIÓN 2: SOPORTE */}
        <div>
          <h3 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider px-2 mb-2">
            Soporte
          </h3>
          <div className="space-y-0.5">
            <button
              onClick={() => handleAction('Centro de asistencia', 'info')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer group"
            >
              <span>Centro de asistencia</span>
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1e3a8a] stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>

            <button
              onClick={() => handleAction('Crear widget', 'info')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer group"
            >
              <span>Crear widget</span>
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1e3a8a] stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>

            <button
              onClick={() => handleAction('Eliminaciones', 'info')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer"
            >
              <span>Eliminaciones</span>
            </button>

            <button
              onClick={() => handleAction('Anuncios personalizados', 'info')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer group"
            >
              <span>Anuncios personalizados</span>
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1e3a8a] stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>

            <button
              onClick={() => handleAction('Tus derechos de privacidad', 'privacidad')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer"
            >
              <span>Tus derechos de privacidad</span>
            </button>

            <button
              onClick={() => handleAction('Política de privacidad', 'privacidad')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer group"
            >
              <span>Política de privacidad</span>
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1e3a8a] stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>

            <button
              onClick={() => handleAction('Condiciones del servicio', 'info')}
              className="w-full text-left py-2.5 px-3 rounded-2xl hover:bg-gray-100 transition-colors font-normal text-[#111111] hover:text-[#1e3a8a] flex items-center justify-between cursor-pointer group"
            >
              <span>Condiciones del servicio</span>
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1e3a8a] stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>
          </div>
        </div>

        {/* SECCIÓN 3: RECURSOS INFERIORES */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] font-bold text-[#1e3a8a] uppercase tracking-wider px-2 mb-2">
            Recursos
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#717171] px-2 font-normal">
            <span onClick={() => handleAction('Info', 'info')} className="hover:underline hover:text-[#1e3a8a] cursor-pointer">Info</span>
            <span onClick={() => handleAction('Blog', 'info')} className="hover:underline hover:text-[#1e3a8a] cursor-pointer">Blog</span>
            <span onClick={() => handleAction('Empresas', 'info')} className="hover:underline hover:text-[#1e3a8a] cursor-pointer">Empresas</span>
            <span onClick={() => handleAction('Empleos', 'info')} className="hover:underline hover:text-[#1e3a8a] cursor-pointer">Empleos</span>
            <span onClick={() => handleAction('Desarrolladores', 'info')} className="hover:underline hover:text-[#1e3a8a] cursor-pointer">Desarrolladores</span>
          </div>
        </div>

      </div>

    </div>
  );
}
