import React from 'react';

const ShapeCloud = ({ src, top, left, height, rotate, delay, opacity = "80" }) => (
  <div className="absolute pointer-events-none z-0" style={{ top, left, transform: `rotate(${rotate}deg)` }}>
    <img 
      src={src} 
      className={`shape-cloud animate-float-complex opacity-${opacity}`} 
      style={{ height: `${height}px`, animationDelay: delay }} 
      alt="nube" 
    />
  </div>
);

const FondoToyStory = ({ children }) => {
  const pene = "/images/custom_cloud_1_translucid.png";
  const vulva = "/images/custom_cloud_2_translucid.png";

  return (
    <div className="toy-story-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Nubes Especiales Transparentes - Más grandes y abundantes */}
      <div className="absolute inset-0 z-0">
        
        {/* Capa de fondo (más pequeñas y opacas) */}
        <ShapeCloud src={vulva} top="8%" left="15%" height="100" rotate="-15" delay="0s" opacity="50" />
        <ShapeCloud src={pene} top="20%" left="85%" height="90" rotate="25" delay="2.5s" opacity="45" />
        <ShapeCloud src={vulva} top="40%" left="75%" height="110" rotate="10" delay="4s" opacity="55" />
        <ShapeCloud src={pene} top="65%" left="10%" height="85" rotate="-20" delay="1s" opacity="50" />
        <ShapeCloud src={vulva} top="85%" left="80%" height="120" rotate="5" delay="3s" opacity="60" />
        <ShapeCloud src={pene} top="15%" left="50%" height="95" rotate="-10" delay="5s" opacity="40" />

        {/* Capa media (tamaño estándar) */}
        <ShapeCloud src={pene} top="30%" left="5%" height="150" rotate="15" delay="1.2s" opacity="70" />
        <ShapeCloud src={vulva} top="25%" left="35%" height="140" rotate="-5" delay="3.7s" opacity="75" />
        <ShapeCloud src={pene} top="45%" left="90%" height="160" rotate="-15" delay="0.5s" opacity="65" />
        <ShapeCloud src={vulva} top="55%" left="50%" height="150" rotate="20" delay="4.2s" opacity="80" />
        <ShapeCloud src={pene} top="75%" left="30%" height="140" rotate="10" delay="2.1s" opacity="70" />
        <ShapeCloud src={vulva} top="10%" left="65%" height="130" rotate="-25" delay="5.5s" opacity="65" />

        {/* Capa frente (muy grandes y claras) */}
        <ShapeCloud src={vulva} top="5%" left="85%" height="200" rotate="5" delay="1.8s" opacity="90" />
        <ShapeCloud src={pene} top="50%" left="15%" height="220" rotate="15" delay="4.8s" opacity="85" />
        <ShapeCloud src={vulva} top="80%" left="60%" height="190" rotate="-10" delay="0.2s" opacity="95" />
        <ShapeCloud src={pene} top="70%" left="85%" height="180" rotate="-20" delay="3.1s" opacity="80" />
        <ShapeCloud src={vulva} top="90%" left="5%" height="210" rotate="12" delay="2.7s" opacity="90" />
        <ShapeCloud src={pene} top="15%" left="25%" height="200" rotate="-5" delay="6.3s" opacity="85" />
        
        {/* Relleno extra */}
        <ShapeCloud src={vulva} top="35%" left="15%" height="80" rotate="30" delay="7s" opacity="50" />
        <ShapeCloud src={pene} top="60%" left="70%" height="90" rotate="-35" delay="2.2s" opacity="55" />
        <ShapeCloud src={vulva} top="45%" left="40%" height="100" rotate="0" delay="1.1s" opacity="45" />

      </div>
      
      {/* Contenido (Login/Registro) */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default FondoToyStory;
