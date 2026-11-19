import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('todos');

  const categories = [
    { id: 'todos', label: 'Todos los juguetes' },
    { id: 'vibradores', label: 'Vibradores' },
    { id: 'lencerias', label: 'Lencería' },
    { id: 'plugs', label: 'Plugs y Joyas' },
    { id: 'kits', label: 'Cajas Sorpresa & Kits' },
    { id: 'aceites', label: 'Aceites & Sensaciones' }
  ];

  const featuredProducts = [
    {
      id: 1,
      nombre: 'Vibrador Cowgirl Deluxe',
      cat: 'vibradores',
      precio: 185000,
      img: '/images/vibrador_cowgirl.png'
    },
    {
      id: 2,
      nombre: 'Lencería Cowgirl Jessie',
      cat: 'lencerias',
      precio: 145000,
      img: '/images/jessy_heart.png'
    },
    {
      id: 3,
      nombre: 'Plug Anal Joya Buzz',
      cat: 'plugs',
      precio: 95000,
      img: '/images/plug_anal.png'
    },
    {
      id: 4,
      nombre: 'Caja Sorpresa Mystery Box',
      cat: 'kits',
      precio: 220000,
      img: '/images/mystery_box.png'
    },
    {
      id: 5,
      nombre: 'Lubricante Térmico Fresa',
      cat: 'aceites',
      precio: 48000,
      img: '/images/toy_vibrator.png'
    },
    {
      id: 6,
      nombre: 'Lencería Andy Romance',
      cat: 'lencerias',
      precio: 135000,
      img: '/images/lenceria_andy.png'
    }
  ];

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (!isOpen) return null;

  const filtered = featuredProducts.filter(p => {
    const matchCat = selectedCat === 'todos' || p.cat === selectedCat;
    const matchSearch = !searchTerm.trim() || p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed top-0 left-0 w-[360px] h-screen bg-white border-r border-[#e9e9e9] z-[250] flex flex-col select-none overflow-hidden transition-all duration-300 text-left shadow-[10px_0_30px_rgba(0,0,0,0.06)]">
      
      {/* Cabecera minimalista y limpia */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0 bg-white">
        <div>
          <h2 className="text-xl font-bold text-[#1e3a8a] tracking-tight leading-tight">
            Buscar por Categoría
          </h2>
          <p className="text-xs text-[#717171] font-normal mt-0.5">
            Explora las colecciones de Toy Store
          </p>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#111111] transition-colors cursor-pointer text-base font-bold flex-shrink-0"
          title="Cerrar panel"
        >
          ✕
        </button>
      </div>

      {/* Contenido con scroll elegante */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
        
        {/* Buscador minimalista tipo Pinterest */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full text-xs py-2.5 pl-9 pr-8 rounded-full bg-gray-100 hover:bg-gray-200/60 focus:bg-white focus:ring-2 focus:ring-[#a6d4f2] outline-none text-[#111111] transition-all font-normal"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-current fill-none" strokeWidth="2.2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-[10px] font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categorías en píldoras refinadas */}
        <div>
          <span className="text-[11px] font-bold text-[#1e3a8a] uppercase tracking-wider block mb-2 px-1">
            Categorías
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => {
              const isSelected = selectedCat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCat(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#a6d4f2] text-[#1e3a8a] font-bold shadow-2xs'
                      : 'bg-gray-100 hover:bg-gray-200/70 text-[#111111] font-normal'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Productos sugeridos en tarjetas visuales de 2 columnas limpias */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-bold text-[#1e3a8a] uppercase tracking-wider">
              Productos ({filtered.length})
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#717171] font-normal">
              No se encontraron juguetes en esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onClose();
                    navigate(`/tienda?buscar=${encodeURIComponent(prod.nombre)}`);
                  }}
                  className="rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-sky-50/50 p-2.5 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-xs group"
                >
                  <div className="w-full h-24 rounded-xl bg-white flex items-center justify-center p-2 mb-2 shadow-2xs group-hover:scale-105 transition-transform">
                    <img
                      src={prod.img}
                      alt={prod.nombre}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-[#1e3a8a] line-clamp-1 w-full">
                    {prod.nombre}
                  </h4>
                  <span className="text-[11px] font-semibold text-[#1e3a8a] mt-1">
                    {formatCOP(prod.precio)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Botón inferior fijo a la tienda */}
      <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/tienda');
          }}
          className="w-full py-2.5 rounded-full bg-[#a6d4f2] hover:bg-[#8ec2e4] text-[#1e3a8a] font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
        >
          Ver todo el catálogo en Tienda
        </button>
      </div>

    </div>
  );
}
