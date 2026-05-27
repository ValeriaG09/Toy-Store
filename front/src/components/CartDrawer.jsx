import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart, checkout } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkout();
      onClose();
      // Redirigir a una página de "Pago" o "Resumen de Pedido"
      navigate(`/pagar/${data.id_pedido}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] pointer-events-none">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out pointer-events-auto flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8l-1.5 6h13M8 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-[1000] text-[#451a03] uppercase tracking-tight">Mi Carrito</h2>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <span className="text-6xl">🏜️</span>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Tu baúl está vacío, vaquero</p>
              <button 
                onClick={onClose}
                className="text-xs font-black text-amber-600 border-b-2 border-amber-600 pb-1 hover:text-amber-700 hover:border-amber-700 transition-all"
              >
                Ir a buscar tesoros
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border-2 border-gray-50 group-hover:border-amber-200 transition-colors">
                  {item.imagen_url ? (
                    <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl opacity-50">
                      🎁
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate pr-2">
                      {item.nombre}
                    </h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs font-bold text-amber-600 mb-3">{formatCOP(item.precio)}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-black text-gray-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Estimado</span>
              <span className="text-2xl font-[1000] text-[#451a03]">{formatCOP(totalPrice)}</span>
            </div>
            
            {error && (
              <p className="text-[10px] font-black text-red-500 uppercase text-center mb-4 bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                ⚠️ {error}
              </p>
            )}

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#451a03] text-white font-black text-xs uppercase tracking-[3px] py-5 rounded-2xl shadow-xl hover:bg-[#5d2506] active:scale-95 transition-all mb-3 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Preparando el envío...' : 'Finalizar Pedido'}
            </button>
            
            <button 
              onClick={clearCart}
              disabled={loading}
              className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors disabled:opacity-30"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
