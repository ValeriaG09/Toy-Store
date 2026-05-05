import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import WoodyWallpaper from '../components/WoodyWallpaper';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Tienda (Elite Woody Edition): Un bazar del lejano oeste rediseñado.
 */
export default function Tienda() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get('cat');

  const getTituloCategoria = () => {
    switch(categoria) {
      case 'vibradores': return 'DINAMITA_DE_COMO_DICE_EL_RAYO';
      case 'lencerias': return 'LAS_CAPERUZAS_DE_BO_PEEP';
      case 'anales': return 'LA_MINA_DE_ORO_DEL_BUSCADOR';
      case 'kits': return 'BAÚL_DE_SUPERVIVENCIA_RODEO';
      default: return 'GRAN_CATÁLOGO_DEL_OESTE';
    }
  };

  return (
    <RoomWrapper 
      theme="woody" 
      wallpaperContent={<WoodyWallpaper />}
      fullWallpaper={true}
    >
      <div className="p-6 md:p-14 min-h-screen flex flex-col items-center justify-center">
        {/* LA TIENDA SE MANTIENE VACÍO POR AHORA, SOLO EL TAPIZ Y LA NAVBAR GLOBAL */}
      </div>
    </RoomWrapper>
  );
}
