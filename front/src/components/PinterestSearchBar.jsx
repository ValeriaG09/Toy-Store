import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LennyIcon from './LennyIcon';
import AvatarHat from './AvatarHat';

export default function PinterestSearchBar({
  searchTerm = '',
  setSearchTerm,
  onVisualSearchClick,
  onSelectTab,
  onOpenSecretos,
  onOpenHats,
  onOpenNotifications,
  className = '',
  placeholder = "Buscar juguetes, secretos o usuarios"
}) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [communityUsers, setCommunityUsers] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem('toy_recent_searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filtrar y limpiar para que los perfiles (@...) no aparezcan en búsquedas recientes
        const cleaned = parsed.filter(item => item && item.label && !item.label.startsWith('@'));
        try {
          localStorage.setItem('toy_recent_searches', JSON.stringify(cleaned));
        } catch (err) {}
        return cleaned;
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Cargar usuarios reales de la base de datos para sugerencias de perfiles
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

  // Limpiar cualquier perfil (@...) que haya quedado guardado en búsquedas recientes
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toy_recent_searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        const cleaned = parsed.filter(item => 
          item && 
          item.label && 
          !item.label.startsWith('@') &&
          !item.label.toLowerCase().includes('mfranco') &&
          !communityUsers.some(u => u.nombre_usuario?.toLowerCase() === item.label.toLowerCase())
        );
        localStorage.setItem('toy_recent_searches', JSON.stringify(cleaned));
        setRecentSearches(cleaned);
      }
    } catch (err) {}
  }, [communityUsers]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Guardar en búsquedas recientes (excluyendo perfiles)
  const saveRecentSearch = (text, img = null) => {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    if (clean.startsWith('@')) return;
    if (communityUsers.some(u => 
      u.nombre_usuario?.toLowerCase() === clean.toLowerCase() ||
      u.nombre?.toLowerCase() === clean.toLowerCase()
    )) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => 
        item.label.toLowerCase() !== clean.toLowerCase() && 
        !item.label.startsWith('@') &&
        !communityUsers.some(u => u.nombre_usuario?.toLowerCase() === item.label.toLowerCase())
      );
      const updated = [{ label: clean, img: img || '/images/vibrador_cowgirl.png' }, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('toy_recent_searches', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const removeRecentSearch = (e, label) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.label !== label);
      try {
        localStorage.setItem('toy_recent_searches', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Cuadrícula predeterminada de "Búsquedas recientes" 100% temática de la Sex Shop Toy Store
  const defaultRecentCards = [
    { label: 'vibradores andy deluxe', img: '/images/vibrador_cowgirl.png', action: () => handleSelectSearchText('vibradores andy deluxe') },
    { label: 'lencería cowgirl de jessie', img: '/images/jessy_heart.png', action: () => handleSelectSearchText('lencería cowgirl de jessie') },
    { label: 'gorritos de toy story', img: '/images/woody_heart.png', action: () => onOpenHats ? onOpenHats() : navigate('/configuracion?tab=cuenta') },
    { label: 'plugs anales y joyas buzz', img: '/images/plug_anal.png', action: () => handleSelectSearchText('plugs anales y joyas buzz') },
    { label: 'caja sorpresa mystery box', img: '/images/mystery_box.png', action: () => handleSelectSearchText('caja sorpresa mystery box') },
    { label: 'lubricantes térmicos y de fresa', img: '/images/toy_vibrator.png', action: () => handleSelectSearchText('lubricantes térmicos y de fresa') },
    { label: 'juegos íntimos para parejas', img: '/images/aliens_friends.png', action: () => handleSelectSearchText('juegos íntimos para parejas') },
    { label: 'tus secretos guardados', img: '/images/plug_anal.png', action: () => onOpenSecretos ? onOpenSecretos() : navigate('/configuracion?tab=secretos') },
    { label: 'rincón de confesiones íntimas', img: '/images/cerdito_travieso.png', action: () => handleSelectSearchText('confesiones íntimas') },
    { label: 'empaque 100% discreto', img: '/images/soldiers.png', action: () => onSelectTab ? onSelectTab('privacidad') : navigate('/configuracion') }
  ];

  // Listado de sugerencias de texto frecuentes 100% referentes a la sex shop
  const popularQueryPool = [
    'vibradores y placer íntimo',
    'lencería cowgirl de jessie',
    'gorritos de toy story',
    'secretos guardados',
    'plugs anales y joyas',
    'lubricantes térmicos y de sabores',
    'juegos íntimos en pareja',
    'cajas sorpresa andy',
    'succionadores de clítoris',
    'aceites de masaje y feromonas',
    'lencería de encaje andy',
    'confesiones y experiencias íntimas',
    'empaque 100% discreto',
    'accesorios desbloqueables',
    'velas de masaje calientes',
    'anillos vibradores para parejas',
    'antifaces y esposas de terciopelo',
    'balas vibradoras de bolsillo',
    'dildos de silicona médica',
    'woody y jessie accesorios'
  ];

  // Filtrado al teclear
  const queryLower = searchTerm.trim().toLowerCase();

  let matchingQueries = queryLower
    ? popularQueryPool.filter(q => q.toLowerCase().includes(queryLower))
    : [];

  // Si hay pocas sugerencias exactas, generar sugerencias dinámicas automáticas basadas en la sex shop
  if (queryLower && matchingQueries.length < 5) {
    const dynamicSuggestions = [
      queryLower,
      `${queryLower} juguetes`,
      `${queryLower} secretos`,
      `${queryLower} placer íntimo`,
      `${queryLower} para parejas`,
      `${queryLower} lencería`,
      `${queryLower} recomendaciones`
    ];
    dynamicSuggestions.forEach(sug => {
      if (!matchingQueries.some(mq => mq.toLowerCase() === sug.toLowerCase())) {
        matchingQueries.push(sug);
      }
    });
  }

  const matchingUsers = queryLower
    ? communityUsers.filter(u => 
        (u.nombre && u.nombre.toLowerCase().includes(queryLower)) ||
        (u.nombre_usuario && u.nombre_usuario.toLowerCase().includes(queryLower))
      )
    : [];

  const settingsTabs = [
    { label: 'Editar perfil', id: 'perfil' },
    { label: 'Administración de la cuenta', id: 'cuenta' },
    { label: 'Visibilidad del perfil', id: 'visibilidad' },
    { label: 'Privacidad y datos discretos', id: 'privacidad' },
    { label: 'Seguridad y contraseña', id: 'seguridad' }
  ];

  const matchingTabs = queryLower
    ? settingsTabs.filter(t => t.label.toLowerCase().includes(queryLower))
    : [];

  const handleSelectSearchText = (text) => {
    if (!text) return;
    const clean = text.trim();
    setSearchTerm(clean);
    setIsOpen(false);

    // Si comienza con @ o coincide con un perfil de usuario, navegar siempre a su perfil
    if (clean.startsWith('@')) {
      const uname = clean.slice(1).trim();
      navigate(`/perfil/${encodeURIComponent(uname)}`);
      return;
    }

    const matchedUser = communityUsers.find(
      u => u.nombre_usuario?.toLowerCase() === clean.toLowerCase() ||
           u.nombre?.toLowerCase() === clean.toLowerCase()
    );

    if (matchedUser) {
      navigate(`/perfil/${matchedUser.nombre_usuario}`);
      return;
    }

    // Búsqueda de productos en la tienda
    saveRecentSearch(clean);
    navigate(`/tienda?buscar=${encodeURIComponent(clean)}`);
  };

  const handleSelectUser = (user) => {
    setIsOpen(false);
    navigate(`/perfil/${user.nombre_usuario}`);
  };

  const handleSelectTab = (tabId) => {
    setIsOpen(false);
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      navigate('/configuracion');
    }
  };

  const handleClearInput = (e) => {
    e.stopPropagation();
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSelectSearchText(searchTerm.trim());
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`} ref={containerRef}>
      
      {/* Icono Lupa izquierda */}
      <span 
        onClick={() => {
          if (searchTerm.trim()) handleSelectSearchText(searchTerm.trim());
          else setIsOpen(true);
        }}
        className="absolute left-4 flex items-center text-[#1e3a8a]/60 hover:text-[#1e3a8a] cursor-pointer transition-colors z-10"
        title="Buscar"
      >
        <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"/>
          <path d="M16 16l4.5 4.5"/>
        </svg>
      </span>

      {/* Input de Búsqueda estilo Pinterest */}
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full h-12 pl-12 pr-24 rounded-full text-base font-normal text-[#111111] placeholder-[#767676] transition-all outline-none border ${
          isOpen
            ? 'bg-white border-[#a6d4f2] ring-4 ring-[#a6d4f2]/40 shadow-sm'
            : 'bg-[#f0f3f6] hover:bg-[#e7ecf2] border-transparent'
        }`}
      />

      {/* Botón de limpiar (X) idéntico a Pinterest (Screenshot 2) */}
      {searchTerm.trim().length > 0 && (
        <button
          type="button"
          onClick={handleClearInput}
          className="absolute right-12 w-7 h-7 rounded-full bg-gray-200/80 hover:bg-gray-300 text-[#111111] flex items-center justify-center text-xs font-bold transition-all cursor-pointer z-10"
          title="Borrar búsqueda"
        >
          ✕
        </button>
      )}

      {/* Botón Cámara / Lenny Binocular a la derecha */}
      {onVisualSearchClick && (
        <button
          type="button"
          onClick={onVisualSearchClick}
          className="absolute right-2 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#a6d4f2]/20 text-[#1e3a8a] transition-all cursor-pointer z-10"
          title="Búsqueda visual con Lenny"
        >
          <LennyIcon className="w-8 h-8" />
        </button>
      )}

      {/* ============================================================ */}
      {/* MENÚ DESPLEGABLE TIPO PINTEREST (COPIE Y PEGUE EXACTO)        */}
      {/* ============================================================ */}
      {isOpen && (
        <div className="absolute top-[54px] left-0 right-0 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-gray-100 p-5 z-[80] max-h-[500px] overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-100 select-none text-left">
          
          {/* ESTADO 1: SIN TEXTO ESCRITO -> BÚSQUEDAS RECIENTES (SCREENSHOT 1) */}
          {!searchTerm.trim() ? (
            <div>
              <h3 className="text-base font-bold text-[#1e3a8a] mb-3 px-1">
                Búsquedas recientes
              </h3>

              {/* Cuadrícula de 2 columnas tipo tarjeta con imagen cuadrada (Screenshot 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Búsquedas reales previas si el usuario las hizo */}
                {recentSearches.map((item, idx) => (
                  <div
                    key={`rec-${idx}`}
                    onClick={() => handleSelectSearchText(item.label)}
                    className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-100/80 cursor-pointer transition-colors group bg-gray-50/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.img || '/images/vibrador_cowgirl.png'}
                        alt={item.label}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-200 flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-sm font-normal text-[#111111] group-hover:text-[#1e3a8a] transition-colors truncate">
                        {item.label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(e, item.label)}
                      className="w-6 h-6 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Tarjetas temáticas oficiales predeterminadas */}
                {defaultRecentCards.map((card, idx) => (
                  <div
                    key={`def-${idx}`}
                    onClick={() => {
                      saveRecentSearch(card.label, card.img);
                      setIsOpen(false);
                      card.action();
                    }}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-100/80 cursor-pointer transition-colors group"
                  >
                    <img
                      src={card.img}
                      alt={card.label}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs"
                    />
                    <span className="text-sm font-normal text-[#111111] group-hover:text-[#1e3a8a] transition-colors leading-snug line-clamp-2">
                      {card.label}
                    </span>
                  </div>
                ))}

              </div>
            </div>
          ) : (
            /* ESTADO 2: CON TEXTO ESCRITO -> LISTADO DE SUGERENCIAS Y PERFILES (SCREENSHOT 2) */
            <div className="space-y-1">
              
              {/* Opción 1: Buscar en toda la tienda */}
              <div
                onClick={() => handleSelectSearchText(searchTerm.trim())}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-sky-50 text-[#1e3a8a] cursor-pointer transition-colors font-medium text-sm"
              >
                <svg className="w-4 h-4 fill-none stroke-current flex-shrink-0" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/>
                  <path d="M16 16l4.5 4.5"/>
                </svg>
                <span>Buscar productos de <b className="font-bold underline">"{searchTerm}"</b></span>
              </div>

              {/* Sugerencias de palabras clave con icono de lupa (Screenshot 2) */}
              {matchingQueries.slice(0, 6).map((q, idx) => (
                <div
                  key={`q-${idx}`}
                  onClick={() => handleSelectSearchText(q)}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-2xl hover:bg-gray-100 cursor-pointer transition-colors text-sm text-[#111111]"
                >
                  <svg className="w-4 h-4 text-gray-400 stroke-current fill-none flex-shrink-0" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7"/><path d="M16 16l4.5 4.5"/>
                  </svg>
                  <span className="capitalize">{q}</span>
                </div>
              ))}

              {/* Perfiles de usuarios reales coincidentes (Screenshot 2: estilo H&M con verificado) */}
              {matchingUsers.length > 0 && (
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <div className="text-[11px] font-bold text-[#717171] uppercase tracking-wider px-3 mb-1.5">
                    Perfiles de usuarios
                  </div>
                  {matchingUsers.map(user => (
                    <div
                      key={user.id_usuario}
                      onClick={() => handleSelectUser(user)}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-2xl hover:bg-gray-100 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-9 h-9 flex-shrink-0">
                          {user.avatar_hat && user.avatar_hat !== 'none' && (
                            <AvatarHat type={user.avatar_hat} size="navbar" />
                          )}
                          {user.foto_perfil ? (
                            <img src={user.foto_perfil} alt={user.nombre} className="w-9 h-9 rounded-full object-cover shadow-2xs" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a6d4f2] to-[#8ec2e4] text-[#1e3a8a] font-bold text-xs flex items-center justify-center shadow-2xs">
                              {user.nombre?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-normal text-[#111111] group-hover:text-[#1e3a8a] transition-colors truncate">
                              {user.nombre}
                            </span>
                            <span className="w-3.5 h-3.5 rounded-full bg-[#1e3a8a] text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0">
                              ✓
                            </span>
                          </div>
                          <span className="text-xs text-[#717171] truncate block">
                            @{user.nombre_usuario || 'usuario'}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-[#1e3a8a] px-3 py-1 rounded-full bg-[#a6d4f2]/40 hover:bg-[#a6d4f2] transition-colors flex-shrink-0">
                        Ver perfil
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pestañas de configuración coincidentes */}
              {matchingTabs.length > 0 && (
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <div className="text-[11px] font-bold text-[#717171] uppercase tracking-wider px-3 mb-1.5">
                    Ajustes de cuenta
                  </div>
                  {matchingTabs.map(tab => (
                    <div
                      key={tab.id}
                      onClick={() => handleSelectTab(tab.id)}
                      className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-100 cursor-pointer transition-colors text-sm text-[#111111]"
                    >
                      <svg className="w-4 h-4 text-[#1e3a8a] stroke-current fill-none flex-shrink-0" strokeWidth="2.2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      <span>Ir a: <span className="font-normal">{tab.label}</span></span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
