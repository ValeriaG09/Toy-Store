import React, { useContext, useState, useRef } from 'react';
import RoomWrapper from '../components/RoomWrapper';
import ToyStoreLogo from '../components/ToyStoreLogo';
import { AuthContext } from '../context/AuthContext';

export default function Configuracion() {
  const { usuario, verificarSesion } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  // Estados para Password
  const [passForm, setPassForm] = useState({ actual: '', nueva: '', confirmar: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Estados para Preferencias
  const [prefs, setPrefs] = useState(usuario?.preferencias || {
    discreto: false,
    ofertas: true,
    newsletter: false
  });
  const [prefsLoading, setPrefsLoading] = useState(false);

  // Manejar cambio de Avatar
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/perfil/avatar', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        verificarSesion(); // Recargar usuario global
        alert('¡Foto de perfil actualizada! 📸');
      } else {
        alert(data.error || 'Error al subir imagen');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  // Manejar cambio de Password
  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passForm.nueva !== passForm.confirmar) {
      return setPassMsg({ type: 'error', text: 'Las contraseñas no coinciden' });
    }
    if (passForm.nueva.length < 8) {
      return setPassMsg({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (!/[a-zA-Z]/.test(passForm.nueva) || !/\d/.test(passForm.nueva) || !/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(passForm.nueva)) {
      return setPassMsg({ type: 'error', text: 'La contraseña debe incluir letras, números y caracteres especiales (ej: @, #, $, !) y no puede contener solo letras o solo números' });
    }

    setPassLoading(true);
    setPassMsg({ type: '', text: '' });

    try {
      const res = await fetch('/perfil/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actual: passForm.actual, nueva: passForm.nueva })
      });
      const data = await res.json();
      if (res.ok) {
        setPassMsg({ type: 'success', text: data.message });
        setPassForm({ actual: '', nueva: '', confirmar: '' });
      } else {
        setPassMsg({ type: 'error', text: data.error });
      }
    } catch (err) {
      setPassMsg({ type: 'error', text: 'Error de conexión' });
    } finally {
      setPassLoading(false);
    }
  };

  // Manejar cambio de Preferencias
  const togglePref = async (key) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    setPrefsLoading(true);

    try {
      await fetch('/perfil/preferencias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferencias: newPrefs })
      });
      verificarSesion();
    } catch (err) {
      console.error(err);
    } finally {
      setPrefsLoading(false);
    }
  };

  return (
    <RoomWrapper theme="andy">
      <div className="flex-1 flex items-center justify-center p-4 pt-20 md:pt-32 pb-24">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-3xl relative animate-in fade-in zoom-in-95 duration-500 border-[12px] border-blue-50">
          
          <div className="flex justify-center mb-6">
            <ToyStoreLogo variant="new" scale={0.6} />
          </div>

          <div className="mt-8 border-b-4 border-dashed border-blue-100 pb-6 mb-10 text-center">
            <h1 className="text-3xl font-[1000] text-blue-900 uppercase tracking-tighter italic">
              Centro de Control
            </h1>
            <p className="text-xs font-black text-blue-400 uppercase tracking-[4px] mt-2">
              Personaliza tu experiencia de juego
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            
            {/* LADO IZQUIERDO: Avatar e Info */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div 
                onClick={handleAvatarClick}
                className="relative group cursor-pointer"
              >
                <div className="w-32 h-32 rounded-full border-8 border-white shadow-xl overflow-hidden bg-blue-100 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95">
                  {usuario?.avatar_url ? (
                    <img src={usuario.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${usuario?.nombre.replace(" ", "+")}&background=0284c7&color=fff&size=256`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-2xl shadow-lg flex items-center justify-center text-white border-4 border-white">
                  ✨
                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />

              <div className="mt-6 text-center">
                <h2 className="text-xl font-black text-blue-900 uppercase">{usuario?.nombre}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest mt-2 inline-block">
                  {usuario?.rol === 1 ? 'Admin del Baúl' : 'Explorador Estándar'}
                </span>
              </div>

              {/* Preferencias Toggles */}
              <div className="w-full mt-10 space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Ajustes de Misión</h3>
                {Object.entries(prefs).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => togglePref(key)}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-95 ${
                      val ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-tight ${val ? 'text-blue-900' : 'text-gray-400'}`}>
                      {key === 'discreto' ? '🔒 Modo Discreto' : key === 'ofertas' ? '🎁 Recibir Ofertas' : '📧 Newsletter'}
                    </span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${val ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${val ? 'left-4.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* LADO DERECHO: Formulario de Seguridad */}
            <div className="lg:col-span-8">
              <div className="bg-yellow-50/50 p-8 rounded-[2.5rem] border-4 border-yellow-100 shadow-inner">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-amber-900 uppercase leading-none">Seguridad del Perfil</h3>
                    <p className="text-[10px] font-bold text-amber-600 uppercase mt-1">Cambia tu contraseña de acceso</p>
                  </div>
                </div>

                <form onSubmit={handlePassSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest ml-4 mb-1 block">Contraseña Actual</label>
                      <input 
                        type="password"
                        required
                        value={passForm.actual}
                        onChange={e => {
                          let val = e.target.value;
                          if (val.startsWith(" ")) val = val.trimStart();
                          setPassForm({...passForm, actual: val});
                        }}
                        className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-amber-200 focus:border-amber-500 outline-none font-bold text-amber-900 placeholder:text-amber-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest ml-4 mb-1 block">Nueva Contraseña</label>
                        <input 
                          type="password"
                          required
                          value={passForm.nueva}
                          onChange={e => {
                            let val = e.target.value;
                            if (val.startsWith(" ")) val = val.trimStart();
                            setPassForm({...passForm, nueva: val});
                          }}
                          className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-amber-200 focus:border-amber-500 outline-none font-bold text-amber-900 placeholder:text-amber-200"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-amber-800 uppercase tracking-widest ml-4 mb-1 block">Confirmar Nueva</label>
                        <input 
                          type="password"
                          required
                          value={passForm.confirmar}
                          onChange={e => {
                            let val = e.target.value;
                            if (val.startsWith(" ")) val = val.trimStart();
                            setPassForm({...passForm, confirmar: val});
                          }}
                          className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-amber-200 focus:border-amber-500 outline-none font-bold text-amber-900 placeholder:text-amber-200"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  {passMsg.text && (
                    <div className={`p-4 rounded-2xl text-xs font-black uppercase text-center ${
                      passMsg.type === 'success' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-red-100 text-red-700 border-2 border-red-200'
                    }`}>
                      {passMsg.text}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={passLoading}
                    className="w-full py-5 bg-gradient-to-r from-yellow-400 to-amber-600 text-white font-black text-xs uppercase tracking-[3px] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {passLoading ? 'Procesando...' : 'Guardar Nueva Contraseña'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[5px]">Configuración v2.0 - Toy Store Digital Edition</p>
          </div>
        </div>
      </div>
    </RoomWrapper>
  );
}
