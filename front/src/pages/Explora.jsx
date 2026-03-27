import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useNavigate } from 'react-router-dom';

export default function Explora() {
  const navigate = useNavigate();
  return (
    <RoomWrapper theme="aliens">
      <div className="p-10">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 bg-green-500 text-indigo-900 px-6 py-2 rounded-full font-black shadow-lg hover:bg-green-600 transition"
        >
          ← VOLVER AL CUARTO
        </button>
        
        <div className="maqueta-card p-10 max-w-4xl mx-auto border-b-8 border-green-400 bg-indigo-950/80 backdrop-blur-md">
          <h1 className="text-4xl font-black text-green-400 mb-6 uppercase tracking-tighter animate-pulse">🛸 EL GANCHO TE ESPERA</h1>
          <p className="text-indigo-200 font-bold mb-8">¡Ooohhh! Has sido elegido para explorar los rincones más profundos del universo.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-900/50 p-6 rounded-2xl border-2 border-green-400/30 flex flex-col items-center hover:scale-105 transition cursor-pointer">
              <span className="text-5xl mb-3">👽</span>
              <p className="text-green-400 font-black text-xs uppercase">Secretos</p>
            </div>
            <div className="bg-indigo-900/50 p-6 rounded-2xl border-2 border-green-400/30 flex flex-col items-center hover:scale-105 transition cursor-pointer">
              <span className="text-5xl mb-3">🍕</span>
              <p className="text-green-400 font-black text-xs uppercase">Antojos</p>
            </div>
            <div className="bg-indigo-900/50 p-6 rounded-2xl border-2 border-green-400/30 flex flex-col items-center hover:scale-105 transition cursor-pointer">
              <span className="text-5xl mb-3">✨</span>
              <p className="text-green-400 font-black text-xs uppercase">Destinos</p>
            </div>
          </div>
        </div>
      </div>
    </RoomWrapper>
  );
}
