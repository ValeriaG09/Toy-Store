import React, { useState } from 'react';

const ProductSidebar = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: 0,
    categoria: 'todos',
    nivelJuego: 'todos'
  });

  const categories = [
    { id: 'vibradores', label: 'VIBRADORES', class: 'bg-[#f06292]' },
    { id: 'anales', label: 'ANALES', class: 'bg-[#ec407a]' },
    { id: 'lencerias', label: 'LENCERÍA', class: 'bg-[#d81b60]' },
    { id: 'kits', label: 'KITS', class: 'bg-[#ad1457]' },
    { id: 'accesorios', label: 'ACCESORIOS', class: 'bg-[#880e4f]' }
  ];

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Global (Más transparente para notar lo de atrás) */}
      <div 
        className="absolute inset-0 z-[11000] bg-white/20 backdrop-blur-[6px] animate-in fade-in duration-700 min-h-full" 
        onClick={onClose}
      ></div>
      
      {/* Drawer Hamm - Maqueta Alcancía (Z-index superior al backdrop) */}
      <div className="absolute top-0 left-0 h-auto min-h-screen w-full lg:w-[85%] max-w-[1100px] z-[12000] flex animate-piggy-bounce">
        
        <div className="min-h-screen h-auto w-full bg-[#fce4ec] border-r-[12px] border-white shadow-[30px_0_70px_rgba(240,98,146,0.15)] flex flex-col relative overflow-hidden rounded-r-[120px]">
           
           {/* Ranura de Moneda (Decorativa Superior) */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-[#f06292] rounded-b-full shadow-inner opacity-20"></div>

           {/* Header - Hamm's Savings Box */}
           <div className="p-8 md:p-12 bg-white border-b-8 border-[#f8bbd0]/30 flex justify-between items-center z-20">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-[#f06292] rounded-full flex items-center justify-center text-white font-black text-3xl shadow-lg border-4 border-white rotate-6">H</div>
                 <div>
                    <h2 className="text-3xl md:text-4xl font-[1000] text-[#ad1457] italic uppercase tracking-tighter leading-none mb-1">
                       Filtro de búsqueda
                    </h2>
                    <p className="text-[10px] font-black text-[#f06292] uppercase tracking-[5px] opacity-60">Suministros de Hamm</p>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="w-14 h-14 bg-[#fdf2f8] hover:bg-[#ad1457] hover:text-white rounded-3xl flex items-center justify-center text-[#f06292] font-black text-3xl transition-all shadow-sm active:scale-90"
              >
                ×
              </button>
           </div>

           <div className="flex-1 flex flex-col md:flex-row h-auto">
              
              {/* FILTROS (Columna Hamm) */}
              <aside className="w-full md:w-[350px] bg-white/50 p-10 border-r-8 border-white/50 z-10 h-auto">
                 <h3 className="text-[11px] font-[1000] text-[#ad1457] uppercase tracking-[6px] mb-10 opacity-40">Configuración</h3>

                 {/* Precio Slider - Estilo Hamm */}
                 <div className="mb-12 p-6 bg-white rounded-[40px] shadow-sm border-4 border-[#fce4ec]">
                    <div className="flex justify-between items-center mb-5">
                       <label className="text-[10px] font-black text-[#ad1457] uppercase tracking-widest">Inversión Máx</label>
                       <div className="bg-[#ffca28] text-white px-3 py-1 rounded-full text-xs font-black shadow-sm">
                          {formatCOP(filters.maxPrice)}
                       </div>
                    </div>
                    <input 
                       type="range" min="0" max="500000" step="5000"
                       value={filters.maxPrice}
                       onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                       className="w-full h-3 bg-[#fce4ec] rounded-full appearance-none cursor-pointer accent-[#ffca28]"
                    />
                 </div>

                 {/* Nivel de Juego */}
                 <div className="mb-12">
                    <label className="text-[10px] font-black text-[#ad1457] uppercase tracking-[4px] block mb-6">Nivel de Intensidad</label>
                    <div className="space-y-4">
                       {['todos', 5, 4, 3, 2, 1].map(lvl => (
                          <label key={lvl} className="flex items-center gap-4 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                   type="radio" name="nivel"
                                   checked={filters.nivelJuego === (lvl === 'todos' ? 'todos' : lvl.toString())}
                                   onChange={() => setFilters(prev => ({ ...prev, nivelJuego: lvl.toString() }))}
                                   className="w-6 h-6 border-4 border-white bg-white checked:bg-[#ffca28] rounded-full appearance-none shadow-sm transition-all"
                                />
                             </div>
                             <span className={`text-xs font-black uppercase tracking-widest transition-colors ${filters.nivelJuego === lvl.toString() ? 'text-[#ad1457]' : 'text-[#f8bbd0]'}`}>
                                {lvl === 'todos' ? 'Catálogo General' : `Nivel ${lvl} o superior`}
                             </span>
                          </label>
                       ))}
                    </div>
                 </div>

                 {/* Categorías */}
                 <div>
                    <label className="text-[10px] font-black text-[#ad1457] uppercase tracking-[4px] block mb-6">Categorías de Ahorro</label>
                    <div className="space-y-5">
                       <label className="flex items-center gap-4 cursor-pointer">
                          <input type="checkbox" checked={filters.categoria === 'todos'} onChange={() => setFilters(prev => ({ ...prev, categoria: 'todos' }))} className="w-6 h-6 border-4 border-white bg-white checked:bg-[#f06292] rounded-xl appearance-none shadow-sm transition-all" />
                          <span className={`text-xs font-black uppercase tracking-widest ${filters.categoria === 'todos' ? 'text-[#ad1457]' : 'text-[#f8bbd0]'}`}>Todas las Secciones</span>
                       </label>
                       {categories.map(cat => (
                          <label key={cat.id} className="flex items-center gap-4 cursor-pointer">
                             <input type="checkbox" checked={filters.categoria === cat.id} onChange={() => setFilters(prev => ({ ...prev, categoria: cat.id }))} className="w-6 h-6 border-4 border-white bg-white checked:bg-[#f06292] rounded-xl appearance-none shadow-sm transition-all" />
                             <span className={`text-xs font-black uppercase tracking-widest ${filters.categoria === cat.id ? 'text-[#ad1457]' : 'text-[#f8bbd0]'}`}>{cat.label}</span>
                          </label>
                       ))}
                    </div>
                 </div>
              </aside>

              {/* RESULTADOS (Sección Vacía / Placeholder Temático) */}
              <main className="flex-1 p-12 flex flex-col items-center justify-center bg-[#fdf2f8]">
                 
                 <div className="relative animate-bounce">
                    {/* Silueta decorativa de Hamm simulada con círculos */}
                    <div className="w-48 h-36 bg-[#f8bbd0] rounded-[100px] border-8 border-white shadow-xl relative">
                       <div className="absolute top-1/2 left-4 w-6 h-4 bg-white/40 rounded-full"></div>
                       <div className="absolute top-1/2 right-4 w-6 h-4 bg-white/40 rounded-full"></div>
                    </div>
                    {/* Moneda dorada cayendo */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#ffca28] border-4 border-white rounded-full shadow-lg flex items-center justify-center font-black text-[#f06292]">$</div>
                 </div>

                 <div className="max-w-md text-center mt-12 bg-white p-10 rounded-[60px] border-8 border-white shadow-2xl relative">
                    {/* Rabo de Hamm decorativo */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 border-4 border-b-transparent border-l-transparent border-[#f8bbd0] rounded-full rotate-45"></div>
                    
                    <h2 className="text-3xl font-black text-[#ad1457] uppercase italic mb-4 leading-none">¡Oink! Estamos Guardando las Monedas</h2>
                    <p className="text-sm font-bold text-[#f48fb1] leading-relaxed uppercase tracking-tight">
                       Hamm está recolectando los mejores juguetes del cuarto de Andy para ti. El inventario se está sincronizando...
                    </p>
                    
                    <div className="mt-8 flex justify-center gap-2">
                       <div className="w-3 h-3 bg-[#f8bbd0] rounded-full animate-pulse"></div>
                       <div className="w-3 h-3 bg-[#f06292] rounded-full animate-pulse delay-75"></div>
                       <div className="w-3 h-3 bg-[#ad1457] rounded-full animate-pulse delay-150"></div>
                    </div>
                 </div>

                 <button 
                   onClick={onClose}
                   className="mt-10 text-[10px] font-black text-[#ad1457] uppercase tracking-[5px] hover:opacity-60 transition-opacity"
                 >
                    Seguir Explorando el Cuarto
                 </button>

              </main>

           </div>

        </div>

      </div>
    </>
  );
};

export default ProductSidebar;
