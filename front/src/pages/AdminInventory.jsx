import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * AdminInventory: Suite de Gestión en la Computadora de Andy (ToyOS Desktop 2025).
 * Al cerrar la ventana, el usuario permanece dentro del escritorio del computador con las demás opciones.
 */
export default function AdminInventory() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado de la ventana activa en el escritorio del computador
  const [ventanaAbierta, setVentanaAbierta] = useState(true);
  const [appActiva, setAppActiva] = useState('inventario'); // 'inventario' | 'pedidos' | 'confesiones' | 'usuarios'
  const [ventanaMaximizada, setVentanaMaximizada] = useState(false);

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  const [mostrandoForm, setMostrandoForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'vibradores',
    stock: '',
    nivel_juego: 1,
    descripcion: '',
    imagen: ''
  });

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setCargando(true);
    try {
      const res = await fetch('/productos');
      const data = await res.json();
      if (res.ok) {
        setProductos(data);
      } else {
        setError('Error al conectar con la base de datos');
      }
    } catch (err) {
      setError('Fallo de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const abrirForm = (producto = null) => {
    if (producto) {
      setEditandoId(producto.id);
      setFormData({
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        stock: producto.stock,
        nivel_juego: producto.nivel_juego || 1,
        descripcion: producto.descripcion || '',
        imagen: producto.imagen || ''
      });
    } else {
      setEditandoId(null);
      setFormData({
        nombre: '',
        precio: '',
        categoria: 'vibradores',
        stock: '',
        nivel_juego: 1,
        descripcion: '',
        imagen: ''
      });
    }
    setMostrandoForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editandoId ? `/productos/${editandoId}` : '/productos';
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMostrandoForm(false);
        fetchProductos();
      } else {
        alert(data.error || 'Error al guardar el producto');
      }
    } catch (err) {
      alert('Error de conexión con el sistema');
    }
  };

  const eliminarProducto = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${nombre}" del catálogo?`)) return;

    try {
      const res = await fetch(`/productos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        fetchProductos();
      } else {
        alert(data.error || 'No se pudo eliminar el producto');
      }
    } catch (err) {
      alert('Error de red al intentar eliminar');
    }
  };

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val);
  };

  const productosFiltrados = productos.filter(p => {
    const matchCat = categoriaFiltro === 'todas' || p.categoria?.toLowerCase() === categoriaFiltro.toLowerCase();
    const matchSearch = !busqueda.trim() || p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || p.id?.toString().includes(busqueda);
    return matchCat && matchSearch;
  });

  const totalStock = productos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const bajoStock = productos.filter(p => Number(p.stock) <= 3).length;

  const categoriasLista = [
    { id: 'todas', label: 'Todos' },
    { id: 'vibradores', label: 'Vibradores' },
    { id: 'lencerias', label: 'Lencería' },
    { id: 'anales', label: 'Anales' },
    { id: 'kits', label: 'Kits & Cajas' },
    { id: 'accesorios', label: 'Accesorios' },
    { id: 'cosmeticos', label: 'Aceites' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0b1329] text-[#111111] flex flex-col select-none relative overflow-hidden font-sans">
      
      {/* ============================================================ */}
      {/* 1. BARRA SUPERIOR DE MENÚ DEL SISTEMA OPERATIVO (TOY-OS 2025)*/}
      {/* ============================================================ */}
      <header className="h-8 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 flex items-center justify-between z-50 text-xs font-medium text-slate-800 flex-shrink-0 shadow-xs">
        
        {/* Lado izquierdo: Identificador del SO y Navegación de Apps */}
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-1.5 font-bold text-[#1e3a8a] cursor-pointer hover:opacity-85 transition-opacity" 
            onClick={() => setVentanaAbierta(false)}
            title="Ir al escritorio del computador"
          >
            <svg className="w-4 h-4 fill-current text-[#1e3a8a]" viewBox="0 0 24 24">
              <path d="M12 2.5s3.5 3 4.5 7.5c1 4.5-.5 8.5-.5 8.5l-4-2-4 2s-1.5-4-.5-8.5C8.5 5.5 12 2.5 12 2.5z" />
              <circle cx="12" cy="10" r="1.5" fill="white" />
            </svg>
            <span className="tracking-tight font-black">ToyOS 2025</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-600 text-[11px]">
            <span 
              onClick={() => { setAppActiva('inventario'); setVentanaAbierta(true); }}
              className={`cursor-pointer transition-colors ${ventanaAbierta && appActiva === 'inventario' ? 'font-bold text-[#1e3a8a]' : 'hover:text-slate-900'}`}
            >
              Almacén
            </span>
            <span 
              onClick={() => { setAppActiva('pedidos'); setVentanaAbierta(true); }}
              className={`cursor-pointer transition-colors ${ventanaAbierta && appActiva === 'pedidos' ? 'font-bold text-[#1e3a8a]' : 'hover:text-slate-900'}`}
            >
              Pedidos
            </span>
            <span 
              onClick={() => { setAppActiva('confesiones'); setVentanaAbierta(true); }}
              className={`cursor-pointer transition-colors ${ventanaAbierta && appActiva === 'confesiones' ? 'font-bold text-[#1e3a8a]' : 'hover:text-slate-900'}`}
            >
              Confesiones
            </span>
            <span 
              onClick={() => { setAppActiva('usuarios'); setVentanaAbierta(true); }}
              className={`cursor-pointer transition-colors ${ventanaAbierta && appActiva === 'usuarios' ? 'font-bold text-[#1e3a8a]' : 'hover:text-slate-900'}`}
            >
              Usuarios
            </span>
          </div>
        </div>

        {/* Lado derecho: Estado del sistema y opciones */}
        <div className="flex items-center gap-3.5 text-[11px] text-slate-600">
          <div className="hidden md:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[10px] text-slate-500">BD 2025 En línea</span>
          </div>

          <button 
            onClick={() => setVentanaAbierta(false)}
            className="px-2.5 py-0.5 rounded bg-slate-100 hover:bg-[#a6d4f2]/40 text-[#1e3a8a] text-[10px] font-semibold transition-colors cursor-pointer"
            title="Ver pantalla principal del computador con todas las opciones"
          >
            Escritorio ToyOS
          </button>

          <button 
            onClick={() => navigate('/admin')}
            className="px-2.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-semibold transition-colors cursor-pointer"
            title="Salir del computador hacia la habitación de Andy"
          >
            Apagar / Cuarto
          </button>

          <span className="font-mono font-bold text-slate-700 pl-1">{currentTime}</span>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. PANTALLA PRINCIPAL DEL COMPUTADOR (ESCRITORIO & VENTANAS) */}
      {/* ============================================================ */}
      <main className="flex-1 p-3 md:p-6 pb-24 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a]">
        
        {/* Marca de agua / Wallpaper estético del computador */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
          <span className="text-[16vw] font-black text-white tracking-widest leading-none">TOY OS</span>
        </div>

        {/* ========================================================== */}
        {/* VISTA A: ESCRITORIO CON TODAS LAS OPCIONES (CUANDO SE CIERRA) */}
        {/* ========================================================== */}
        {!ventanaAbierta ? (
          <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Computadora de Andy • Star Command Suite 2025</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Panel Central de Administrador
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto font-normal">
                Selecciona una aplicación del sistema para gestionar tu tienda.
              </p>
            </div>

            {/* Cuadrícula de opciones / aplicaciones del computador */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              
              {/* Opción 1: Inventario */}
              <div
                onClick={() => { setAppActiva('inventario'); setVentanaAbierta(true); }}
                className="bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl p-5 border border-white/40 shadow-xl flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#a6d4f2] text-[#1e3a8a] flex items-center justify-center mb-3 shadow-md group-hover:rotate-6 transition-transform">
                  <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#1e3a8a] leading-tight mb-1">
                  Almacén & Catálogo
                </h3>
                <span className="text-[11px] text-slate-500 font-normal">
                  {productos.length} juguetes registrados
                </span>
              </div>

              {/* Opción 2: Pedidos */}
              <div
                onClick={() => { setAppActiva('pedidos'); setVentanaAbierta(true); }}
                className="bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl p-5 border border-white/40 shadow-xl flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3 shadow-md group-hover:rotate-6 transition-transform">
                  <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#1e3a8a] leading-tight mb-1">
                  Pedidos & Despachos
                </h3>
                <span className="text-[11px] text-slate-500 font-normal">
                  Control de envíos discretos
                </span>
              </div>

              {/* Opción 3: Confesiones */}
              <div
                onClick={() => { setAppActiva('confesiones'); setVentanaAbierta(true); }}
                className="bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl p-5 border border-white/40 shadow-xl flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 shadow-md group-hover:rotate-6 transition-transform">
                  <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#1e3a8a] leading-tight mb-1">
                  Buzón de Confesiones
                </h3>
                <span className="text-[11px] text-slate-500 font-normal">
                  Historias de la comunidad
                </span>
              </div>

              {/* Opción 4: Usuarios */}
              <div
                onClick={() => { setAppActiva('usuarios'); setVentanaAbierta(true); }}
                className="bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl p-5 border border-white/40 shadow-xl flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-md group-hover:rotate-6 transition-transform">
                  <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#1e3a8a] leading-tight mb-1">
                  Jugueteros & Usuarios
                </h3>
                <span className="text-[11px] text-slate-500 font-normal">
                  Cuentas y roles
                </span>
              </div>

            </div>

            {/* Widget Informativo del Sistema */}
            <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-semibold">Estado de la Tienda: Operativa en Colombia</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => navigate('/tienda')}
                  className="px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition-all cursor-pointer"
                >
                  Ver Tienda Pública
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white font-bold transition-all cursor-pointer"
                >
                  Regresar a la Habitación
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================== */
          /* VISTA B: VENTANA DE APLICACIÓN ABIERTA SOBRE EL ESCRITORIO   */
          /* ========================================================== */
          <div className={`w-full max-w-6xl ${ventanaMaximizada ? 'h-[92vh]' : 'h-[85vh]'} bg-white rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.55)] border border-slate-300 flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-200`}>
            
            {/* BARRA DE TÍTULO DE LA VENTANA (BOTONES macOS / WINDOWS) */}
            <div className="h-10 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between flex-shrink-0 select-none">
              
              {/* Traffic Lights: Botón Rojo ahora vuelve al escritorio del computador */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setVentanaAbierta(false)}
                  className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-90 flex items-center justify-center text-[8px] text-red-950 font-black group cursor-pointer shadow-2xs"
                  title="Cerrar ventana y ver el escritorio del computador"
                >
                  <span className="opacity-0 group-hover:opacity-100">✕</span>
                </button>
                <button 
                  onClick={() => setVentanaAbierta(false)}
                  className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:brightness-90 cursor-pointer shadow-2xs"
                  title="Minimizar al dock"
                />
                <button 
                  onClick={() => setVentanaMaximizada(!ventanaMaximizada)}
                  className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:brightness-90 cursor-pointer shadow-2xs"
                  title="Maximizar / Restaurar"
                />
              </div>

              {/* Título dinámico de la ventana */}
              <div className="flex items-center gap-2 text-xs font-bold text-[#1e3a8a]">
                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>
                  {appActiva === 'inventario' && 'Almacén de Juguetes — Administrador v2.5 (2025)'}
                  {appActiva === 'pedidos' && 'Gestión de Pedidos & Envíos — ToyOS 2025'}
                  {appActiva === 'confesiones' && 'Moderación de Confesiones — ToyOS 2025'}
                  {appActiva === 'usuarios' && 'Directorio de Usuarios — ToyOS 2025'}
                </span>
              </div>

              {/* Botón cerrar a la derecha */}
              <button 
                onClick={() => setVentanaAbierta(false)}
                className="text-[11px] font-semibold text-slate-500 hover:text-[#1e3a8a] cursor-pointer"
                title="Volver al escritorio"
              >
                Ver Apps
              </button>
            </div>

            {/* CONTENIDO INTERNO: SI LA APP ES INVENTARIO */}
            {appActiva === 'inventario' ? (
              <>
                {/* BARRA DE HERRAMIENTAS Y BÚSQUEDA DEL SOFTWARE */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                  
                  {/* Buscador interno */}
                  <div className="relative flex-1 min-w-[220px] max-w-sm">
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar por nombre o referencia..."
                      className="w-full text-xs py-2 pl-8 pr-3 rounded-xl bg-white border border-slate-300 focus:border-[#a6d4f2] focus:ring-2 focus:ring-[#a6d4f2]/40 outline-none text-slate-800 transition-all font-normal"
                    />
                    <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {busqueda && (
                      <button 
                        onClick={() => setBusqueda('')} 
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[9px] flex items-center justify-center font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Métricas y botón nuevo */}
                  <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 text-xs">
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600">
                        Total: <b className="text-[#1e3a8a]">{productos.length}</b>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600">
                        Stock: <b className="text-[#1e3a8a]">{totalStock}</b> uds
                      </div>
                      {bajoStock > 0 && (
                        <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                          {bajoStock} en alerta
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => abrirForm()}
                      className="px-4 py-2 rounded-xl bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span className="text-sm font-black">+</span>
                      <span>Nuevo Juguete</span>
                    </button>
                  </div>

                </div>

                {/* FILTROS RÁPIDOS POR CATEGORÍA EN PÍLDORAS */}
                <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
                  {categoriasLista.map(cat => {
                    const isSelected = categoriaFiltro === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoriaFiltro(cat.id)}
                        className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#a6d4f2] text-[#1e3a8a] font-bold shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-normal'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* TABLA PRINCIPAL DE DATOS DEL ALMACÉN */}
                <div className="flex-1 overflow-auto no-scrollbar bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 w-16">Item</th>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Precio COP</th>
                        <th className="py-3 px-4">Stock en Almacén</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {cargando ? (
                        <tr>
                          <td colSpan="6" className="py-20 text-center text-slate-400">
                            <div className="w-6 h-6 border-2 border-[#a6d4f2] border-t-[#1e3a8a] rounded-full animate-spin mx-auto mb-2"></div>
                            Sincronizando inventario con la computadora...
                          </td>
                        </tr>
                      ) : productosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-20 text-center text-slate-400 font-normal">
                            No hay productos que coincidan con los criterios seleccionados.
                          </td>
                        </tr>
                      ) : (
                        productosFiltrados.map((p) => {
                          const stockNum = Number(p.stock) || 0;
                          return (
                            <tr key={p.id} className="hover:bg-sky-50/50 transition-colors">
                              
                              {/* Miniatura del producto */}
                              <td className="py-2.5 px-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1">
                                  <img 
                                    src={p.imagen || '/images/vibrador_cowgirl.png'} 
                                    alt={p.nombre} 
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => { e.target.src = '/images/vibrador_cowgirl.png'; }}
                                  />
                                </div>
                              </td>

                              {/* Nombre y referencia */}
                              <td className="py-2.5 px-4">
                                <div className="font-bold text-[#1e3a8a] text-xs">
                                  {p.nombre}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  REF #{p.id.toString().padStart(4, '0')}
                                </span>
                              </td>

                              {/* Categoría */}
                              <td className="py-2.5 px-4">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                  {p.categoria}
                                </span>
                              </td>

                              {/* Precio */}
                              <td className="py-2.5 px-4 font-bold text-slate-800">
                                {formatCOP(p.precio)}
                              </td>

                              {/* Stock */}
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${stockNum <= 3 ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                  <span className={`font-semibold ${stockNum <= 3 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                                    {stockNum} unidades
                                  </span>
                                </div>
                              </td>

                              {/* Acciones */}
                              <td className="py-2.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => abrirForm(p)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#a6d4f2] text-slate-700 hover:text-[#1e3a8a] font-semibold text-[11px] transition-colors cursor-pointer"
                                    title="Editar producto"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => eliminarProducto(p.id, p.nombre)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-semibold text-[11px] transition-colors cursor-pointer"
                                    title="Eliminar producto"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* BARRA INFERIOR DE ESTADO DE LA VENTANA */}
                <div className="h-7 bg-slate-50 border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500 flex-shrink-0">
                  <span>{productosFiltrados.length} juguetes listados en almacén</span>
                  <span>Catálogo Toy Store 2025 • Conexión Segura</span>
                </div>
              </>
            ) : (
              /* VISTAS MODULARES PARA OTRAS APPS DEL SISTEMA OPERATIVO */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                <div className="w-16 h-16 rounded-3xl bg-[#a6d4f2]/40 text-[#1e3a8a] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-1">
                  {appActiva === 'pedidos' && 'Módulo de Pedidos & Despachos'}
                  {appActiva === 'confesiones' && 'Módulo de Moderación de Confesiones'}
                  {appActiva === 'usuarios' && 'Módulo de Usuarios & Jugueteros'}
                </h2>
                <p className="text-xs text-slate-500 max-w-sm font-normal mb-6">
                  Este módulo de ToyOS 2025 se encuentra listo para vincular sus flujos de despacho y base de datos.
                </p>
                <button
                  onClick={() => setAppActiva('inventario')}
                  className="px-5 py-2.5 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Regresar a Inventario de Almacén
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================== */}
        {/* MODAL FICHA TÉCNICA DE PRODUCTO (ESTILO VENTANA DE SOFTWARE) */}
        {/* ========================================================== */}
        {mostrandoForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden animate-in zoom-in-95 duration-150">
              
              {/* Cabecera del modal */}
              <div className="h-10 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between select-none">
                <span className="text-xs font-bold text-[#1e3a8a]">
                  {editandoId ? 'Editar Juguete en Almacén' : 'Registrar Nuevo Juguete en Catálogo'}
                </span>
                <button
                  onClick={() => setMostrandoForm(false)}
                  className="w-6 h-6 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#1e3a8a] block">Nombre del Juguete</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej. Vibrador Cowgirl Deluxe"
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-[#a6d4f2] focus:ring-2 focus:ring-[#a6d4f2]/40 outline-none text-slate-800"
                    />
                  </div>

                  {/* Categoría */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#1e3a8a] block">Categoría</label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      required
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-[#a6d4f2] outline-none text-slate-800 bg-white cursor-pointer"
                    >
                      <option value="vibradores">Vibradores</option>
                      <option value="lencerias">Lencerías</option>
                      <option value="anales">Anales & Plugs</option>
                      <option value="kits">Kits & Cajas Sorpresa</option>
                      <option value="accesorios">Accesorios</option>
                      <option value="cosmeticos">Cosméticos & Aceites</option>
                    </select>
                  </div>

                  {/* Precio */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#1e3a8a] block">Precio en COP ($)</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="Ej. 185000"
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-[#a6d4f2] outline-none text-slate-800"
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#1e3a8a] block">Unidades en Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="Ej. 12"
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-[#a6d4f2] outline-none text-slate-800"
                    />
                  </div>
                </div>

                {/* Ruta de imagen */}
                <div className="space-y-1">
                  <label className="font-bold text-[#1e3a8a] block">Ruta o Imagen (PNG / URL)</label>
                  <input
                    type="text"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleInputChange}
                    placeholder="/images/vibrador_cowgirl.png"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-[#a6d4f2] outline-none text-slate-800 font-mono text-[11px]"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-1">
                  <label className="font-bold text-[#1e3a8a] block">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Descripción sutil y discreta del producto..."
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-[#a6d4f2] outline-none text-slate-800 resize-none font-normal"
                  />
                </div>

                {/* Botones de acción */}
                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMostrandoForm(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-bold cursor-pointer transition-all shadow-xs"
                  >
                    {editandoId ? 'Actualizar Ficha' : 'Guardar en Catálogo'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* 3. DOCK FLOTANTE INFERIOR DEL SISTEMA OPERATIVO (TOY-OS 2025) */}
      {/* ============================================================ */}
      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1.5">
        
        {/* App 1: Inventario */}
        <button 
          onClick={() => { setAppActiva('inventario'); setVentanaAbierta(true); }}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shadow-md relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
            ventanaAbierta && appActiva === 'inventario' ? 'bg-white text-[#1e3a8a]' : 'bg-white/70 hover:bg-white text-slate-700'
          }`}
          title="Almacén de Productos"
        >
          <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          {ventanaAbierta && appActiva === 'inventario' && (
            <span className="w-1 h-1 bg-[#1e3a8a] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* App 2: Pedidos */}
        <button 
          onClick={() => { setAppActiva('pedidos'); setVentanaAbierta(true); }}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shadow-md relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
            ventanaAbierta && appActiva === 'pedidos' ? 'bg-white text-[#1e3a8a]' : 'bg-white/70 hover:bg-white text-slate-700'
          }`}
          title="Gestión de Pedidos & Envíos"
        >
          <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {ventanaAbierta && appActiva === 'pedidos' && (
            <span className="w-1 h-1 bg-[#1e3a8a] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* App 3: Confesiones */}
        <button 
          onClick={() => { setAppActiva('confesiones'); setVentanaAbierta(true); }}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shadow-md relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
            ventanaAbierta && appActiva === 'confesiones' ? 'bg-white text-[#1e3a8a]' : 'bg-white/70 hover:bg-white text-slate-700'
          }`}
          title="Buzón de Confesiones"
        >
          <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {ventanaAbierta && appActiva === 'confesiones' && (
            <span className="w-1 h-1 bg-[#1e3a8a] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* App 4: Usuarios */}
        <button 
          onClick={() => { setAppActiva('usuarios'); setVentanaAbierta(true); }}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shadow-md relative group cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
            ventanaAbierta && appActiva === 'usuarios' ? 'bg-white text-[#1e3a8a]' : 'bg-white/70 hover:bg-white text-slate-700'
          }`}
          title="Directorio de Usuarios"
        >
          <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {ventanaAbierta && appActiva === 'usuarios' && (
            <span className="w-1 h-1 bg-[#1e3a8a] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* Separador */}
        <div className="w-px h-6 bg-white/30 mx-1"></div>

        {/* Salir a la habitación de Andy */}
        <button 
          onClick={() => navigate('/admin')}
          className="w-11 h-11 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center shadow-md relative group cursor-pointer transition-transform hover:scale-110 active:scale-95"
          title="Apagar computador y volver a la habitación de Andy"
        >
          <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      </footer>

    </div>
  );
}
