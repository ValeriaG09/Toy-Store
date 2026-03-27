import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Tienda() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get('cat');

  const getTituloCategoria = () => {
    switch(categoria) {
      case 'vibradores': return 'VIBRADORES ESPACIALES';
      case 'lencerias': return 'BOUTIQUE DE MODA';
      case 'anales': return 'EXPLORACIÓN INTERGALÁCTICA';
      case 'kits': return 'KIT DE SUPERVIVENCIA';
      default: return 'CATÁLOGO COMPLETO';
    }
  };

  return (
    <RoomWrapper theme="woody">
      <div className="p-10 min-h-screen">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 bg-red-600 text-white px-8 py-3 rounded-full font-black shadow-[0_5px_0_#991b1b] hover:bg-red-700 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs"
        >
          ← VOLVER AL CUARTO
        </button>
        
        <div className="maqueta-card p-10 max-w-5xl mx-auto border-b-8 border-amber-600 relative overflow-hidden">
          {/* Decoración de fondo sutil */}
          <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
            <span className="text-[200px]">🤠</span>
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-black text-amber-900 mb-2 uppercase tracking-tighter italic">
              {getTituloCategoria()}
            </h1>
            <div className="h-2 w-32 bg-red-600 mb-6"></div>
            
            <p className="text-amber-800 font-bold mb-10 text-xl">
              {categoria 
                ? `¡Has llegado al sector de ${categoria.toUpperCase()}! Los mejores suministros para tu aventura.`
                : '¡Bienvenido al lejano oeste de la diversión! Aquí todos los juguetes son bienvenidos.'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Placeholder de Productos */}
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-amber-100/50 p-8 rounded-2xl border-4 border-dashed border-amber-300 flex flex-col items-center grayscale opacity-50">
                  <span className="text-6xl mb-4">🧸</span>
                  <p className="text-amber-700 text-center text-xs font-bold uppercase tracking-widest">PRODUCTO {i} EN CAJA...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoomWrapper>
  );
}
