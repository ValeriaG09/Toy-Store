import React from 'react';

export default function CowboyHat({ className }) {
  return (
    <svg 
      viewBox="0 0 100 60" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Copa del sombrero */}
      <path 
        d="M20 40C20 20 35 15 50 15C65 15 80 20 80 40" 
        fill="#8B4513" 
        stroke="#5D2E0C" 
        strokeWidth="2"
      />
      {/* Detalle superior (hundimiento) */}
      <path 
        d="M40 20C45 18 55 18 60 20" 
        stroke="#5D2E0C" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      {/* Cinta del sombrero */}
      <path 
        d="M22 35C22 35 35 32 50 32C65 32 78 35 78 35V40C78 40 65 38 50 38C35 38 22 40 22 40V35Z" 
        fill="#5D2E0C"
      />
      {/* Ala del sombrero */}
      <path 
        d="M5 45C5 45 15 38 50 38C85 38 95 45 95 45C95 45 85 55 50 55C15 55 5 45 5 45Z" 
        fill="#A0522D" 
        stroke="#5D2E0C" 
        strokeWidth="2"
      />
    </svg>
  );
}
