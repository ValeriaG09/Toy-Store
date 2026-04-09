import React from 'react';

const NavHoverItem = ({ label, path, iconType, baseColorClass, hoverColorClass, isActive, onClick }) => {
  const getIcon = () => {
    // Todos los SVGs ahora aplican incondicionalmente el color de la temática (baseColorClass) 
    // y manejan una opacidad de 40% (o más) para resaltar sus detalles constructivos.
    switch (iconType) {
      case 'phallic': // Dildo detallado (Woody)
        return (
          <svg viewBox="0 0 100 100" className={`w-12 h-12 md:w-16 md:h-16 opacity-40 drop-shadow-md transition-colors duration-300 ${baseColorClass}`} fill="currentColor">
            <path d="M35 90 Q50 85, 65 90 L70 95 L30 95 Z" />
            <path d="M40 90 L60 90 L62 80 Q65 60, 60 40 Q55 20, 65 10 Q70 5, 65 5 Q55 0, 45 10 Q30 25, 38 60 L40 90" />
            <path d="M42 60 Q50 65, 58 60 M44 40 Q50 45, 55 40 M46 25 Q50 28, 55 25" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
          </svg>
        );
      case 'rabbit': // Conejo Vibrador Clásico (Jessie - Vestier) - Reemplaza los 'lips' incomprensibles
        return (
          <svg viewBox="0 0 100 100" className={`w-14 h-14 md:w-[74px] md:h-[74px] opacity-40 drop-shadow-md transition-colors duration-300 ${baseColorClass}`} fill="currentColor">
            {/* Base */}
            <rect x="40" y="80" width="20" height="15" rx="5" />
            {/* Shaft */}
            <path d="M42 80 L58 80 L60 30 C60 10, 40 10, 40 30 Z" />
            {/* Bunny stimulator (Orejas) */}
            <path d="M42 60 Q15 60, 25 40 Q33 45, 29 55 Q35 48, 42 48 Z" />
            {/* Detalles / Relieves */}
            <path d="M42 40 Q50 45, 58 40 M42 50 Q50 55, 58 50 M42 60 Q50 65, 58 60" stroke="white" strokeWidth="2.5" fill="none" opacity="0.5"/>
          </svg>
        );
      case 'handcuffs': // Esposas detalladas y realistas (Lotso - Guía)
        return (
          <svg viewBox="0 0 100 100" className={`w-14 h-14 md:w-[72px] md:h-[72px] opacity-40 drop-shadow-md transition-colors duration-300 ${baseColorClass}`} stroke="currentColor" fill="none">
            {/* CUFF IZQUIERDO */}
            <circle cx="28" cy="50" r="16" strokeWidth="3.5"/>
            <path d="M28 38 A 12 12 0 1 1 16 50" strokeWidth="3" />
            <path d="M16 50 A 12 12 0 0 1 28 38" strokeWidth="2" strokeDasharray="3 2" opacity="0.6"/>
            {/* Bisagra Izquierda */}
            <rect x="40" y="44" width="8" height="12" rx="1" fill="currentColor" stroke="none"/>
            <circle cx="44" cy="47" r="1.5" fill="white" stroke="none"/>
            <circle cx="44" cy="53" r="1.5" fill="white" stroke="none"/>
            {/* Cerradura Izquierda */}
            <path d="M20 50 A 1.5 1.5 0 1 1 20 49 L 22 49 L 22 51 Z" fill="currentColor" stroke="none"/>

            {/* CUFF DERECHO */}
            <circle cx="72" cy="50" r="16" strokeWidth="3.5"/>
            <path d="M72 38 A 12 12 0 1 0 84 50" strokeWidth="3" />
            <path d="M84 50 A 12 12 0 0 0 72 38" strokeWidth="2" strokeDasharray="3 2" opacity="0.6"/>
            {/* Bisagra Derecha */}
            <rect x="52" y="44" width="8" height="12" rx="1" fill="currentColor" stroke="none"/>
            <circle cx="56" cy="47" r="1.5" fill="white" stroke="none"/>
            <circle cx="56" cy="53" r="1.5" fill="white" stroke="none"/>
            {/* Cerradura Derecha */}
            <path d="M80 50 A 1.5 1.5 0 1 0 80 49 L 78 49 L 78 51 Z" fill="currentColor" stroke="none"/>

            {/* CADENA CENTRAL (ESLABONES) */}
            <ellipse cx="48" cy="50" rx="3" ry="5" strokeWidth="2.5" />
            <ellipse cx="50" cy="50" rx="4" ry="2" strokeWidth="2.5" />
            <ellipse cx="52" cy="50" rx="3" ry="5" strokeWidth="2.5" />
          </svg>
        );
      case 'plug': // Plug anal enjoyado (Buzz)
        return (
          <svg viewBox="0 0 100 100" className={`w-12 h-12 md:w-16 md:h-16 opacity-40 drop-shadow-md transition-colors duration-300 ${baseColorClass}`} fill="currentColor">
            {/* Jewel Base */}
            <polygon points="35,85 65,85 55,95 45,95" fill="white" opacity="0.5"/>
            <path d="M30,85 Q50,75, 70,85 L65,88 L35,88 Z" />
            {/* Stem */}
            <rect x="44" y="70" width="12" height="15" rx="2" />
            {/* Bulb */}
            <path d="M50 15 C20 40, 35 70, 45 70 L55 70 C65 70, 80 40, 50 15 Z" />
            {/* Gloss Highlight */}
            <path d="M45 30 Q40 45, 45 60" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
          </svg>
        );
      case 'vagina': // Flor vulvar detallada (Andy)
        return (
          <svg viewBox="0 0 100 100" className={`w-12 h-12 md:w-16 md:h-16 opacity-40 drop-shadow-md transition-colors duration-300 ${baseColorClass}`} fill="currentColor">
             {/* Outer Petals / Majora */}
             <path d="M50 10 C20 30, 15 70, 50 95 C85 70, 80 30, 50 10 Z" />
             {/* Inner Petals / Minora */}
             <path d="M50 25 C35 40, 30 65, 50 80 C70 65, 65 40, 50 25 Z" fill="white" opacity="0.4" />
             {/* Clitoral node */}
             <circle cx="50" cy="35" r="4" fill="white" opacity="0.9"/>
             {/* Center split */}
             <path d="M50 42 Q48 60, 50 72" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
          </svg>
        );
      case 'whip': // Látigo Flogger (Aliens)
        return (
          <svg viewBox="0 0 100 100" className={`w-12 h-12 md:w-16 md:h-16 opacity-40 drop-shadow-md transition-colors duration-300 ${baseColorClass}`} fill="currentColor">
             {/* Handle */}
             <rect x="42" y="10" width="16" height="30" rx="4" />
             {/* Loop */}
             <path d="M50 10 Q50 0, 60 5" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7"/>
             {/* Tails */}
             <path d="M44 40 Q30 60, 35 90" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
             <path d="M50 40 Q50 70, 50 95" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
             <path d="M56 40 Q70 60, 65 90" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
             <path d="M47 40 Q40 65, 45 85" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
             <path d="M53 40 Q60 65, 55 85" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  return (
    <div className="relative group cursor-pointer flex items-center justify-center pointer-events-auto" onClick={handleClick}>
       {/* Ícono Sombra 3D: Invisible (scale-50, opacity-0) excepto al hacer Hover o si está Activo en la URL */}
       <div 
         className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isActive ? 'scale-[1.3] opacity-100' : 'scale-50 opacity-0 group-hover:scale-125 group-hover:opacity-100'}`}
         style={{ zIndex: 0 }}
       >
          <div className="group-hover:animate-bounce-slow">
            {getIcon()}
          </div>
       </div>
       
       <a href={path || "#"} className={`relative z-10 transition-colors duration-300 font-bold uppercase tracking-widest text-[14px] md:text-[16px] px-2 py-1 ${isActive ? baseColorClass : 'text-blue-900 ' + hoverColorClass}`}>
          {label}
       </a>
    </div>
  );
};

export default NavHoverItem;
