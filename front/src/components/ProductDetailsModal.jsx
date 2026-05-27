import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ToyTester from './ToyTester';

export default function ProductDetailsModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const auth = React.useContext(AuthContext);
  const { usuario } = auth || {};
  
  const [showTester, setShowTester] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    
    setIsSubmitting(true);
    
    const medals = [
      { name: 'Sheriff del Placer', icon: '🤠', color: 'bg-amber-100 text-amber-700' },
      { name: 'Explorador Galáctico', icon: '🚀', color: 'bg-purple-100 text-purple-700' },
      { name: 'Vaquero de Élite', icon: '⭐', color: 'bg-blue-100 text-blue-700' },
      { name: 'Centinela de la Noche', icon: '🌙', color: 'bg-indigo-100 text-indigo-700' }
    ];
    
    const randomMedal = medals[Math.floor(Math.random() * medals.length)];
    
    const reviewData = {
      usuario: usuario?.nombre || 'Vaquero Anónimo',
      texto: newReview,
      medalla: randomMedal.name,
      icono: randomMedal.icon,
      color: randomMedal.color
    };

    try {
      const res = await fetch(`/productos/${product.id}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (res.ok) {
        // Recargar reseñas
        fetchReviews();
        setNewReview('');
      }
    } catch (err) {
      console.error('Error al guardar reseña:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/productos/${product.id}/resenas`);
      if (res.ok) {
        const data = await res.json();
        setUserReviews(data);
      }
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    }
  };

  useEffect(() => {
    if (isOpen && product?.id) {
      fetchReviews();
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryEmoji = (cat) => {
    const map = { vibradores: '🍆', lencerias: '👙', anales: '🍑', kits: '📦', accesorios: '✨' };
    return map[cat] || '🎁';
  };

  const NivelBadge = ({ nivel }) => {
    const colors = ['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-red-600'];
    const labels = ['Suave', 'Moderado', 'Intenso', 'Extremo', 'Ultra'];
    const idx = Math.min(Math.max((nivel || 1) - 1, 0), 4);
    return (
      <span className={`${colors[idx]} text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm`}>
        {labels[idx]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#451a03]/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 border-8 border-white">
        
        {/* Lado Izquierdo: Imagen */}
        <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden flex items-center justify-center">
          {product.imagen_url ? (
            <img 
              src={product.imagen_url} 
              alt={product.nombre} 
              className="w-full h-full object-contain drop-shadow-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl">
              {getCategoryEmoji(product.categoria)}
            </div>
          )}
          
          <div className="absolute top-6 left-6">
            <NivelBadge nivel={product.nivel_juego} />
          </div>
          
          <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-2xl">
            {getCategoryEmoji(product.categoria)}
          </div>
        </div>

        {/* Lado Derecho: Info */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-2">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[4px]">
              {product.categoria}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-[1000] text-[#451a03] uppercase leading-none mb-6">
            {product.nombre}
          </h2>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl font-[1000] text-[#451a03]">
              {formatCOP(product.precio)}
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">COP</span>
          </div>

          <div className="prose prose-amber mb-8">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Descripción</h4>
            <p className="text-gray-700 font-medium leading-relaxed">
              {product.descripcion}
            </p>
          </div>

          {/* SUBSCRIPCIÓN PARA CONSUMIBLES */}
          {product.categoria === 'accesorios' && (
            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-100 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-[11px] font-black text-emerald-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="text-lg">🔄</span> Club de los Juguetes Olvidados
                </h4>
                <p className="text-[10px] font-bold text-emerald-600 leading-tight mb-4">
                  "Se te está acabando el aceite para la maquinaria, no queremos chirridos en la noche."
                </p>
                <div className="flex gap-2">
                  {[null, 30, 60].map(days => (
                    <button
                      key={days}
                      onClick={() => setSubscription(days)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                        ${subscription === days 
                          ? 'bg-emerald-500 text-white shadow-lg scale-105' 
                          : 'bg-white text-emerald-600 hover:bg-emerald-100'
                        }`}
                    >
                      {days ? `Cada ${days} días` : 'Compra Única'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-125 transition-transform duration-700">🛢️</div>
            </div>
          )}

          {/* TOY TESTER TRIGGER */}
          {product.dimensiones && (
            <button 
              onClick={() => setShowTester(true)}
              className="mb-8 flex items-center gap-3 text-amber-600 hover:text-amber-700 transition-colors group self-start"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">
                 📐
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-amber-200">Probar Talla Virtual</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">Compara con objetos reales</span>
              </div>
            </button>
          )}

          <div className="mt-auto flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                addToCart({ ...product, subscription });
                // Opcionalmente cerrar modal
              }}
              className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-black text-xs uppercase tracking-[3px] py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8l-1.5 6h13M8 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              Añadir al Carrito
            </button>
            
            <button 
              onClick={onClose}
              className="px-8 bg-gray-100 text-gray-600 font-black text-xs uppercase tracking-[2px] py-5 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Volver
            </button>
          </div>

          {/* SECCIÓN DE REVIEWS FUNCIONALES */}
          <div className="mt-12 pt-12 border-t-2 border-gray-100">
             <div className="flex items-center justify-between mb-8">
               <h4 className="text-sm font-black text-[#451a03] uppercase tracking-tighter">Reseñas de la Comunidad 🌟</h4>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 {userReviews.length} {userReviews.length === 1 ? 'comentario' : 'comentarios'}
               </span>
             </div>

             {/* Formulario de Review */}
             <form onSubmit={handleAddReview} className="mb-10 group">
                <div className="relative">
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Cuéntanos tu aventura... ¿Qué medalla te ganarás hoy?"
                    className="w-full p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 min-h-[120px] resize-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !newReview.trim()}
                    className="absolute bottom-4 right-4 bg-amber-500 text-white p-3 rounded-2xl shadow-lg hover:bg-amber-600 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                  >
                    <svg className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isSubmitting ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                      )}
                    </svg>
                  </button>
                </div>
             </form>
             
             <div className="space-y-6">
                {userReviews.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                    <span className="text-4xl block mb-3">🤠</span>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sé el primer vaquero en dejar su marca</p>
                  </div>
                ) : (
                  userReviews.map((rev, i) => (
                    <div key={rev.id || i} className="bg-gray-50 rounded-[2rem] p-6 relative animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 mb-3">
                         <span className="text-xs font-black text-gray-900">{rev.usuario}</span>
                         <span className={`${rev.color} text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1`}>
                           <span>{rev.icono}</span> {rev.medalla}
                         </span>
                         <span className="text-[8px] font-bold text-gray-300 ml-auto">
                           {new Date(rev.fecha).toLocaleDateString()}
                         </span>
                      </div>
                      <p className="text-[11px] font-medium text-gray-600 leading-relaxed">"{rev.texto}"</p>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>

      <ToyTester 
        product={product} 
        isOpen={showTester} 
        onClose={() => setShowTester(false)} 
      />
    </div>
  );
}
