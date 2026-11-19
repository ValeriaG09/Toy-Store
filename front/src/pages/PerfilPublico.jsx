import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AvatarHat from '../components/AvatarHat';
import PinterestSearchBar from '../components/PinterestSearchBar';
import ChatbotWidget from '../components/ChatbotWidget';
import ConfesionesDrawer from '../components/ConfesionesDrawer';
import ConfiguracionSoporteDrawer from '../components/ConfiguracionSoporteDrawer';

export default function PerfilPublico() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { usuario, logout, avatarHat, userNameHint } = useContext(AuthContext);

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [siguiendo, setSiguiendo] = useState(false);
  const [seguidoresCount, setSeguidoresCount] = useState(0);
  const [activeTab, setActiveTab] = useState('guardados'); // 'creados' | 'guardados'
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePersonSearch, setSharePersonSearch] = useState('');
  const [communityUsers, setCommunityUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showConfesionesDrawer, setShowConfesionesDrawer] = useState(false);
  const [showConfigSoporteDrawer, setShowConfigSoporteDrawer] = useState(false);

  const shareModalRef = useRef(null);
  const userDropdownRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Cargar perfil del usuario
  useEffect(() => {
    if (!username) return;
    setCargando(true);
    setError('');

    fetch(`/auth/perfil/${encodeURIComponent(username)}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Usuario no encontrado');
        return res.json();
      })
      .then(data => {
        if (data.perfil) {
          setPerfil(data.perfil);
          setSiguiendo(Boolean(data.perfil.siguiendoActual));
          setSeguidoresCount(data.perfil.seguidores || 0);
          document.title = `Toy Store | ${data.perfil.nombre} (@${data.perfil.nombre_usuario})`;
        } else {
          setError('No pudimos encontrar este perfil.');
        }
      })
      .catch(err => {
        setError(err.message || 'Error al cargar perfil');
      })
      .finally(() => {
        setCargando(false);
      });
  }, [username]);

  // Cargar usuarios de la comunidad para la lista de compartir
  useEffect(() => {
    fetch('/auth/usuarios', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data?.usuarios && Array.isArray(data.usuarios)) {
          setCommunityUsers(data.usuarios);
        }
      })
      .catch(() => {});
  }, []);

  // Cerrar modales al hacer clic fuera
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (shareModalRef.current && !shareModalRef.current.contains(e.target)) {
        setShowShareModal(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Escuchar evento de apertura de confesiones desde el ToyMobile u otros componentes
  useEffect(() => {
    const handleOpenConfesiones = () => setShowConfesionesDrawer(true);
    window.addEventListener('toy_open_confesiones', handleOpenConfesiones);
    return () => window.removeEventListener('toy_open_confesiones', handleOpenConfesiones);
  }, []);

  const handleToggleSeguir = async () => {
    if (!perfil) return;
    if (!usuario) {
      showToast('Inicia sesión para seguir a este usuario.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      const res = await fetch(`/auth/seguir/${perfil.id || perfil.id_usuario}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSiguiendo(data.siguiendo);
        setSeguidoresCount(prev => data.siguiendo ? prev + 1 : Math.max(0, prev - 1));
        showToast(data.mensaje);
      } else {
        showToast(data.error || 'No se pudo actualizar el seguimiento');
      }
    } catch (e) {
      showToast('Error de conexión');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Enlace del perfil copiado al portapapeles');
  };

  const shareUrl = window.location.href;
  const shareText = perfil ? `Mira el perfil de ${perfil.nombre} en Toy Store` : 'Toy Store';

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareMessenger = () => {
    window.open(`fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleSendToUser = (targetUser) => {
    showToast(`Enlace enviado con éxito a ${targetUser.nombre}.`);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased flex flex-col select-none">
      
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-none">
          <div className="bg-[#a6d4f2] text-[#1e3a8a] text-sm font-bold px-6 py-2.5 rounded-2xl shadow-xl border border-[#8ec2e4]">
            {toastMessage}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. BARRA VERTICAL DE ICONOS A LA IZQUIERDA (TOTALMENTE FIJA) */}
      {/* ============================================================ */}
      <aside className="fixed left-0 top-0 bottom-0 w-[82px] border-r border-[#e9e9e9] flex flex-col justify-between items-center py-4 bg-white z-40 select-none">
        
        {/* ICONOS SUPERIORES */}
        <div className="flex flex-col items-center space-y-4 w-full">
          
          {/* LOGO OFICIAL TOY STORE */}
          <div 
            className="w-[76px] h-[58px] rounded-2xl flex items-center justify-center px-1 py-0.5 select-none pointer-events-none"
            title="Toy Store"
          >
            <img 
              src="/images/logo_config.png" 
              alt="Toy Store" 
              className="w-full h-full object-contain drop-shadow-sm" 
            />
          </div>

          {/* ICONO 1: INICIO */}
          <button 
            onClick={() => navigate('/')} 
            className="w-12 h-12 rounded-full hover:bg-[#a6d4f2]/20 flex items-center justify-center text-[#1e3a8a] transition-colors cursor-pointer group"
            title="Inicio"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.25L10.9 3.5a1.6 1.6 0 0 1 2.2 0L21 10.25V20a1.75 1.75 0 0 1-1.75 1.75H4.75A1.75 1.75 0 0 1 3 20V10.25z" />
              <path d="M9.5 21v-6a2.5 2.5 0 0 1 5 0v6" />
            </svg>
          </button>

          {/* ICONO 2: LA BRÚJULA */}
          <button 
            onClick={() => navigate('/configuracion?tab=hoy')} 
            className="w-12 h-12 rounded-full hover:bg-[#a6d4f2]/30 flex items-center justify-center transition-all cursor-pointer text-[#1e3a8a]"
            title="Sigue inspirándote"
          >
            <div className="relative">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9.25" />
                <polygon points="15.8,8.2 13.2,13.2 8.2,15.8 10.8,10.8" fill="none" />
                <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </button>

          {/* ICONO 3: EL COFRE DE SECRETOS GUARDADOS */}
          <button 
            onClick={() => navigate('/configuracion?tab=secretos')}
            className="w-12 h-12 rounded-full hover:bg-[#a6d4f2]/30 flex items-center justify-center transition-all cursor-pointer text-[#1e3a8a]"
            title="Tus secretos guardados"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11V8.5C4 5.5 7.5 3.5 12 3.5C16.5 3.5 20 5.5 20 8.5V11" />
              <rect x="3.5" y="11" width="17" height="9" rx="2.5" />
              <rect x="10.5" y="10" width="3" height="4" rx="1" fill="currentColor" fillOpacity="0.25" />
              <circle cx="12" cy="12" r="0.8" fill="currentColor" />
              <path d="M7.5 6.5v13.5" strokeOpacity="0.35" strokeWidth="1.8" />
              <path d="M16.5 6.5v13.5" strokeOpacity="0.35" strokeWidth="1.8" />
              <path d="M2.5 13.5v2" strokeWidth="2" strokeOpacity="0.35" />
              <path d="M21.5 13.5v2" strokeWidth="2" strokeOpacity="0.35" />
            </svg>
          </button>

          {/* ICONO 4: CARRITO */}
          <button 
            onClick={() => navigate('/carrito')}
            className="w-12 h-12 rounded-full hover:bg-[#a6d4f2]/30 flex items-center justify-center text-[#1e3a8a] transition-all cursor-pointer group"
            title="Carrito, Factura y Pago"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M1 2.5h3.5l2.6 11.5a2 2 0 0 0 2 1.5h8.6a2 2 0 0 0 2-1.5L21.5 6.5H5.2" />
            </svg>
          </button>

          {/* ICONO 5: NOTIFICACIONES */}
          <button 
            onClick={() => navigate('/configuracion')}
            className="w-12 h-12 rounded-full hover:bg-[#a6d4f2]/30 flex items-center justify-center text-[#1e3a8a] transition-all cursor-pointer"
            title="Notificaciones"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* ICONO 6: MENSAJES -> RINCÓN DE CONFESIONES */}
          <button 
            onClick={() => setShowConfesionesDrawer(!showConfesionesDrawer)}
            className={`w-12 h-12 flex items-center justify-center transition-all cursor-pointer text-[#1e3a8a] ${
              showConfesionesDrawer 
                ? 'rounded-2xl bg-[#a6d4f2]/30 ring-1 ring-[#a6d4f2]/50 shadow-xs' 
                : 'rounded-full hover:bg-[#a6d4f2]/30'
            }`}
            title="Rincón de Confesiones"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3.5C6.75 3.5 2.5 7.25 2.5 11.8c0 2.65 1.4 5 3.65 6.45-.15.95-.6 2.3-1.4 3.25 1.8 0 3.65-.8 4.75-1.75.8.2 1.65.3 2.5.3 5.25 0 9.5-3.75 9.5-8.25S17.25 3.5 12 3.5z" />
              <circle cx="8" cy="11.8" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="11.8" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="16" cy="11.8" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>

        {/* ICONO ENGRANAJE DE CONFIGURACIÓN INFERIOR (ABRE PANEL LATERAL CONFIGURACIÓN Y SOPORTE) */}
        <button 
          onClick={() => {
            setShowConfesionesDrawer(false);
            setShowConfigSoporteDrawer(prev => !prev);
          }}
          className={`w-12 h-12 flex items-center justify-center transition-all cursor-pointer mb-2 text-[#1e3a8a] relative group ${
            showConfigSoporteDrawer
              ? 'rounded-2xl bg-[#a6d4f2]/30 ring-1 ring-[#a6d4f2]/50 shadow-xs'
              : 'rounded-full hover:bg-[#a6d4f2]/30'
          }`}
          title="Configuración y soporte"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </aside>

      {/* RINCÓN DE CONFESIONES SLIDE-OVER DRAWER */}
      <ConfesionesDrawer 
        isOpen={showConfesionesDrawer} 
        onClose={() => setShowConfesionesDrawer(false)} 
      />

      {/* PANEL LATERAL DE CONFIGURACIÓN Y SOPORTE (RÉPLICA EXACTA DE PINTEREST) */}
      <ConfiguracionSoporteDrawer 
        isOpen={showConfigSoporteDrawer} 
        onClose={() => setShowConfigSoporteDrawer(false)}
        onSelectTab={(tabKey) => {
          setShowConfigSoporteDrawer(false);
          navigate(`/configuracion?tab=${tabKey}`);
        }}
        showToast={showToast}
      />

      {/* ============================================================ */}
      {/* 2. BARRA SUPERIOR FIJA CON PINTEREST SEARCH BAR Y AVATAR     */}
      {/* ============================================================ */}
      <header className={`fixed top-0 right-0 h-[76px] px-8 flex items-center justify-between border-b border-[#e9e9e9]/80 bg-white z-30 select-none transition-all duration-300 ${
        showConfesionesDrawer || showConfigSoporteDrawer 
          ? (showConfigSoporteDrawer ? 'left-[402px]' : 'left-[442px]') 
          : 'left-[82px]'
      }`}>
        
        {/* Buscador inteligente tipo Pinterest */}
        <div className="flex-1 relative flex items-center mr-6">
          <PinterestSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Buscar juguetes, secretos o usuarios"
          />
        </div>

        {/* Avatar derecho + flechita desplegable (exacto a Pinterest) */}
        <div className="flex items-center gap-2 relative pt-2 flex-shrink-0 select-none" ref={userDropdownRef}>
          <button
            type="button"
            onClick={() => navigate('/configuracion?tab=secretos')}
            className="p-1 rounded-full hover:bg-[#a6d4f2]/20 transition-all cursor-pointer group relative"
            title="Tus secretos más guardados (Perfil)"
          >
            <div className="relative w-9 h-9">
              {avatarHat && avatarHat !== 'none' && (
                <AvatarHat type={avatarHat} size="navbar" />
              )}
              {usuario?.foto_perfil ? (
                <img
                  src={usuario.foto_perfil}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a6d4f2] to-[#8ec2e4] text-[#1e3a8a] font-bold text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  {(usuario?.nombre || 'M').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </button>

          {/* Flecha separada */}
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              showUserDropdown 
                ? 'bg-[#e2e2e2] shadow-inner text-[#111111] ring-2 ring-gray-300/80 scale-95' 
                : 'text-[#1e3a8a] hover:bg-[#a6d4f2]/20'
            }`}
            title="Cuentas y opciones"
          >
            <svg className={`w-3.5 h-3.5 text-current transition-transform duration-150 ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {/* Menú desplegable exacto a Pinterest */}
          {showUserDropdown && (
            <div className="absolute right-0 top-14 w-[280px] bg-white rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.16)] border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-100 text-left select-none">
              <div className="text-xs text-[#717171] font-normal mb-3 px-2">
                Actualmente en
              </div>

              <div 
                onClick={() => {
                  navigate('/configuracion?tab=secretos');
                  setShowUserDropdown(false);
                }}
                className="flex items-center gap-3 p-2 pt-3 rounded-2xl hover:bg-gray-100/80 cursor-pointer transition-colors group"
              >
                <div className="relative w-14 h-14 flex-shrink-0">
                  {avatarHat && avatarHat !== 'none' && (
                    <AvatarHat type={avatarHat} size="sm" />
                  )}
                  {usuario?.foto_perfil ? (
                    <img
                      src={usuario.foto_perfil}
                      alt="Avatar"
                      className="w-14 h-14 rounded-full object-cover shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#a6d4f2] to-[#8ec2e4] text-[#1e3a8a] font-bold text-xl flex items-center justify-center shadow-xs">
                      {(usuario?.nombre || 'M').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-base font-semibold text-[#1e3a8a] transition-colors truncate leading-tight">
                    {usuario?.nombre || 'Mariana Alvarez'}
                  </p>
                  <p className="text-xs text-[#717171] font-normal mt-0.5">Personal</p>
                  <p className="text-xs text-[#717171] font-normal truncate mt-0.5">
                    {usuario?.email || 'mfranco090393@gmail.com'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#717171] font-normal mt-4 mb-1 px-2">
                Tus cuentas
              </div>
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/login');
                  }}
                  className="w-full text-left font-semibold text-[15px] text-[#1e3a8a] hover:text-[#0047AB] py-2 px-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Agregar otra cuenta
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (logout) await logout();
                    navigate('/login');
                  }}
                  className="w-full text-left font-semibold text-[15px] text-[#1e3a8a] hover:text-red-600 py-2 px-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Salir
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. CONTENIDO PRINCIPAL: PERFIL COPIE Y PEGUE DE PINTEREST    */}
      {/* ============================================================ */}
      <main className={`pt-[110px] pb-32 w-full transition-all duration-300 ${
        showConfesionesDrawer || showConfigSoporteDrawer 
          ? (showConfigSoporteDrawer ? 'pl-[402px]' : 'pl-[442px]') 
          : 'pl-[82px]'
      }`}>
        <div className="w-full max-w-[1240px] mx-auto px-6 md:px-8">
        
        {cargando ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-[#a6d4f2] border-t-[#1e3a8a] rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-[#1e3a8a]">Cargando perfil de usuario...</p>
          </div>
        ) : error || !perfil ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">Usuario no encontrado</h2>
            <p className="text-sm text-[#717171] mb-6">El nombre de usuario "@{username}" no existe o fue modificado.</p>
            <button
              onClick={() => navigate('/configuracion')}
              className="px-6 py-2.5 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-bold text-xs transition-all shadow-xs"
            >
              Volver a Configuración
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            
            {/* ============================================================ */}
            {/* CABECERA DE PERFIL: 2 COLUMNAS (COPIE Y PEGUE EXACTO DE PINTEREST) */}
            {/* ============================================================ */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-10 w-full mb-12 relative select-none">
              
              {/* COLUMNA IZQUIERDA: AVATAR, NOMBRE, METRICAS, BIO Y BOTÓN */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[360px] xl:w-[390px] flex-shrink-0">
                
                {/* Avatar oficial con gorro ajustado sobre la curvatura de la cabeza */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4">
                  {perfil.avatar_hat && perfil.avatar_hat !== 'none' && (
                    <AvatarHat 
                      type={perfil.avatar_hat} 
                      size="lg" 
                    />
                  )}
                  {perfil.foto_perfil ? (
                    <img
                      src={perfil.foto_perfil}
                      alt={perfil.nombre}
                      className="w-full h-full rounded-full object-cover shadow-sm ring-4 ring-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#a6d4f2] to-[#8ec2e4] text-[#1e3a8a] font-bold text-4xl flex items-center justify-center shadow-sm ring-4 ring-gray-100 select-none">
                      {perfil.nombre?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                {/* Nombre oficial con insignia de verificado idéntica a Pinterest */}
                <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a] tracking-tight flex items-center gap-2">
                  <span>{perfil.nombre}</span>
                  <span className="w-5 h-5 rounded-full bg-[#1e3a8a] text-white text-[11px] flex items-center justify-center font-bold flex-shrink-0" title="Perfil verificado de Toy Store">
                    ✓
                  </span>
                </h1>

                {/* Handle / Nombre de usuario */}
                <div className="text-sm text-[#717171] font-normal mt-0.5">
                  @{perfil.nombre_usuario}
                </div>

                {/* Métricas de seguidores y siguiendo */}
                <div className="flex items-center gap-2 text-sm text-[#717171] mt-2 font-normal flex-wrap">
                  <span className="font-semibold text-[#111111]">{seguidoresCount} {seguidoresCount === 1 ? 'seguidor' : 'seguidores'}</span>
                  <span>·</span>
                  <span>Siguiendo a <b className="font-semibold text-[#111111]">{perfil.siguiendo || 0}</b></span>
                  <span>·</span>
                  <span>Comunidad Toy Store</span>
                </div>

                {/* Biografía / Información */}
                {perfil.informacion ? (
                  <p className="text-sm text-[#111111] mt-3 leading-relaxed font-normal">
                    {perfil.informacion}
                  </p>
                ) : (
                  <p className="text-sm text-[#717171] mt-3 italic font-normal">
                    Explorando juguetes, secretos y deseos íntimos en Toy Store.
                  </p>
                )}

                {/* Enlace al sitio web con icono de globo */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1e3a8a] hover:underline mt-3 cursor-pointer">
                  <svg className="w-3.5 h-3.5 stroke-current flex-shrink-0" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <a 
                    href={perfil.sitio_web ? (perfil.sitio_web.startsWith('http') ? perfil.sitio_web : `https://${perfil.sitio_web}`) : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {perfil.sitio_web ? perfil.sitio_web.replace(/^https?:\/\//, '') : `${perfil.nombre_usuario}.toystore.com`}
                  </a>
                </div>

                {/* Botón principal: Editar perfil o Seguir */}
                <div className="mt-5">
                  {perfil.esMismoUsuario ? (
                    <button
                      type="button"
                      onClick={() => navigate('/configuracion')}
                      className="px-7 py-3 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      Editar perfil
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleSeguir}
                      className={`px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-xs ${
                        siguiendo
                          ? 'bg-gray-200 text-[#1e3a8a] hover:bg-gray-300'
                          : 'bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a]'
                      }`}
                    >
                      {siguiendo ? 'Siguiendo' : 'Seguir'}
                    </button>
                  )}
                </div>

              </div>

              {/* COLUMNA DERECHA: TARJETA SHOWCASE PORTADA PROPORCIONADA EXACTA A PINTEREST */}
              <div className="w-full lg:w-[540px] xl:w-[600px] h-[320px] md:h-[350px] rounded-[32px] overflow-hidden relative shadow-sm border border-gray-100 bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 flex items-center justify-center p-8 group flex-shrink-0">
                
                {/* Botones flotantes redondos blancos en la esquina superior derecha (Screenshot 9) */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                  
                  {/* Botón Compartir [ ↑ ] */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowShareModal(!showShareModal)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-95 ${
                        showShareModal ? 'bg-[#1e3a8a] text-white' : 'bg-white/95 hover:bg-white text-[#111111]'
                      }`}
                      title="Compartir perfil"
                    >
                      <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </button>

                    {/* Pop-up de compartir flotando sobre el botón */}
                    {showShareModal && (
                      <div 
                        ref={shareModalRef}
                        className="absolute top-14 right-0 w-[340px] max-w-[92vw] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none text-left"
                      >
                        {/* Cabecera modal compartir */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-bold text-[#111111]">
                            Compartir
                          </h3>
                          <button 
                            onClick={() => setShowShareModal(false)}
                            className="w-7 h-7 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#111111] flex items-center justify-center text-sm font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Redes sociales */}
                        <div className="grid grid-cols-5 gap-2 text-center mb-5">
                          <div onClick={handleCopyLink} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 text-[#111111] flex items-center justify-center transition-colors shadow-2xs">
                              <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </div>
                            <span className="text-[10px] text-[#717171] group-hover:text-[#111111] font-medium leading-tight">Copiar</span>
                          </div>

                          <div onClick={handleShareWhatsApp} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-colors shadow-2xs">
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm5.77 14.01c-.24.67-1.39 1.28-1.92 1.34-.49.06-1.12.08-3.23-.78-2.69-1.11-4.43-3.84-4.57-4.02-.13-.18-1.09-1.45-1.09-2.77s.69-1.97.94-2.24c.24-.26.54-.33.72-.33.18 0 .36 0 .52.01.17.01.4.07.61.57.24.57.81 1.98.88 2.13.07.15.12.33.02.53-.09.21-.14.33-.29.5-.15.18-.31.39-.45.53-.15.15-.31.31-.13.62.18.3 1.21 2 2.61 3.24 1.8 1.6 3.32 2.09 3.79 2.33.3.15.48.13.66-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.77.83 2.07.98.3.15.5.23.57.35.07.12.07.72-.17 1.39z"/>
                              </svg>
                            </div>
                            <span className="text-[10px] text-[#717171] group-hover:text-[#111111] font-medium leading-tight">WhatsApp</span>
                          </div>

                          <div onClick={handleShareMessenger} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0084FF] to-[#A824FB] text-white flex items-center justify-center transition-colors shadow-2xs">
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.13 2 11.23c0 2.9 1.45 5.48 3.72 7.11v3.66l3.52-1.93c.88.24 1.8.38 2.76.38 5.52 0 10-4.13 10-9.22C22 6.13 17.52 2 12 2zm1.05 12.39l-2.68-2.86-5.23 2.86 5.75-6.1 2.74 2.86 5.17-2.86-5.75 6.1z"/>
                              </svg>
                            </div>
                            <span className="text-[10px] text-[#717171] group-hover:text-[#111111] font-medium leading-tight">Messenger</span>
                          </div>

                          <div onClick={handleShareFacebook} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center transition-colors shadow-2xs">
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                            </div>
                            <span className="text-[10px] text-[#717171] group-hover:text-[#111111] font-medium leading-tight">Facebook</span>
                          </div>

                          <div onClick={handleShareTwitter} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-colors shadow-2xs">
                              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            </div>
                            <span className="text-[10px] text-[#717171] group-hover:text-[#111111] font-medium leading-tight">X</span>
                          </div>
                        </div>

                        {/* Personas internas */}
                        <div className="relative mb-3">
                          <input
                            type="text"
                            value={sharePersonSearch}
                            onChange={(e) => setSharePersonSearch(e.target.value)}
                            placeholder="Buscar personas"
                            className="w-full text-xs py-2 pl-8 pr-3 rounded-full bg-gray-100 hover:bg-gray-200/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111] transition-all font-normal"
                          />
                          <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                          </svg>
                        </div>

                        <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
                          {communityUsers
                            .filter(u => !sharePersonSearch.trim() || u.nombre?.toLowerCase().includes(sharePersonSearch.toLowerCase()))
                            .map(u => (
                              <div key={u.id_usuario} className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-gray-50">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="relative w-8 h-8 flex-shrink-0">
                                    {u.avatar_hat && u.avatar_hat !== 'none' && (
                                      <AvatarHat type={u.avatar_hat} size="navbar" />
                                    )}
                                    {u.foto_perfil ? (
                                      <img src={u.foto_perfil} alt={u.nombre} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-[#a6d4f2] text-[#1e3a8a] font-bold text-xs flex items-center justify-center">
                                        {u.nombre?.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-normal text-[#111111] truncate">{u.nombre}</p>
                                    <span className="text-[10px] text-[#717171] truncate block">@{u.nombre_usuario}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSendToUser(u)}
                                  className="px-3.5 py-1.5 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] text-xs font-bold cursor-pointer active:scale-95 transition-all flex-shrink-0 shadow-2xs"
                                >
                                  Enviar
                                </button>
                              </div>
                            ))}
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Botón Más opciones [ ··· ] */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#111111] flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-95"
                    title="Copiar enlace"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                      <circle cx="5" cy="12" r="2" />
                    </svg>
                  </button>

                </div>

                {/* Contenido visual de la tarjeta de portada / showcase */}
                <div className="relative flex flex-col items-center justify-center text-center p-6 w-full">
                  <div className="relative max-w-[280px] max-h-[200px] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/images/vibrador_cowgirl.png" 
                      alt="Showcase Toy Store" 
                      className="max-h-[180px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)]"
                    />
                  </div>
                  <div className="mt-5 px-5 py-2 rounded-full bg-white/85 backdrop-blur-xs text-xs font-semibold text-[#1e3a8a] shadow-xs">
                    Colección privada · Secretos y deseos de {perfil.nombre}
                  </div>
                </div>

              </div>

            </div>

            {/* ============================================================ */}
            {/* PESTAÑAS: CREADOS Y GUARDADOS (IDÉNTICO A PINTEREST)          */}
            {/* ============================================================ */}
            <div className="w-full border-b border-gray-200 mb-8 flex justify-center gap-10">
              <button
                type="button"
                onClick={() => setActiveTab('creados')}
                className={`pb-3 font-bold text-base transition-all relative cursor-pointer ${
                  activeTab === 'creados'
                    ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                    : 'text-[#717171] hover:text-[#111111]'
                }`}
              >
                Creados
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guardados')}
                className={`pb-3 font-bold text-base transition-all relative cursor-pointer ${
                  activeTab === 'guardados'
                    ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
                    : 'text-[#717171] hover:text-[#111111]'
                }`}
              >
                Guardados
              </button>
            </div>

            {/* ============================================================ */}
            {/* CONTENIDO DE PESTAÑAS (COLECCIONES DISCRETAS Y REALES)        */}
            {/* ============================================================ */}
            {activeTab === 'guardados' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 w-full animate-in fade-in duration-200">
                
                {/* Tablero 1 */}
                <div className="rounded-3xl border border-gray-100 p-4 bg-gray-50/60 hover:bg-sky-50/50 hover:shadow-md transition-all cursor-pointer group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-sky-100 p-4 flex items-center justify-center mb-3">
                    <img src="/images/vibrador_cowgirl.png" alt="Favoritos íntimos" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1e3a8a]">Favoritos Íntimos</h3>
                      <p className="text-xs text-[#717171] font-normal">5 secretos guardados</p>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-2xs" title="Colección discreta">
                      <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Tablero 2 */}
                <div className="rounded-3xl border border-gray-100 p-4 bg-gray-50/60 hover:bg-sky-50/50 hover:shadow-md transition-all cursor-pointer group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 p-4 flex items-center justify-center mb-3">
                    <img src="/images/lenceria_andy.png" alt="Lencería & Juegos" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1e3a8a]">Lencería & Pasión</h3>
                      <p className="text-xs text-[#717171] font-normal">3 secretos guardados</p>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-2xs" title="Colección discreta">
                      <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Tablero 3 */}
                <div className="rounded-3xl border border-gray-100 p-4 bg-gray-50/60 hover:bg-sky-50/50 hover:shadow-md transition-all cursor-pointer group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-emerald-100 p-4 flex items-center justify-center mb-3">
                    <img src="/images/plug_anal.png" alt="Sensaciones Secretas" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1e3a8a]">Sensaciones Secretas</h3>
                      <p className="text-xs text-[#717171] font-normal">2 secretos guardados</p>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-2xs" title="Colección discreta">
                      <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Tablero 4 */}
                <div className="rounded-3xl border border-gray-100 p-4 bg-gray-50/60 hover:bg-sky-50/50 hover:shadow-md transition-all cursor-pointer group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 p-4 flex items-center justify-center mb-3">
                    <img src="/images/mystery_box.png" alt="Cajas Sorpresa & Kits" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1e3a8a]">Cajas Sorpresa & Kits</h3>
                      <p className="text-xs text-[#717171] font-normal">6 secretos guardados</p>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-2xs" title="Colección discreta">
                      <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Tablero 5 */}
                <div className="rounded-3xl border border-gray-100 p-4 bg-gray-50/60 hover:bg-sky-50/50 hover:shadow-md transition-all cursor-pointer group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 to-indigo-100 p-4 flex items-center justify-center mb-3">
                    <img src="/images/vibrador_cowgirl.png" alt="Aceites & Sensaciones" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#1e3a8a]">Aceites & Sensaciones</h3>
                      <p className="text-xs text-[#717171] font-normal">4 secretos guardados</p>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-2xs" title="Colección discreta">
                      <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-16 text-center animate-in fade-in duration-200">
                <div className="max-w-md mx-auto p-8 rounded-3xl bg-gray-50/70 border border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-[#a6d4f2]/30 text-[#1e3a8a] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-[#1e3a8a] mb-1">
                    Sin creaciones públicas aún
                  </h3>
                  <p className="text-xs text-[#717171]">
                    {perfil.nombre} mantiene sus deseos y tableros en modo discreto y confidencial.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        </div>
      </main>

      <ChatbotWidget />
    </div>
  );
}
