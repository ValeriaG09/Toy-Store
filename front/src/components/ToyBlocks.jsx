import React from 'react';

export const ToyCube = ({ letter, colorName }) => {
  const map = {
    red: { front: 'bg-[#E52521]', top: 'bg-[#F47B79]', right: 'bg-[#A01A17]' },
    yellow: { front: 'bg-[#FFC107]', top: 'bg-[#FFD54F]', right: 'bg-[#B28704]' },
    blue: { front: 'bg-[#1976D2]', top: 'bg-[#64B5F6]', right: 'bg-[#0D47A1]' },
    green: { front: 'bg-[#4CAF50]', top: 'bg-[#81C784]', right: 'bg-[#2E7D32]' },
    orange: { front: 'bg-[#FF9800]', top: 'bg-[#FFB74D]', right: 'bg-[#E65100]' },
    purple: { front: 'bg-[#9C27B0]', top: 'bg-[#BA68C8]', right: 'bg-[#4A148C]' },
    pink: { front: 'bg-[#E91E63]', top: 'bg-[#F06292]', right: 'bg-[#880E4F]' },
  };
  const colors = map[colorName];
  
  return (
    <div className="relative w-[50px] h-[50px] md:w-[64px] md:h-[64px] z-10 transition-transform duration-300 hover:-translate-y-6 hover:scale-110 cursor-pointer group">
      {/* Front */}
      <div className={`absolute inset-0 ${colors.front} flex items-center justify-center font-black text-3xl md:text-4xl text-white shadow-inner z-20 border-[3px] border-black/20 rounded-sm`}>
         <span style={{ textShadow: '2px 3px 0 rgba(0,0,0,0.3)' }}>{letter}</span>
      </div>
      {/* Top */}
      <div className={`absolute ${colors.top} border-[3px] border-black/20 z-10 rounded-sm outline outline-1 outline-black/10`} style={{
         width: '100%', height: '20px', 
         bottom: '100%', left: '10px',
         transform: 'skewX(-45deg)'
      }}></div>
      {/* Right */}
      <div className={`absolute ${colors.right} border-[3px] border-black/20 z-0 rounded-sm outline outline-1 outline-black/10`} style={{
         width: '20px', height: '100%',
         left: '100%', top: '-10px',
         transform: 'skewY(-45deg)'
      }}></div>
    </div>
  );
};

const ToyBlocks = () => (
  <div className="absolute right-12 md:right-32 bottom-[-15px] z-30 flex flex-col items-center pointer-events-auto filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]">
    {/* ROW 1: S E X */}
    <div className="flex gap-[32px] ml-[40px] z-20 relative mb-[-5px]">
      <div className="translate-y-2 rotate-6"><ToyCube letter="S" colorName="red" /></div>
      <div className="-translate-y-2 -rotate-3"><ToyCube letter="E" colorName="yellow" /></div>
      <div className="translate-y-3 -rotate-6"><ToyCube letter="X" colorName="blue" /></div>
    </div>
    {/* ROW 2: S H O P */}
    <div className="flex gap-[28px] z-10 relative">
      <div className="-rotate-6 translate-y-1"><ToyCube letter="S" colorName="green" /></div>
      <div className="rotate-3"><ToyCube letter="H" colorName="orange" /></div>
      <div className="-rotate-2"><ToyCube letter="O" colorName="purple" /></div>
      <div className="rotate-3 translate-y-2"><ToyCube letter="P" colorName="pink" /></div>
    </div>
  </div>
);

export default ToyBlocks;
