import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarHat from '../components/AvatarHat';
import LennyIcon from '../components/LennyIcon';
import PinterestSearchBar from '../components/PinterestSearchBar';
import ChatbotWidget from '../components/ChatbotWidget';
import ConfesionesDrawer from '../components/ConfesionesDrawer';
import ConfiguracionSoporteDrawer from '../components/ConfiguracionSoporteDrawer';
import { AuthContext } from '../context/AuthContext';

export default function Configuracion() {
  const { usuario, updateUsuario, logout, avatarHat, cambiarAvatarHat, gorritosDesbloqueados, esAdmin, userNameHint, cambiarFotoPerfil } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showConfesionesDrawer, setShowConfesionesDrawer] = useState(false);
  const [showConfigSoporteDrawer, setShowConfigSoporteDrawer] = useState(false);

  // Menú de opciones de Pinterest
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', mensaje: '' });
  
  // Modales y vistas
  const [showHatModal, setShowHatModal] = useState(false);
  const [avatarModalTab, setAvatarModalTab] = useState('foto'); // 'foto' | 'gorritos'
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const avatarFileInputRef = useRef(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [showSavedIdeasView, setShowSavedIdeasView] = useState(false);
  const [showExploreTodayView, setShowExploreTodayView] = useState(() => {
    return new URLSearchParams(window.location.search).get('tab') === 'hoy';
  });
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const notificationsDrawerRef = useRef(null);
  const [notificationSearch, setNotificationSearch] = useState('');
  
  // Punto rojo de notificaciones: se apaga cuando el usuario abre el panel porque ya leyó todo
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(() => {
    try {
      return localStorage.getItem('toy_notif_unread') !== 'false';
    } catch (e) {
      return true;
    }
  });

  const toggleNotificationsDrawer = () => {
    setShowNotificationsDrawer(prev => {
      const next = !prev;
      if (next) {
        setShowConfesionesDrawer(false);
        setShowConfigSoporteDrawer(false);
        setHasUnreadNotifications(false);
        try {
          localStorage.setItem('toy_notif_unread', 'false');
        } catch (e) {}
        cargarUsuariosYNotificaciones();
        fetch('/auth/notificaciones/leer', { method: 'PUT', credentials: 'include' }).catch(() => {});
      }
      return next;
    });
  };

  // Usuarios reales de la plataforma para interacción y seguimiento mutuo (sin datos falsos)
  const [communityUsers, setCommunityUsers] = useState([]);
  const [realNotifications, setRealNotifications] = useState([]);
  const [followingUsers, setFollowingUsers] = useState({});

  // Cargar usuarios reales y notificaciones desde la base de datos
  const cargarUsuariosYNotificaciones = () => {
    fetch('/auth/usuarios', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data?.usuarios && Array.isArray(data.usuarios)) {
          const mapped = data.usuarios.map(u => ({
            id: u.id_usuario,
            nombre: u.nombre || (u.email ? u.email.split('@')[0] : 'Usuario'),
            nombre_usuario: u.nombre_usuario || (u.email ? u.email.split('@')[0] : 'usuario'),
            texto: `${u.nombre || 'Usuario'} es parte de la comunidad Toy Store`,
            tiempo: 'En línea',
            img: u.foto_perfil,
            avatar_hat: u.avatar_hat || 'none',
            is_following: Boolean(u.is_following)
          }));
          setCommunityUsers(mapped);
          const followMap = {};
          mapped.forEach(u => {
            if (u.is_following) followMap[u.id] = true;
          });
          setFollowingUsers(followMap);
        }
      })
      .catch(() => {});

    fetch('/auth/notificaciones', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data?.notificaciones && Array.isArray(data.notificaciones)) {
          setRealNotifications(data.notificaciones);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    cargarUsuariosYNotificaciones();
  }, []);

  const toggleFollowUser = async (userId, userName, userHandle) => {
    try {
      const res = await fetch(`/auth/seguir/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setFollowingUsers(prev => ({
          ...prev,
          [userId]: data.siguiendo
        }));
        showToast(data.mensaje || (data.siguiendo ? `Comenzaste a seguir a ${userName}.` : `Dejaste de seguir a ${userName}.`));
        // Refrescar notificaciones
        fetch('/auth/notificaciones', { credentials: 'include' })
          .then(r => r.json())
          .then(d => { if (d?.notificaciones) setRealNotifications(d.notificaciones); })
          .catch(() => {});
      } else {
        showToast(data.error || 'No se pudo actualizar seguimiento');
      }
    } catch (e) {
      showToast('Error de conexión');
    }
  };

  const hoyFecha = new Intl.DateTimeFormat('es-CO', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const [activeBoardFilter, setActiveBoardFilter] = useState('todos'); // 'todos' | 'publico' | 'privado'
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [nuevoTableroNombre, setNuevoTableroNombre] = useState('');
  const [esTableroPrivado, setEsTableroPrivado] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  // Formulario Perfil
  const [nombre, setNombre] = useState('M');
  const [informacion, setInformacion] = useState('');
  const [pronombres, setPronombres] = useState('');
  const [showPronombres, setShowPronombres] = useState(false);
  const [sitioWeb, setSitioWeb] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const usernameCheckTimerRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleUsernameChange = (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setNombreUsuario(clean);
    setHasChanges(true);

    if (usernameCheckTimerRef.current) {
      clearTimeout(usernameCheckTimerRef.current);
    }

    if (!clean) {
      setUsernameError('El nombre de usuario es obligatorio');
      return;
    }

    if (clean.length < 3 || clean.length > 30) {
      setUsernameError('Debe tener entre 3 y 30 caracteres (solo letras, números y _)');
      return;
    }

    if (usuario?.nombre_usuario && clean === usuario.nombre_usuario.toLowerCase()) {
      setUsernameError('');
      return;
    }

    usernameCheckTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/auth/check-username?username=${encodeURIComponent(clean)}`, { credentials: 'include' });
        const data = await res.json();
        if (data.disponible === false) {
          setUsernameError(data.mensaje || 'El nombre de usuario ya está en uso');
        } else {
          setUsernameError('');
        }
      } catch (err) {
        console.error(err);
      }
    }, 250);
  };

  // Seguridad
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  // Privacidad
  const [perfilPrivado, setPerfilPrivado] = useState(false);
  const [ocultarBusqueda, setOcultarBusqueda] = useState(true);
  const [empaqueDiscreto, setEmpaqueDiscreto] = useState(true);

  // Catálogo oficial de sombreros de Toy Store
  const hatsCatalog = [
    { id: 'woody', nombre: 'Sheriff Woody', personaje: 'Woody', mision: 'Desbloqueado por registro en Toy Store' },
    { id: 'jessie', nombre: 'Vaquera Jessie', personaje: 'Jessie', mision: 'Desbloqueada por registro en Toy Store' },
    { id: 'none', nombre: 'Estilo Clásico', personaje: 'Original', mision: 'Disponible para todos los usuarios' },
    { id: 'potato', nombre: 'Sr. Cara de Papa', personaje: 'Cara de Papa', mision: 'Realiza tu primera compra en Toy Store' },
    { id: 'buzz', nombre: 'Star Command', personaje: 'Buzz Lightyear', mision: 'Guarda 3 productos en tus tableros de secretos' },
    { id: 'lotso', nombre: 'Orejitas de Fresa', personaje: 'Lotso', mision: 'Lee cualquier artículo de la Guía de Placer' },
    { id: 'alien', nombre: 'Antena de la Garra', personaje: 'Marciano', mision: 'Haz un pedido superior a $100.000 COP' },
    { id: 'rex', nombre: 'Cresta de Rex', personaje: 'Rex', mision: 'Activa el modo Empaque 100% Discreto' },
    { id: 'hamm', nombre: 'Cerdito Alcancía', personaje: 'Hamm', mision: 'Usa un cupón de descuento en tu compra' },
    { id: 'bopeep', nombre: 'Pastorcita Bo Peep', personaje: 'Bo Peep', mision: 'Visita y explora la sección Vestier' }
  ];

  // Buscador y Búsqueda Visual (Cámara tipo Pinterest)
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showVisualSearchModal, setShowVisualSearchModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState(null);
  const [showUploadsDropdown, setShowUploadsDropdown] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  // Historial de imágenes subidas real (inicia vacío sin fotos de mentira)
  const [uploadHistory, setUploadHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('toy_visual_search_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Ideas guardadas / Favoritos del usuario
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const stored = localStorage.getItem('toy_favoritos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      { id: 'fav-1', nombre: 'Vibrador Cowgirl Deluxe', precio: '120.000', cat: 'Vibradores', img: '/images/vibrador_cowgirl.png', boardId: 'b-amor' },
      { id: 'fav-2', nombre: 'Lencería Andy Sweet Lace', precio: '85.000', cat: 'Lencería', img: '/images/lenceria_andy.png', boardId: 'b-amor' },
      { id: 'fav-3', nombre: 'Plug Anal Joya Buzz', precio: '65.000', cat: 'Anales', img: '/images/plug_anal.png', boardId: 'b-pegatinas' },
      { id: 'fav-4', nombre: 'Mystery Box Sorpresa Andy', precio: '150.000', cat: 'Kits', img: '/images/mystery_box.png', boardId: 'b-pegatinas' },
      { id: 'fav-5', nombre: 'Classic Wand Vibrator', precio: '110.000', cat: 'Vibradores', img: '/images/toy_vibrator.png', boardId: 'b-amor' }
    ];
  });

  // Tableros de ideas (inicia vacío hasta que el usuario los cree)
  const [tableros, setTableros] = useState(() => {
    try {
      const stored = localStorage.getItem('toy_tableros');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filtrar tableros de ejemplo previos
          return parsed.filter(t => t.id !== 'b-amor' && t.id !== 'b-pegatinas');
        }
      }
    } catch (e) {}
    return [];
  });


  // Conexión dinámica con los productos de Toy Store
  // Por el momento permanece vacío a la espera de los productos oficiales definitivos.
  // Cuenta con la función inteligente que seleccionará una muestra variada (distintas categorías).
  const [sugerenciasTablero, setSugerenciasTablero] = useState([]);

  // Procesa y selecciona una muestra variada de productos (no todos, sino varios y diversos por categoría)
  const cargarSugerenciasDesdeProductos = (lista) => {
    if (!Array.isArray(lista) || lista.length === 0) {
      setSugerenciasTablero([]);
      return;
    }
    const categoriasVistas = new Set();
    const seleccion = [];
    for (const prod of lista) {
      const cat = (prod.categoria || 'general').toLowerCase();
      if (!categoriasVistas.has(cat)) {
        categoriasVistas.add(cat);
        seleccion.push(prod);
      }
      if (seleccion.length >= 5) break;
    }
    if (seleccion.length < 5) {
      for (const prod of lista) {
        if (!seleccion.some(p => p.id === prod.id)) {
          seleccion.push(prod);
        }
        if (seleccion.length >= 5) break;
      }
    }
    setSugerenciasTablero(seleccion.map(p => ({
      id: `prod-${p.id}`,
      originalId: p.id,
      nombre: p.nombre,
      precio: Number(p.precio).toLocaleString('es-CO'),
      cat: p.categoria,
      img: p.imagen || '/images/toy_vibrator.png'
    })));
  };

  useEffect(() => {
    // Escuchar actualizaciones de productos oficiales cuando se creen en la tienda
    const handleProductosActualizados = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        cargarSugerenciasDesdeProductos(e.detail);
      }
    };
    window.addEventListener('toy_store_productos_actualizados', handleProductosActualizados);
    return () => window.removeEventListener('toy_store_productos_actualizados', handleProductosActualizados);
  }, []);

  const userDropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const visualModalRef = useRef(null);
  const searchContainerRef = useRef(null);
  const shareDropdownRef = useRef(null);

  // Mantener el nombre oficial de Toy Store en la pestaña
  useEffect(() => {
    if (showSavedIdeasView) {
      document.title = 'Toy Store | Tus secretos guardados';
    } else if (showExploreTodayView) {
      document.title = 'Toy Store | Sigue inspirándote';
    } else if (showHistoryView) {
      document.title = 'Toy Store | Historial de búsqueda visual';
    } else {
      document.title = 'Toy Store | Configuración';
    }
  }, [showSavedIdeasView, showExploreTodayView, showHistoryView]);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setInformacion(usuario.informacion || '');
      setPronombres(usuario.pronombres || '');
      setSitioWeb(usuario.sitio_web || '');
      setNombreUsuario(usuario.nombre_usuario || (usuario.email ? usuario.email.split('@')[0] : ''));
      if (usuario.empaque_discreto !== undefined) {
        setEmpaqueDiscreto(Boolean(usuario.empaque_discreto));
      }
      setHasChanges(false);
    }
  }, [usuario]);

  useEffect(() => {
    const handleOutsideClicks = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(e.target)) {
        setShowShareModal(false);
      }
      if (visualModalRef.current && !visualModalRef.current.contains(e.target)) {
        const isCameraClick = e.target.closest('[data-camera-btn="true"]');
        if (!isCameraClick) {
          setShowVisualSearchModal(false);
        }
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClicks);
    return () => document.removeEventListener('mousedown', handleOutsideClicks);
  }, []);

  // Navegación fluida dentro de Configuración y soporte para el botón Atrás del navegador
  const abrirExploraHoy = (pushHistory = true) => {
    setShowExploreTodayView(true);
    setShowSavedIdeasView(false);
    setShowHistoryView(false);
    setShowNotificationsDrawer(false);
    if (pushHistory) {
      window.history.pushState({ tab: 'hoy' }, '', '/configuracion?tab=hoy');
    }
  };

  const abrirSecretos = (pushHistory = true) => {
    setShowSavedIdeasView(true);
    setShowExploreTodayView(false);
    setShowHistoryView(false);
    setShowNotificationsDrawer(false);
    if (pushHistory) {
      window.history.pushState({ tab: 'secretos' }, '', '/configuracion?tab=secretos');
    }
  };

  const abrirHistorial = (pushHistory = true) => {
    setShowHistoryView(true);
    setShowSavedIdeasView(false);
    setShowExploreTodayView(false);
    setShowNotificationsDrawer(false);
    if (pushHistory) {
      window.history.pushState({ tab: 'historial' }, '', '/configuracion?tab=historial');
    }
  };

  const volverAConfiguracion = () => {
    setShowSavedIdeasView(false);
    setShowHistoryView(false);
    setShowExploreTodayView(false);
    setShowNotificationsDrawer(false);
    if (window.location.search.includes('tab=')) {
      window.history.pushState(null, '', '/configuracion');
    }
  };

  // Manejar el botón "Atrás" del navegador para devolver siempre a Configuración
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab === 'secretos') {
        setShowSavedIdeasView(true);
        setShowHistoryView(false);
        setShowExploreTodayView(false);
      } else if (tab === 'historial') {
        setShowHistoryView(true);
        setShowSavedIdeasView(false);
        setShowExploreTodayView(false);
      } else if (tab === 'hoy') {
        setShowExploreTodayView(true);
        setShowSavedIdeasView(false);
        setShowHistoryView(false);
      } else {
        setShowSavedIdeasView(false);
        setShowHistoryView(false);
        setShowExploreTodayView(false);
      }
    };

    const initialParams = new URLSearchParams(window.location.search);
    const initialTab = initialParams.get('tab');
    if (initialTab === 'secretos') {
      setShowSavedIdeasView(true);
    } else if (initialTab === 'historial') {
      setShowHistoryView(true);
    }

    window.addEventListener('popstate', handlePopState);
    const handleOpenConfesiones = () => setShowConfesionesDrawer(true);
    window.addEventListener('toy_open_confesiones', handleOpenConfesiones);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('toy_open_confesiones', handleOpenConfesiones);
    };
  }, []);

  const showToast = (msg, ms = 2200) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
    }, ms);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    showToast('¡Copiado!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleFavorito = (prod) => {
    const exists = favoritos.some(f => f.id === prod.id);
    let updated;
    if (exists) {
      updated = favoritos.filter(f => f.id !== prod.id);
      showToast(`"${prod.nombre}" quitado de tus secretos.`);
    } else {
      updated = [{ ...prod }, ...favoritos];
      showToast(`"${prod.nombre}" agregado a tus secretos.`);
    }
    setFavoritos(updated);
    try {
      localStorage.setItem('toy_favoritos', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleOpenCrearTablero = () => {
    setNuevoTableroNombre('');
    setEsTableroPrivado(false);
    setShowCreateBoardModal(true);
  };

  const handleConfirmarCrearTablero = (e) => {
    if (e) e.preventDefault();
    if (!nuevoTableroNombre.trim()) return;

    const nuevoTablero = {
      id: `b-${Date.now()}`,
      nombre: nuevoTableroNombre.trim(),
      pinesCount: 0,
      tiempo: 'justo ahora',
      esPrivado: esTableroPrivado,
      imagenes: ['/images/vibrador_cowgirl.png']
    };

    const updated = [...tableros, nuevoTablero];
    setTableros(updated);
    try {
      localStorage.setItem('toy_tableros', JSON.stringify(updated));
    } catch (e) {}
    setShowCreateBoardModal(false);
    showToast(`Tablero "${nuevoTablero.nombre}" creado con éxito.`);
  };

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setFeedback({ tipo: 'error', mensaje: 'Por favor sube una imagen válida (PNG, JPG, WebP).' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setUploadedImage(dataUrl);
      setUploadedImageName(file.name);
      setIsAnalyzingImage(true);

      const newEntry = {
        id: Date.now().toString(),
        nombre: file.name,
        img: dataUrl,
        fecha: new Date().toLocaleDateString(),
        query: 'juguetes'
      };
      const updated = [newEntry, ...uploadHistory.filter(h => h.id !== newEntry.id)];
      setUploadHistory(updated);
      try {
        localStorage.setItem('toy_visual_search_history', JSON.stringify(updated));
      } catch (err) {}

      setTimeout(() => {
        setIsAnalyzingImage(false);
        const term = file.name.toLowerCase();
        let cat = 'juguetes';
        if (term.includes('vibra')) cat = 'vibradores';
        else if (term.includes('lenc')) cat = 'lencerias';
        else if (term.includes('anal') || term.includes('plug')) cat = 'anales';
        else if (term.includes('kit') || term.includes('box')) cat = 'kits';
        setDetectedCategory(cat);
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleEliminarHistorial = () => {
    setUploadHistory([]);
    try {
      localStorage.removeItem('toy_visual_search_history');
    } catch (e) {}
    setFeedback({ tipo: 'exito', mensaje: 'Historial de búsqueda visual eliminado con éxito.' });
  };

  const handleEliminarItem = (id) => {
    const updated = uploadHistory.filter(item => item.id !== id);
    setUploadHistory(updated);
    try {
      localStorage.setItem('toy_visual_search_history', JSON.stringify(updated));
    } catch (e) {}
    setFeedback({ tipo: 'exito', mensaje: 'Imagen eliminada del historial.' });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    setShowSearchSuggestions(false);

    // Revisar si coincide con una pestaña de configuración
    const matchedTab = pinterestNavItems.find(item => 
      item.label.toLowerCase().includes(term) || item.id.includes(term)
    );
    if (matchedTab) {
      setShowHistoryView(false);
      setShowSavedIdeasView(false);
      setActiveTab(matchedTab.id);
      setFeedback({ tipo: 'exito', mensaje: `Sección "${matchedTab.label}" encontrada.` });
      return;
    }

    if (term.includes('gorro') || term.includes('sombrero') || term.includes('woody') || term.includes('jessie') || term.includes('buzz')) {
      setShowHatModal(true);
      return;
    }

    if (term.includes('historial') || term.includes('foto') || term.includes('imagen')) {
      abrirHistorial();
      return;
    }

    if (term.includes('guardad') || term.includes('idea') || term.includes('tablero') || term.includes('pin')) {
      abrirSecretos();
      return;
    }

    // Navegar a la tienda buscando el producto
    navigate(`/tienda?buscar=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleGuardarPerfil = async (e) => {
    if (e) e.preventDefault();
    if (usernameError) {
      showToast(usernameError);
      return;
    }
    setLoading(true);
    setFeedback({ tipo: '', mensaje: '' });

    try {
      const res = await fetch('/auth/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nombre: nombre.trim(),
          informacion: (informacion || '').trim(),
          pronombres: pronombres || '',
          sitio_web: (sitioWeb || '').trim(),
          nombre_usuario: (nombreUsuario || '').trim().toLowerCase(),
          empaque_discreto: empaqueDiscreto
        })
      });

      const data = await res.json();
      if (res.ok && data.usuario) {
        updateUsuario(data.usuario);
        setHasChanges(false);
        setUsernameError('');
        showToast('Perfil guardado con éxito.');
      } else {
        if (data.campo === 'nombre_usuario') {
          setUsernameError(data.error);
        }
        showToast(data.error || 'Error al guardar.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestablecer = () => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setInformacion(usuario.informacion || '');
      setPronombres(usuario.pronombres || '');
      setSitioWeb(usuario.sitio_web || '');
      setNombreUsuario(usuario.nombre_usuario || (usuario.email ? usuario.email.split('@')[0] : ''));
      if (usuario.empaque_discreto !== undefined) {
        setEmpaqueDiscreto(Boolean(usuario.empaque_discreto));
      }
    }
    setUsernameError('');
    setHasChanges(false);
    showToast('Valores restablecidos.');
  };

  const handleCerrarSesion = async () => {
    await logout();
    navigate('/login');
  };

  // Opciones de configuración exactas de la captura de Pinterest
  const pinterestNavItems = [
    { id: 'perfil', label: 'Editar perfil' },
    { id: 'cuenta', label: 'Administración de la cuenta' },
    { id: 'visibilidad', label: 'Visibilidad del perfil' },
    { id: 'recomendaciones', label: 'Ajusta las recomendaciones' },
    { id: 'enlace', label: 'Enlace a Pinterest' },
    { id: 'permisos', label: 'Permisos sociales' },
    { id: 'notificaciones', label: 'Notificaciones' },
    { id: 'privacidad', label: 'Privacidad y datos' },
    { id: 'seguridad', label: 'Seguridad' },
    { id: 'marca', label: 'Contenido de marca' },
    { id: 'labs', label: 'Labs' }
  ];

  // Avatar oficial de Toy Store (foto de perfil persistente o avatar azul predeterminado)
  const avatarName = (usuario?.nombre || nombre || userNameHint || 'Mariana Alvarez').trim();
  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName).replace(/%20/g, '+')}&background=0284c7&color=fff&size=256`;
  const avatarUrl = usuario?.foto_perfil || defaultAvatarUrl;

  // Manejadores de foto de perfil con persistencia en base de datos
  const handleAvatarFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona una imagen válida (PNG, JPG o WebP).');
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.88);
          
          const res = await cambiarFotoPerfil(compressedBase64);
          setIsUploadingPhoto(false);
          if (res.ok) {
            showToast('¡Foto de perfil actualizada con éxito!');
          } else {
            showToast(res.error || 'Error al guardar la foto.');
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploadingPhoto(false);
      showToast('Error al procesar la imagen.');
    }
  };

  const handleEliminarFoto = async () => {
    setIsUploadingPhoto(true);
    const res = await cambiarFotoPerfil(null);
    setIsUploadingPhoto(false);
    if (res.ok) {
      showToast('Avatar restablecido al azul predeterminado.');
    } else {
      showToast('Error al restablecer avatar.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-white select-none font-fredoka text-[#111111]">
      
      {/* ============================================================ */}
      {/* 1. BARRA VERTICAL DE ICONOS A LA IZQUIERDA (TOTALMENTE FIJA) */}
      {/* ============================================================ */}
      <aside className="fixed left-0 top-0 bottom-0 w-[82px] border-r border-[#e9e9e9] flex flex-col justify-between items-center py-4 bg-white z-40 select-none">
        
        {/* ICONOS SUPERIORES */}
        <div className="flex flex-col items-center space-y-4 w-full">
          
          {/* LOGO OFICIAL TOY STORE (SOLO DECORACION, NO REDIRIGE) */}
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

          {/* ICONO 1: INICIO (LA CASITA DIRIGE A LA PÁGINA PRINCIPAL) */}
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

          {/* ICONO 2: LA BRÚJULA (DIRIGE A BÚSQUEDA Y RECOMENDACIONES "SIGUE INSPIRÁNDOTE") */}
          <button 
            onClick={() => {
              if (showExploreTodayView) volverAConfiguracion();
              else abrirExploraHoy();
            }} 
            className={`w-12 h-12 flex items-center justify-center transition-all cursor-pointer text-[#1e3a8a] ${
              showExploreTodayView 
                ? 'rounded-2xl bg-[#a6d4f2]/30 ring-1 ring-[#a6d4f2]/50 shadow-xs' 
                : 'rounded-full hover:bg-[#a6d4f2]/30'
            }`}
            title="Sigue inspirándote (Búsqueda y recomendaciones)"
          >
            <div className="relative">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9.25" />
                <polygon points="15.8,8.2 13.2,13.2 8.2,15.8 10.8,10.8" fill="none" />
                <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </button>

          {/* ICONO 3: EL COFRE DE SECRETOS GUARDADOS (REDISEÑO VECTORIAL PROFESIONAL) */}
          <button 
            onClick={() => {
              if (showSavedIdeasView) volverAConfiguracion();
              else abrirSecretos();
            }}
            className={`w-12 h-12 flex items-center justify-center transition-all cursor-pointer text-[#1e3a8a] ${
              showSavedIdeasView 
                ? 'rounded-2xl bg-[#a6d4f2]/30 ring-1 ring-[#a6d4f2]/50 shadow-xs' 
                : 'rounded-full hover:bg-[#a6d4f2]/30'
            }`}
            title="Tus secretos guardados"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {/* Tapa arqueada elegante */}
              <path d="M4 11V8.5C4 5.5 7.5 3.5 12 3.5C16.5 3.5 20 5.5 20 8.5V11" />
              {/* Cuerpo con esquinas redondeadas */}
              <rect x="3.5" y="11" width="17" height="9" rx="2.5" />
              {/* Broche central */}
              <rect x="10.5" y="10" width="3" height="4" rx="1" fill="currentColor" fillOpacity="0.25" />
              <circle cx="12" cy="12" r="0.8" fill="currentColor" />
              {/* Bandas de refuerzo */}
              <path d="M7.5 6.5v13.5" strokeOpacity="0.35" strokeWidth="1.8" />
              <path d="M16.5 6.5v13.5" strokeOpacity="0.35" strokeWidth="1.8" />
              {/* Asas laterales */}
              <path d="M2.5 13.5v2" strokeWidth="2" strokeOpacity="0.35" />
              <path d="M21.5 13.5v2" strokeWidth="2" strokeOpacity="0.35" />
            </svg>
          </button>

          {/* ICONO 4: CARRITO DE COMPRAS (DIRIGE A LA PÁGINA DE FACTURA / PAGO / CARRITO) */}
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

          {/* ICONO 5: NOTIFICACIONES (ABRE EL PANEL LATERAL DE ACTIVIDAD Y ACTUALIZACIONES) */}
          <button 
            data-bell-btn="true"
            onClick={toggleNotificationsDrawer}
            className={`w-12 h-12 flex items-center justify-center transition-all cursor-pointer relative text-[#1e3a8a] ${
              showNotificationsDrawer 
                ? 'rounded-2xl bg-[#a6d4f2]/30 ring-1 ring-[#a6d4f2]/50 shadow-xs' 
                : 'rounded-full hover:bg-[#a6d4f2]/30'
            }`}
            title="Notificaciones"
          >
            <div className="relative">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {hasUnreadNotifications && !showNotificationsDrawer && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E52521] ring-2 ring-white"></span>
              )}
            </div>
          </button>

          {/* ICONO MENSAJES -> RINCÓN DE CONFESIONES */}
          <button 
            onClick={() => {
              setShowNotificationsDrawer(false);
              setShowConfesionesDrawer(!showConfesionesDrawer);
            }}
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
            setShowNotificationsDrawer(false);
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
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
          if (tabKey === 'hoy') {
            setShowExploreTodayView(true);
            setShowSavedIdeasView(false);
          } else {
            volverAConfiguracion();
            setActiveTab(tabKey);
          }
        }}
        showToast={showToast}
      />

      {/* ============================================================ */}
      {/* PANEL LATERAL DE NOTIFICACIONES (RÉPLICA EXACTA DE PINTEREST) */}
      {/* ============================================================ */}
      {showNotificationsDrawer && (
        <div 
          ref={notificationsDrawerRef}
          className="fixed top-0 left-[82px] w-[360px] h-screen bg-white border-r border-[#e9e9e9] z-20 flex flex-col select-none overflow-hidden transition-all duration-300"
        >
          {/* Cabecera */}
          <div className="p-5 pb-3 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
            <h2 className="text-2xl font-bold text-[#1e3a8a]">
              Notificaciones
            </h2>
            <button 
              onClick={() => setShowNotificationsDrawer(false)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#111111] transition-colors cursor-pointer text-lg font-medium"
              title="Cerrar notificaciones"
            >
              ✕
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            
            {/* SECCIÓN 1: ACTIVIDAD (SEGUIR Y BUSCAR USUARIOS MUTUAMENTE) */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#1e3a8a]">
                  Actividad
                </h3>
                <span className="text-xs text-[#717171] font-normal">
                  {Object.values(followingUsers).filter(Boolean).length} Siguiendo
                </span>
              </div>

              {/* Buscador de usuarios reales para interactuar y tomar ideas mutuamente */}
              <div className="relative mb-3">
                <input
                  type="text"
                  value={notificationSearch}
                  onChange={(e) => setNotificationSearch(e.target.value)}
                  placeholder="Buscar usuarios para seguir..."
                  className="w-full text-xs py-2.5 pl-8 pr-3 rounded-full bg-gray-100 hover:bg-gray-200/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111] transition-all"
                />
                <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              {/* Usuarios reales registrados en el sistema */}
              <div className="space-y-3">
                {communityUsers
                  .filter(u => {
                    if (!notificationSearch.trim()) return true;
                    const s = notificationSearch.toLowerCase();
                    return (
                      (u.nombre && u.nombre.toLowerCase().includes(s)) ||
                      (u.nombre_usuario && u.nombre_usuario.toLowerCase().includes(s))
                    );
                  })
                  .map(u => {
                    const isFollowing = !!followingUsers[u.id];
                    return (
                      <div key={u.id} className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div 
                          onClick={() => {
                            setShowNotificationsDrawer(false);
                            navigate(`/perfil/${u.nombre_usuario}`);
                          }}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
                        >
                          <div className="relative w-11 h-11 flex-shrink-0">
                            {u.avatar_hat && u.avatar_hat !== 'none' && (
                              <AvatarHat type={u.avatar_hat} size="navbar" />
                            )}
                            {u.img ? (
                              <img src={u.img} alt={u.nombre} className="w-11 h-11 rounded-full object-cover shadow-xs" />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#a6d4f2] to-[#8ec2e4] text-[#1e3a8a] font-bold text-base flex items-center justify-center shadow-xs">
                                {u.nombre.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#111111] group-hover:text-[#1e3a8a] leading-snug font-semibold truncate transition-colors">
                              {u.nombre}
                            </p>
                            <span className="text-[11px] text-[#717171] truncate block">
                              @{u.nombre_usuario}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleFollowUser(u.id, u.nombre, u.nombre_usuario)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                            isFollowing
                              ? 'bg-gray-200 text-[#111111] hover:bg-gray-300'
                              : 'bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] shadow-xs'
                          }`}
                        >
                          {isFollowing ? 'Siguiendo' : 'Seguir'}
                        </button>
                      </div>
                    );
                  })}

                {communityUsers.length === 0 && (
                  <div className="py-4 text-center text-xs text-[#717171]">
                    No hay otros usuarios registrados aún.
                  </div>
                )}
              </div>
            </div>

            {/* SECCIÓN 2: ACTUALIZACIONES (NOTIFICACIONES REALES Y SUGERENCIAS DEL SISTEMA) */}
            <div className="px-5 pt-4 pb-8 border-t border-gray-100 mt-2">
              <h3 className="text-base font-bold text-[#1e3a8a] mb-3">
                Actualizaciones
              </h3>

              {/* Notificaciones Reales de la Base de Datos */}
              {realNotifications && realNotifications.length > 0 && (
                <div className="space-y-2 mb-3">
                  {realNotifications.map(notif => (
                    <div
                      key={notif.id_notificacion}
                      onClick={() => {
                        if (notif.remitente_username) {
                          setShowNotificationsDrawer(false);
                          navigate(`/perfil/${notif.remitente_username}`);
                        }
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-sky-50/60 hover:bg-sky-100/70 border border-sky-100/80 cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#a6d4f2]/40 text-[#1e3a8a] flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {notif.remitente_nombre ? notif.remitente_nombre.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#111111] leading-snug font-medium">
                          {notif.texto}
                        </p>
                        <span className="text-[10px] text-[#717171] mt-0.5 block">
                          {new Date(notif.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Item 1 */}
              <div 
                onClick={() => { setShowNotificationsDrawer(false); navigate('/tienda?buscar=vibradores'); }}
                className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-gray-100/80 cursor-pointer transition-colors group mb-1.5"
              >
                <div className="w-11 h-11 rounded-full bg-gray-100 group-hover:bg-[#a6d4f2]/30 flex items-center justify-center text-[#1e3a8a] flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7"/><path d="M16 16l4.5 4.5"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#111111] leading-snug">
                    ¿Sigues buscando? Explora ideas y productos de <span className="font-semibold text-[#1e3a8a]">Vibradores y Placer Íntimo</span>
                  </p>
                  <span className="text-[11px] text-[#717171] mt-0.5 block">13 h</span>
                </div>
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => { setShowNotificationsDrawer(false); navigate('/tienda?buscar=lencerias'); }}
                className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-gray-100/80 cursor-pointer transition-colors group mb-1.5"
              >
                <div className="w-11 h-11 rounded-full bg-gray-100 group-hover:bg-[#a6d4f2]/30 flex items-center justify-center text-[#1e3a8a] flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7"/><path d="M16 16l4.5 4.5"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#111111] leading-snug">
                    ¿Sigues buscando? Descubre nuevos estilos en <span className="font-semibold text-[#1e3a8a]">Lencería Cowgirl de Jessie</span>
                  </p>
                  <span className="text-[11px] text-[#717171] mt-0.5 block">4 d</span>
                </div>
              </div>

              {/* Item 3: Pregunta interactiva de la página con icono SVG limpio */}
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100/80 mb-2 mt-1">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#a6d4f2]/40 text-[#1e3a8a] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#111111] leading-snug font-medium">
                      ¿Te gustaría que te recomendemos juguetes según tus preferencias secretas?
                    </p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        type="button"
                        onClick={() => showToast("¡Preferencias activadas! Ahora recibirás sugerencias personalizadas.")}
                        className="bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        Sí, activar
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast("Recordatorio guardado para más adelante.")}
                        className="bg-white hover:bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 transition-colors cursor-pointer active:scale-95"
                      >
                        Más tarde
                      </button>
                    </div>
                    <span className="text-[10px] text-[#717171] mt-2 block">1 sem</span>
                  </div>
                </div>
              </div>

              {/* Item 4: Notificación con icono SVG limpio */}
              <div 
                onClick={() => { setShowNotificationsDrawer(false); setShowHatModal(true); setAvatarModalTab('gorritos'); }}
                className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-gray-100/80 cursor-pointer transition-colors group mb-1.5"
              >
                <div className="w-11 h-11 rounded-full bg-[#a6d4f2]/30 text-[#1e3a8a] flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#111111] leading-snug">
                    Toyito te informa: <span className="font-semibold text-[#1e3a8a]">¿Ya viste los nuevos accesorios desbloqueables para tu avatar?</span>
                  </p>
                  <span className="text-[11px] text-[#717171] mt-0.5 block">2 sem</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. BARRA SUPERIOR FIJA (HEADER ADAPTABLE A NOTIFICACIONES)   */}
      {/* ============================================================ */}
      <header className={`fixed top-0 right-0 h-[76px] px-8 flex items-center justify-between border-b border-[#e9e9e9]/80 bg-white z-30 select-none transition-all duration-300 ${
        showNotificationsDrawer || showConfesionesDrawer || showConfigSoporteDrawer 
          ? (showConfigSoporteDrawer ? 'left-[402px]' : 'left-[442px]') 
          : 'left-[82px]'
      }`}>
          
          {/* BUSCADOR INTELIGENTE TIPO PINTEREST (COPIE Y PEGUE EXACTO CON BÚSQUEDAS RECIENTES Y SUGERENCIAS) */}
          <div className="flex-1 relative flex items-center mr-6">
            <PinterestSearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onVisualSearchClick={() => setShowVisualSearchModal(prev => !prev)}
              onSelectTab={(tabId) => {
                setShowHistoryView(false);
                setShowSavedIdeasView(false);
                setShowExploreTodayView(tabId === 'hoy');
                setActiveTab(tabId);
              }}
              onOpenSecretos={() => abrirSecretos()}
              onOpenHats={() => setShowHatModal(true)}
              onOpenNotifications={() => setShowNotificationsDrawer(true)}
              placeholder="Buscar juguetes o configuraciones"
            />

            {/* ============================================================ */}
            {/* VENTANA EMERGENTE DE BÚSQUEDA POR IMAGEN (ADAPTABLE SIN CORTES) */}
            {/* ============================================================ */}
            {showVisualSearchModal && (
              <div 
                ref={visualModalRef}
                className="absolute top-[60px] right-0 w-[470px] max-w-[92vw] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-6 z-[70] animate-in fade-in zoom-in-95 duration-150 select-none text-left"
              >
                {/* Cabecera */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#1e3a8a] tracking-tight">
                    Carga una imagen para buscar
                  </h3>
                  <button 
                    onClick={() => { setShowVisualSearchModal(false); setUploadedImage(null); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#5f6368] hover:text-[#111111] transition-colors cursor-pointer text-base font-bold"
                    title="Cerrar"
                  >
                    ✕
                  </button>
                </div>

                {/* Input file oculto */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processImageFile(e.target.files[0]);
                    }
                  }} 
                />

                {/* Área punteada para arrastrar o hacer clic */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-5 min-h-[145px] max-h-[170px] flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group ${
                    isDragOver 
                      ? 'border-[#a6d4f2] bg-[#a6d4f2]/20 scale-[1.01]' 
                      : 'border-[#cdcdcd] hover:border-[#1e3a8a]/40 bg-[#fafafa] hover:bg-gray-50'
                  }`}
                >
                  {!uploadedImage ? (
                    <>
                      {/* Círculo con flecha arriba idéntico a Pinterest */}
                      <div className="w-10 h-10 rounded-full border-2 border-[#111111] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                      <p className="text-sm font-normal text-[#111111]">
                        Elige un archivo, o arrástralo y suéltalo aquí
                      </p>
                      <span className="text-[11px] text-[#717171] mt-1 font-normal">
                        Formatos soportados: PNG, JPG, WebP
                      </span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center w-full animate-in fade-in duration-200">
                      <div className="relative mb-2">
                        <img 
                          src={uploadedImage} 
                          alt="Previsualización" 
                          className="max-h-24 max-w-full rounded-2xl object-contain shadow-xs"
                        />
                        {isAnalyzingImage && (
                          <div className="absolute inset-0 bg-[#a6d4f2]/30 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                            <div className="w-6 h-6 border-2 border-white border-t-[#1e3a8a] rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>

                      <p className="text-xs font-normal text-[#111111] truncate max-w-[260px]">
                        {uploadedImageName || 'Imagen seleccionada'}
                      </p>

                      {isAnalyzingImage ? (
                        <p className="text-[11px] text-[#5f6368] font-normal mt-1 animate-pulse">
                          Escaneando imagen con búsqueda visual...
                        </p>
                      ) : (
                        <div className="mt-2.5 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setShowVisualSearchModal(false);
                              navigate(`/tienda?buscar=${encodeURIComponent(detectedCategory || 'juguetes')}`);
                            }}
                            className="bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] text-xs font-medium px-4 py-2 rounded-full transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5 stroke-current" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                              <circle cx="11" cy="11" r="7"/><path d="M16 16l4.5 4.5"/>
                            </svg>
                            <span>Buscar juguetes similares</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImage(null);
                              setUploadedImageName('');
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-[#111111] text-xs font-medium px-3 py-2 rounded-full transition-colors cursor-pointer"
                            title="Quitar"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pie: "Tus archivos subidos ⌃" y botón "Ver todo" */}
                {uploadHistory.length === 0 ? (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-normal text-[#717171]">
                      Tus archivos subidos
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowVisualSearchModal(false);
                        setShowHistoryView(true);
                        setShowSavedIdeasView(false);
                      }}
                      className="rounded-full bg-[#efefef] hover:bg-[#e2e2e2] px-3.5 py-1.5 text-xs font-normal text-[#111111] transition-colors cursor-pointer active:scale-95 shadow-2xs"
                    >
                      Ver todo
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button 
                        type="button"
                        onClick={() => setShowUploadsDropdown(!showUploadsDropdown)}
                        className="flex items-center gap-1 text-xs font-normal text-[#111111] hover:text-[#1e3a8a] transition-colors cursor-pointer"
                      >
                        <span>Tus archivos subidos</span>
                        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showUploadsDropdown ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowVisualSearchModal(false);
                          setShowHistoryView(true);
                          setShowSavedIdeasView(false);
                        }}
                        className="rounded-full bg-[#efefef] hover:bg-[#e2e2e2] px-3.5 py-1.5 text-xs font-normal text-[#111111] transition-colors cursor-pointer active:scale-95 shadow-2xs"
                      >
                        Ver todo
                      </button>
                    </div>

                    {/* Fila de imágenes subidas real, sin recortes */}
                    {showUploadsDropdown && (
                      <div className="mt-2.5">
                        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar snap-x">
                          {uploadHistory.slice(0, 8).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setUploadedImage(item.img);
                                setUploadedImageName(item.nombre);
                                setDetectedCategory(item.query);
                              }}
                              className="w-[78px] h-[104px] flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#a6d4f2] shadow-xs hover:shadow-md transition-all group snap-start bg-gray-50"
                              title={item.nombre}
                            >
                              <img src={item.img} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                            </div>
                          ))}
                        </div>
                        {/* Puntos de paginación idénticos a Pinterest */}
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                          <span className="w-2 h-2 rounded-full bg-[#111111]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* AVATAR DERECHO -> CLIC DIRECTO DIRIGE A "TUS IDEAS GUARDADAS" */}
          <div className="flex items-center gap-2 relative pt-2 flex-shrink-0 select-none" ref={userDropdownRef}>
            <button
              type="button"
              onClick={() => {
                abrirSecretos();
                setShowUserDropdown(false);
              }}
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
                    {avatarName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </button>

            {/* FLECHA SEPARADA -> AL CLIC TIENE SOMBRA DE PRESIONADO Y ABRE MENÚ EXACTO A PINTEREST */}
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

            {/* MENÚ DESPLEGABLE EXACTO A LA CAPTURA DE PINTEREST */}
            {showUserDropdown && (
              <div className="absolute right-0 top-14 w-[280px] bg-white rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.16)] border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-100 text-left select-none">
                
                {/* 1. Actualmente en */}
                <div className="text-xs text-[#717171] font-normal mb-3 px-2">
                  Actualmente en
                </div>

                <div 
                  onClick={() => {
                    abrirSecretos();
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
                        {avatarName.charAt(0).toUpperCase()}
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

                {/* 2. Tus cuentas */}
                <div className="text-xs text-[#717171] font-normal mt-4 mb-1 px-2">
                  Tus cuentas
                </div>

                {/* Opciones directas en azul oscuro */}
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
                    onClick={handleCerrarSesion}
                    className="w-full text-left font-semibold text-[15px] text-[#1e3a8a] hover:text-red-600 py-2 px-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Salir
                  </button>
                </div>

              </div>
            )}
          </div>
      </header>

      {/* MENSAJE TOAST FLOTANTE AL FINAL DE LA PÁGINA (ESTILO PINTEREST EN AZULITO) */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-none select-none">
          <div className="bg-[#a6d4f2] text-[#1e3a8a] text-sm font-medium px-6 py-2.5 rounded-2xl shadow-xl border border-[#8ec2e4]">
            {toastMessage}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. CONTENIDO PRINCIPAL                                       */}
      {/* ============================================================ */}
      <main className={`pt-[116px] pb-36 px-12 transition-all duration-300 ${
        showNotificationsDrawer || showConfesionesDrawer || showConfigSoporteDrawer 
          ? (showConfigSoporteDrawer ? 'ml-[402px]' : 'ml-[442px]') 
          : 'ml-[82px]'
      }`}>

        {/* ============================================================ */}
        {/* VISTA 0: SIGUE INSPIRÁNDOTE (HOY / BRÚJULA - TIPO PINTEREST) */}
        {/* ============================================================ */}
        {showExploreTodayView ? (
          <div className="w-full max-w-[760px] mx-auto animate-in fade-in duration-200 text-center pb-12 select-none">
            <p className="text-sm font-semibold text-[#1e3a8a] mb-1 capitalize">
              {hoyFecha}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1e3a8a] tracking-tight mb-8">
              Sigue inspirándote
            </h1>

            {/* Cuadrícula de 4 tarjetas de inspiración compactas idéntica a Pinterest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6">
              
              {/* Tarjeta 1 */}
              <div 
                onClick={() => navigate('/tienda?buscar=vibradores')}
                className="relative aspect-[4/5] rounded-[28px] overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <img 
                  src="/images/toy_vibrator.png" 
                  alt="Accesorios que parecen esculturas" 
                  className="w-full h-full object-cover p-5 bg-gradient-to-br from-pink-50 to-sky-100 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5 md:p-6">
                  <span className="text-xs font-semibold text-white/90 drop-shadow-xs mb-1">
                    Aspecto artístico
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-md">
                    Accesorios que parecen esculturas
                  </h3>
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div 
                onClick={() => navigate('/tienda')}
                className="relative aspect-[4/5] rounded-[28px] overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <img 
                  src="/images/vibrador_cowgirl.png" 
                  alt="Un rincón positivo" 
                  className="w-full h-full object-cover p-5 bg-gradient-to-br from-amber-50 to-orange-100 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5 md:p-6">
                  <span className="text-xs font-semibold text-white/90 drop-shadow-xs mb-1">
                    Ideas para sentirse bien
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-md">
                    Un rincón positivo
                  </h3>
                </div>
              </div>

              {/* Tarjeta 3 */}
              <div 
                onClick={() => navigate('/tienda?buscar=lencerias')}
                className="relative aspect-[4/5] rounded-[28px] overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <img 
                  src="/images/lenceria_andy.png" 
                  alt="Complicidad en pareja" 
                  className="w-full h-full object-cover p-5 bg-gradient-to-br from-purple-50 to-sky-100 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5 md:p-6">
                  <span className="text-xs font-semibold text-white/90 drop-shadow-xs mb-1">
                    Complicidad y juegos
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-md">
                    Lencería Cowgirl para encender la chispa
                  </h3>
                </div>
              </div>

              {/* Tarjeta 4 */}
              <div 
                onClick={() => navigate('/tienda?buscar=anales')}
                className="relative aspect-[4/5] rounded-[28px] overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <img 
                  src="/images/plug_anal.png" 
                  alt="Sensaciones intensas" 
                  className="w-full h-full object-cover p-5 bg-gradient-to-br from-blue-50 to-emerald-100 group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5 md:p-6">
                  <span className="text-xs font-semibold text-white/90 drop-shadow-xs mb-1">
                    Sensaciones intensas
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-md">
                    Secretos para explorar a solas
                  </h3>
                </div>
              </div>

            </div>

            {/* SECCIÓN FINAL DE EXPLORA HOY (RÉPLICA EXACTA DE PINTEREST CON BOTÓN INGENIOSO) */}
            <div className="flex flex-col items-center justify-center text-center mt-12 mb-8 select-none animate-in fade-in duration-300">
              {/* Círculo con checkmark */}
              <div className="w-10 h-10 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center mb-3.5">
                <svg className="w-5 h-5 text-[#1e3a8a] stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <p className="text-sm font-bold text-[#1e3a8a] mb-1">
                ¡Es todo por hoy!
              </p>

              <h3 className="text-base sm:text-lg font-bold text-[#1e3a8a] mb-6">
                Vuelve mañana para encontrar más inspiración
              </h3>

              <button
                type="button"
                onClick={() => navigate('/tienda')}
                className="px-7 py-3 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                Ir a ver productos para ti
              </button>
            </div>

          </div>
        ) : showSavedIdeasView ? (
          <div className="w-full max-w-[1240px] mx-auto animate-in fade-in duration-200">
            
            {/* Cabecera: Tus secretos guardados */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight">
                  Tus secretos guardados
                </h1>
              </div>

              {/* Tarjeta de perfil en cabecera derecha idéntica a Pinterest */}
              <div className="flex items-center gap-4 bg-gray-50/80 p-3 rounded-3xl border border-gray-100 self-start md:self-auto">
                <div className="relative w-14 h-14 flex-shrink-0">
                  {avatarHat && avatarHat !== 'none' && (
                    <AvatarHat type={avatarHat} size="sm" />
                  )}
                  {usuario?.foto_perfil ? (
                    <img src={usuario.foto_perfil} alt="Avatar" className="w-14 h-14 rounded-full object-cover shadow-xs" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#a6d4f2] to-[#8ec2e4] text-[#1e3a8a] font-bold text-xl flex items-center justify-center shadow-xs">
                      {avatarName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Botón Lapicito para cambiar imagen/gorrito idéntico a Pinterest */}
                  <button
                    type="button"
                    onClick={() => setShowHatModal(true)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white border border-gray-300 shadow-sm hover:border-[#1e3a8a] hover:scale-110 flex items-center justify-center text-[#111111] hover:text-[#1e3a8a] transition-all cursor-pointer z-10"
                    title="Cambiar imagen o gorrito"
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </button>
                </div>

                <div>
                  <span className="font-medium text-base text-[#111111]">{usuario?.nombre || 'Mariana Alvarez'}</span>
                  <p className="text-xs text-[#717171] font-normal">Siguiendo a 0</p>
                </div>

                {/* Botón Compartir perfil y su Popover (Con color azul activo) */}
                <div className="relative" ref={shareDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(!showShareModal)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all cursor-pointer shadow-2xs ml-2 ${
                      showShareModal 
                        ? 'bg-[#a6d4f2] text-[#1e3a8a] ring-2 ring-[#8ec2e4]' 
                        : 'bg-[#efefef] hover:bg-[#e2e2e2] text-[#111111] active:scale-95'
                    }`}
                  >
                    Compartir perfil
                  </button>

                  {/* Popover idéntico a Pinterest (Sin usuarios ficticios) */}
                  {showShareModal && (
                    <div className="absolute right-0 top-12 w-[310px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
                      {/* Título Compartir */}
                      <div className="relative text-center mb-4">
                        <h3 className="text-sm font-medium text-[#111111]">
                          Compartir
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowShareModal(false)}
                          className="absolute right-0 top-0 text-gray-400 hover:text-gray-700 text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Iconos de Redes Sociales Reales */}
                      <div className="grid grid-cols-4 gap-3 text-center mb-3">
                        {/* 1. Copiar enlace */}
                        <button
                          type="button"
                          onClick={handleCopyShareLink}
                          className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            copiedLink ? 'bg-[#a6d4f2] text-[#1e3a8a]' : 'bg-[#e9e9e9] hover:bg-[#dedede] text-[#111111]'
                          }`}>
                            {copiedLink ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[11px] font-normal text-[#111111] leading-tight">
                            {copiedLink ? '¡Copiado!' : 'Copiar enlace'}
                          </span>
                        </button>

                        {/* 2. WhatsApp */}
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent('¡Descubre mis secretos más guardados en Toy Store! Entra a ver mi perfil secreto: ' + window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#25D366] hover:brightness-105 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.39 1.31-1.92 1.36-.5.05-1.12.06-3.64-.98-3.09-1.28-5.07-4.41-5.23-4.62-.15-.2-1.25-1.67-1.25-3.18 0-1.51.78-2.26 1.06-2.56.28-.3.61-.38.81-.38.2 0 .41 0 .59.01.19.01.44-.07.69.52.25.6.85 2.08.93 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.52.23.6.36.08.13.08.77-.16 1.45z"/>
                            </svg>
                          </div>
                          <span className="text-[11px] font-normal text-[#111111]">WhatsApp</span>
                        </a>

                        {/* 3. Messenger */}
                        <a
                          href="https://www.messenger.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00c6ff] via-[#0078ff] to-[#a800e0] hover:brightness-105 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.913 1.454 5.512 3.727 7.199V22l3.373-1.852c.905.251 1.867.387 2.9.387 5.523 0 10-4.145 10-9.276C22 6.145 17.523 2 12 2zm1.066 12.448l-2.671-2.85-5.213 2.85 5.733-6.087 2.744 2.85 5.14-2.85-5.733 6.087z"/>
                            </svg>
                          </div>
                          <span className="text-[11px] font-normal text-[#111111]">Messenger</span>
                        </a>

                        {/* 4. Facebook */}
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#1877F2] hover:brightness-105 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                          <span className="text-[11px] font-normal text-[#111111]">Facebook</span>
                        </a>
                      </div>

                      {/* Fila X / Twitter */}
                      <div className="flex justify-start pl-2">
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Mis secretos más guardados en Toy Store: ' + window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-black hover:bg-neutral-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </div>
                          <span className="text-[11px] font-normal text-[#111111]">X</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pestaña: Tableros (Sin opción de Pines) */}
            <div className="flex items-center border-b border-gray-100 mb-6">
              <div className="pb-3 text-base font-medium text-[#111111] relative">
                <span>Tableros</span>
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1e3a8a] rounded-full"></span>
              </div>
            </div>

            {/* Barra de Filtros: Público / Privado (Con color azul activo) */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  className="p-2.5 rounded-full hover:bg-gray-100 text-[#111111] transition-colors cursor-pointer"
                  title="Filtros"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBoardFilter(activeBoardFilter === 'publico' ? 'todos' : 'publico')}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeBoardFilter === 'publico' 
                      ? 'bg-[#a6d4f2] text-[#1e3a8a] ring-2 ring-[#8ec2e4]' 
                      : 'bg-[#efefef] text-[#111111] hover:bg-[#e2e2e2]'
                  }`}
                >
                  Público
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBoardFilter(activeBoardFilter === 'privado' ? 'todos' : 'privado')}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeBoardFilter === 'privado' 
                      ? 'bg-[#a6d4f2] text-[#1e3a8a] ring-2 ring-[#8ec2e4]' 
                      : 'bg-[#efefef] text-[#111111] hover:bg-[#e2e2e2]'
                  }`}
                >
                  Privado
                </button>
              </div>

              <button
                type="button"
                onClick={handleOpenCrearTablero}
                className="bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-medium text-sm px-6 py-2.5 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Crear
              </button>
            </div>

            {/* CONTENIDO: TABLEROS (Filtrados por público o privado) */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
                {/* Tableros creados por el usuario según filtro */}
                {tableros
                  .filter(tab => {
                    if (activeBoardFilter === 'privado') return tab.esPrivado === true;
                    if (activeBoardFilter === 'publico') return !tab.esPrivado;
                    return true;
                  })
                  .map((tab) => (
                    <div 
                      key={tab.id}
                      className="group cursor-pointer text-left"
                    >
                      <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-xs group-hover:shadow-lg transition-all relative flex">
                        {tab.esPrivado && (
                          <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs">
                            <svg className="w-3.5 h-3.5 fill-current text-[#111111]" viewBox="0 0 24 24">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                            </svg>
                          </div>
                        )}
                        
                        <div className="w-full h-full">
                          <img src={tab.imagenes[0] || '/images/vibrador_cowgirl.png'} alt={tab.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      </div>

                      <div className="mt-2.5 px-1">
                        <h4 className="font-medium text-base text-[#111111] group-hover:text-[#1e3a8a] transition-colors">
                          {tab.nombre}
                        </h4>
                        <p className="text-xs text-[#717171] mt-0.5">
                          {tab.pinesCount} Pines • {tab.tiempo}
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Tarjeta para CREAR NUEVO TABLERO idéntica a Pinterest */}
                <div 
                  onClick={handleOpenCrearTablero}
                  className="w-full aspect-[4/3] rounded-3xl bg-[#efefef] hover:bg-[#e5e5e5] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer transition-all group p-4"
                >
                  <div className="bg-white rounded-full px-5 py-2.5 font-medium text-sm text-[#111111] shadow-xs group-hover:scale-105 transition-transform">
                    Crear
                  </div>
                </div>

              </div>

              {/* SECCIÓN: SUGERENCIAS PARA EL TABLERO (Conectada dinámicamente a productos) */}
              {sugerenciasTablero.length > 0 && (
                <div className="pt-6 border-t border-gray-100 animate-in fade-in duration-200">
                  <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">
                    Sugerencias para el tablero
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {sugerenciasTablero.map((sug) => {
                      const isSaved = favoritos.some(f => f.id === sug.id);
                      return (
                        <div key={sug.id} className="group rounded-3xl border border-gray-100 bg-white p-3 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between">
                          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-2">
                            <img src={sug.img} alt={sug.nombre} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                            <button
                              type="button"
                              onClick={() => toggleFavorito(sug)}
                              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer ${
                                isSaved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:text-red-500'
                              }`}
                              title={isSaved ? "Quitar de secretos" : "Guardar en secretos"}
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                            </button>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-[#111111] truncate">{sug.nombre}</p>
                            <span className="text-[11px] text-[#717171] block">${sug.precio} COP</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleFavorito(sug)}
                            className={`mt-2.5 w-full py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              isSaved 
                                ? 'bg-[#efefef] text-[#111111]' 
                                : 'bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a]'
                            }`}
                          >
                            {isSaved ? 'Guardado' : 'Guardar'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* ============================================================ */}
            {/* MODAL: CREAR UN TABLERO (RÉPLICA EXACTA DE PINTEREST)         */}
            {/* ============================================================ */}
            {showCreateBoardModal && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
                onClick={() => setShowCreateBoardModal(false)}
              >
                <div 
                  className="bg-white rounded-3xl max-w-[500px] w-full p-7 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 text-left select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Título y botón cerrar */}
                  <div className="relative text-center mb-2">
                    <h2 className="text-xl md:text-2xl font-medium text-[#111111]">
                      Crear un tablero
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowCreateBoardModal(false)}
                      className="absolute right-0 top-0 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black font-medium text-lg transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Collage gráfico placeholder idéntico a Pinterest */}
                  <div className="w-[180px] h-[120px] mx-auto my-5 rounded-2xl overflow-hidden bg-[#e9e9e9] flex gap-1 p-1">
                    <div className="w-2/3 h-full rounded-xl bg-[#dcdcdc]"></div>
                    <div className="w-1/3 h-full flex flex-col gap-1">
                      <div className="w-full h-1/2 rounded-lg bg-[#dcdcdc]"></div>
                      <div className="w-full h-1/2 rounded-lg bg-[#dcdcdc]"></div>
                    </div>
                  </div>

                  <form onSubmit={handleConfirmarCrearTablero}>
                    {/* Campo nombre del tablero */}
                    <div className="border border-[#cdcdcd] rounded-2xl px-4 py-3 bg-white focus-within:border-[#1e3a8a] focus-within:ring-2 focus-within:ring-[#a6d4f2]/40 transition-all mb-5">
                      <label className="block text-xs font-normal text-[#717171] mb-1">
                        Nombre del tablero
                      </label>
                      <input
                        type="text"
                        autoFocus
                        value={nuevoTableroNombre}
                        onChange={(e) => setNuevoTableroNombre(e.target.value)}
                        placeholder="Elige un nombre para tu tablero"
                        className="w-full text-base font-normal text-[#111111] outline-none bg-transparent placeholder-[#767676]"
                      />
                    </div>

                    {/* Switch: Hacer este tablero privado */}
                    <div className="flex items-center justify-between gap-4 mb-8">
                      <div>
                        <p className="text-sm font-medium text-[#111111]">
                          Hacer este tablero privado
                        </p>
                        <p className="text-xs text-[#717171] mt-0.5 leading-relaxed">
                          Los tableros son públicos de forma predeterminada y cualquier persona puede verlos. Solo tú puedes ver los tableros privados.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEsTableroPrivado(!esTableroPrivado)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                          esTableroPrivado ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          esTableroPrivado ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* Botón Crear */}
                    <button
                      type="submit"
                      disabled={!nuevoTableroNombre.trim()}
                      className={`w-full py-3.5 rounded-full text-sm font-medium transition-all ${
                        nuevoTableroNombre.trim()
                          ? 'bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] cursor-pointer shadow-sm active:scale-98'
                          : 'bg-[#efefef] text-[#717171] cursor-not-allowed'
                      }`}
                    >
                      Crear
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        ) : showHistoryView ? (
          /* ============================================================ */
          /* VISTA 2: HISTORIAL DE BÚSQUEDA VISUAL                        */
          /* ============================================================ */
          <div className="w-full max-w-[1280px] mx-auto animate-in fade-in duration-200">
            {/* Barra superior de Historial idéntica a Pinterest */}
            <div className="relative flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <button
                onClick={() => setShowHistoryView(false)}
                className="w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#1e3a8a] transition-colors cursor-pointer"
                title="Volver a Configuración"
              >
                <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>

              <h1 className="text-2xl md:text-[28px] font-black text-[#1e3a8a] absolute left-1/2 -translate-x-1/2">
                Historial
              </h1>

              {uploadHistory.length > 0 ? (
                <button
                  onClick={handleEliminarHistorial}
                  className="rounded-full bg-[#efefef] hover:bg-[#e2e2e2] text-[#111111] font-bold text-sm px-5 py-2.5 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                >
                  Eliminar todos
                </button>
              ) : (
                <div className="w-12" />
              )}
            </div>

            {/* Contenido del Historial */}
            {uploadHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-[#a6d4f2]/20 flex items-center justify-center text-[#1e3a8a] mb-4">
                  <svg className="w-10 h-10 stroke-current" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8a2 2 0 012-2h2.5l1.5-2h4l1.5 2H18a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">No hay imágenes en el historial</h2>
                <p className="text-sm text-[#717171] max-w-md mb-6">
                  Las fotos o capturas que subas para buscar juguetes similares con la cámara aparecerán aquí guardadas.
                </p>
                <button
                  onClick={() => {
                    setShowHistoryView(false);
                    setShowVisualSearchModal(true);
                  }}
                  className="bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-bold px-6 py-3 rounded-full text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Cargar una imagen ahora
                </button>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-5 pb-16 space-y-5">
                {uploadHistory.map((item) => (
                  <div
                    key={item.id}
                    className="break-inside-avoid group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer bg-gray-50 border border-gray-100"
                  >
                    <img
                      src={item.img}
                      alt={item.nombre}
                      className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300 rounded-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarItem(item.id);
                          }}
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#111111] flex items-center justify-center shadow-md text-xs font-bold transition-all"
                          title="Eliminar de historial"
                        >
                          ✕
                        </button>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white truncate mb-1.5">{item.nombre}</p>
                        <button
                          onClick={() => navigate(`/tienda?buscar=${encodeURIComponent(item.query || 'juguetes')}`)}
                          className="w-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] text-xs font-bold px-3 py-1.5 rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <span>Buscar en Tienda</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* VISTA 3: COLUMNAS DE CONFIGURACIÓN                           */
          /* ============================================================ */
          <div className="flex max-w-[1120px] w-full gap-24 items-start">
            
            {/* COLUMNA 1: LISTA DE AJUSTES ESTILO PINTEREST */}
            <nav className="w-[260px] space-y-1.5 flex-shrink-0 select-none pt-1 sticky top-[100px] self-start">
              {pinterestNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowSavedIdeasView(false);
                      setShowHistoryView(false);
                    }}
                    className={`block w-full text-left text-[15px] px-3.5 py-2 -mx-3.5 rounded-2xl transition-all duration-150 cursor-pointer hover:bg-[#a6d4f2]/25 ${
                      isActive 
                        ? 'font-bold text-[#1e3a8a]' 
                        : 'font-normal text-[#5f6368] hover:text-[#1e3a8a]'
                    }`}
                  >
                    <span className="relative inline-block pb-0.5">
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1e3a8a] rounded-full"></span>
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* COLUMNA 2: CONTENIDO PRINCIPAL */}
            <div className="flex-1 max-w-[640px]">
              
              {/* PESTAÑA: EDITAR PERFIL */}
              {activeTab === 'perfil' && (
                <div className="space-y-6">
                  
                  {/* TÍTULO EN AZUL Y SUBTÍTULO EN GRIS */}
                  <div>
                    <h1 className="text-[32px] font-bold text-[#1e3a8a] tracking-tight leading-tight">
                      Editar perfil
                    </h1>
                    <p className="text-[15px] text-[#5f6368] font-normal mt-1 leading-relaxed">
                      Mantén privados tus datos personales. Cualquier persona que pueda ver tu perfil podrá ver la información que agregues aquí.
                    </p>
                  </div>

                  {/* SECCIÓN FOTO */}
                  <div>
                    <span className="block text-xs font-semibold text-[#717171] mb-1">
                      Foto
                    </span>
                    <div className="flex items-center gap-5 pt-8 pb-1">
                      {/* Avatar redondo oficial */}
                      <div className="relative w-[84px] h-[84px]">
                        {avatarHat && avatarHat !== 'none' && (
                          <AvatarHat type={avatarHat} size="md" />
                        )}
                        {usuario?.foto_perfil ? (
                          <img
                            src={usuario.foto_perfil}
                            alt="Avatar"
                            className="w-[84px] h-[84px] rounded-full object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-[#a6d4f2] to-[#8ec2e4] text-[#1e3a8a] font-bold text-3xl flex items-center justify-center shadow-md select-none">
                            {avatarName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Botón Cambiar */}
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarModalTab('foto');
                          setShowHatModal(true);
                        }}
                        className="bg-[#efefef] hover:bg-[#e2e2e2] text-[#111111] font-medium text-base px-5 py-3 rounded-full transition-colors active:scale-95 cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>

                  {/* CAMPOS DE FORMULARIO REDONDEADOS Y AMPLIOS */}
                  <div className="space-y-5">
                    
                    {/* CAMPO: NOMBRE */}
                    <div className="border border-[#cdcdcd] rounded-2xl px-4 py-3 bg-white focus-within:border-[#1e3a8a] focus-within:ring-2 focus-within:ring-[#a6d4f2]/40 transition-all">
                      <label className="block text-xs font-medium text-[#717171] mb-0.5">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => {
                          setNombre(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full text-base font-normal text-[#111111] outline-none bg-transparent"
                      />
                    </div>

                    {/* CAMPO: INFORMACIÓN */}
                    <div className="border border-[#cdcdcd] rounded-2xl px-4 py-3.5 bg-white focus-within:border-[#1e3a8a] focus-within:ring-2 focus-within:ring-[#a6d4f2]/40 transition-all">
                      <label className="block text-xs font-medium text-[#717171] mb-0.5">
                        Información
                      </label>
                      <textarea
                        rows={2}
                        value={informacion}
                        onChange={(e) => {
                          setInformacion(e.target.value);
                          setHasChanges(true);
                        }}
                        placeholder="Cuenta tu historia"
                        className="w-full text-base font-normal text-[#111111] outline-none bg-transparent placeholder-[#767676] resize-none"
                      />
                    </div>

                    {/* CAMPO: PRONOMBRES */}
                    <div>
                      <div 
                        onClick={() => setShowPronombres(!showPronombres)}
                        className="border border-[#cdcdcd] rounded-2xl px-4 py-3.5 bg-white cursor-pointer flex items-center justify-between hover:border-[#1e3a8a]/40 transition-all relative"
                      >
                        <div>
                          <span className="block text-xs font-medium text-[#717171] mb-0.5">
                            Pronombres
                          </span>
                          <span className="text-base font-normal text-[#111111]">
                            {pronombres || 'Agrega tus pronombres'}
                          </span>
                        </div>
                        <svg className="w-5 h-5 text-[#717171]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>

                        {showPronombres && (
                          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50">
                            {['ella / la', 'él / lo', 'elle / le', 'Prefiero no especificar'].map(p => (
                              <div 
                                key={p} 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setPronombres(p); 
                                  setHasChanges(true); 
                                  setShowPronombres(false); 
                                }}
                                className="px-4 py-2.5 text-sm font-medium hover:bg-gray-100 rounded-xl text-[#111111]"
                              >
                                {p}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#717171] font-normal mt-1.5 leading-relaxed px-1">
                        Elige hasta 2 grupos de pronombres para que aparezcan en tu perfil y las personas sepan cómo referirse a ti. Puedes editarlos o eliminarlos cuando quieras.
                      </p>
                    </div>

                    {/* CAMPO: SITIO WEB */}
                    <div>
                      <div className="border border-[#cdcdcd] rounded-2xl px-4 py-3 bg-white focus-within:border-[#1e3a8a] focus-within:ring-2 focus-within:ring-[#a6d4f2]/40 transition-all">
                        <label className="block text-xs font-medium text-[#717171] mb-0.5">
                          Sitio web
                        </label>
                        <input
                          type="text"
                          value={sitioWeb}
                          onChange={(e) => {
                            setSitioWeb(e.target.value);
                            setHasChanges(true);
                          }}
                          placeholder="https://"
                          className="w-full text-base font-normal text-[#111111] outline-none bg-transparent placeholder-[#767676]"
                        />
                      </div>
                      <p className="text-xs text-[#717171] font-normal mt-1.5 leading-relaxed px-1">
                        Agrega un enlace e impulsa tráfico a tu sitio
                      </p>
                    </div>

                    {/* CAMPO: NOMBRE DE USUARIO */}
                    <div>
                      <div className={`border rounded-2xl px-4 py-3 bg-white transition-all ${
                        usernameError 
                          ? 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200' 
                          : 'border-[#cdcdcd] focus-within:border-[#1e3a8a] focus-within:ring-2 focus-within:ring-[#a6d4f2]/40'
                      }`}>
                        <label className="block text-xs font-medium text-[#717171] mb-0.5">
                          Nombre de usuario
                        </label>
                        <input
                          type="text"
                          value={nombreUsuario}
                          onChange={(e) => handleUsernameChange(e.target.value)}
                          placeholder="tu_usuario"
                          className="w-full text-base font-normal text-[#111111] outline-none bg-transparent"
                        />
                      </div>
                      {usernameError ? (
                        <p className="text-xs text-red-500 font-medium mt-1.5 leading-relaxed px-1 animate-in fade-in duration-150">
                          {usernameError}
                        </p>
                      ) : (
                        <p className="text-xs text-[#717171] font-normal mt-1.5 leading-relaxed px-1">
                          www.toystore.com/{nombreUsuario || (usuario?.nombre_usuario || 'usuario')}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* PESTAÑA: ADMINISTRACIÓN DE LA CUENTA */}
              {activeTab === 'cuenta' && (
                <div className="space-y-4 max-w-[640px] animate-fade-in">
                  <h1 className="text-[32px] font-bold text-[#1e3a8a]">Administración de la cuenta</h1>
                  <p className="text-base text-[#5f6368]">Configura tus datos de acceso, contraseña y credenciales.</p>
                  <div className="border border-gray-200 rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-bold text-[#717171] uppercase">Correo Electrónico</span>
                    <p className="text-base font-semibold text-[#111111]">{usuario?.email || 'alvarezfrancomariana@gmail.com'}</p>
                  </div>
                </div>
              )}

              {/* PESTAÑA: SEGURIDAD */}
              {activeTab === 'seguridad' && (
                <div className="space-y-4 max-w-[640px] animate-fade-in">
                  <h1 className="text-[32px] font-bold text-[#1e3a8a]">Seguridad</h1>
                  <p className="text-base text-[#5f6368]">Actualiza tu contraseña para mantener protegida tu cuenta.</p>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-2xl px-4 py-3">
                      <label className="block text-xs font-semibold text-[#717171]">Contraseña actual</label>
                      <input type="password" value={contrasenaActual} onChange={e => setContrasenaActual(e.target.value)} className="w-full text-base outline-none bg-transparent text-[#111111]" />
                    </div>
                    <div className="border border-gray-200 rounded-2xl px-4 py-3">
                      <label className="block text-xs font-semibold text-[#717171]">Nueva contraseña</label>
                      <input type="password" value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} className="w-full text-base outline-none bg-transparent text-[#111111]" />
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA: PRIVACIDAD Y DATOS */}
              {activeTab === 'privacidad' && (
                <div className="space-y-4 max-w-[640px] animate-fade-in">
                  <h1 className="text-[32px] font-bold text-[#1e3a8a]">Privacidad y datos</h1>
                  <p className="text-base text-[#5f6368]">Controla la confidencialidad de tus entregas y facturación.</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-5">
                      <div>
                        <span className="text-base font-bold text-[#111111] block">Empaque 100% Discreto</span>
                        <span className="text-xs text-[#717171]">Cajas selladas sin rótulos comerciales</span>
                      </div>
                      <button onClick={() => setEmpaqueDiscreto(!empaqueDiscreto)} className={`w-12 h-6 rounded-full p-1 transition-colors ${empaqueDiscreto ? 'bg-[#a6d4f2]' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full transition-transform ${empaqueDiscreto ? 'translate-x-6 bg-[#1e3a8a]' : 'bg-white'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* OTRAS PESTAÑAS */}
              {['visibilidad', 'recomendaciones', 'enlace', 'permisos', 'notificaciones', 'marca', 'labs'].includes(activeTab) && (
                <div className="space-y-4 max-w-[640px] animate-fade-in">
                  <h1 className="text-[32px] font-bold text-[#1e3a8a]">
                    {pinterestNavItems.find(i => i.id === activeTab)?.label}
                  </h1>
                  <p className="text-base text-[#5f6368]">Ajustes sincronizados con tu cuenta personal.</p>
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* BARRA INFERIOR FIJA (DOCK CON RESTABLECER Y GUARDAR)          */}
      {/* ============================================================ */}
      {!showHistoryView && !showSavedIdeasView && !showExploreTodayView && activeTab === 'perfil' && (
        <footer className={`fixed bottom-0 right-0 py-3.5 bg-white/95 backdrop-blur-xs border-t border-gray-100 flex items-center justify-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 ${
          showNotificationsDrawer || showConfesionesDrawer || showConfigSoporteDrawer 
            ? (showConfigSoporteDrawer ? 'left-[402px]' : 'left-[442px]') 
            : 'left-[82px]'
        }`}>
          <button
            type="button"
            onClick={handleRestablecer}
            className="px-6 py-3.5 rounded-full bg-[#efefef] hover:bg-[#e2e2e2] text-[#5f6368] hover:text-[#111111] font-medium text-base transition-colors active:scale-95 cursor-pointer"
          >
            Restablecer
          </button>
          <button
            type="button"
            onClick={handleGuardarPerfil}
            disabled={!hasChanges && !loading}
            className={`px-6 py-3.5 rounded-full font-semibold text-base transition-all ${
              hasChanges 
                ? 'bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] cursor-pointer active:scale-95 shadow-md font-bold' 
                : 'bg-[#efefef] text-[#717171]/50 cursor-not-allowed opacity-80 font-medium'
            }`}
          >
            Guardar
          </button>
        </footer>
      )}

      {/* ============================================================ */}
      {/* MODAL AVATAR CON 2 SECCIONES: CAMBIAR FOTO Y GORRITOS         */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* MODAL AVATAR: CLON EXACTO DE PINTEREST (MINIMALISTA, BOTON AZUL, SIN EMOJIS) */}
      {/* ============================================================ */}
      {showHatModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowHatModal(false);
          }}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-[32px] p-8 sm:p-10 max-w-[460px] w-full shadow-2xl relative animate-in zoom-in-95 duration-150">
            
            {/* BOTÓN CERRAR DISCRETO */}
            <button 
              onClick={() => setShowHatModal(false)} 
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 text-[#5f6368] hover:text-[#111111] font-normal text-lg cursor-pointer flex items-center justify-center transition-colors"
              title="Cerrar"
            >
              ✕
            </button>

            {/* SELECTOR DISCRETO DE SECCIONES (FOTO / GORRITOS - COLOR #a6d4f2) */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => setAvatarModalTab('foto')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  avatarModalTab === 'foto'
                    ? 'bg-[#a6d4f2] text-[#1e3a8a] shadow-xs'
                    : 'bg-gray-100 text-[#555555] hover:text-[#111111]'
                }`}
              >
                Cambiar imagen
              </button>
              <button
                type="button"
                onClick={() => setAvatarModalTab('gorritos')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  avatarModalTab === 'gorritos'
                    ? 'bg-[#a6d4f2] text-[#1e3a8a] shadow-xs'
                    : 'bg-gray-100 text-[#555555] hover:text-[#111111]'
                }`}
              >
                Gorritos
              </button>
            </div>

            {/* SECCIÓN 1: FOTO DE PERFIL (COPIE Y PEGUE EXACTO DE PINTEREST CON BOTÓN AZUL #a6d4f2) */}
            {avatarModalTab === 'foto' && (
              <div className="flex flex-col items-center justify-center text-center space-y-5 pt-1 pb-1 min-h-[175px]">
                <h3 className="text-xl sm:text-2xl font-medium text-[#111111] tracking-normal">
                  Cambiar tu imagen
                </h3>

                {/* Input de archivo oculto */}
                <input
                  type="file"
                  ref={avatarFileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleAvatarFileSelected}
                />

                {/* Botón en azul #a6d4f2 como el resto del diseño */}
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="w-full bg-[#a6d4f2] hover:bg-[#92c5e5] text-[#1e3a8a] font-medium text-base py-3 px-8 rounded-full transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center"
                >
                  {isUploadingPhoto ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin"></span>
                      <span>Guardando...</span>
                    </span>
                  ) : (
                    <span>Elegir una foto</span>
                  )}
                </button>

                {usuario?.foto_perfil && (
                  <button
                    type="button"
                    onClick={handleEliminarFoto}
                    disabled={isUploadingPhoto}
                    className="text-xs font-normal text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                  >
                    Restablecer al avatar predeterminado
                  </button>
                )}
              </div>
            )}

            {/* SECCIÓN 2: GORRITOS DE TOY STORE (MISMO TAMAÑO QUE CARGAR IMAGEN, SIN TEXTOS ADMIN) */}
            {avatarModalTab === 'gorritos' && (
              <div className="flex flex-col items-center justify-center text-center space-y-3 pt-1 pb-1 min-h-[175px]">
                <h3 className="text-xl sm:text-2xl font-medium text-[#111111] tracking-normal">
                  Gorritos
                </h3>

                <div className="grid grid-cols-5 gap-1.5 w-full p-0.5 no-scrollbar">
                  {hatsCatalog.map(hat => {
                    const isUnlocked = esAdmin || (gorritosDesbloqueados && gorritosDesbloqueados.includes(hat.id));
                    const isEquipped = avatarHat === hat.id;

                    return (
                      <button
                        key={hat.id}
                        type="button"
                        onClick={() => {
                          if (!isUnlocked) {
                            showToast(`Accesorio bloqueado: ${hat.mision}`);
                            return;
                          }
                          cambiarAvatarHat(hat.id);
                          showToast(`Accesorio ${hat.nombre} equipado.`);
                        }}
                        className={`py-1 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center relative cursor-pointer h-[52px] ${
                          !isUnlocked 
                            ? 'border-gray-200 bg-gray-50/70 opacity-60 hover:bg-gray-100'
                            : isEquipped 
                              ? 'border-[#a6d4f2] bg-[#a6d4f2]/25 ring-2 ring-[#a6d4f2] shadow-xs' 
                              : 'border-gray-200 hover:border-[#a6d4f2] bg-white hover:shadow-xs'
                        }`}
                        title={isUnlocked ? `Equipar ${hat.nombre}` : `Bloqueado: ${hat.mision}`}
                      >
                        <div className={`h-6 flex items-center justify-center ${!isUnlocked ? 'grayscale opacity-75' : ''}`}>
                          {hat.id === 'none' ? (
                            <span className="text-[8.5px] text-gray-400 font-normal">Sin gorro</span>
                          ) : (
                            <AvatarHat type={hat.id} size="preview" className="w-7 h-6" />
                          )}
                        </div>
                        <span className="text-[8.5px] font-normal text-[#111111] truncate w-full leading-tight mt-0.5">{hat.nombre}</span>
                        {isEquipped && (
                          <span className="text-[7px] font-medium text-[#1e3a8a] leading-none mt-0.5">En uso</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* COMPAÑERO TOYITO RE-IMPLEMENTADO EN CONFIGURACIÓN */}
      <ChatbotWidget />

    </div>
  );
}
