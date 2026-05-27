import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ProductSidebar = ({ isOpen, onClose, onApplyFilters }) => {
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: 500000,
    categoria: 'todos',
    nivelJuego: 'todos'
  });
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProductos();
    }
  }, [filters, isOpen]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.categoria !== 'todos') params.set('cat', filters.categoria);
      if (filters.maxPrice > 0) params.set('maxPrice', filters.maxPrice);
      if (filters.nivelJuego !== 'todos') params.set('nivelJuego', filters.nivelJuego);
      
      const res = await fetch(`/productos?${params.toString()}`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error fetching products in sidebar", err);
    } finally {
      setLoading(false);
    }
  };

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

  const getCategoryEmoji = (cat) => {
    const map = { vibradores: '🍆', lencerias: '👙', anales: '🍑', kits: '📦', accesorios: '✨' };
    return map[cat] || '🎁';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Global */}
      <div 
        className="fixed inset-0 z-[11000] bg-black/40 backdrop-blur-[6px] animate-in fade-in duration-700" 
        onClick={onClose}
      ></div>
      
      {/* Drawer Hamm - Maqueta Alcancía */}
      <div className="fixed top-0 left-0 h-screen w-full lg:w-[95%] max-w-[1400px] z-[12000] flex animate-piggy-bounce">
        
        <div className="h-full w-full bg-[#fce4ec] border-r-[12px] border-white shadow-[30px_0_70px_rgba(240,98,146,0.15)] flex flex-col relative overflow-hidden rounded-r-[120px]">
           
           {/* Ranura de Moneda */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-[#f06292] rounded-b-full shadow-inner opacity-20"></div>

           {/* Header */}
           <div className="p-6 md:p-8 bg-white border-b-8 border-[#f8bbd0]/30 flex justify-between items-center z-20">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-[#f06292] rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg border-4 border-white rotate-6">H</div>
                 <div>
                    <h2 className="text-2xl md:text-3xl font-[1000] text-[#ad1457] italic uppercase tracking-tighter leading-none mb-1">
                       Filtro de búsqueda
                    </h2>
                    <p className="text-[9px] font-black text-[#f06292] uppercase tracking-[5px] opacity-60">Suministros de Hamm</p>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-[#fdf2f8] hover:bg-[#ad1457] hover:text-white rounded-2xl flex items-center justify-center text-[#f06292] font-black text-2xl transition-all shadow-sm active:scale-90"
              >
                ×
              </button>
           </div>

           <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* FILTROS */}
              <aside className="w-full md:w-[320px] bg-white/50 p-8 border-r-8 border-white/50 z-10 overflow-y-auto">
                 <h3 className="text-[10px] font-[1000] text-[#ad1457] uppercase tracking-[6px] mb-8 opacity-40">Configuración</h3>

                 {/* Precio Slider */}
                 <div className="mb-10 p-5 bg-white rounded-[35px] shadow-sm border-4 border-[#fce4ec]">
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-[9px] font-black text-[#ad1457] uppercase tracking-widest">Inversión Máx</label>
                       <div className="bg-[#ffca28] text-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm">
                          {formatCOP(filters.maxPrice)}
                       </div>
                    </div>
                    <input 
                       type="range" min="0" max="500000" step="5000"
                       value={filters.maxPrice}
                       onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                       className="w-full h-2 bg-[#fce4ec] rounded-full appearance-none cursor-pointer accent-[#ffca28]"
                    />
                 </div>

                 {/* Nivel de Juego */}
                 <div className="mb-10">
                    <label className="text-[9px] font-black text-[#ad1457] uppercase tracking-[4px] block mb-5">Nivel de Intensidad</label>
                    <div className="space-y-3">
                       {['todos', 5, 4, 3, 2, 1].map(lvl => (
                          <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                             <input 
                                type="radio" name="nivel"
                                checked={filters.nivelJuego === (lvl === 'todos' ? 'todos' : lvl.toString())}
                                onChange={() => setFilters(prev => ({ ...prev, nivelJuego: lvl.toString() }))}
                                className="w-5 h-5 border-4 border-white bg-white checked:bg-[#ffca28] rounded-full appearance-none shadow-sm transition-all"
                             />
                             <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${filters.nivelJuego === lvl.toString() ? 'text-[#ad1457]' : 'text-[#f8bbd0]'}`}>
                                {lvl === 'todos' ? 'Catálogo General' : `Nivel ${lvl} o superior`}
                             </span>
                          </label>
                       ))}
                    </div>
                 </div>

                 {/* Categorías */}
                 <div className="mb-8">
                    <label className="text-[9px] font-black text-[#ad1457] uppercase tracking-[4px] block mb-5">Categorías de Ahorro</label>
                    <div className="space-y-4">
                       <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="cat" checked={filters.categoria === 'todos'} onChange={() => setFilters(prev => ({ ...prev, categoria: 'todos' }))} className="w-5 h-5 border-4 border-white bg-white checked:bg-[#f06292] rounded-xl appearance-none shadow-sm transition-all" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${filters.categoria === 'todos' ? 'text-[#ad1457]' : 'text-[#f8bbd0]'}`}>Todas</span>
                       </label>
                       {categories.map(cat => (
                          <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                             <input type="radio" name="cat" checked={filters.categoria === cat.id} onChange={() => setFilters(prev => ({ ...prev, categoria: cat.id }))} className="w-5 h-5 border-4 border-white bg-white checked:bg-[#f06292] rounded-xl appearance-none shadow-sm transition-all" />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${filters.categoria === cat.id ? 'text-[#ad1457]' : 'text-[#f8bbd0]'}`}>{cat.label}</span>
                          </label>
                       ))}
                    </div>
                 </div>

                 <button 
                    onClick={() => {
                      if (onApplyFilters) onApplyFilters(filters);
                      onClose();
                    }}
                    className="w-full bg-[#ad1457] text-white text-[10px] font-black uppercase tracking-[3px] py-4 rounded-2xl shadow-lg hover:scale-105 transition-all active:scale-95 mb-10"
                  >
                     Ir a la Tienda Full
                  </button>
              </aside>

              {/* RESULTADOS REALES */}
              <main className="flex-1 p-8 flex flex-col bg-[#fdf2f8] overflow-y-auto">
                 
                 {loading ? (
                   <div className="flex-1 flex flex-col items-center justify-center">
                     <div className="w-16 h-16 bg-[#f8bbd0] rounded-full animate-bounce flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                     </div>
                     <p className="mt-4 text-xs font-black text-[#ad1457] uppercase tracking-[3px]">Hamm está buscando...</p>
                   </div>
                 ) : productos.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="text-6xl mb-6">🐷💤</div>
                      <h2 className="text-2xl font-black text-[#ad1457] uppercase italic mb-2">¡Oink! El Baúl está vacío</h2>
                      <p className="text-[10px] font-bold text-[#f48fb1] uppercase tracking-widest max-w-xs">
                        No hay juguetes que coincidan con estos ahorros. Prueba ajustando tu inversión.
                      </p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productos.map(p => (
                        <div key={p.id} className="bg-white rounded-[30px] p-4 shadow-sm border-4 border-transparent hover:border-[#f06292] transition-all group">
                           <div className="aspect-square bg-[#fdf2f8] rounded-[20px] mb-3 flex items-center justify-center overflow-hidden relative">
                              {p.imagen_url ? (
                                <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              ) : (
                                <span className="text-4xl">{getCategoryEmoji(p.categoria)}</span>
                              )}
                              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-[8px] font-black text-[#ad1457] uppercase">
                                 Nivel {p.nivel_juego}
                              </div>
                           </div>
                           <h4 className="text-[10px] font-black text-[#ad1457] uppercase truncate mb-1">{p.nombre}</h4>
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-[1000] text-[#ad1457]">{formatCOP(p.precio)}</span>
                              <button 
                                onClick={() => addToCart(p)}
                                className="w-8 h-8 bg-[#ffca28] text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                              >
                                +
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}

              </main>

           </div>

        </div>

      </div>
    </>
  );
};

export default ProductSidebar;
