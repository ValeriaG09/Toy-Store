import React from 'react';
import RoomWrapper from '../components/RoomWrapper';
import { useNavigate } from 'react-router-dom';

import LotsoFurImg from '../assets/lotso_fur_texture.png';

export default function Guia() {
  const navigate = useNavigate();
  return (
    <RoomWrapper 
      theme="lotso" 
      fullWallpaper={true} 
      wallpaperContent={
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ 
            backgroundImage: `url(${LotsoFurImg})`,
            backgroundSize: '450px auto',
            backgroundRepeat: 'repeat',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.2)' // Sombra suave para profundidad
          }}
        />
      }
    >
      <div className="p-10 pt-44 relative z-10">
        {/* Contenido vacío temporalmente */}
      </div>
    </RoomWrapper>
  );
}
