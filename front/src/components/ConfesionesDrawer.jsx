import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AvatarHat from './AvatarHat';

export default function ConfesionesDrawer({ isOpen, onClose, hasSidebar = true }) {
  const { usuario, avatarHat } = useContext(AuthContext);

  const [confesiones, setConfesiones] = useState(() => {
    try {
      const stored = localStorage.getItem('toy_confesiones');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'conf-1',
        autor: 'Anónimo',
        autorUsuario: null,
        esAnonimo: true,
        avatarHat: null,
        fotoPerfil: null,
        tag: 'En pareja',
        tiempo: 'hace 2 horas',
        texto: 'Anoche probamos el vibrador Cowgirl en pareja por primera vez... la vibración profunda nos dejó sin palabras. ¡100% recomendado si quieren salir de la rutina y conectar a otro nivel!',
        likes: 24,
        liked: false,
        comentarios: [
          { id: 'c-1', autor: 'Anónimo', texto: '¡Totalmente de acuerdo! Las distintas intensidades son increíbles.', tiempo: 'hace 1 hora' }
        ]
      },
      {
        id: 'conf-2',
        autor: 'Anónimo',
        autorUsuario: null,
        esAnonimo: true,
        avatarHat: null,
        fotoPerfil: null,
        tag: 'Fantasía cumplida',
        tiempo: 'hace 5 horas',
        texto: 'Siempre tuve curiosidad por los plugs con joya pero me daba mucha pena pedir uno. Me atreví aprovechando el empaque 100% discreto y la experiencia ha sido una maravilla absoluta. No tengan miedo a explorar.',
        likes: 38,
        liked: false,
        comentarios: [
          { id: 'c-2', autor: 'Comunidad Toy Store', texto: '¿Qué tamaño recomendaste para empezar?', tiempo: 'hace 3 horas' },
          { id: 'c-3', autor: 'Anónimo', texto: 'El tamaño pequeño con lubricante a base de agua es perfecto para comenzar.', tiempo: 'hace 2 horas' }
        ]
      },
      {
        id: 'conf-3',
        autor: 'Anónimo',
        autorUsuario: null,
        esAnonimo: true,
        avatarHat: null,
        fotoPerfil: null,
        tag: 'Juguete favorito',
        tiempo: 'ayer',
        texto: 'La lencería Cowgirl combinada con los aceites térmicos de fresa cambió por completo nuestra noche de aniversario. Lo mejor es que nadie en casa supo qué era el paquete.',
        likes: 19,
        liked: false,
        comentarios: []
      },
      {
        id: 'conf-4',
        autor: 'Anónimo',
        autorUsuario: null,
        esAnonimo: true,
        avatarHat: null,
        fotoPerfil: null,
        tag: 'Curiosidad',
        tiempo: 'hace 2 días',
        texto: 'Me arriesgué pidiendo la Mystery Box sorpresa sin saber qué venía y fue la mejor decisión del mes. Me llegó un producto que superó todas mis expectativas.',
        likes: 45,
        liked: false,
        comentarios: [
          { id: 'c-4', autor: 'ToyLover', texto: '¡Las cajas sorpresa son lo más divertido de Toy Store!', tiempo: 'hace 1 día' }
        ]
      }
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [nuevoTexto, setNuevoTexto] = useState('');
  const [esAnonimo, setEsAnonimo] = useState(true);
  const [selectedTag, setSelectedTag] = useState('En pareja');
  const [expandedComments, setExpandedComments] = useState({});
  const [nuevoComentarioTextos, setNuevoComentarioTextos] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2200);
  };

  const guardarLocalmente = (nuevas) => {
    setConfesiones(nuevas);
    try {
      localStorage.setItem('toy_confesiones', JSON.stringify(nuevas));
    } catch (e) {}
  };

  // Cargar confesiones sincronizadas desde el backend persistente
  useEffect(() => {
    fetch('/confesiones')
      .then(res => res.json())
      .then(data => {
        if (data?.confesiones && Array.isArray(data.confesiones) && data.confesiones.length > 0) {
          setConfesiones(prev => {
            const likedMap = {};
            prev.forEach(p => { if (p.liked) likedMap[p.id] = true; });
            try {
              const local = JSON.parse(localStorage.getItem('toy_confesiones') || '[]');
              local.forEach(l => { if (l.liked) likedMap[l.id] = true; });
            } catch (e) {}

            const merged = data.confesiones.map(c => ({
              ...c,
              liked: Boolean(likedMap[c.id] || c.liked)
            }));
            try {
              localStorage.setItem('toy_confesiones', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  const tags = ['En pareja', 'Fantasía cumplida', 'Juguete favorito', 'Curiosidad', 'Primera vez'];

  const handleCrearConfesion = async (e) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;

    const payload = {
      texto: nuevoTexto.trim(),
      tag: selectedTag,
      esAnonimo,
      autor: esAnonimo ? 'Anónimo' : (usuario?.nombre || 'Usuario'),
      autorUsuario: esAnonimo ? null : (usuario?.nombre_usuario || null),
      avatarHat: esAnonimo ? null : (avatarHat !== 'none' ? avatarHat : null),
      fotoPerfil: esAnonimo ? null : (usuario?.foto_perfil || null)
    };

    try {
      const res = await fetch('/confesiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.confesion) {
        guardarLocalmente([data.confesion, ...confesiones]);
      } else {
        const nueva = {
          id: `conf-${Date.now()}`,
          ...payload,
          tiempo: 'justo ahora',
          likes: 0,
          liked: false,
          comentarios: []
        };
        guardarLocalmente([nueva, ...confesiones]);
      }
    } catch (err) {
      const nueva = {
        id: `conf-${Date.now()}`,
        ...payload,
        tiempo: 'justo ahora',
        likes: 0,
        liked: false,
        comentarios: []
      };
      guardarLocalmente([nueva, ...confesiones]);
    }

    setNuevoTexto('');
    setShowForm(false);
    showToast('Tu confesión ha sido compartida en el Rincón.');
  };

  const handleToggleLike = async (id) => {
    // Actualización optimista inmediata
    const actualizadas = confesiones.map(c => {
      if (c.id === id) {
        const nuevoLiked = !c.liked;
        return {
          ...c,
          liked: nuevoLiked,
          likes: nuevoLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 1) - 1)
        };
      }
      return c;
    });
    guardarLocalmente(actualizadas);

    try {
      await fetch(`/confesiones/${id}/like`, { method: 'POST' });
    } catch (e) {}
  };

  const toggleComments = (id) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAgregarComentario = async (confId) => {
    const texto = nuevoComentarioTextos[confId]?.trim();
    if (!texto) return;

    const autorNombre = usuario?.nombre ? `${usuario.nombre.split(' ')[0]}` : 'Anónimo';
    const nuevoC = {
      id: `c-${Date.now()}`,
      autor: autorNombre,
      texto,
      tiempo: 'justo ahora'
    };

    const actualizadas = confesiones.map(c => {
      if (c.id === confId) {
        return {
          ...c,
          comentarios: [...(c.comentarios || []), nuevoC]
        };
      }
      return c;
    });

    guardarLocalmente(actualizadas);
    setNuevoComentarioTextos(prev => ({ ...prev, [confId]: '' }));
    showToast('Comentario publicado');

    try {
      await fetch(`/confesiones/${confId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, autor: autorNombre })
      });
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Toast flotante */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div className="bg-[#a6d4f2] text-[#1e3a8a] text-xs font-bold px-5 py-2.5 rounded-2xl shadow-xl border border-[#8ec2e4]">
            {toastMsg}
          </div>
        </div>
      )}

      {/* Drawer lateral idéntico a Notificaciones (adaptado con hasSidebar: left-[82px] en config/perfil, left-0 en inicio) */}
      <div className={`fixed top-0 ${hasSidebar ? 'left-[82px]' : 'left-0'} w-[360px] h-screen bg-white border-r border-[#e9e9e9] z-[250] flex flex-col select-none overflow-hidden transition-all duration-300 text-left shadow-[10px_0_30px_rgba(0,0,0,0.06)]`}>
        
        {/* Cabecera idéntica a Notificaciones */}
        <div className="p-5 pb-3.5 flex items-center justify-between border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-[#a6d4f2]/30 text-[#1e3a8a] flex items-center justify-center flex-shrink-0">
              {/* Icono Luna SVG minimalista */}
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[#1e3a8a] tracking-tight leading-tight truncate">
                Rincón de Confesiones
              </h2>
              <p className="text-[11px] text-[#717171] leading-none mt-0.5 truncate">
                Experiencias y secretos de la comunidad
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#111111] transition-colors cursor-pointer text-base font-bold flex-shrink-0"
            title="Cerrar confesiones"
          >
            ✕
          </button>
        </div>

        {/* Barra superior de acción: Confesar algo */}
        <div className="p-4 pb-2 bg-gradient-to-b from-[#a6d4f2]/10 to-white flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          <span className="text-xs font-bold text-[#1e3a8a]">
            {confesiones.length} confesiones compartidas
          </span>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-1.5 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>{showForm ? 'Cancelar' : 'Hacer una confesión'}</span>
            {showForm ? (
              <span className="text-xs">✕</span>
            ) : (
              <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </button>
        </div>

        {/* Formulario de nueva confesión */}
        {showForm && (
          <form onSubmit={handleCrearConfesion} className="p-4 bg-gray-50/90 border-b border-gray-200 animate-in fade-in slide-in-from-top-2 duration-150 flex-shrink-0">
            <p className="text-xs font-bold text-[#1e3a8a] mb-2">
              Comparte tu experiencia íntima o fantasía
            </p>

            {/* Toggle Anónimo vs Con Perfil con iconos SVG limpios (sin emojis) */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setEsAnonimo(true)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                  esAnonimo 
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs' 
                    : 'bg-white text-[#717171] border-gray-200 hover:bg-gray-100'
                }`}
              >
                {/* Icono Máscara / Incógnito SVG */}
                <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M15 10h.01M8 15s1.5 2 4 2 4-2 4-2" />
                </svg>
                <span>100% Anónimo</span>
              </button>

              <button
                type="button"
                onClick={() => setEsAnonimo(false)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                  !esAnonimo 
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs' 
                    : 'bg-white text-[#717171] border-gray-200 hover:bg-gray-100'
                }`}
              >
                {/* Icono Usuario SVG */}
                <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="truncate">@{usuario?.nombre_usuario || 'mi_usuario'}</span>
              </button>
            </div>

            {/* Selector de tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={`text-[11px] px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                    selectedTag === t
                      ? 'bg-[#a6d4f2] text-[#1e3a8a] font-bold shadow-2xs'
                      : 'bg-white text-[#717171] border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              placeholder="Escribe tu secreto o experiencia con total libertad..."
              className="w-full text-xs p-3 rounded-2xl bg-white border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#a6d4f2]/40 outline-none text-[#111111] resize-none mb-3"
            />

            <button
              type="submit"
              disabled={!nuevoTexto.trim()}
              className={`w-full py-2.5 rounded-full text-xs font-bold transition-all ${
                nuevoTexto.trim()
                  ? 'bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] cursor-pointer shadow-xs active:scale-98'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Publicar en el Rincón
            </button>
          </form>
        )}

        {/* Feed de Confesiones con scroll fluido idéntico a Notificaciones */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5">
          {confesiones.map((conf) => (
            <div 
              key={conf.id}
              className="p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-[#a6d4f2]/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all text-left group"
            >
              {/* Cabecera de la tarjeta */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    {conf.esAnonimo ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#a6d4f2]/30 to-sky-100 text-[#1e3a8a] flex items-center justify-center shadow-2xs">
                        {/* Icono Anónimo SVG limpio */}
                        <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                          <circle cx="9" cy="10" r="1" fill="currentColor" />
                          <circle cx="15" cy="10" r="1" fill="currentColor" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 15a3.5 3.5 0 0 0 5 0" />
                        </svg>
                      </div>
                    ) : (
                      <>
                        {conf.avatarHat && conf.avatarHat !== 'none' && (
                          <AvatarHat type={conf.avatarHat} size="navbar" />
                        )}
                        {conf.fotoPerfil ? (
                          <img src={conf.fotoPerfil} alt={conf.autor} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a6d4f2] to-[#8ec2e4] text-[#1e3a8a] font-bold text-xs flex items-center justify-center">
                            {conf.autor.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1e3a8a] leading-tight truncate">
                      {conf.autor}
                    </p>
                    <span className="text-[10px] text-[#717171] leading-none block">
                      {conf.tiempo}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#1e3a8a] px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100 flex-shrink-0">
                  {conf.tag}
                </span>
              </div>

              {/* Texto de la confesión */}
              <p className="text-xs text-[#111111] leading-relaxed mb-2.5 font-normal">
                {conf.texto}
              </p>

              {/* Barra de interacción */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                
                {/* Botón Me Gusta */}
                <button
                  type="button"
                  onClick={() => handleToggleLike(conf.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer active:scale-95 ${
                    conf.liked 
                      ? 'bg-rose-50 text-rose-600 font-bold' 
                      : 'hover:bg-gray-100 text-[#717171] hover:text-[#111111]'
                  }`}
                  title="Me gusta"
                >
                  <svg className={`w-3.5 h-3.5 ${conf.liked ? 'fill-rose-500 stroke-rose-500' : 'fill-none stroke-current'}`} strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span>{conf.likes || 0}</span>
                </button>

                {/* Botón Comentarios */}
                <button
                  type="button"
                  onClick={() => toggleComments(conf.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-gray-100 text-[#717171] hover:text-[#1e3a8a] transition-all cursor-pointer text-xs"
                  title="Ver comentarios"
                >
                  <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.636 1.05.512 1.666a4.582 4.582 0 01-1.285 2.104 4.55 4.55 0 002.825-.972c.44-.33.99-.462 1.523-.372.69.117 1.411.174 2.152.174z" />
                  </svg>
                  <span>{conf.comentarios ? conf.comentarios.length : 0}</span>
                </button>

              </div>

              {/* Caja de Comentarios desplegable */}
              {expandedComments[conf.id] && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100 space-y-2 animate-in fade-in duration-150">
                  {conf.comentarios && conf.comentarios.map(c => (
                    <div key={c.id} className="bg-gray-50 p-2 rounded-xl text-[11px] leading-snug">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[#1e3a8a]">{c.autor}</span>
                        <span className="text-[10px] text-[#717171]">{c.tiempo}</span>
                      </div>
                      <p className="text-[#111111] font-normal">{c.texto}</p>
                    </div>
                  ))}

                  {/* Input para agregar respuesta */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={nuevoComentarioTextos[conf.id] || ''}
                      onChange={(e) => setNuevoComentarioTextos({ ...nuevoComentarioTextos, [conf.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAgregarComentario(conf.id);
                      }}
                      placeholder="Escribe un comentario..."
                      className="flex-1 text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200/60 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111] transition-all font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => handleAgregarComentario(conf.id)}
                      className="px-3 py-1.5 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-bold text-xs cursor-pointer active:scale-95 transition-all"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </>
  );
}
