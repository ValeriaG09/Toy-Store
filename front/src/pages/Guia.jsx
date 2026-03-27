import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useNavigate } from 'react-router-dom';

export default function Guia() {
  const navigate = useNavigate();
  return (
    <RoomWrapper theme="woody"> {/* Jessie usa similar a Woody pero con toques rojos */}
      <div className="p-10">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 bg-red-600 text-white px-6 py-2 rounded-full font-black shadow-lg hover:bg-red-700 transition"
        >
          ← VOLVER AL CUARTO
        </button>
        
        <div className="maqueta-card p-10 max-w-4xl mx-auto border-b-8 border-red-500">
          <h1 className="text-4xl font-black text-red-900 mb-6 uppercase tracking-tighter">🤠 GUÍA DE JUEGO</h1>
          <p className="text-gray-700 font-bold mb-8">Aprende a jugar como un verdadero juguete de Andy.</p>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-5 rounded-xl border-l-8 border-red-500 font-bold text-red-900">
              PASO 1: Elige tu juguete favorito del catálogo.
            </div>
            <div className="bg-red-50 p-5 rounded-xl border-l-8 border-red-500 font-bold text-red-900">
              PASO 2: Agrégalo a tu cofre de juguetes.
            </div>
            <div className="bg-red-50 p-5 rounded-xl border-l-8 border-red-500 font-bold text-red-900">
              PASO 3: ¡Prepárate para la aventura!
            </div>
          </div>
        </div>
      </div>
    </RoomWrapper>
  );
}
