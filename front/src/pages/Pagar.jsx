import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomWrapper from '../components/RoomWrapper';
import WoodyWallpaper from '../components/WoodyWallpaper';

export default function Pagar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí podrías cargar los detalles del pedido desde el backend si fuera necesario
    // Por ahora simulamos que tenemos el ID y el total
    setLoading(false);
  }, [id]);

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <RoomWrapper theme="woody" wallpaperContent={<WoodyWallpaper />} fullWallpaper={true}>
      <div className="min-h-screen flex items-center justify-center p-6 pt-32 pb-24 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-2xl border-[12px] border-blue-50 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
              💰
            </div>
            <h1 className="text-3xl font-[1000] text-[#451a03] uppercase tracking-tight mb-2">¡Casi es Tuyo!</h1>
            <p className="text-xs font-black text-amber-600 uppercase tracking-widest">Pedido #{id} • Pendiente de Pago</p>
          </div>

          <div className="bg-amber-50/50 rounded-[2rem] p-8 border-4 border-amber-100 mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-black text-amber-800 uppercase tracking-widest">Método Recomendado</span>
              <span className="bg-yellow-400 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm">RÁPIDO</span>
            </div>
            
            <div className="space-y-6">
              {/* Opción Nequi/Daviplata */}
              <div className="bg-white p-6 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center justify-between hover:border-amber-400 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📱</div>
                  <div>
                    <h4 className="font-black text-gray-900 uppercase text-sm">Transferencia Directa</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Nequi o Daviplata</p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </div>

              {/* Opción Tarjeta */}
              <div className="bg-white/50 p-6 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">💳</div>
                  <div>
                    <h4 className="font-black text-gray-400 uppercase text-sm">Tarjeta de Crédito</h4>
                    <p className="text-[10px] font-bold text-gray-300 uppercase">Próximamente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => {
                // Simular procesamiento
                const btn = document.getElementById('pay-btn');
                btn.innerText = 'Procesando Pago...';
                btn.disabled = true;
                setTimeout(() => {
                  navigate(`/confirmacion/${id}`);
                }, 2000);
              }}
              id="pay-btn"
              className="w-full bg-[#451a03] text-white font-black text-sm uppercase tracking-[4px] py-6 rounded-2xl shadow-xl hover:bg-[#5d2506] active:scale-95 transition-all disabled:opacity-50"
            >
              Pagar Ahora
            </button>
            <button 
              onClick={() => navigate('/tienda')}
              className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-amber-600 transition-colors"
            >
              Volver a la Tienda
            </button>
          </div>

          <div className="mt-12 pt-8 border-t-4 border-dashed border-gray-100 flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">🛡️</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pago 100% Seguro y Discreto</p>
          </div>

        </div>
      </div>
    </RoomWrapper>
  );
}
