import React, { useContext } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import ToyStoreLogo from '../components/ToyStoreLogo';
import { AuthContext } from '../context/AuthContext';

export default function Configuracion() {
  const { usuario } = useContext(AuthContext);

  return (
    <RoomWrapper theme="andy">
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-12">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-500 border-[12px] border-blue-50">
          
          <ToyStoreLogo variant="new" scale={0.8} />

          <div className="mt-8 border-b-4 border-dashed border-blue-100 pb-6 mb-8 text-center">
            <h1 className="text-3xl font-[1000] text-blue-900 uppercase tracking-tighter italic">
              Configuración del Perfil
            </h1>
            <p className="text-xs font-black text-blue-400 uppercase tracking-[4px] mt-2">
              Manual de operación del juguete
            </p>
          </div>

          <div className="space-y-6">
            {/* Info del Usuario */}
            <div className="bg-blue-50/50 p-6 rounded-3xl border-2 border-blue-100 flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img 
                  src={`https://ui-avatars.com/api/?name=${usuario?.nombre.replace(" ", "+")}&background=0284c7&color=fff&size=256`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Identificación</p>
                <h2 className="text-xl font-black text-blue-900 uppercase">{usuario?.nombre}</h2>
                <p className="text-sm font-bold text-gray-500 lowercase">{usuario?.email}</p>
              </div>
            </div>

            {/* Sección Próximamente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-100 opacity-60">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl mb-3 flex items-center justify-center text-white shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <p className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Seguridad</p>
                <h3 className="text-gray-400 font-bold uppercase text-sm">Cambiar Clave</h3>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-100 opacity-60">
                <div className="w-10 h-10 bg-pink-400 rounded-xl mb-3 flex items-center justify-center text-white shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <p className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Preferencias</p>
                <h3 className="text-gray-400 font-bold uppercase text-sm">Privacidad</h3>
              </div>
            </div>

            <div className="pt-6 flex flex-col items-center">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[5px]">Configuración v1.0</p>
            </div>
          </div>
        </div>
      </div>
    </RoomWrapper>
  );
}
