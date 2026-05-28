import React, { useEffect, useState } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import WoodyWallpaper from '../components/WoodyWallpaper';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/pedidos/mis-pedidos')
      .then(res => res.json())
      .then(data => {
        setPedidos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar pedidos:', err);
        setLoading(false);
      });
  }, []);

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'entregado': return 'bg-green-100 text-green-700';
      case 'pendiente': return 'bg-amber-100 text-amber-700';
      case 'cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <RoomWrapper theme="woody" wallpaperContent={<WoodyWallpaper />} fullWallpaper={true}>
      <div className="min-h-screen p-4 md:p-6 pt-20 md:pt-32 pb-24 relative z-10 max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-[3rem] shadow-2xl border-8 border-white">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-[1000] text-[#451a03] uppercase tracking-tighter">Mis Pedidos</h1>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-[4px]">El historial de tu baúl</p>
            </div>
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
              📜
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center animate-pulse">
               <span className="text-4xl">🚀</span>
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-4">Buscando en los archivos de Andy...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-100">
               <span className="text-5xl block mb-4">🌵</span>
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No has realizado ningún pedido aún</p>
               <button 
                 onClick={() => window.location.href = '/tienda'}
                 className="mt-6 text-xs font-black text-amber-600 border-b-2 border-amber-600 pb-1"
               >
                 Ir a la Tienda
               </button>
            </div>
          ) : (
            <div className="space-y-6">
              {pedidos.map((p) => (
                <div key={p.id_pedido} className="bg-white p-6 rounded-3xl border-2 border-gray-50 shadow-sm hover:shadow-md hover:border-amber-100 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📦</div>
                      <div>
                        <h4 className="font-black text-[#451a03] uppercase text-sm">Pedido #{p.id_pedido}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(p.fecha).toLocaleDateString()} a las {new Date(p.fecha).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-right">
                        <p className="text-sm font-[1000] text-[#451a03]">{formatCOP(p.total)}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Pagado</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(p.estado)}`}>
                        {p.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 pt-8 border-t-4 border-dashed border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
             <p>Gracias por ser parte de Toy Store</p>
             <p>© 2024</p>
          </div>

        </div>
      </div>
    </RoomWrapper>
  );
}
