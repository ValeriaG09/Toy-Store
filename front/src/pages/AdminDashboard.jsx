import React from 'react';
import SpaceWrapper from '../components/SpaceWrapper';

/**
 * AdminDashboard: El centro de mando administrativo de la juguetería (Elite Edition).
 */
const AdminDashboard = () => {
  return (
    <SpaceWrapper>
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col items-center">
        
        {/* Espaciador superior (Más aire para el HUD) */}
        <div className="h-28"></div>

        {/* Título del Panel de Mando con Glitch */}
        <div className="text-center mb-16 space-y-3 relative group">
           <h1 className="text-5xl md:text-7xl font-black text-white hud-text uppercase tracking-tighter animate-glitch-text">
             Centro de Comando de Logística
           </h1>
           <p className="text-[11px] md:text-sm font-black text-lime-400/60 uppercase tracking-[10px] pl-2">
             Sector 12: Base Territorial Toy Store
           </p>
           {/* Adorno tecnológico bajo el título */}
           <div className="flex justify-center gap-2 mt-4">
              <div className="w-16 h-1 bg-lime-500/20 rounded-full"></div>
              <div className="w-4 h-1 bg-lime-500/50 rounded-full animate-pulse"></div>
              <div className="w-16 h-1 bg-lime-500/20 rounded-full"></div>
           </div>
        </div>

        {/* Módulos de Operación (Holographic Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-30">
          
          {/* Tarjeta: Inventario */}
          <div className="space-glass p-8 rounded-[40px] group cursor-pointer transition-all hover:-translate-y-2 hover:border-lime-500/40">
             {/* Esquinas Tácticas (Brackets) */}
             <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-lime-500/30"></div>
             <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-lime-500/30"></div>
             
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-lime-500/10 rounded-2xl flex items-center justify-center mb-6 border border-lime-500/20 shadow-[0_0_20px_rgba(163,230,53,0.1)] group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                   </svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">Inventario</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8">Suministros del Escuadrón Space Ranger</p>
                <button className="w-full py-4 bg-slate-900 border border-white/5 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-[4px] hover:bg-lime-500 hover:text-black transition-all">
                  Acceder al Almacén
                </button>
             </div>
          </div>

          {/* Tarjeta: Pedidos */}
          <div className="space-glass p-8 rounded-[40px] group cursor-pointer transition-all hover:-translate-y-2 hover:border-blue-500/40">
             {/* Esquinas Tácticas (Brackets) */}
             <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-blue-500/30"></div>
             <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-blue-500/30"></div>

             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                   </svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">Pedidos</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8">Rastreo de Cápsulas de Entrega</p>
                <button className="w-full py-4 bg-slate-900 border border-white/5 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-[4px] hover:bg-blue-500 hover:text-black transition-all">
                  Historial de Vuelo
                </button>
             </div>
          </div>

          {/* Tarjeta: Comunidad */}
          <div className="space-glass p-8 rounded-[40px] group cursor-pointer transition-all hover:-translate-y-2 hover:border-purple-500/40">
             {/* Esquinas Tácticas (Brackets) */}
             <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-purple-500/30"></div>
             <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-purple-500/30"></div>

             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)] group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                   </svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">Comunidad</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8">Base de Datos de Space Rangers</p>
                <button className="w-full py-4 bg-slate-900 border border-white/5 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-[4px] hover:bg-purple-500 hover:text-black transition-all">
                  Ver Soldados
                </button>
             </div>
          </div>

        </div>

        {/* Sección de Mensaje de Comando (Limpia - Elite Detail) */}
        <div className="mt-20 border-t border-dashed border-white/10 pt-12 w-full max-w-4xl text-center">
           <div className="flex justify-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              {['Status: 100%', 'Sync: Locked', 'Latency: 2ms', 'Buzz-Secure'].map(txt => (
                <div key={txt} className="flex flex-col items-center">
                   <span className="text-[7px] font-black text-lime-400 uppercase tracking-[3px]">{txt}</span>
                </div>
              ))}
           </div>
        </div>

      </div>
    </SpaceWrapper>
  );
};

export default AdminDashboard;
