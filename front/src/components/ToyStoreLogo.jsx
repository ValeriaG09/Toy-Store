import React from 'react';
import logoOfficialImg from '../assets/logo_official.png';
import logoNewImg from '../assets/logo_toystore_new.png';

export default function ToyStoreLogo({ scale = 1, variant = 'official' }) {
  const currentLogo = variant === 'new' ? logoNewImg : logoOfficialImg;
  
  return (
    <div 
      className="flex flex-col items-center select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <img 
        src={currentLogo} 
        alt="Toy Store Logo" 
        className="max-w-full h-auto object-contain"
        style={{ height: '180px' }} // Altura base para que el scale funcione bien
      />
    </div>
  );
}
