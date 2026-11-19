import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MascotAvatar from './MascotAvatar';

export default function ChatbotWidget() {
  const { usuario, esAdmin: esAdminAuth, ageVerifiedGlobal, isLoggedInHint, userNameHint, cargandoSesion } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Si la ventana de validación de edad está activa (bloqueo inicial), no mostrar a Toyito
  const isAgeVerificationActive = !ageVerifiedGlobal && !usuario && (!isLoggedInHint || !cargandoSesion);

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(() => localStorage.getItem('toy_saludo_activo') !== 'false');
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Identificar si el usuario conectado es Administrador (reconocido en cualquier página de la tienda)
  const esAdmin = Boolean(
    esAdminAuth ||
    (usuario && (
      usuario.rol === 1 || 
      usuario.id_rol === 1 || 
      usuario.rol === 'admin' || 
      usuario.email === 'alvarezfrancomariana@gmail.com' || 
      usuario.email === 'saraguevara192@gmail.com'
    )) ||
    (isLoggedInHint && userNameHint && (
      userNameHint.toLowerCase().includes('mariana') || 
      userNameHint.toLowerCase().includes('sara')
    )) ||
    localStorage.getItem('toy_is_admin') === 'true' ||
    sessionStorage.getItem('toy_vista_admin') === 'true'
  );

  const userSuggestions = [
    "¿Qué sorpresas me recomiendas hoy?",
    "¿Cómo garantizan la discreción de mi entrega?",
    "Ideas para encender la chispa en pareja",
    "Sensaciones intensas para disfrutar a solas",
    "Los secretos más deseados de la tienda"
  ];

  const adminSuggestions = [
    "Estado general del inventario",
    "Productos con stock crítico",
    "Resumen por categorías",
    "Métricas de usuarios registrados"
  ];

  const getInitialMessage = (isAdmin) => {
    if (isAdmin) {
      return {
        id: 'init-1',
        sender: 'bot',
        text: `¡Hola, querida admin!\n\nQué alegría tenerte por aquí. Estoy listo para ayudarte a revisar el inventario, el stock de los productos o cualquier dato que necesites de la tienda.\n\n¿En qué te puedo colaborar hoy?`,
        productos: [],
        sugerencias: adminSuggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
    return {
      id: 'init-1',
      sender: 'bot',
      text: `¡Hola! Mi nombre es Toyito.\nGracias por permitirme ser tu guía y compañía en Toy Store.\n\nEstoy listo para asesorarte, encontrar el producto ideal para ti y resolver todas tus dudas de forma 100% amigable y confidencial.\n\n¿Te encuentras listo para explorar las sorpresas del baúl?`,
      productos: [],
      sugerencias: userSuggestions,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const [messages, setMessages] = useState(() => [getInitialMessage(esAdmin)]);
  const [expandedSuggestions, setExpandedSuggestions] = useState({});

  // Sincronizar el saludo inicial si cambia el estado de admin o el usuario
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        return [getInitialMessage(esAdmin)];
      }
      return prev;
    });
  }, [esAdmin, usuario]);

  // Temporizador de inactividad de 5 minutos para reiniciar la conversación
  const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
  const closedAtRef = useRef(null);
  const resetTimerRef = useRef(null);

  const handleCloseChat = () => {
    setIsOpen(false);
    closedAtRef.current = Date.now();
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setMessages([getInitialMessage(esAdmin)]);
      setExpandedSuggestions({});
      setInputMessage('');
      closedAtRef.current = null;
    }, INACTIVITY_TIMEOUT_MS);
  };

  const handleOpenChat = () => {
    if (closedAtRef.current && (Date.now() - closedAtRef.current >= INACTIVITY_TIMEOUT_MS)) {
      setMessages([getInitialMessage(esAdmin)]);
      setExpandedSuggestions({});
      setInputMessage('');
    }
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    closedAtRef.current = null;
    setIsOpen(true);
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const toggleExpandSuggestions = (msgId) => {
    setExpandedSuggestions(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Al abrir el chat por primera vez, mantener arriba en el mensaje inicial
  useEffect(() => {
    if (isOpen) {
      if (messages.length === 1 && chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Hacer scroll automático hacia abajo solo al enviar/recibir nuevos mensajes
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  // Manejar el envío de mensajes
  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/chat/mensaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mensaje: textToSend,
          usuario: usuario ? { 
            nombre: usuario.nombre, 
            id_rol: usuario.id_rol || usuario.rol || (esAdmin ? 1 : 2), 
            rol: usuario.rol || usuario.id_rol || (esAdmin ? 1 : 2),
            email: usuario.email 
          } : (esAdmin ? { nombre: userNameHint || 'Mariana', rol: 1, id_rol: 1, email: 'alvarezfrancomariana@gmail.com' } : null)
        })
      });

      const data = await res.json();

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.respuesta || "Aquí estoy para acompañarte en tu aventura.",
        productos: data.productos || [],
        sugerencias: data.sugerencias || (esAdmin ? adminSuggestions : userSuggestions),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Error al comunicarse con Toyito:", err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Hubo un pequeño inconveniente en la conexión. ¿Intentamos de nuevo?",
        productos: [],
        sugerencias: esAdmin ? adminSuggestions : userSuggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (prod) => {
    if (prod.imagen && prod.imagen !== '/images/default.png') return prod.imagen;
    const cat = (prod.categoria || '').toLowerCase();
    if (cat.includes('vibra')) return '/images/toy_vibrator.png';
    if (cat.includes('lence')) return '/images/lenceria_andy.png';
    if (cat.includes('anal')) return '/images/plug_anal.png';
    if (cat.includes('kit')) return '/images/mystery_box.png';
    return '/images/toy_vibrator.png';
  };

  // No renderizar a Toyito mientras la ventana de verificación de edad esté bloqueando la pantalla
  if (isAgeVerificationActive) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[2500] pointer-events-none">
      
      {/* --- VENTANA DEL CHATBOT ABIERTA --- */}
      {isOpen ? (
        <div className="pointer-events-auto w-[92vw] sm:w-[390px] h-[580px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border-4 border-sky-300 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* ENCABEZADO DEL CHAT (#87CEEB) */}
          <div className="bg-[#87CEEB] px-5 py-3.5 flex items-center justify-between shadow-sm border-b border-sky-200">
            <div className="flex items-center gap-3">
              <MascotAvatar className="w-10 h-10 flex-shrink-0 drop-shadow-sm" expression="happy" />
              <div>
                <h4 className="font-black text-sm tracking-wide uppercase text-white drop-shadow-xs">
                  Toyito
                </h4>
                <p className="text-[11px] text-white/90 font-medium mt-0.5">
                  {esAdmin ? 'Asistente de Administración' : 'Tu compañía en esta aventura'}
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseChat}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all shadow-sm"
              title="Cerrar chat"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* CUERPO DEL CHAT (MENSAJES) */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-sky-50/40 via-white to-white space-y-4 text-sm custom-scrollbar"
          >
            
            {/* ILUSTRACIÓN DE CUERPO COMPLETO DE TOYITO AL INICIO */}
            <div className="flex flex-col items-center justify-center pt-2 pb-4 border-b border-sky-100 mb-2 text-center bg-gradient-to-b from-sky-50 to-transparent rounded-2xl p-3">
              <MascotAvatar variant="full" className="w-32 h-36 mb-2" expression="happy" />
              <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
                {esAdmin 
                  ? 'Estoy aquí para acompañarte durante todo tu recorrido en la tienda y ayudarte con todo lo que necesites de administración. ¡Cuenta conmigo!'
                  : 'Estoy aquí para acompañarte durante todo tu recorrido en la tienda. ¡Cuenta conmigo para cualquier recomendación o duda!'}
              </p>
            </div>

            {messages.map((msg) => {
              const isInitial = msg.id === 'init-1';
              const isLatest = msg === messages[messages.length - 1];
              const isExpanded = !!expandedSuggestions[msg.id];

              return (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  <div className={`flex gap-2 max-w-[88%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'bot' && (
                      <MascotAvatar variant="head" className="w-8 h-8 flex-shrink-0 mt-1" expression={loading ? 'thinking' : 'happy'} />
                    )}

                    <div className={`p-3.5 rounded-2xl shadow-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#0047AB] text-white rounded-tr-none font-medium'
                        : 'bg-gray-50 border border-sky-100 text-gray-800 rounded-tl-none font-normal'
                    }`}>
                      {msg.text ? msg.text.replace(/\*\*/g, '') : ''}
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 mt-1 px-1 font-semibold">
                    {msg.timestamp}
                  </span>

                  {/* TARJETAS DE PRODUCTOS RECOMENDADOS */}
                  {msg.productos && msg.productos.length > 0 && (
                    <div className="mt-3 w-full grid grid-cols-1 gap-2.5 pl-9">
                      {msg.productos.map((prod) => (
                        <div 
                          key={prod.id} 
                          className="bg-white border-2 border-sky-200 rounded-xl p-2.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-all hover:border-yellow-400 group"
                        >
                          <img 
                            src={getProductImage(prod)} 
                            alt={prod.nombre} 
                            className="w-14 h-14 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-black uppercase text-[#00AEEF] bg-sky-50 px-1.5 py-0.5 rounded">
                                {prod.categoria}
                              </span>
                              {esAdmin && prod.stock !== undefined && (
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                  prod.stock <= 5 
                                    ? 'bg-red-100 text-red-700' 
                                    : prod.stock <= 10 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  Stock: {prod.stock} uds.
                                </span>
                              )}
                            </div>
                            <h5 className="font-bold text-gray-800 text-xs truncate mt-0.5 group-hover:text-[#0047AB] transition-colors">
                              {prod.nombre}
                            </h5>
                            <p className="font-black text-[#E52521] text-xs mt-0.5">
                              ${Number(prod.precio).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              handleCloseChat();
                              navigate(`/tienda?cat=${prod.categoria || 'todos'}`);
                            }}
                            className="px-2.5 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xs rounded-lg transition-all shadow-sm flex-shrink-0"
                          >
                            Ver
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 1. SUGERENCIAS DEL MENSAJE INICIAL: LISTA COMPLETA EN PASTILLAS (COMO EN LA IMAGEN) */}
                  {isInitial && msg.sugerencias && msg.sugerencias.length > 0 && (
                    <div className="mt-3 flex flex-col items-start gap-2 pl-9 w-full">
                      {msg.sugerencias.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sug)}
                          className="w-fit max-w-[95%] text-xs sm:text-[13px] bg-white border border-[#38bdf8] text-[#0047AB] font-bold px-4 py-2 rounded-full hover:bg-sky-50 hover:border-[#00AEEF] transition-all shadow-sm active:scale-95 text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 2. SUGERENCIAS DE RESPUESTAS POSTERIORES: BOTÓN 'MOSTRAR MÁS SUGERENCIAS' PARA EXPANDIR TODAS */}
                  {!isInitial && isLatest && msg.sugerencias && msg.sugerencias.length > 0 && (
                    <div className="mt-3 flex flex-col items-start gap-2 pl-9 w-full">
                      {!isExpanded ? (
                        <button
                          onClick={() => toggleExpandSuggestions(msg.id)}
                          className="w-fit text-xs bg-sky-50 border border-sky-300 text-[#0047AB] font-bold px-4 py-2 rounded-full hover:bg-sky-100 hover:border-[#00AEEF] transition-all shadow-sm active:scale-95"
                        >
                          Mostrar más sugerencias
                        </button>
                      ) : (
                        <div className="flex flex-col items-start gap-2 w-full">
                          {msg.sugerencias.map((sug, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(sug)}
                              className="w-fit max-w-[95%] text-xs sm:text-[13px] bg-white border border-[#38bdf8] text-[#0047AB] font-bold px-4 py-2 rounded-full hover:bg-sky-50 hover:border-[#00AEEF] transition-all shadow-sm active:scale-95 text-left"
                            >
                              {sug}
                            </button>
                          ))}
                          <button
                            onClick={() => toggleExpandSuggestions(msg.id)}
                            className="w-fit text-xs bg-gray-100 border border-gray-300 text-gray-700 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-all shadow-sm active:scale-95 mt-1"
                          >
                            Ocultar sugerencias
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}

            {/* INDICADOR DE PENSANDO */}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold pl-2">
                <MascotAvatar variant="head" className="w-8 h-8 animate-bounce" expression="thinking" />
                <span className="animate-pulse">Toyito está escribiendo...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* CAMPO DE ENTRADA */}
          <div className="p-3 bg-white border-t border-sky-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje a Toyito..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 bg-gray-50 border border-sky-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#0047AB] focus:bg-white transition-all text-gray-800"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || loading}
              className="w-10 h-10 rounded-full bg-[#0047AB] hover:bg-[#003882] text-white flex items-center justify-center font-bold shadow-md hover:brightness-110 disabled:opacity-40 active:scale-95 transition-all flex-shrink-0"
              title="Enviar"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

        </div>
      ) : (
        /* --- ESTADO CERRADO: NUBE DE DIÁLOGO AL LADO DE TOYITO EN PERFECTA SINCRONÍA --- */
        <div className="flex flex-row items-center gap-2.5 animate-float-bounce pointer-events-none select-none">
          
          {/* NUBE DE DIÁLOGO AL LADITO DE TOYITO */}
          {showTooltip && (
            <div className="pointer-events-auto relative flex items-center bg-white border-2 border-sky-300 px-4 py-2.5 rounded-2xl shadow-xl max-w-[260px] sm:max-w-[280px] transition-all">
              
              <span className="text-[12.5px] leading-snug font-black text-[#0047AB] select-none">
                {esAdmin 
                  ? '¡Hola, querida admin! Aquí estoy para ayudarte.' 
                  : '¡Hola! Soy Toyito, tu compañía en la tienda.'}
              </span>

              <button 
                onClick={() => setShowTooltip(false)} 
                className="ml-2.5 -mr-1 w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-sky-50 font-black text-sm transition-all flex-shrink-0"
                title="Cerrar"
              >
                ×
              </button>

              {/* Colita / Pico de la nube de diálogo apuntando a la derecha hacia Toyito */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t-2 border-r-2 border-sky-300 rotate-45 pointer-events-none" />

            </div>
          )}

          {/* BOTÓN FLOTANTE CERRADO (AVATAR CIRCULAR) */}
          <button
            onClick={handleOpenChat}
            className="pointer-events-auto group relative flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 drop-shadow-xl flex-shrink-0"
            title="Abrir chat con Toyito"
          >
            <MascotAvatar variant="head" className="w-16 h-16 sm:w-18 sm:h-18" expression="happy" showBadge={false} />
          </button>

        </div>
      )}

    </div>
  );
}

