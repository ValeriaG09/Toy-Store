import React from 'react';

/**
 * Lenny el Binocular (Personaje icónico de Toy Story)
 * Diseñado como icono vectorizado para la búsqueda visual / cámara en Toy Store.
 */
export default function LennyIcon({ className = "w-9 h-9", active = false }) {
  return (
    <svg 
      viewBox="0 0 54 44" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-visible transition-transform duration-200 group-hover:scale-110 select-none pointer-events-none`}
    >
      <defs>
        {/* Gradiente cuerpo azul cian */}
        <linearGradient id="lennyBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Gradiente aros oculares */}
        <linearGradient id="lennyBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Gradiente perillas rojas */}
        <linearGradient id="lennyRedKnob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="70%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* Gradiente patas naranjas */}
        <linearGradient id="lennyFeetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      {/* 1. PATAS NARANJAS (DEBAJO DEL CUERPO) */}
      <g id="lenny-feet">
        {/* Piernas */}
        <rect x="18" y="32" width="3" height="6" rx="1.5" fill="#c2410c" />
        <rect x="33" y="32" width="3" height="6" rx="1.5" fill="#c2410c" />
        
        {/* Pata izquierda (tipo aleta de pato) */}
        <path 
          d="M12 37.5C12 36.5 13 36 15 36H24C25.5 36 26 37 25.5 38.5C25 40 23.5 41 21 41H14C12.5 41 12 39 12 37.5Z" 
          fill="url(#lennyFeetGrad)"
          stroke="#c2410c"
          strokeWidth="0.8"
        />
        {/* Pata derecha (tipo aleta de pato) */}
        <path 
          d="M28 37.5C28 36.5 29 36 31 36H40C41.5 36 42 37 41.5 38.5C41 40 39.5 41 37 41H30C28.5 41 28 39 28 37.5Z" 
          fill="url(#lennyFeetGrad)"
          stroke="#c2410c"
          strokeWidth="0.8"
        />
      </g>

      {/* 2. PERILLA SUPERIOR DE ENFOQUE (DIAL AZUL) */}
      <g id="lenny-top-dial">
        <rect x="23" y="2" width="8" height="5" rx="2" fill="#0369a1" />
        <line x1="25" y1="3" x2="25" y2="6" stroke="#7dd3fc" strokeWidth="1" strokeLinecap="round" />
        <line x1="27" y1="3" x2="27" y2="6" stroke="#7dd3fc" strokeWidth="1" strokeLinecap="round" />
        <line x1="29" y1="3" x2="29" y2="6" stroke="#7dd3fc" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* 3. PERILLAS ROJAS LATERALES */}
      <g id="lenny-side-knobs">
        {/* Perilla izquierda */}
        <ellipse cx="4.5" cy="20" rx="3.5" ry="7" fill="url(#lennyRedKnob)" stroke="#7f1d1d" strokeWidth="0.8" />
        {/* Perilla derecha */}
        <ellipse cx="49.5" cy="20" rx="3.5" ry="7" fill="url(#lennyRedKnob)" stroke="#7f1d1d" strokeWidth="0.8" />
      </g>

      {/* 4. CUERPO BASE DE LOS BINOCULARES */}
      <g id="lenny-body">
        {/* Carcasa trasera y puente central */}
        <rect x="14" y="9" width="26" height="23" rx="8" fill="url(#lennyBodyGrad)" />
        <circle cx="27" cy="17" r="4.5" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
        <circle cx="27" cy="17" r="2" fill="#38bdf8" />
      </g>

      {/* 5. OCULAR IZQUIERDO CON OJO */}
      <g id="lenny-left-eye">
        {/* Aro exterior biselado */}
        <circle cx="17" cy="20" r="11.5" fill="url(#lennyBezelGrad)" stroke="#0369a1" strokeWidth="1.2" />
        {/* Sombra interior del barril */}
        <circle cx="17" cy="20" r="9.2" fill="#0c4a6e" />
        {/* Globo ocular blanco */}
        <circle cx="17" cy="20" r="8" fill="#ffffff" />
        {/* Pupila negra grande expresiva */}
        <circle cx="17.5" cy="19.5" r="4.8" fill="#0f172a" />
        {/* Brillo de luz / Reflejo simpático */}
        <circle cx="15.8" cy="17.8" r="1.8" fill="#ffffff" />
        <circle cx="19" cy="21.5" r="0.8" fill="#ffffff" />
      </g>

      {/* 6. OCULAR DERECHO CON OJO */}
      <g id="lenny-right-eye">
        {/* Aro exterior biselado */}
        <circle cx="37" cy="20" r="11.5" fill="url(#lennyBezelGrad)" stroke="#0369a1" strokeWidth="1.2" />
        {/* Sombra interior del barril */}
        <circle cx="37" cy="20" r="9.2" fill="#0c4a6e" />
        {/* Globo ocular blanco */}
        <circle cx="37" cy="20" r="8" fill="#ffffff" />
        {/* Pupila negra grande expresiva */}
        <circle cx="37.5" cy="19.5" r="4.8" fill="#0f172a" />
        {/* Brillo de luz / Reflejo simpático */}
        <circle cx="35.8" cy="17.8" r="1.8" fill="#ffffff" />
        <circle cx="39" cy="21.5" r="0.8" fill="#ffffff" />
      </g>
    </svg>
  );
}
