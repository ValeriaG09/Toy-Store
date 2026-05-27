import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import HammIcon from '../assets/hamm_icon.png';

const Chatbot = () => {
  const auth = useContext(AuthContext);
  const { usuario, vistaAdmin } = auth || {};
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola, personita increíble! 🌈 Soy Hamm, le guardián de este baúl de tesoros. Estoy aquí para que tu misión sea divertida y segura. ¿En qué puedo apoyarte hoy? ¡Aquí hablamos con toda la buena onda! 🐷✨' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [waitingForPin, setWaitingForPin] = useState(false);
  const [catalogo, setCatalogo] = useState([]);
  const messagesEndRef = useRef(null);

  const SHERIFF_KEY = "ANDY2024";

  useEffect(() => {
    fetch('/productos')
      .then(res => res.json())
      .then(data => setCatalogo(data))
      .catch(err => console.error("Hamm no pudo leer el inventario", err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { role: 'bot', text }]);
  };

  const getHammResponse = async (msg) => {
    const clean = msg.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[?¿!¡.,]/g, "")
      .trim();

    const words = clean.split(' ');
    const isAdmin = vistaAdmin || (usuario && usuario.rol === 1);

    // 1. GESTIÓN DE SEGURIDAD (SHERIFF)
    if (waitingForPin) {
      if (clean.includes(SHERIFF_KEY.toLowerCase())) {
        setIsVerified(true);
        setWaitingForPin(false);
        return "¡Acceso concedido, Sheriffe! 🤠⭐ Mi alcancía es toda tuya. ¿Quieres revisar el 'stock' o ver las 'ventas' del equipo?";
      }
      return "¡Oink! Esa clave no me suena. 🐷🔥 ¿Me dices el código real de Sheriffe?";
    }

    if (clean.includes(SHERIFF_KEY.toLowerCase())) {
      setIsVerified(true);
      return "¡Wow, ya tenías la clave! Sheriffe verificado. 🤠⭐ ¿Qué secreto del baúl exploramos hoy?";
    }

    // 2. MISIONES Y RECOMENDACIONES
    if (clean.includes('recomiendame') || clean.includes('recomienda') || clean.includes('sugiereme') || clean.includes('sugieres') || clean.includes('sugerencia') || clean.includes('recomendar') || clean.includes('que compro')) {
      if (clean.includes('romantica') || clean.includes('romance') || clean.includes('cita') || clean.includes('compartir') || clean.includes('pareja')) {
        setTimeout(() => navigate('/tienda?cat=romance'), 3000);
        return "¡Oh, veo que buscas romance! 🌹 Te recomiendo el 'Conjunto Lencería Bo Peep' o el 'Kit Aventura Rodeo' para encender la llama. Prepárate, ¡te estoy llevando a tu Cita Romántica en 3 segundos! 🐷✨";
      }
      if (clean.includes('solitaria') || clean.includes('solitario') || clean.includes('solo') || clean.includes('sola') || clean.includes('conmigo')) {
        setTimeout(() => navigate('/tienda?cat=solitario'), 3000);
        return "¡Excelente elección! 🕵️‍♂️ Una Misión Solitaria con el 'Vibrador Buzz Espacial' o el 'Succionador Nebula' para disfrutar a tu propio ritmo. ¡Sujétate, despegamos hacia tu misión en 3 segundos! 🚀🐷";
      }
      if (clean.includes('aventura') || clean.includes('rodeo') || clean.includes('salvaje') || clean.includes('intensa') || clean.includes('intenso') || clean.includes('nuevo')) {
        setTimeout(() => navigate('/tienda?cat=aventura'), 3000);
        return "¡Arre, vaquero! 🤠🔥 El Rodeo Salvaje es para los sheriffes más audaces: te sugiero el 'Plug Estrella Fugaz' o el 'Arnés Cowgirl Premium'. ¡Al galope en 3 segundos! 🐴✨";
      }
      if (clean.includes('regalo') || clean.includes('sorpresa') || clean.includes('regalar')) {
        setTimeout(() => navigate('/tienda?cat=regalo'), 3000);
        return "¡Qué gran detalle! 🎁 Una Misión Sorpresa con nuestro 'Kit Tu Primera Vez' o la 'Caja Misteriosa Al'. ¡Nos vamos a la tienda de sorpresas en 3 segundos! 🐷🌟";
      }
      
      return "¡Claro que sí, camarada! 🤠✨ En el baúl de Andy tenemos misiones especiales para cada ocasión. ¿Qué aventura buscas hoy?\n\n🌹 **Cita Romántica** (para compartir y encender la llama)\n🕵️‍♂️ **Misión Solitaria** (autoplacer y vibración espacial)\n🔥 **Rodeo Salvaje** (acción intensa y accesorios pro)\n🎁 **Misión Sorpresa** (los kits más completos para regalar)\n\n¡Dime cuál prefieres y te preparo la recomendación perfecta y te llevo allá! 🐷🚀";
    }

    if (clean.includes('cita romantica') || (clean.includes('romantica') && clean.includes('cita')) || clean === 'romance') {
      setTimeout(() => navigate('/tienda?cat=romance'), 3000);
      return "¡Preparando la atmósfera! 🌹 Romance en camino. Te sugiero el 'Conjunto Lencería Bo Peep' o nuestra lencería vaquera. ¡Te llevo allá en 3 segundos! 🐷✨";
    }
    if (clean.includes('mision solitaria') || clean === 'solitario' || clean === 'solitaria' || (clean.includes('solitaria') && clean.includes('mision'))) {
      setTimeout(() => navigate('/tienda?cat=solitario'), 3000);
      return "¡Modo astronauta activado! 🕵️‍♂️ Misión Solitaria en curso. Te recomiendo el 'Vibrador Buzz Espacial' o el 'Vibrador Vaquera Deluxe'. ¡Despegando en 3 segundos! 🚀🐷";
    }
    if (clean.includes('rodeo salvaje') || clean.includes('salvaje') || clean === 'aventura') {
      setTimeout(() => navigate('/tienda?cat=aventura'), 3000);
      return "¡Prepara el lazo! 🤠🔥 Rodeo Salvaje iniciado. Te sugiero el 'Plug Estrella Fugaz' o el 'Arnés Cowgirl Premium'. ¡Al galope en 3 segundos! 🐷✨";
    }
    if (clean.includes('mision sorpresa') || clean === 'sorpresa' || clean === 'regalo') {
      setTimeout(() => navigate('/tienda?cat=regalo'), 3000);
      return "¡Empacando la felicidad! 🎁 Misión Sorpresa lista. Te sugiero el 'Kit Tu Primera Vez' o la 'Caja Misteriosa Al'. ¡Nos vamos en 3 segundos! 🐷🌟";
    }

    // 3. PRODUCTOS Y RECOMENDACIONES
    if (words.some(w => ['producto', 'vendes', 'tienes', 'comprar', 'juguete', 'mostrar', 'muestrame', 'ensename', 'catalogo', 'tienda', 'ver'].includes(w)) || clean.includes('muestrame productos')) {
      setTimeout(() => navigate('/tienda'), 2000);
      
      if (clean.includes('vibrador') || clean.includes('vibrar')) {
        const vibs = catalogo.filter(p => p.nombre.toLowerCase().includes('vibrador') || p.id_categoria === 1).slice(0, 2);
        return `¡Claro! Tenemos juguetitos que vibran increíble. 🚀 Te sugiero el "${vibs[0]?.nombre || 'Vibrador Buzz'}" o el "${vibs[1]?.nombre || 'Cohete Espacial'}". ¡En 2 segundos te llevo a la tienda!`;
      }
      if (clean.includes('lenceria') || clean.includes('ropa') || clean.includes('disfraz')) {
        return "¡Uff! Nuestra ropita es para todxs. 👗 El 'Body Jessie' es súper popular. ¡Sujétate, que vamos para la tienda!";
      }
      return "¡El baúl está lleno de sorpresas! 🎁 Prepárate, te estoy llevando al catálogo completo para que explores todo. ¡Al infinito y más allá! 🚀";
    }

    // 3. AYUDA DE CONFIGURACIÓN
    if (words.some(w => ['perfil', 'foto', 'avatar', 'clave', 'contrasena', 'ajustes', 'configuracion', 'cambiar'].includes(w))) {
      if (!usuario) return "¡Hola! Primero necesitas iniciar sesión para ajustar tus cositas. 🤠";
      if (clean.includes('foto') || clean.includes('avatar') || clean.includes('imagen')) {
        return "¡Claro! En tu sección de 'Configuración' puedes subir tu foto favorita. Solo toca tu avatar actual y elige la imagen. 📸✨";
      }
      if (clean.includes('clave') || clean.includes('contrasena') || clean.includes('password')) {
        return "¡Seguridad primero! 🔒 En 'Configuración' puedes renovar tu clave de acceso. Es súper fácil y rápido.";
      }
      return "¡Ve a la sección de 'Configuración' en el menú! Ahí puedes personalizar tu perfil, cambiar tu imagen y tu contraseña. 🛠️🐷";
    }

    // 4. PREGUNTAS FRECUENTES
    if (words.some(w => ['envio', 'domicilio', 'llega', 'entrega', 'discreto', 'paquete'].includes(w))) {
      return "¡No te preocupes! 📦 Mis envíos son totalmente discretos. Llegan en empaques neutros para que nadie sepa qué hay en tu baúl. Suele tardar de 1 a 3 días. 🐷🛡️";
    }
    if (words.some(w => ['pago', 'pagar', 'plata', 'efectivo', 'tarjeta', 'nequi', 'daviplata'].includes(w))) {
      return "¡Aceptamos varias formas de pago! 💰 Puedes usar tarjeta o apps digitales al finalizar. ¡Es súper seguro!";
    }
    if (words.some(w => ['quien', 'eres', 'ham', 'hamm', 'cerdo', 'alcancia'].includes(w))) {
      return "¡Soy Hamm! 🐷 Le guardián más cool de este baúl. Mi misión es que te diviertas y encuentres siempre lo mejor. ¡Hablamos con confianza!";
    }

    // 5. ACCIONES DE ADMIN
    if (words.some(w => ['stock', 'inventario', 'ventas', 'ganancias', 'dinero', 'cuanto', 'vendimos'].includes(w))) {
      if (!isAdmin && !isVerified) return "¡Epa! Eso es solo para el equipo de Sheriffes. 🤠🚫";
      if (!isVerified) {
        setWaitingForPin(true);
        return "¡Un momento! 🤠🔑 Necesito tu 'Clave de Sheriffe' para mostrarte los números.";
      }

      try {
        const res = await fetch('/productos/admin/stats');
        const data = await res.json();
        
        if (clean.includes('stock') || clean.includes('inventario') || clean.includes('cantidad') || clean.includes('cuantos')) {
          let resp = `¡Oink! Aquí tienes el reporte real del baúl: 📦\n\n`;
          data.categorias.forEach(c => {
            resp += `• ${c.nombre}: ${c.cantidad} tipos\n`;
          });
          
          if (data.stock_bajo_count > 0) {
            resp += `\n⚠️ ¡PILAS! Estos productos se están agotando:\n`;
            data.stock_bajo_items.forEach(item => {
              resp += `• ${item.nombre} (Quedan ${item.stock})\n`;
            });
          } else {
            resp += `\n✨ ¡Todo el stock está reluciente!`;
          }
          
          return resp;
        }

        if (clean.includes('ventas') || clean.includes('dinero') || clean.includes('ganancias') || clean.includes('vendimos')) {
          const fmt = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
          
          let resp = `¡Mi alcancía está pesada! 💰 Aquí están las cuentas del equipo:\n\n`;
          resp += `📅 Esta Semana: ${fmt(data.ventas_semanales)}\n`;
          resp += `🗓️ Este Mes: ${fmt(data.ventas_mensuales)}\n`;
          resp += `🌟 Este Año: ${fmt(data.ventas_anuales)}\n`;
          resp += `\n✨ Ventas Totales: ${fmt(data.ventas_totales)}`;
          return resp;
        }
      } catch (err) {
        return "¡Rayos! No pude abrir la alcancía en este momento. Intenta en un ratito. 🐷";
      }
    }

    // 6. SALUDOS Y DESPEDIDAS
    if (words.some(w => ['hola', 'buenos', 'tardes', 'noches', 'que', 'tal', 'ola', 'habla'].includes(w))) {
      return `¡Hola, hola! 🤠🐷 ¿Cómo va todo hoy? ¿Buscas algo divertido o necesitas ayuda con tu cuenta?`;
    }
    if (words.some(w => ['gracias', 'chao', 'adios', 'luego', 'gracias', 'bien'].includes(w))) {
      return "¡A ti! ✨ Aquí estaré si necesitas algo más. ¡Pásala increíble y vuelve pronto! 🚀";
    }

    return "¡Rayos! 🐷 No logré captar eso. Pero no te preocupes, puedes preguntarme sobre 'productos', 'cómo cambiar mi foto', o 'envíos'. ¡Estoy para ayudarte!";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await getHammResponse(userMsg);
      setTimeout(() => {
        addBotMessage(response);
        setLoading(false);
      }, 800);
    } catch (err) {
      addBotMessage("¡Uy! Tuve un pequeño hipo técnico. Intenta de nuevo. 🐷");
      setLoading(false);
    }
  };

  const QuickButton = ({ text, onClick }) => (
    <button 
      onClick={onClick}
      className="px-3 py-1.5 bg-white border-2 border-[#fce4ec] text-[#f06292] text-[10px] font-black rounded-full hover:bg-[#f06292] hover:text-white transition-all whitespace-nowrap shadow-sm"
    >
      {text}
    </button>
  );

  return (
    <div className="fixed bottom-8 left-8 z-[1000]">
      {/* Botón flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#f06292] rounded-full shadow-[0_10px_25px_rgba(240,98,146,0.4)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 group border-4 border-white overflow-hidden"
      >
        <img 
          src={HammIcon} 
          alt="Hamm" 
          className="w-full h-full object-cover group-hover:rotate-12 transition-transform" 
        />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-gray-800 animate-pulse shadow-md">
          ?
        </div>
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-80 md:w-96 h-[550px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-[8px] border-[#fce4ec] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="p-6 bg-[#f06292] text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner border-2 border-pink-200 overflow-hidden">
                <img src={HammIcon} alt="Hamm Mini" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-xs italic">Hamm's AI</h4>
                <p className="text-[10px] opacity-90 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Disponible y Divertide
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-pink-400/30 rounded-full text-2xl font-black hover:bg-pink-400 transition-colors">×</button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fdf2f8] scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-bold shadow-md transition-all ${
                  msg.role === 'user' 
                  ? 'bg-[#ad1457] text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 border-2 border-[#fce4ec] rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border-2 border-[#fce4ec] flex gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-[#f06292] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#f06292] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#f06292] rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas */}
          <div className="px-4 py-2 bg-[#fdf2f8] flex gap-2 overflow-x-auto no-scrollbar border-t border-pink-100">
            <QuickButton text="🚀 Catálogo" onClick={() => { setInput("Ver catálogo"); }} />
            <QuickButton text="📸 Perfil" onClick={() => { setInput("Cómo cambio mi foto?"); }} />
            <QuickButton text="📦 Envíos" onClick={() => { setInput("Es discreto?"); }} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t-4 border-[#fce4ec] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe algo..."
              className="flex-1 bg-[#fdf2f8] px-5 py-3.5 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-[#f06292] transition-all placeholder:text-pink-200"
            />
            <button 
              type="submit"
              className="bg-[#f06292] text-white px-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ad1457] transition-all shadow-md active:scale-90"
            >
              ✨
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
