import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import SavePasswordPrompt from "../components/SavePasswordPrompt";
import { AuthContext } from "../context/AuthContext";
import WoodyBuzzImg from "../assets/woody_buzz_nobg.png";
import ToyStoreLogo from "../components/ToyStoreLogo";
import RoomWrapper from "../components/RoomWrapper";

const ToyPlane = () => {
  const [waiting, setWaiting] = useState(false);
  const [direction, setDirection] = useState('right');
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (waiting) return;
  }, [key, waiting]);

  const handleAnimationEnd = (e) => {
    // Evitar que el final de animación de los hijos (soldados/humo) resetee el avión prematuramente
    if (e.target !== e.currentTarget) return;

    setWaiting(true);
    setTimeout(() => {
      setDirection(prev => prev === 'right' ? 'left' : 'right');
      setKey(prev => prev + 1);
      setWaiting(false);
    }, 500);
  };

  if (waiting) return null;

  return (
    <div className="absolute top-36 left-0 w-full h-[35vh] overflow-visible pointer-events-none z-[40]">
      <div
        key={key}
        onAnimationEnd={handleAnimationEnd}
        className={`absolute flex items-center ${direction === 'right' ? 'flex-row animate-fly-right' : 'flex-row animate-fly-left'}`}
      >
        <div className="relative flex items-center">
          {/* Lógica de vuelo: Siempre el avión delante del cartel */}
          {direction === 'right' ? (
            <>
              <div className="plane-banner order-1">¡UN UNIVERSO DE PLACER TE ESPERA!</div>
              <div className="banner-rope order-2"></div>
              <div className="relative order-3">
                <img src="/images/plane_right.png?v=14" className="w-32 md:w-48 h-auto relative z-10" style={{ background: 'transparent' }} />
                {/* Humo Estático Infinito (Sin re-renders) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 animate-smoke-puff z-0" style={{ animationDelay: '0s' }}>
                  <div className="w-10 h-10 bg-[#e8f0fe] blur-xl rounded-full opacity-60"></div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-4 animate-smoke-puff z-0" style={{ animationDelay: '0.6s' }}>
                  <div className="w-10 h-10 bg-white blur-lg rounded-full opacity-80"></div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-4 animate-smoke-puff z-0" style={{ animationDelay: '1.2s' }}>
                  <div className="w-10 h-10 bg-white blur-xl rounded-full opacity-40"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative order-1">
                <img src="/images/plane_left.png?v=14" className="w-32 md:w-48 h-auto relative z-10" style={{ background: 'transparent' }} />
                {/* Humo Estático Infinito */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 animate-smoke-puff z-0" style={{ animationDelay: '0s' }}>
                  <div className="w-10 h-10 bg-[#e8f0fe] blur-xl rounded-full opacity-60"></div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 animate-smoke-puff z-0" style={{ animationDelay: '0.6s' }}>
                  <div className="w-10 h-10 bg-white blur-lg rounded-full opacity-80"></div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 animate-smoke-puff z-0" style={{ animationDelay: '1.2s' }}>
                  <div className="w-10 h-10 bg-white blur-xl rounded-full opacity-40"></div>
                </div>
              </div>
              <div className="banner-rope order-2"></div>
              <div className="plane-banner order-3">¡UN UNIVERSO DE PLACER TE ESPERA!</div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default function Inicio() {
  const auth = useContext(AuthContext);
  // Desestructuración defensiva para evitar errores si el contexto es undefined
  const { 
    usuario, logout, cargandoSesion, ageVerifiedGlobal, 
    confirmAge, isLoggedInHint, userNameHint, vistaAdmin, setVistaAdmin 
  } = auth || {};
  const navigate = useNavigate();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  // Control de vista (solo para admins)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // --- SEGURIDAD: VERIFICACIÓN DE EDAD ---
  const [verificationStage, setVerificationStage] = useState('initial'); // 'initial', 'proof', 'rejected'
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");
  const [activeInfo, setActiveInfo] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEnterPressed, setIsEnterPressed] = useState(false);

  // --- COMPONENTE INFO OVERLAY (PROFESIONAL) ---
  const InfoOverlay = () => {
    if (!isInfoOpen) return null;

    const content = {
      notice: {
        title: "NOTICE TO USERS (AVISO LEGAL)",
        text: (
          <div className="space-y-4 text-justify text-sm leading-relaxed">
            <p className="font-bold text-[#E52521]">POR FAVOR, LEA ESTE AVISO DETALLADAMENTE ANTES DE ACCEDER.</p>
            <p>Este sitio web, "Toy Store", es un espacio exclusivo para ADULTOS. El contenido mostrado aquí incluye representaciones gráficas, textos y productos relacionados con la sexualidad humana que pueden ser considerados explícitos.</p>
            <p>Al hacer clic en "Entrar", usted declara bajo juramento y bajo las penas de perjurio de su jurisdicción que: 1) Tiene al menos 18 años de edad (o la mayoría de edad legal en su lugar de residencia); 2) Accede al sitio de forma voluntaria; 3) No se siente ofendido por material erótico; 4) No permitirá que menores de edad tengan acceso a este dispositivo mientras navega en el sitio.</p>
            <p>Toy Store utiliza sistemas de verificación de identidad para garantizar que solo agentes autorizados (adultos) ingresen a nuestra base de datos. Cualquier intento de falsificación de edad es una violación de nuestros Términos de Servicio.</p>
          </div>
        )
      },
      law: {
        title: "AVISO A LAS FUERZAS DEL ORDEN",
        text: (
          <div className="space-y-4 text-justify text-sm leading-relaxed">
            <p className="font-bold text-[#E52521]">DECLARACIÓN DE CUMPLIMIENTO Y COOPERACIÓN LEGAL</p>
            <p>Toy Store opera bajo una política de tolerancia cero respecto a cualquier contenido ilegal, especialmente aquel relacionado con la explotación infantil. Cumplimos estrictamente con todas las leyes locales e internacionales de protección de menores.</p>
            <p>Contamos con un Oficial de Cumplimiento encargado de mantener registros detallados de acuerdo con los estándares de la industria (incluyendo regulaciones similares a la 18 U.S.C. 2257 cuando aplica). Cooperamos proactivamente con las autoridades de seguridad para reportar cualquier actividad sospechosa o intento de acceso por parte de menores.</p>
            <p>Nuestros sistemas de monitoreo están diseñados para detectar y bloquear el uso indebido de nuestra plataforma. Para consultas legales oficiales, por favor contacte a nuestro departamento de cumplimiento a través de los canales corporativos.</p>
          </div>
        )
      },
      parental: {
        title: "RECURSOS DE CONTROL PARENTAL",
        text: (
          <div className="space-y-4 text-justify text-sm leading-relaxed">
            <p className="font-bold text-blue-600 uppercase tracking-widest">Protegiendo a los más pequeños del Baúl de Juguetes</p>
            <p>En Toy Store nos tomamos muy en serio la seguridad de los menores. Si comparte su dispositivo con niños, le recomendamos encarecidamente utilizar herramientas de filtrado de contenido para adultos.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><a href="https://www.netnanny.com" target="_blank" className="text-[#00AEEF] font-bold">Net Nanny</a>: Software líder en filtrado y monitoreo parental.</li>
              <li><a href="https://www.cyberpatrol.com" target="_blank" className="text-[#00AEEF] font-bold">CyberPatrol</a>: Soluciones robustas para el control de acceso web.</li>
              <li><a href="https://www.opendns.com/home-internet-security/" target="_blank" className="text-[#00AEEF] font-bold">OpenDNS</a>: Guías gratuitas para configurar su red doméstica.</li>
            </ul>
            <p>Configurar estas herramientas es sencillo y garantiza que el contenido para adultos se mantenga fuera del alcance de quienes aún no están listos para él.</p>
          </div>
        )
      },
      terms: {
        title: "TÉRMINOS DE SERVICIO (LAS REGLAS DEL BAÚL)",
        text: (
          <div className="space-y-3 text-justify text-xs md:text-sm leading-relaxed overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
            <p className="font-bold text-gray-800">1. ACEPTACIÓN DEL JUEGO:</p>
            <p>Al utilizar este sitio, usted acepta que es mayor de edad y que los productos adquiridos son para uso personal y privado.</p>
            <p className="font-bold text-gray-800">2. PROPIEDAD INTELECTUAL:</p>
            <p>Todo el arte, logos y diseños de Toy Store (incluyendo la estética de Star Command y el Cuarto de Andy) son propiedad exclusiva. El uso no autorizado de nuestra marca será reportado.</p>
            <p className="font-bold text-gray-800">3. PRIVACIDAD DE DATOS (SEGURIDAD DE STAR COMMAND):</p>
            <p>Sus datos están encriptados. Nunca compartiremos su identidad con terceros, a menos que sea requerido por ley bajo orden judicial.</p>
            <p className="font-bold text-gray-800">4. GARANTÍA DE PRODUCTOS:</p>
            <p>Todos nuestros juguetes pasan por pruebas de calidad para asegurar que su experiencia de juego sea segura y satisfactoria.</p>
          </div>
        )
      }
    };

    const active = content[activeInfo];

    return (
      <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-10 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
        <div className="bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.5)] max-w-2xl w-full relative p-8 md:p-16 border-8 border-sky-400 animate-in zoom-in-95 duration-300 my-auto">
          <button
            onClick={() => setIsInfoOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-xl hover:bg-gray-200 hover:text-gray-800 transition-all z-10"
            title="Cerrar"
          >
            ×
          </button>

          <h4 className="text-2xl font-black text-[#0047AB] uppercase mb-8 tracking-tight text-center border-b-4 border-yellow-400 pb-3 inline-block w-full">
            {active?.title}
          </h4>

          <div className="text-gray-600 mb-4 overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar">
            {active?.text}
          </div>
        </div>
      </div>
    );
  };



  useEffect(() => {
    // Si no está verificado y NO hay usuario, bloqueamos el scroll del body
    if (!ageVerifiedGlobal && !usuario) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [ageVerifiedGlobal, usuario]);

  const handleVerifySuccess = () => {
    confirmAge();
  };

  useEffect(() => {
    if (verificationStage === 'rejected') {
      const timer = setTimeout(() => {
        window.location.replace("https://www.google.com");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [verificationStage]);

  const checkAge = () => {
    if (!dob) {
      setDobError("Ingresa tu fecha de nacimiento");
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 18) {
      handleVerifySuccess();
    } else {
      setVerificationStage('rejected');
    }
  };

  const handleLogout = () => {
    setCerrandoSesion(true);

    // Transición suave y retorno al portal de edad (Opcional si ya verificó)
    setTimeout(() => {
      logout();
      setVerificationStage('initial');
      setCerrandoSesion(false);
    }, 600);
  };

  const wallpaperAndy = (
    <div className="absolute inset-0 select-none pointer-events-none opacity-[0.15]">
      {/* Hilera 1 */}
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '5%', left: '5%', height: '170px', transform: 'rotate(-10deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '3%', left: '30%', height: '150px', transform: 'rotate(15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '6%', left: '55%', height: '160px', transform: 'rotate(-5deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '2%', left: '80%', height: '180px', transform: 'rotate(25deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

      {/* Hilera 2 */}
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '22%', left: '15%', height: '190px', transform: 'rotate(50deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '18%', left: '42%', height: '175px', transform: 'rotate(-15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '20%', left: '68%', height: '165px', transform: 'rotate(-10deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '23%', left: '92%', height: '160px', transform: 'rotate(10deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

      {/* Hilera 3 */}
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '40%', left: '8%', height: '185px', transform: 'rotate(-25deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '38%', left: '33%', height: '210px', transform: 'rotate(15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '42%', left: '58%', height: '165px', transform: 'rotate(8deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '39%', left: '85%', height: '195px', transform: 'rotate(-30deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

      {/* Hilera 4 */}
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '58%', left: '18%', height: '170px', transform: 'rotate(20deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '54%', left: '46%', height: '180px', transform: 'rotate(-40deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '60%', left: '72%', height: '200px', transform: 'rotate(35deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '57%', left: '94%', height: '155px', transform: 'rotate(-10deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

      {/* Hilera 5 */}
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '76%', left: '6%', height: '175px', transform: 'rotate(12deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '74%', left: '29%', height: '190px', transform: 'rotate(-15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=10" className="absolute" style={{ top: '78%', left: '52%', height: '205px', transform: 'rotate(25deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=10" className="absolute" style={{ top: '72%', left: '81%', height: '170px', transform: 'rotate(-20deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />

      {/* Hilera 6 */}
      <img src="/images/custom_pene.svg?v=18" className="absolute" style={{ top: '92%', left: '12%', height: '180px', transform: 'rotate(45deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=18" className="absolute" style={{ top: '89%', left: '40%', height: '165px', transform: 'rotate(-12deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_pene.svg?v=18" className="absolute" style={{ top: '91%', left: '65%', height: '190px', transform: 'rotate(15deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
      <img src="/images/custom_vulva.svg?v=18" className="absolute" style={{ top: '88%', left: '88%', height: '175px', transform: 'rotate(-30deg)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.1))' }} />
    </div>
  );

  return (
    <>
      {/* --- ELEMENTOS GLOBALES NÍTIDOS (SOLO AL CERRAR SESIÓN SI ES NECESARIO) --- */}
      {cerrandoSesion && (
        <>
          <div className="top-loading-bar animate-pulse"></div>
          <div className="loader-overlay-minimal"></div>
        </>
      )}

      {/* --- MODAL DE VERIFICACIÓN DE EDAD (BLOQUEO TOTAL) --- */}
      {(!ageVerifiedGlobal && !usuario && (!isLoggedInHint || !cargandoSesion)) && (
        <div className="fixed inset-0 z-[2000] flex flex-col items-center py-12 md:py-20 px-4 bg-white/20 backdrop-blur-[10px] animate-in fade-in duration-700 overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.4)] max-w-2xl w-full relative overflow-hidden py-16 px-8 md:px-20 flex flex-col items-center shrink-0 mb-12 border-[12px] border-[#81D4FA] active:shadow-inner transition-all">

            {/* Header: Nuevo Logo (Más grande y espacioso) */}
            <div className="mb-12">
              <ToyStoreLogo variant="new" scale={0.75} />
            </div>

            <div className="text-center w-full">
              {verificationStage === 'initial' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-3xl md:text-4xl font-black text-[#0047AB] mb-8 uppercase tracking-tight leading-tight drop-shadow-sm">Este es un Sitio Web para adultos</h3>

                  <div
                    onClick={() => { setActiveInfo('notice'); setIsInfoOpen(true); }}
                    className="inline-block border-2 border-[#E52521] text-[#E52521] font-bold px-6 py-1.5 rounded-full mb-8 text-xs uppercase tracking-widest bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    Notice to Users
                  </div>

                  <div className="text-gray-600 text-sm md:text-base leading-relaxed mb-12 font-medium max-w-lg mx-auto">
                    Este baúl de juguetes es una zona exclusiva para adultos. Nuestro sitio contiene material restringido a menores de edad, incluyendo representaciones explícitas y artículos orientados a la sexualidad y el placer. Al entrar, confirmas bajo juramento que tienes al menos 18 años de edad (o la mayoría de edad legal en tu jurisdicción), que accedes de forma voluntaria y que das tu completo consentimiento para explorar nuestro catálogo de juguetes y contenido para adultos.
                    <br />
                    <span
                      onClick={() => { setActiveInfo('law'); setIsInfoOpen(true); }}
                      className="text-[#E52521] font-black mt-4 block cursor-pointer hover:underline uppercase text-xs tracking-wider"
                    >
                      Aviso a las fuerzas del orden
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 w-full">
                    <button
                      onClick={() => setVerificationStage('proof')}
                      className="flex-1 bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-black py-5 rounded-full transition-all uppercase tracking-widest text-sm shadow-[0_8px_0_#ca8a04,0_15px_30px_rgba(202,138,4,0.3)] border-2 border-white/20 active:translate-y-2 active:shadow-[0_2px_0_#ca8a04] hover:brightness-110 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                      Tengo 18 años o más - Entrar
                    </button>
                    <button
                      onClick={() => setVerificationStage('rejected')}
                      className="flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white font-black py-5 rounded-full transition-all uppercase tracking-widest text-sm shadow-[0_8px_0_#991b1b,0_15px_30px_rgba(153,27,27,0.3)] border-2 border-white/20 active:translate-y-2 active:shadow-[0_2px_0_#991b1b] hover:brightness-110 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                      Soy menor de 18 años - Salir
                    </button>
                  </div>

                  <div className="mt-14 space-y-4">
                    <p className="text-[11px] text-gray-400 max-w-md mx-auto leading-relaxed">
                      Nuestra <span onClick={() => { setActiveInfo('parental'); setIsInfoOpen(true); }} className="text-[#00AEEF] font-bold cursor-pointer hover:underline">página de control parental</span> explica cómo bloquear fácilmente el acceso a este sitio.
                    </p>
                    <div className="flex justify-center items-center gap-8 text-[11px] font-black text-[#E52521] uppercase tracking-widest">
                      <span onClick={() => { setActiveInfo('terms'); setIsInfoOpen(true); }} className="cursor-pointer hover:underline">Términos de Servicio</span>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-center items-center gap-3 opacity-30 grayscale pointer-events-none text-gray-400">
                    <span className="text-xs font-black">© ToyStore.com, 2026</span>
                    <div className="bg-[#0047AB] text-white px-2 py-0.5 rounded font-black text-[10px]">RTA</div>
                  </div>
                </div>
              )}

              {verificationStage === 'proof' && (
                <div className="animate-in slide-in-from-right-8 duration-300 w-full max-w-md mx-auto">
                  <h3 className="text-2xl font-black text-[#0047AB] uppercase mb-4 tracking-tight">VALIDACIÓN DE RANGO</h3>
                  <p className="text-[#E52521] text-xs font-black uppercase mb-10 tracking-wider">Ingresa tu fecha de origen para confirmar tu mayoría de edad</p>

                  <div className="space-y-6 mb-12">
                    <div className="relative group text-left">
                      <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-5 tracking-[3px]">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => { setDob(e.target.value); setDobError(""); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEnterPressed(true);
                            checkAge();
                          }
                        }}
                        onKeyUp={(e) => { if (e.key === 'Enter') setIsEnterPressed(false); }}
                        className="w-full bg-gray-50 border-2 border-gray-100 px-8 py-5 rounded-[1.5rem] outline-none focus:border-[#00AEEF] transition-all font-bold text-xl text-gray-800 uppercase"
                      />
                      {dobError && <p className="text-[#E52521] text-xs font-black mt-3 uppercase text-center animate-bounce">{dobError}</p>}
                    </div>
                  </div>

                  <button
                    onClick={checkAge}
                    className={`w-full bg-gradient-to-br from-[#00AEEF] to-[#0047AB] text-white font-black py-5 rounded-full transition-all uppercase tracking-widest text-sm shadow-[0_8px_0_#002152,0_15px_30px_rgba(0,33,82,0.3)] border-2 border-white/20 active:translate-y-2 active:shadow-[0_2px_0_#002152] hover:brightness-110 relative overflow-hidden group ${isEnterPressed ? 'translate-y-2 shadow-[0_2px_0_#002152] brightness-110' : ''}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                    CONFIRMAR IDENTIDAD
                  </button>
                  <button
                    onClick={() => setVerificationStage('initial')}
                    className="w-full mt-8 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#00AEEF] text-center"
                  >
                    REGRESAR AL INICIO
                  </button>
                </div>
              )}

              {verificationStage === 'rejected' && (
                <div className="animate-in zoom-in-95 duration-500 w-full flex flex-col items-center justify-center min-h-[300px]">
                  <h3 className="text-3xl md:text-4xl font-black text-[#E52521] uppercase tracking-tighter mb-8 border-b-4 border-[#E52521] pb-2 inline-block">
                    ACCESO DENEGADO
                  </h3>

                  <div className="bg-gray-50 p-8 md:p-10 rounded-[2rem] border-2 border-gray-200 mb-10 w-full max-w-lg shadow-inner flex flex-col items-center text-center">
                    <svg className="w-12 h-12 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <p className="text-gray-700 font-bold leading-relaxed text-sm md:text-base">
                      La verificación de edad no ha sido aprobada.
                      <br /><br />
                      En cumplimiento con nuestras políticas de seguridad y regulaciones vigentes de protección a menores, no podemos concederle el acceso a este sitio.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs font-black text-[#0047AB] uppercase tracking-widest animate-pulse bg-blue-50 px-6 py-3 rounded-full border border-blue-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    <span>Redirigiendo a entorno seguro en 5 segundos...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pie de modal */}
            <div className="bg-gray-50/50 w-full py-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest border-t border-gray-100 text-center mt-auto">
              Seguridad del Baúl de Andy • {verificationStage === 'rejected' ? 'Acceso Bloqueado' : 'Star Command Encryption'}
            </div>
          </div>
        </div>
      )}

      {/* --- HABITACIÓN DE ANDY (DESENFOCADA SI NO SE HA VERIFICADO) --- */}
      <RoomWrapper
        theme="andy"
        wallpaperContent={wallpaperAndy}
        isBlurred={(!ageVerifiedGlobal && !usuario) || showLoginPrompt || cerrandoSesion}
        showFooter={true}
      >
        <SavePasswordPrompt />
        {/* --- CONTENIDO PRINCIPAL (DESENFOCADO SI NO SE HA VERIFICADO) --- */}
        <div className={`flex flex-col flex-1 transition-all duration-1000 ${(!ageVerifiedGlobal && !usuario && !isLoggedInHint) ? 'blur-2xl pointer-events-none scale-110 grayscale' : 'blur-0 opacity-100 scale-100 grayscale-0'}`}>

          {/* --- HABITACIÓN DE ANDY --- */}
          <main className="flex-1 flex flex-col items-center justify-start py-10 px-6 relative">
            <div className="w-full max-w-2xl mt-44 z-30 relative group px-6 mx-auto">
              <div className="relative bg-[#fdfaf6] border-[8px] border-white rounded-t-[100px] rounded-b-xl shadow-[15px_15px_40px_rgba(0,0,0,0.08),inset_0_0_15px_rgba(0,0,0,0.03)] overflow-hidden min-h-[500px] flex flex-col border-b-[12px]">
                <div className="h-24 w-full flex items-center justify-center bg-white/50 border-b-2 border-white">
                  <div className="px-6 py-1 border-2 border-blue-900/10 rounded-full">
                    <span className="text-[10px] font-black text-blue-900 tracking-[5px] uppercase opacity-40">COLECCIÓN PENSADA EN TI</span>
                  </div>
                </div>
                {[
                  { items: [{ name: "Vibradores", icon: "🍆", img: "/images/vibrador_cowgirl.png", cat: "vibradores", color: "hover:drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]" }, { name: "Lencerias", icon: "👙", img: "/images/lenceria_andy.png", cat: "lencerias", color: "hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]" }] },
                  { items: [{ name: "Anales", icon: "🍑", img: "/images/plug_anal.png", cat: "anales", color: "hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]" }, { name: "Kits", icon: "📦", img: "/images/mystery_box.png", cat: "kits", color: "hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" }] }
                ].map((shelf, sIdx) => (
                  <div key={sIdx} className="relative w-full h-[280px] md:h-[320px] flex flex-col justify-end pb-8 group/shelf border-b border-white last:border-b-0">
                    <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>
                    <div className="flex justify-around items-end px-10 relative z-10 mb-2">
                      {shelf.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex flex-col items-center group/toy cursor-pointer transition-all duration-500 hover:scale-105" onClick={() => !usuario ? setShowLoginPrompt(true) : navigate(`/tienda?cat=${item.cat}`)}>
                          <div className={`relative transition-all duration-700 ${item.color} flex flex-col items-center justify-end h-40 md:h-52`}>
                            {item.img ? (
                              <img src={item.img} alt={item.name} className="w-32 md:w-56 h-full object-contain drop-shadow-xl sticker-bounce" />
                            ) : (
                              <span className="text-7xl md:text-[10rem] leading-none drop-shadow-lg sticker-bounce block">{item.icon}</span>
                            )}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/10 blur-md rounded-full opacity-40"></div>
                          </div>
                          <p className="mt-4 text-[10px] font-black text-blue-900/40 uppercase tracking-[3px] text-center">{item.name}</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-5 w-full bg-gradient-to-b from-white to-[#f5f5f5] shadow-sm border-t border-gray-100"></div>
                  </div>
                ))}
              </div>
              <div className="w-[102%] h-[102%] bg-black/5 blur-3xl absolute -top-1 -left-[1%] -z-10 rounded-t-[100px]"></div>
            </div>

            <div className="mt-16 mb-10 z-30">
              <button
                onClick={() => !usuario ? setShowLoginPrompt(true) : navigate('/tienda')}
                className="btn-red-toystore"
              >
                VER CATÁLOGO
              </button>
            </div>

            <ToyPlane />

          </main>

          {/* --- MODAL LOGIN REQUIRED --- */}
          {showLoginPrompt && (
            <div className="fixed inset-0 z-[998] flex items-center justify-center p-4 bg-white/20 backdrop-blur-[6px] animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative animate-in zoom-in-95 duration-300 border-4 border-yellow-400 z-[999]">
                <button onClick={() => setShowLoginPrompt(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                <div className="text-center mb-6">
                  <ToyStoreLogo scale={0.7} variant="new" />
                  <h3 className="text-2xl font-black text-blue-900 uppercase -mt-4">¡Únete a la Diversión!</h3>
                  <p className="text-gray-500 text-sm mt-2">Para ver el catálogo completo necesitas una cuenta.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/login')} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 rounded-xl transition shadow-md">INICIAR SESIÓN</button>
                  <button onClick={() => navigate('/registro')} className="w-full bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold py-3 rounded-xl transition">REGISTRARSE</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </RoomWrapper>
      <InfoOverlay />
    </>
  );
}