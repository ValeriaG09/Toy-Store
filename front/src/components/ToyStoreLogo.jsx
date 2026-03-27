import React from 'react';
import logoImg from '../assets/logo_official.png';

export default function ToyStoreLogo({ scale = 1 }) {
  return (
    <div 
      className="flex flex-col items-center select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <img 
        src={logoImg} 
        alt="Toy Store Logo" 
        className="max-w-full h-auto object-contain"
        style={{ height: '180px' }} // Altura base para que el scale funcione bien
      />
    </div>
  );
}
