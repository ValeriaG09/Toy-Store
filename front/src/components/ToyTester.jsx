import React, { useState } from 'react';

const REFERENCE_OBJECTS = [
  { id: 'banana', name: 'Banana 🍌', height: 20, width: 4, color: 'bg-yellow-400', emoji: '🍌' },
  { id: 'remote', name: 'Control Remoto 📺', height: 18, width: 5, color: 'bg-gray-800', emoji: '📺' },
  { id: 'card', name: 'Tarjeta 💳', height: 8.5, width: 5.4, color: 'bg-blue-600', emoji: '💳' },
  { id: 'phone', name: 'Smartphone 📱', height: 15, width: 7.5, color: 'bg-slate-900', emoji: '📱' },
];

export default function ToyTester({ product, isOpen, onClose }) {
  const [refObj, setRefObj] = useState(REFERENCE_OBJECTS[0]);
  
  if (!isOpen || !product?.dimensiones) return null;

  const { largo, ancho } = product.dimensiones;
  
  // Factor de escala para que 20cm sean ~200px
  const SCALE = 10; 

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border-8 border-amber-400 animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-amber-400 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#451a03] uppercase tracking-tighter">Toy-Tester Virtual 📐</h2>
            <p className="text-[10px] font-bold text-[#451a03]/60 uppercase tracking-widest">Compara la escala real de tu juguete</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
            <svg className="w-6 h-6 text-[#451a03]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-12 items-center justify-center min-h-[400px]">
          
          {/* Área de comparación */}
          <div className="flex-1 w-full flex items-end justify-center gap-16 pb-8 border-b-2 border-dashed border-gray-100">
            
            {/* El Producto */}
            <div className="flex flex-col items-center gap-4">
              <div 
                className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-full rounded-b-xl shadow-lg relative group"
                style={{ 
                  height: `${largo * SCALE}px`, 
                  width: `${ancho * SCALE}px`,
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-purple-600 uppercase">
                  {largo} cm
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-full"></div>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tu Juguete</span>
            </div>

            {/* Objeto de Referencia */}
            <div className="flex flex-col items-center gap-4">
              <div 
                className={`${refObj.color} rounded-xl shadow-lg flex items-center justify-center text-4xl relative transition-all duration-500`}
                style={{ 
                  height: `${refObj.height * SCALE}px`, 
                  width: `${refObj.width * SCALE}px` 
                }}
              >
                {refObj.emoji}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-gray-500 uppercase">
                  {refObj.height} cm
                </div>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Referencia</span>
            </div>

          </div>

          {/* Controles */}
          <div className="w-full md:w-48 flex flex-col gap-3">
            <h4 className="text-[11px] font-black text-[#451a03]/40 uppercase tracking-widest mb-2">Cambiar Referencia</h4>
            {REFERENCE_OBJECTS.map(obj => (
              <button
                key={obj.id}
                onClick={() => setRefObj(obj)}
                className={`p-3 rounded-2xl text-xs font-black uppercase tracking-tight transition-all text-left flex items-center gap-3
                  ${refObj.id === obj.id 
                    ? 'bg-amber-100 text-amber-700 shadow-inner' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
              >
                <span>{obj.emoji}</span>
                {obj.name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 p-6 flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">💡</div>
           <p className="text-[11px] font-bold text-gray-500 leading-tight">
             <b>Dato del Sheriff:</b> Esta escala es una aproximación visual. Recuerda que cada cuerpo es un mundo y lo importante es cómo te sientas tú con tu nuevo juguete.
           </p>
        </div>

      </div>
    </div>
  );
}
