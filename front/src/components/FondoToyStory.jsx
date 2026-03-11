import React from 'react';

const FondoToyStory = ({ children }) => {
  return (
    <div className="toy-story-bg min-h-screen flex items-center justify-center p-4">
      {/* Nubes decorativas */}
      <div className="cloud-container">
        <div className="cloud animate-float opacity-80" style={{ top: '15%', left: '10%', transform: 'scale(0.8)' }}></div>
        <div className="cloud animate-float opacity-60" style={{ top: '25%', left: '70%', animationDelay: '1s', transform: 'scale(1.2)' }}></div>
        <div className="cloud animate-float opacity-90" style={{ top: '55%', left: '15%', animationDelay: '2s' }}></div>
        <div className="cloud animate-float opacity-70" style={{ top: '75%', left: '80%', animationDelay: '3s', transform: 'scale(0.9)' }}></div>
        <div className="cloud animate-float opacity-85" style={{ top: '85%', left: '45%', animationDelay: '4s', transform: 'scale(1.1)' }}></div>
      </div>
      
      {/* Contenido (Login/Registro) */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default FondoToyStory;
