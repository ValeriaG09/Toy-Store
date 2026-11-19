import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ChatbotWidget from '../components/ChatbotWidget';

export default function Carrito() {
  const { usuario, esAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Productos en el carrito (recupera de localStorage o inicializa con selección)
  const [itemsCarrito, setItemsCarrito] = useState(() => {
    try {
      const stored = localStorage.getItem('toy_carrito');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 1,
        nombre: 'Vibrador Cowgirl Deluxe',
        categoria: 'Vibradores',
        precio: 120000,
        cantidad: 1,
        imagen: '/images/vibrador_cowgirl.png'
      },
      {
        id: 2,
        nombre: 'Lencería Cowgirl de Jessie',
        categoria: 'Lencería',
        precio: 85000,
        cantidad: 1,
        imagen: '/images/lenceria_andy.png'
      }
    ];
  });

  const [pasoActual, setPasoActual] = useState(1); // 1: Carrito, 2: Facturación, 3: Pago
  const [empaqueDiscreto, setEmpaqueDiscreto] = useState(true);
  const [metodoPago, setMetodoPago] = useState('wompi'); // 'wompi' | 'pse' | 'tarjeta' | 'contraentrega'

  // Datos de facturación
  const [facturacion, setFacturacion] = useState({
    nombreCompleto: usuario?.nombre || 'Mariana Alvarez',
    documento: '1098765432',
    tipoDocumento: 'CC',
    email: usuario?.email || 'mfranco090393@gmail.com',
    telefono: '3104567890',
    direccion: 'Carrera 45 # 12-34, Apto 502',
    ciudad: 'Medellín',
    departamento: 'Antioquia',
    notasEntrega: 'Entregar en portería con empaque 100% sellado y discreto.'
  });

  const [toastMensaje, setToastMensaje] = useState('');

  const showToast = (msg) => {
    setToastMensaje(msg);
    setTimeout(() => setToastMensaje(''), 2500);
  };

  const modificarCantidad = (id, delta) => {
    setItemsCarrito(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const nuevaCantidad = Math.max(1, item.cantidad + delta);
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      });
      try {
        localStorage.setItem('toy_carrito', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const eliminarItem = (id) => {
    setItemsCarrito(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('toy_carrito', JSON.stringify(updated));
      } catch (e) {}
      showToast('Producto retirado del carrito.');
      return updated;
    });
  };

  // Cálculos financieros
  const subtotal = itemsCarrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const envio = subtotal > 100000 ? 0 : 12000;
  const descuento = subtotal > 150000 ? 15000 : 0;
  const total = Math.max(0, subtotal + envio - descuento);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#111111] flex flex-col font-sans select-none">
      
      {/* Toast flotante */}
      {toastMensaje && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#1e3a8a] text-white text-sm font-medium px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2">
            <svg className="w-5 h-5 text-[#a6d4f2]" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMensaje}</span>
          </div>
        </div>
      )}

      {/* Cabecera / Barra de Navegación Oficial Toy Store */}
      <Navbar />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-20">
        
        {/* Banner de Estado del Módulo */}
        <div className="mb-8 bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-[#a6d4f2]/70 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#a6d4f2]/40 text-[#1e3a8a] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1e3a8a]">
                  Facturación, Pago y Carrito de Compras
                </h1>
                <span className="text-[11px] font-semibold bg-[#a6d4f2] text-[#1e3a8a] px-2.5 py-0.5 rounded-full">
                  En diseño
                </span>
              </div>
              <p className="text-xs text-[#555555] mt-0.5">
                Página dedicada para la emisión de factura electrónica, liquidación de impuestos y pasarela de pago seguro.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/tienda')}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-[#1e3a8a] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs self-start sm:self-auto"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver a la Tienda</span>
          </button>
        </div>

        {/* Indicador de Pasos Tipo Checkout */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-0"></div>
            
            {/* Paso 1 */}
            <button
              onClick={() => setPasoActual(1)}
              className={`relative z-10 flex flex-col items-center cursor-pointer transition-all ${pasoActual === 1 ? 'scale-105' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                pasoActual === 1 
                  ? 'bg-[#1e3a8a] text-white ring-4 ring-[#a6d4f2]/50 shadow-md' 
                  : pasoActual > 1 
                    ? 'bg-[#a6d4f2] text-[#1e3a8a]' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}>
                1
              </div>
              <span className={`text-xs font-medium mt-1.5 ${pasoActual === 1 ? 'text-[#1e3a8a] font-bold' : 'text-[#717171]'}`}>
                Tu Carrito
              </span>
            </button>

            {/* Paso 2 */}
            <button
              onClick={() => setPasoActual(2)}
              className={`relative z-10 flex flex-col items-center cursor-pointer transition-all ${pasoActual === 2 ? 'scale-105' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                pasoActual === 2 
                  ? 'bg-[#1e3a8a] text-white ring-4 ring-[#a6d4f2]/50 shadow-md' 
                  : pasoActual > 2 
                    ? 'bg-[#a6d4f2] text-[#1e3a8a]' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}>
                2
              </div>
              <span className={`text-xs font-medium mt-1.5 ${pasoActual === 2 ? 'text-[#1e3a8a] font-bold' : 'text-[#717171]'}`}>
                Datos de Factura
              </span>
            </button>

            {/* Paso 3 */}
            <button
              onClick={() => setPasoActual(3)}
              className={`relative z-10 flex flex-col items-center cursor-pointer transition-all ${pasoActual === 3 ? 'scale-105' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                pasoActual === 3 
                  ? 'bg-[#1e3a8a] text-white ring-4 ring-[#a6d4f2]/50 shadow-md' 
                  : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}>
                3
              </div>
              <span className={`text-xs font-medium mt-1.5 ${pasoActual === 3 ? 'text-[#1e3a8a] font-bold' : 'text-[#717171]'}`}>
                Pago Seguro
              </span>
            </button>
          </div>
        </div>

        {/* Contenido en 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA (Paso 1, 2 o 3) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* PASO 1: LISTADO DE PRODUCTOS EN EL CARRITO */}
            {pasoActual === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <h2 className="text-xl font-bold text-[#111111]">
                    Juguetes en tu pedido ({itemsCarrito.reduce((a, b) => a + b.cantidad, 0)})
                  </h2>
                  <button 
                    onClick={() => navigate('/tienda')}
                    className="text-xs font-semibold text-[#1e3a8a] hover:underline cursor-pointer"
                  >
                    + Agregar más juguetes
                  </button>
                </div>

                {itemsCarrito.length === 0 ? (
                  <div className="py-12 text-center text-[#717171]">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <svg className="w-8 h-8 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="9" cy="20" r="1.5" />
                        <circle cx="18" cy="20" r="1.5" />
                        <path d="M1 2.5h3.5l2.6 11.5a2 2 0 0 0 2 1.5h8.6a2 2 0 0 0 2-1.5L21.5 6.5H5.2" />
                      </svg>
                    </div>
                    <p className="text-base font-medium text-[#111111]">Tu carrito está actualmente vacío</p>
                    <p className="text-xs mt-1">Explora nuestro catálogo para descubrir nuevas sensaciones.</p>
                    <button
                      onClick={() => navigate('/tienda')}
                      className="mt-5 px-6 py-2.5 rounded-full bg-[#a6d4f2] text-[#1e3a8a] font-semibold text-xs transition-all hover:bg-[#8ec2e4] cursor-pointer"
                    >
                      Ir a la Tienda
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itemsCarrito.map(item => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-xl bg-white p-2 border border-gray-200/60 flex-shrink-0 flex items-center justify-center">
                          <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-[#1e3a8a] uppercase tracking-wider block">
                            {item.categoria}
                          </span>
                          <h4 className="text-sm font-bold text-[#111111] truncate">
                            {item.nombre}
                          </h4>
                          <span className="text-xs text-[#555555] font-semibold block mt-0.5">
                            ${Number(item.precio).toLocaleString('es-CO')} COP
                          </span>
                        </div>

                        {/* Control de cantidad */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-gray-200 bg-white rounded-full px-2 py-1 shadow-2xs">
                            <button
                              onClick={() => modificarCantidad(item.id, -1)}
                              className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-[#111111] cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-[#111111]">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => modificarCantidad(item.id, 1)}
                              className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-[#111111] cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => eliminarItem(item.id)}
                            className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                            title="Quitar"
                          >
                            <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setPasoActual(2)}
                        className="px-7 py-3 rounded-full bg-[#1e3a8a] hover:bg-[#162c6d] text-white font-semibold text-sm transition-all active:scale-95 cursor-pointer shadow-md flex items-center gap-2"
                      >
                        <span>Continuar a Facturación</span>
                        <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PASO 2: DATOS DE FACTURACIÓN Y ENVÍO */}
            {pasoActual === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs animate-in fade-in duration-200">
                <div className="pb-4 border-b border-gray-100 mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#111111]">
                      Información de Facturación Electrónica
                    </h2>
                    <p className="text-xs text-[#717171] mt-0.5">
                      Los datos para generar el documento tributario y la guía de despacho.
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-[#a6d4f2]/30 text-[#1e3a8a] flex items-center justify-center">
                    <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1.5">
                      Nombre o Razón Social
                    </label>
                    <input
                      type="text"
                      value={facturacion.nombreCompleto}
                      onChange={(e) => setFacturacion({ ...facturacion, nombreCompleto: e.target.value })}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1.5">
                      Número de Identificación (CC / NIT)
                    </label>
                    <input
                      type="text"
                      value={facturacion.documento}
                      onChange={(e) => setFacturacion({ ...facturacion, documento: e.target.value })}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1.5">
                      Correo Electrónico (Factura Digital)
                    </label>
                    <input
                      type="email"
                      value={facturacion.email}
                      onChange={(e) => setFacturacion({ ...facturacion, email: e.target.value })}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1.5">
                      Teléfono Celular
                    </label>
                    <input
                      type="tel"
                      value={facturacion.telefono}
                      onChange={(e) => setFacturacion({ ...facturacion, telefono: e.target.value })}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#111111] block mb-1.5">
                      Dirección de Entrega
                    </label>
                    <input
                      type="text"
                      value={facturacion.direccion}
                      onChange={(e) => setFacturacion({ ...facturacion, direccion: e.target.value })}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1.5">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={facturacion.ciudad}
                      onChange={(e) => setFacturacion({ ...facturacion, ciudad: e.target.value })}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#111111] block mb-1.5">
                      Departamento
                    </label>
                    <input
                      type="text"
                      value={facturacion.departamento}
                      onChange={(e) => setFacturacion({ ...facturacion, departamento: e.target.value })}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111]"
                    />
                  </div>
                </div>

                {/* Opción Empaque Discreto Garantizado */}
                <div className="mt-6 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="chk-empaque"
                    checked={empaqueDiscreto}
                    onChange={(e) => setEmpaqueDiscreto(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1e3a8a] focus:ring-[#a6d4f2] mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="chk-empaque" className="text-xs cursor-pointer">
                    <span className="font-bold text-[#1e3a8a] block">Empaque 100% Discreto Oficial Toy Store</span>
                    <span className="text-[#555555]">Caja café sellada sin logos ni descripciones de contenido sexual en la etiqueta. Privacidad total garantizada.</span>
                  </label>
                </div>

                <div className="pt-6 flex justify-between items-center">
                  <button
                    onClick={() => setPasoActual(1)}
                    className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#111111] transition-all cursor-pointer"
                  >
                    ← Volver al Carrito
                  </button>
                  <button
                    onClick={() => setPasoActual(3)}
                    className="px-7 py-3 rounded-full bg-[#1e3a8a] hover:bg-[#162c6d] text-white font-semibold text-sm transition-all active:scale-95 cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <span>Proceder al Pago</span>
                    <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: PASARELA DE PAGO */}
            {pasoActual === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs animate-in fade-in duration-200">
                <div className="pb-4 border-b border-gray-100 mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#111111]">
                      Método de Pago Seguro
                    </h2>
                    <p className="text-xs text-[#717171] mt-0.5">
                      Transacciones encriptadas de alta seguridad para tu total tranquilidad.
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'wompi', nombre: 'Wompi Bancolombia', desc: 'Tarjetas, Nequi, QR y Botón Bancolombia' },
                    { id: 'pse', nombre: 'PSE (Transferencia Bancaria)', desc: 'Débito desde cualquier cuenta de banco colombiana' },
                    { id: 'tarjeta', nombre: 'Tarjeta de Crédito / Débito', desc: 'Visa, Mastercard, American Express' },
                    { id: 'contraentrega', nombre: 'Pago Contra Entrega', desc: 'Paga en efectivo al recibir tu paquete sellado' }
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setMetodoPago(m.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        metodoPago === m.id
                          ? 'border-[#1e3a8a] bg-sky-50/50 ring-2 ring-[#a6d4f2]/60'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#111111]">{m.nombre}</h4>
                        <p className="text-[11px] text-[#717171] mt-0.5">{m.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        metodoPago === m.id ? 'border-[#1e3a8a] bg-[#1e3a8a]' : 'border-gray-300'
                      }`}>
                        {metodoPago === m.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-600 stroke-current flex-shrink-0" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="text-xs font-bold text-amber-900">
                      Módulo de pasarela en proceso de integración visual
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Esta pantalla se encuentra en etapa de diseño preliminar según requerimiento. Al completar el diseño definitivo se conectará con el API de recaudo real.
                  </p>
                </div>

                <div className="pt-6 flex justify-between items-center">
                  <button
                    onClick={() => setPasoActual(2)}
                    className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#111111] transition-all cursor-pointer"
                  >
                    ← Volver a Facturación
                  </button>
                  <button
                    onClick={() => showToast('¡Simulación de pedido registrada con éxito!')}
                    className="px-8 py-3.5 rounded-full bg-[#1e3a8a] hover:bg-[#162c6d] text-white font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-lg flex items-center gap-2"
                  >
                    <span>Finalizar y Pagar (${total.toLocaleString('es-CO')} COP)</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* COLUMNA DERECHA: RESUMEN DE COMPRA Y FACTURA */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs sticky top-36">
              <h3 className="text-lg font-bold text-[#111111] pb-3 border-b border-gray-100 mb-4 flex items-center justify-between">
                <span>Resumen de la Factura</span>
                <span className="text-xs font-semibold text-[#1e3a8a] bg-[#a6d4f2]/30 px-2.5 py-1 rounded-full">
                  Discreto
                </span>
              </h3>

              <div className="space-y-2.5 text-xs text-[#555555] pb-4 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal productos</span>
                  <span className="font-semibold text-[#111111]">${subtotal.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío discreto</span>
                  <span className="font-semibold text-[#111111]">
                    {envio === 0 ? <span className="text-emerald-600 font-bold">¡Gratis!</span> : `$${envio.toLocaleString('es-CO')} COP`}
                  </span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Descuento especial</span>
                    <span>-${descuento.toLocaleString('es-CO')} COP</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-[#717171]">
                  <span>IVA incluido (19%)</span>
                  <span>${Math.round(total * 0.19 / 1.19).toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              <div className="pt-4 pb-4 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-[#111111] block">Total a Pagar</span>
                  <span className="text-[10px] text-[#717171]">Moneda legal colombiana (COP)</span>
                </div>
                <span className="text-2xl font-black text-[#1e3a8a]">
                  ${total.toLocaleString('es-CO')}
                </span>
              </div>

              {/* Sellos de Confianza */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-[#555555]">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 stroke-current flex-shrink-0" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Compra 100% protegida y confidencial</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#1e3a8a] stroke-current flex-shrink-0" fill="none" strokeWidth="2.3" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>Empaque exterior neutral sin distintivos</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      <ChatbotWidget />
    </div>
  );
}
