import React from 'react';

/**
 * MascotAvatar Component - "Toyito"
 * Usa la pose exacta de /images/Mascota Toy Store en fondo transparente.png
 * ajustada para coincidir al 100% con la imagen de referencia del usuario.
 */
export default function MascotAvatar({ 
  className = "w-14 h-14", 
  variant = "head", 
  expression = "happy", 
  showBadge = false,
  imageType = "transparent"
}) {
  // Usar la pose oficial en fondo transparente pedida por el usuario
  const imageSrc = '/images/Mascota Toy Store en fondo transparente.png';

  if (variant === 'full') {
    return (
      <div className={`relative inline-block select-none ${className}`}>
        <img 
          src={imageSrc} 
          alt="Toyito" 
          className="w-full h-full object-contain pointer-events-none filter drop-shadow-md transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  // --- AVATAR CIRCULAR CON GORRITA COMPLETA "TOY STORE" Y CARITA TIERNA ---
  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-[#87CEEB] border-2 border-[#FFD100] shadow-xl select-none overflow-hidden p-0.5 transition-transform duration-300 hover:scale-105 ${className}`}>
      <img 
        src={imageSrc} 
        alt="Toyito Avatar" 
        className="w-full h-full object-cover object-[center_16%] scale-[1.60] pointer-events-none transition-transform duration-200"
      />
    </div>
  );
}




