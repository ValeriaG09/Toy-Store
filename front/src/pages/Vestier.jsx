import React, { useState, useRef, useEffect } from 'react';
import RoomWrapper from '../components/RoomWrapper';

/**
 * JessieOutfitBg: Recreación PREMIUM del traje de Jessie.
 */
const JessieOutfitBg = () => (
  <div className="absolute inset-0 flex flex-col overflow-hidden bg-white">
    {/* 1. PARTE SUPERIOR */}
    <div className="h-[300px] md:h-[35%] bg-[#FFD100] relative z-20 shadow-lg">
      <svg className="absolute bottom-[-40px] left-0 w-full h-[150px]" viewBox="0 0 1000 150" preserveAspectRatio="none">
        <path d="M0,0 L1000,0 L1000,60 Q850,140 700,80 Q550,20 400,80 Q250,140 100,80 Q50,60 0,80 Z" fill="#FFD100" />
        <path d="M0,75 Q100,125 200,75 T400,75 T600,75 T800,75 T1000,75" fill="none" stroke="#D0021B" strokeWidth="4" strokeLinecap="round" className="opacity-80" />
        <path d="M50,40 Q70,70 90,40 Q70,10 50,40 M250,50 Q270,80 290,50 Q270,20 250,50 M450,40 Q470,70 490,40 Q470,10 450,40 M650,50 Q670,80 690,50 Q670,20 650,50" fill="none" stroke="#D0021B" strokeWidth="3" className="opacity-40" />
      </svg>
    </div>
    {/* 2. PECHERA */}
    <div className="flex-1 bg-[#F9F9FB] relative flex flex-col justify-center items-center gap-12 z-10 pt-20">
      {[1, 2].map((i) => (
        <div key={i} className="w-14 h-14 bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-full border-[6px] border-white shadow-xl flex items-center justify-center">
          <div className="w-5 h-5 bg-gray-200 rounded-full border border-gray-100 shadow-inner"></div>
        </div>
      ))}
    </div>
    {/* 3. CINTURÓN */}
    <div className="h-[100px] md:h-[12%] bg-[#0056B3] relative flex justify-center items-center z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] border-t-8 border-[#0047AB]">
      <div className="absolute w-full h-8 md:h-10 bg-[#8B4513] shadow-inner opacity-90 border-y border-[#5E2F0D]"></div>
      <div className="w-32 h-24 md:w-36 md:h-28 bg-gradient-to-b from-[#FFD700] via-[#FDB931] to-[#67440E] rounded-[48%] border-[5px] border-[#8B4513] shadow-2xl relative z-10 flex items-center justify-center transform overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-black/10 mix-blend-overlay"></div>
         <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            <path fill="#5E2F0D" d="M20,35 Q50,15 80,35 L85,45 Q75,40 65,45 L60,70 Q50,85 40,70 L35,45 Q25,40 15,45 Z" />
            <path fill="#5E2F0D" d="M30,30 Q10,10 5,40 L15,35 Q18,20 30,30 M70,30 Q90,10 95,40 L85,35 Q82,20 70,30" />
            <circle cx="50" cy="55" r="4" fill="#8B4513" />
         </svg>
      </div>
    </div>
    {/* 4. CHAPERAS */}
    <div className="h-[25vh] md:h-[30vh] bg-white relative z-0">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="cowSpots" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
            <path d="M50,100 C70,80 120,90 140,110 C160,130 150,170 130,190 C110,210 60,200 40,180 C20,160 30,120 50,100" fill="black" />
            <path d="M220,40 C240,20 280,30 290,60 C300,90 280,120 250,130 C220,140 200,110 210,80 C220,50 200,60 220,40" fill="black" />
            <path d="M10,250 C30,230 80,240 90,270 C100,300 80,330 50,340 C20,350 0,320 0,290 C0,260 0,270 10,250" fill="black" />
            <path d="M250,220 C270,200 320,210 330,240 C340,270 320,300 290,310 C260,320 240,290 250,260" fill="black" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cowSpots)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
    </div>
  </div>
);

export default function Vestier() {
  const [garmentId, setGarmentId] = useState('jessy');
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Iniciar la cámara
  const startCamera = async () => {
    try {
      setErrorMsg('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCapturedImage(null);
      setResultImage(null);
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo acceder a la cámara. Revisa los permisos.');
    }
  };

  // Detener la cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Tomar la foto
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      // Asegurar proporciones
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(base64Image);
      stopCamera();
    }
  };

  // Retomar foto
  const retakePhoto = () => {
    setCapturedImage(null);
    setResultImage(null);
    startCamera();
  };

  // Enviar a la IA (Virtual Try-On)
  const applyTryOn = async () => {
    if (!capturedImage) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/productos/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person_image: capturedImage,
          garment_id: garmentId
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResultImage(data.result_image);
      } else {
        setErrorMsg(data.error || 'Error procesando la imagen');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoomWrapper theme="jessie" fullWallpaper={true} wallpaperContent={<JessieOutfitBg />}>
      <div className="p-6 md:p-10 pt-32 relative z-10 min-h-screen flex items-center justify-center">
        
        <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[3rem] shadow-2xl w-full max-w-5xl border-8 border-red-50 relative animate-in fade-in zoom-in duration-500">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-[1000] text-red-600 uppercase tracking-tighter italic drop-shadow-sm">
              Vestier Virtual IA
            </h1>
            <p className="text-sm md:text-md font-bold text-red-400 mt-2">
              Pruébate nuestros conjuntos de forma mágica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* LADO IZQUIERDO: Controles y Selección */}
            <div className="flex flex-col gap-6">
              <div className="bg-red-50 p-6 rounded-3xl border-4 border-red-100">
                <h3 className="text-lg font-black text-red-800 uppercase mb-4">1. Elige tu conjunto</h3>
                <div className="flex gap-4">
                  <div 
                    onClick={() => setGarmentId('jessy')}
                    className={`flex-1 cursor-pointer transition-all rounded-2xl border-4 overflow-hidden ${garmentId === 'jessy' ? 'border-red-500 scale-105 shadow-xl' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src="/img/productos/lenceria_jessi.webp" alt="Jessy" className="w-full h-32 object-cover bg-white" />
                    <div className="bg-red-500 text-white text-center py-1 font-bold text-xs uppercase">Cowgirl</div>
                  </div>
                  <div 
                    onClick={() => setGarmentId('bo-peep')}
                    className={`flex-1 cursor-pointer transition-all rounded-2xl border-4 overflow-hidden ${garmentId === 'bo-peep' ? 'border-pink-500 scale-105 shadow-xl' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src="/img/productos/lenceria_bo.jpeg" alt="Bo Peep" className="w-full h-32 object-cover bg-white" />
                    <div className="bg-pink-500 text-white text-center py-1 font-bold text-xs uppercase">Pastora</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-3xl border-4 border-amber-100 flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-black text-amber-800 uppercase mb-2">2. Tómate una foto</h3>
                <p className="text-xs text-amber-700 mb-6 font-bold">
                  Procura buena luz y estar de frente. Alinea tus hombros con la silueta en pantalla.
                </p>
                
                {!cameraActive && !capturedImage && !resultImage && (
                  <button 
                    onClick={startCamera}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-black text-lg uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-transform"
                  >
                    📸 Abrir Cámara
                  </button>
                )}

                {(capturedImage || resultImage) && !loading && (
                   <button 
                     onClick={retakePhoto}
                     className="w-full py-3 bg-gray-200 text-gray-700 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-gray-300 transition-colors mt-auto"
                   >
                     ↻ Tomar otra foto
                   </button>
                )}
              </div>
            </div>

            {/* LADO DERECHO: Cámara y Resultados */}
            <div className="bg-slate-100 rounded-3xl border-4 border-slate-200 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
              
              {/* CÁMARA ACTIVA */}
              <div className={`w-full h-full relative ${cameraActive ? 'block' : 'hidden'}`}>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video>
                
                {/* OVERLAY SILUETA */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                  <svg viewBox="0 0 100 150" className="w-2/3 h-full max-h-[80%]">
                    <path d="M50 10 C35 10, 35 35, 50 35 C65 35, 65 10, 50 10 Z M25 45 C10 45, 10 70, 20 100 L30 150 L70 150 L80 100 C90 70, 90 45, 75 45 C60 45, 40 45, 25 45 Z" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <button 
                    onClick={capturePhoto}
                    className="w-16 h-16 bg-white rounded-full border-4 border-red-500 shadow-xl active:scale-90 transition-transform"
                  ></button>
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden"></canvas>

              {/* FOTO CAPTURADA */}
              {capturedImage && !resultImage && !loading && (
                <div className="w-full h-full relative flex flex-col">
                  <img src={capturedImage} alt="Captura" className="w-full h-full object-cover transform scale-x-[-1]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-0 w-full px-6">
                    <button 
                      onClick={applyTryOn}
                      className="w-full py-4 bg-gradient-to-r from-green-400 to-green-600 text-white font-black text-lg uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-transform animate-pulse"
                    >
                      ✨ Probarme el Traje ✨
                    </button>
                  </div>
                </div>
              )}

              {/* PANTALLA DE CARGA */}
              {loading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-20">
                  <div className="w-16 h-16 border-8 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-red-600 font-black uppercase tracking-widest animate-pulse">La IA está trabajando...</h3>
                  <p className="text-xs text-gray-500 font-bold mt-2">Ajustando medidas y texturas mágicamente</p>
                </div>
              )}

              {/* RESULTADO FINAL */}
              {resultImage && !loading && (
                <div className="w-full h-full relative animate-in fade-in duration-1000">
                  <img src={resultImage} alt="Resultado" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg uppercase">
                    Misión Cumplida
                  </div>
                </div>
              )}

              {/* ESTADO VACÍO */}
              {!cameraActive && !capturedImage && !resultImage && !loading && (
                <div className="text-center p-8 opacity-50">
                  <div className="text-6xl mb-4">👗</div>
                  <p className="font-bold uppercase tracking-widest text-slate-500">Espejo Mágico Apagado</p>
                </div>
              )}

            </div>
          </div>
          
          {errorMsg && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-200 text-red-700 font-black rounded-xl text-center uppercase text-sm">
              🚨 {errorMsg}
            </div>
          )}

        </div>
      </div>
    </RoomWrapper>
  );
}
