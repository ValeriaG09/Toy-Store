import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useNavigate } from 'react-router-dom';

export default function Contacto() {
  const navigate = useNavigate();
  return (
    <RoomWrapper theme="buzz">
      <div className="p-10">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 bg-purple-600 text-white px-6 py-2 rounded-full font-black shadow-lg hover:bg-purple-700 transition"
        >
          ← VOLVER AL CUARTO
        </button>
        
        <div className="maqueta-card p-10 max-w-2xl mx-auto border-b-8 border-lime-400 bg-gray-50">
          <h1 className="text-4xl font-black text-purple-900 mb-6 uppercase tracking-tighter">🚀 COMANDO ESTELAR</h1>
          <p className="text-gray-600 font-bold mb-8">¿Necesitas refuerzos? Envía una señal al centro de control.</p>
          
          <form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest pl-2 mb-1">Identificación</label>
              <input type="text" placeholder="NOMBRE DEL GUARDÍAN" className="p-4 rounded-xl border-2 border-purple-200 focus:border-lime-400 outline-none transition" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest pl-2 mb-1">Canal de comunicación</label>
              <input type="email" placeholder="CORREO@ESTELAR.COM" className="p-4 rounded-xl border-2 border-purple-200 focus:border-lime-400 outline-none transition" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest pl-2 mb-1">Mensaje de auxilio</label>
              <textarea placeholder="ESCRIBE TU MENSAJE..." rows="4" className="p-4 rounded-xl border-2 border-purple-200 focus:border-lime-400 outline-none transition resize-none"></textarea>
            </div>
            
            <button className="bg-lime-500 hover:bg-lime-600 text-purple-900 font-black py-4 rounded-xl shadow-[0_5px_0_#4d7c0f] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest mt-4">
              ¡ENVIAR A LA BASE!
            </button>
          </form>
        </div>
      </div>
    </RoomWrapper>
  );
}
