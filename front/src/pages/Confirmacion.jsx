import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RoomWrapper from '../components/RoomWrapper';
import WoodyWallpaper from '../components/WoodyWallpaper';

export default function Confirmacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simular confeti o algo visual si se desea (usando CSS puro)
  
  return (
    <RoomWrapper theme="andy" wallpaperContent={<WoodyWallpaper />} fullWallpaper={true}>
      <div className="min-h-screen flex items-center justify-center p-6 pt-32 pb-24 relative z-10">
        <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] w-full max-w-2xl border-[15px] border-amber-50 text-center animate-in zoom-in-90 duration-700">
          
          <div className="relative mb-12">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Chispas visuales */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 border-4 border-dashed border-green-200 rounded-full animate-[spin_10s_linear_infinite] opacity-50"></div>
          </div>

          <h1 className="text-4xl font-[1000] text-[#451a03] uppercase tracking-tighter mb-4">
            ¡Misión Cumplida, Vaquero!
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-[4px] mb-8">
            Tu pedido <span className="text-amber-600">#{id}</span> ha sido confirmado
          </p>

          <div className="bg-green-50 rounded-3xl p-8 border-2 border-green-100 mb-10">
            <p className="text-[11px] font-black text-green-700 uppercase leading-relaxed">
              "¡Hay un amigo en ti! Tus tesoros están siendo empacados con todo el cuidado del mundo. Hamm ya guardó el cambio en la alcancía y Buzz está preparando el cohete para el envío."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/tienda')}
              className="bg-[#451a03] text-white font-black text-xs uppercase tracking-[3px] py-5 rounded-2xl shadow-lg hover:bg-[#5d2506] transition-all"
            >
              Seguir Comprando
            </button>
            <button 
              onClick={() => navigate('/mis-pedidos')} 
              className="bg-white border-4 border-amber-100 text-amber-800 font-black text-xs uppercase tracking-[3px] py-5 rounded-2xl hover:bg-amber-50 transition-all"
            >
              Ver Mis Pedidos
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 opacity-30 grayscale">
             <span className="text-2xl">📦</span>
             <span className="text-2xl">🚀</span>
             <span className="text-2xl">🤠</span>
             <span className="text-2xl">🐷</span>
          </div>

        </div>
      </div>

      {/* Confeti CSS Simple */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #ffd700;
          top: -20px;
          z-index: 50;
          animation: confetti 4s linear infinite;
        }
      `}} />
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="confetti-piece"
          style={{ 
            left: `${Math.random() * 100}vw`, 
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: ['#ffeb3b', '#f44336', '#2196f3', '#4caf50', '#ff9800'][i % 5]
          }}
        />
      ))}
    </RoomWrapper>
  );
}
