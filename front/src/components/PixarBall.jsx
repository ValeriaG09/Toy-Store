import React from 'react';

const PixarBall = () => (
  <div className="absolute left-8 md:left-24 bottom-[-15px] z-30 pointer-events-auto transition-transform duration-500 hover:-translate-y-6 hover:rotate-12 cursor-pointer">
    <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-[#FFC107] relative overflow-hidden shadow-[inset_-10px_-15px_30px_rgba(0,0,0,0.4),0_15px_25px_rgba(0,0,0,0.5)] border-[3px] border-yellow-600 flex items-center justify-center">
      {/* Stripe */}
      <div className="absolute top-1/2 left-0 w-full h-[40px] md:h-[50px] bg-[#2196F3] -translate-y-1/2 shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-4px_8px_rgba(0,0,0,0.3)] flex items-center justify-center">
        {/* Star */}
        <svg className="w-12 h-12 md:w-16 md:h-16 text-[#F44336] drop-shadow-md z-10" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </div>
      {/* Gloss */}
      <div className="absolute top-2 left-6 w-12 h-12 md:w-16 md:h-16 bg-white/40 rounded-full blur-[3px] z-20"></div>
    </div>
  </div>
);

export default PixarBall;
