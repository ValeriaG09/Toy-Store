import React from 'react';

/**
 * Colección oficial de sombreros y accesorios de personajes de Toy Store.
 * Diseñados con alto nivel de detalle vectorial (Pixar/Disney aesthetic) y
 * calibrados con precisión matemática para descansar sobre el avatar como el sombrero de vaquero.
 */
export default function AvatarHat({ type = 'woody', size = 'lg', className = '' }) {
  if (!type || type === 'none') return null;

  // Calibración exacta de tamaños y posiciones para que el ala o base descanse sobre la curvatura superior del avatar
  let sizeClasses = '';
  if (size === 'navbar') {
    // Para avatar de 36-44px en Navbar y Notificaciones (ala descansa directamente sobre la frente)
    sizeClasses = 'absolute -top-[12px] left-1/2 -translate-x-1/2 w-[46px] md:w-[48px] z-20 pointer-events-none drop-shadow-sm';
  } else if (size === 'sm' || size === 'sidebar') {
    // Para avatar de 48-56px en la barra lateral
    sizeClasses = 'absolute -top-[15px] left-1/2 -translate-x-1/2 w-[58px] z-20 pointer-events-none drop-shadow-sm';
  } else if (size === 'md') {
    // Para avatar de 80-84px en el vestidor y vista previa de edición
    sizeClasses = 'absolute -top-[23px] left-1/2 -translate-x-1/2 w-[86px] z-20 pointer-events-none drop-shadow-sm';
  } else if (size === 'preview') {
    // Para los recuadros de la cuadrícula de gorritos
    sizeClasses = 'relative w-16 h-12 pointer-events-none drop-shadow-xs flex items-center justify-center';
  } else {
    // 'lg' o 'hero': Para el avatar principal de 112px a 128px en Perfil (ala abraza perfectamente la curvatura superior)
    sizeClasses = 'absolute -top-[28px] sm:-top-[32px] left-1/2 -translate-x-1/2 w-[114px] sm:w-[130px] z-20 pointer-events-none drop-shadow-md';
  }

  switch (type) {
    case 'woody':
      // Sombrero de vaquero de lujo del Sheriff Woody con textura de cuero, pespuntes reales y estrella dorada
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="woodyCrownRich" x1="50" y1="12" x2="50" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A14A17" />
                <stop offset="0.5" stopColor="#87360A" />
                <stop offset="1" stopColor="#5E2305" />
              </linearGradient>
              <linearGradient id="woodyBrimRich" x1="50" y1="36" x2="50" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#B45920" />
                <stop offset="0.6" stopColor="#92400E" />
                <stop offset="1" stopColor="#622907" />
              </linearGradient>
              <linearGradient id="woodyGoldBadge" x1="50" y1="34" x2="50" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047" />
                <stop offset="1" stopColor="#CA8A04" />
              </linearGradient>
            </defs>

            {/* Sombra proyectada por la copa sobre el ala */}
            <ellipse cx="50" cy="40" rx="30" ry="6" fill="#3D1703" opacity="0.4" />

            {/* Copa del sombrero con hendidura realista y volumen */}
            <path
              d="M22 41C21 21 34 13 50 13C66 13 79 21 78 41C70 41 60 39 50 39C40 39 30 41 22 41Z"
              fill="url(#woodyCrownRich)"
              stroke="#451A03"
              strokeWidth="2"
            />
            {/* Hendidura vaquera superior de la copa */}
            <path
              d="M37 18C43 15 57 15 63 18"
              stroke="#3D1703"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M39 19C45 17 55 17 61 19"
              stroke="#B45920"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Cinta de cuero labrado marrón oscuro */}
            <path
              d="M21 37C21 37 34 33 50 33C66 33 79 37 79 37V42C79 42 66 38 50 38C34 38 21 42 21 42V37Z"
              fill="#3D1703"
              stroke="#260D02"
              strokeWidth="0.8"
            />

            {/* Estrella dorada de Sheriff en el centro de la cinta */}
            <g transform="translate(50, 36.5)">
              <polygon points="0,-4 1.2,-1.2 4,-1.2 1.8,0.5 2.6,3.2 0,1.6 -2.6,3.2 -1.8,0.5 -4,-1.2 -1.2,-1.2" fill="url(#woodyGoldBadge)" stroke="#854D0E" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1" fill="#FEF08A" />
            </g>

            {/* Ala ancha de vaquero curvada que abraza el avatar (y=38 a y=55) */}
            <path
              d="M4 45C4 45 14 37 50 37C86 37 96 45 96 45C96 45 86 55 50 55C14 55 4 45 4 45Z"
              fill="url(#woodyBrimRich)"
              stroke="#451A03"
              strokeWidth="2"
            />

            {/* Costura artesanal cruzada en cuero canela icónica del sombrero de Woody */}
            <path
              d="M10 44.5L13 42M20 41L23 39M30 38.5L33 37.5M40 37.5L43 37M57 37L60 37.5M67 37.5L70 38.5M77 39L80 41M87 42L90 44.5"
              stroke="#FEF3C7"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Pespunte cruzado en X característico en los extremos */}
            <path d="M13 44.5L10 42M90 42L87 44.5" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" />

            {/* Línea de brillo en el borde superior del ala */}
            <path
              d="M16 43C26 39 38 38 50 38C62 38 74 39 84 43"
              stroke="#D97706"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>
      );

    case 'jessie':
      // Sombrero de vaquera de lujo de Jessie con pespunte blanco laceado, lazo con herradura y terciopelo rojo
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="jessieCrownRich" x1="50" y1="12" x2="50" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EF4444" />
                <stop offset="0.6" stopColor="#DC2626" />
                <stop offset="1" stopColor="#991B1B" />
              </linearGradient>
              <linearGradient id="jessieBrimRich" x1="50" y1="36" x2="50" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F87171" />
                <stop offset="0.5" stopColor="#EF4444" />
                <stop offset="1" stopColor="#B91C1C" />
              </linearGradient>
            </defs>

            {/* Sombra de la copa sobre el ala */}
            <ellipse cx="50" cy="40" rx="30" ry="6" fill="#7F1D1D" opacity="0.4" />

            {/* Copa de fieltro rojo pasión */}
            <path
              d="M22 41C21 21 34 13 50 13C66 13 79 21 78 41C70 41 60 39 50 39C40 39 30 41 22 41Z"
              fill="url(#jessieCrownRich)"
              stroke="#7F1D1D"
              strokeWidth="2"
            />
            {/* Hendidura de vaquera en la parte superior */}
            <path
              d="M37 18C43 15 57 15 63 18"
              stroke="#7F1D1D"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M39 19C45 17 55 17 61 19"
              stroke="#FCA5A5"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Cinta blanca de Jessie con ribete plateado */}
            <path
              d="M21 37C21 37 34 33 50 33C66 33 79 37 79 37V42C79 42 66 38 50 38C34 38 21 42 21 42V37Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="0.8"
            />
            {/* Detalle central de hebilla / lazo en la cinta */}
            <g transform="translate(50, 36.5)">
              <circle cx="0" cy="0" r="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.5" fill="#EF4444" />
            </g>

            {/* Ala ancha curvada roja de vaquera que abraza el avatar (y=38 a y=55) */}
            <path
              d="M4 45C4 45 14 37 50 37C86 37 96 45 96 45C96 45 86 55 50 55C14 55 4 45 4 45Z"
              fill="url(#jessieBrimRich)"
              stroke="#7F1D1D"
              strokeWidth="2"
            />

            {/* El icónico pespunte / lazo blanco grueso de Jessie a lo largo de todo el borde exterior */}
            <path
              d="M8 45C17 38.5 33 38 50 38C67 38 83 38.5 92 45"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
            {/* Pespunte inferior que contornea el borde */}
            <path
              d="M12 47C22 52 35 54 50 54C65 54 78 52 88 47"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              opacity="0.85"
            />
          </svg>
        </div>
      );

    case 'buzz':
      // Casco espacial de astronauta Star Command de Buzz Lightyear
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="buzzHoodGrad" x1="50" y1="12" x2="50" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A855F7" />
                <stop offset="0.6" stopColor="#9333EA" />
                <stop offset="1" stopColor="#6B21A8" />
              </linearGradient>
              <linearGradient id="buzzArmorGrad" x1="50" y1="42" x2="50" y2="55" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ADE80" />
                <stop offset="0.5" stopColor="#22C55E" />
                <stop offset="1" stopColor="#15803D" />
              </linearGradient>
              <linearGradient id="buzzVisorGrad" x1="50" y1="18" x2="50" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" stopOpacity="0.45" />
                <stop offset="1" stopColor="#0284C7" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="buzzWhiteShell" x1="50" y1="10" x2="50" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#E2E8F0" />
              </linearGradient>
            </defs>

            {/* Capucha morada espacial base */}
            <path
              d="M22 50C16 32 26 12 50 12C74 12 84 32 78 50C70 48 60 46 50 46C40 46 30 48 22 50Z"
              fill="url(#buzzHoodGrad)"
              stroke="#581C87"
              strokeWidth="2"
            />
            {/* Nervadura aerodinámica central de la capucha */}
            <path d="M50 12V24" stroke="#D8B4FE" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="27" r="1.5" fill="#E9D5FF" />

            {/* Borde exterior del casco blanco de Star Command */}
            <path
              d="M20 48C18 36 22 26 27 20C25 28 26 38 27 46"
              fill="url(#buzzWhiteShell)"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
            <path
              d="M80 48C82 36 78 26 73 20C75 28 74 38 73 46"
              fill="url(#buzzWhiteShell)"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />

            {/* Visera esférica de cristal transparente de Buzz */}
            <path
              d="M25 45C24 26 35 18 50 18C65 18 76 26 75 45C67 48 50 49 25 45Z"
              fill="url(#buzzVisorGrad)"
              stroke="#38BDF8"
              strokeWidth="1.2"
            />
            {/* Brillo curvo del cristal de la escafandra */}
            <path
              d="M32 28C36 21 44 20 54 21"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
            <circle cx="64" cy="26" r="1.5" fill="#FFFFFF" fillOpacity="0.75" />

            {/* Cuello / Armadura verde Star Command que abraza el avatar (y=44 a y=55) */}
            <path
              d="M17 50C27 45 38 43 50 43C62 43 73 45 83 50C83 50 73 55 50 55C27 55 17 50 17 50Z"
              fill="url(#buzzArmorGrad)"
              stroke="#14532D"
              strokeWidth="2"
            />
            {/* Costura / franja negra de blindaje */}
            <path d="M22 51C31 47 40 45 50 45C60 45 69 47 78 51" stroke="#064E3B" strokeWidth="1" strokeDasharray="3 2" />

            {/* Emblema Star Command / Alas de Space Ranger en el centro */}
            <g transform="translate(42, 45)">
              <rect x="0" y="2" width="5" height="3" rx="1" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.5" />
              <rect x="11" y="2" width="5" height="3" rx="1" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.5" />
              <polygon points="8,1 9.5,4 12,4 10,6 11,9 8,7.5 5,9 6,6 4,4 6.5,4" fill="#FBBF24" stroke="#B45309" strokeWidth="0.5" />
            </g>

            {/* Comunicador auricular izquierdo rojo con detalle plateado */}
            <g>
              <rect x="12" y="34" width="8" height="15" rx="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <rect x="14" y="37" width="4" height="4" rx="2" fill="#FCA5A5" />
              <circle cx="16" cy="45" r="1.2" fill="#FFFFFF" />
            </g>

            {/* Comunicador auricular derecho con antena sensor */}
            <g>
              {/* Antena fina que sube */}
              <path d="M83 34V22" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="83" cy="21" r="2" fill="#22C55E" stroke="#14532D" strokeWidth="1" />
              {/* Módulo auricular verde */}
              <rect x="80" y="34" width="8" height="15" rx="4" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
              <rect x="82" y="37" width="4" height="4" rx="2" fill="#A7F3D0" />
              <circle cx="84" cy="45" r="1.2" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      );

    case 'lotso':
      // Gorro de peluche premium del oso Lotso con orejitas acolchadas, fresita 3D y textura afelpada
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="lotsoPlushGrad" x1="50" y1="10" x2="50" y2="52" gradientUnits="userSpaceOnUse">
                <stop stopColor="#DB2777" />
                <stop offset="0.4" stopColor="#BE185D" />
                <stop offset="0.9" stopColor="#831843" />
                <stop offset="1" stopColor="#500724" />
              </linearGradient>
              <linearGradient id="lotsoEarInner" x1="24" y1="12" x2="24" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FCE7F3" />
                <stop offset="1" stopColor="#FBCFE8" />
              </linearGradient>
              <linearGradient id="lotsoBerry3D" x1="4" y1="2" x2="16" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB7185" />
                <stop offset="0.4" stopColor="#E11D48" />
                <stop offset="1" stopColor="#881337" />
              </linearGradient>
            </defs>

            {/* Oreja Izquierda afelpada con costuras de muñeco */}
            <g transform="rotate(-18 22 20)">
              <circle cx="22" cy="20" r="14.5" fill="url(#lotsoPlushGrad)" stroke="#500724" strokeWidth="2" />
              {/* Almohadilla de terciopelo rosa pastel */}
              <ellipse cx="22" cy="21" rx="8.5" ry="9" fill="url(#lotsoEarInner)" stroke="#F472B6" strokeWidth="1" />
              {/* Costuras visibles de peluche alrededor */}
              <circle cx="22" cy="21" r="11" stroke="#FCE7F3" strokeWidth="0.9" strokeDasharray="2 2" fill="none" opacity="0.75" />
            </g>

            {/* Oreja Derecha afelpada */}
            <g transform="rotate(18 78 20)">
              <circle cx="78" cy="20" r="14.5" fill="url(#lotsoPlushGrad)" stroke="#500724" strokeWidth="2" />
              <ellipse cx="78" cy="21" rx="8.5" ry="9" fill="url(#lotsoEarInner)" stroke="#F472B6" strokeWidth="1" />
              <circle cx="78" cy="21" r="11" stroke="#FCE7F3" strokeWidth="0.9" strokeDasharray="2 2" fill="none" opacity="0.75" />
            </g>

            {/* Cabeza / Capucha abovedada de peluche suave */}
            <path
              d="M18 50C14 28 26 13 50 13C74 13 86 28 82 50C73 47 62 44 50 44C38 44 27 47 18 50Z"
              fill="url(#lotsoPlushGrad)"
              stroke="#500724"
              strokeWidth="2.2"
            />

            {/* Mechoncito de peluche tierno en la coronilla */}
            <path
              d="M44 14C43 9 47 7 50 10C53 7 57 9 56 14"
              fill="#DB2777"
              stroke="#500724"
              strokeWidth="1.5"
            />

            {/* Cejotas gruesas moradas de terciopelo de Lotso */}
            <path d="M33 25C36 22 42 23 45 27" stroke="#4A044E" strokeWidth="3" strokeLinecap="round" />
            <path d="M67 25C64 22 58 23 55 27" stroke="#4A044E" strokeWidth="3" strokeLinecap="round" />

            {/* Ojitos brillantes de botón de peluche */}
            <ellipse cx="38" cy="31" rx="3.2" ry="3.6" fill="#2E022D" />
            <circle cx="37" cy="29.5" r="1.1" fill="#FFFFFF" />
            <ellipse cx="62" cy="31" rx="3.2" ry="3.6" fill="#2E022D" />
            <circle cx="61" cy="29.5" r="1.1" fill="#FFFFFF" />

            {/* Hocico de peluche rosado acolchado */}
            <ellipse cx="50" cy="39" rx="11" ry="7" fill="#FDF2F8" stroke="#F472B6" strokeWidth="1.2" />
            {/* Gran nariz morada aterciopelada característica de Lotso */}
            <ellipse cx="50" cy="36.5" rx="5.2" ry="3.6" fill="#581C87" stroke="#3B0764" strokeWidth="0.8" />
            <ellipse cx="48.5" cy="35.5" rx="1.6" ry="0.9" fill="#E9D5FF" />
            {/* Sonrisa afable de osito */}
            <path d="M46 40.5C48 43 52 43 54 40.5" stroke="#581C87" strokeWidth="1.5" strokeLinecap="round" />

            {/* Dobladillo inferior suave con pespunte artesanal que abraza el avatar (y=44 a y=55) */}
            <path
              d="M16 50C26 45 38 43 50 43C62 43 74 45 84 50C84 50 74 55 50 55C26 55 16 50 16 50Z"
              fill="#9D174D"
              stroke="#500724"
              strokeWidth="2"
            />
            <path d="M20 51C30 47 40 45 50 45C60 45 70 47 80 51" stroke="#FCE7F3" strokeWidth="1.2" strokeDasharray="3 2" />

            {/* La famosa Fresa de Lotso en 3D en la parte superior derecha con brillo */}
            <g transform="translate(67, 5) rotate(14)">
              {/* Sombra de la fresa */}
              <ellipse cx="8.5" cy="11.5" rx="6.5" ry="7.5" fill="#3B0764" opacity="0.35" />
              {/* Cuerpo carnoso y brillante de la fresa */}
              <path
                d="M8.5 2C8.5 2 2 8.5 2 13C2 17 5.5 19.5 8.5 19.5C11.5 19.5 15 17 15 13C15 8.5 8.5 2 8.5 2Z"
                fill="url(#lotsoBerry3D)"
                stroke="#701A75"
                strokeWidth="1.2"
              />
              {/* Semillas doradas detalladas con relieve */}
              <circle cx="5.5" cy="9" r="0.7" fill="#FEF08A" />
              <circle cx="8.5" cy="8" r="0.7" fill="#FEF08A" />
              <circle cx="11.5" cy="9" r="0.7" fill="#FEF08A" />
              <circle cx="6.5" cy="13" r="0.7" fill="#FEF08A" />
              <circle cx="10" cy="13" r="0.7" fill="#FEF08A" />
              <circle cx="8.5" cy="16.5" r="0.7" fill="#FEF08A" />
              {/* Hojas verdes y tallito */}
              <path d="M8.5 3V0.5" stroke="#14532D" strokeWidth="1.8" strokeLinecap="round" />
              <path
                d="M3.5 3.5C5.5 5 8.5 4.5 8.5 4.5C8.5 4.5 11.5 5 13.5 3.5C12.5 5.5 10.5 6 8.5 6C6.5 6 4.5 5.5 3.5 3.5Z"
                fill="#22C55E"
                stroke="#15803D"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>
      );

    case 'alien':
      // Gorro del Marcianito de Pizza Planet con sus 3 ojos, antena sensorial y cuello espacial
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="alienSkinGrad" x1="50" y1="12" x2="50" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A3E635" />
                <stop offset="0.6" stopColor="#84CC16" />
                <stop offset="1" stopColor="#4D7C0F" />
              </linearGradient>
              <linearGradient id="alienCollarGrad" x1="50" y1="44" x2="50" y2="55" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#1E40AF" />
              </linearGradient>
            </defs>

            {/* Oreja puntiaguda izquierda icónica de marciano */}
            <path
              d="M32 40C20 37 10 30 3 23C11 27 20 32 30 34"
              fill="url(#alienSkinGrad)"
              stroke="#365314"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M26 36C18 33 12 28 8 25" stroke="#365314" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

            {/* Oreja puntiaguda derecha */}
            <path
              d="M68 40C80 37 90 30 97 23C89 27 80 32 70 34"
              fill="url(#alienSkinGrad)"
              stroke="#365314"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M74 36C82 33 88 28 92 25" stroke="#365314" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

            {/* Tallo de la antena con resorte o eslabones */}
            <path d="M50 26V8" stroke="#365314" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50 26V8" stroke="#84CC16" strokeWidth="2" strokeLinecap="round" />
            {/* Esfera luminosa de la antena (The Claw!) */}
            <circle cx="50" cy="7" r="5.5" fill="#84CC16" stroke="#365314" strokeWidth="1.6" />
            <circle cx="48" cy="5.5" r="1.6" fill="#FFFFFF" />

            {/* Cabeza suave y abovedada del marcianito */}
            <path
              d="M22 48C18 28 28 14 50 14C72 14 82 28 78 48C70 46 60 44 50 44C40 44 30 46 22 48Z"
              fill="url(#alienSkinGrad)"
              stroke="#365314"
              strokeWidth="2"
            />

            {/* TRES OJOS EXPRESIVOS DE MARCIANO DISNEY PIXAR */}
            {/* Ojo Izquierdo */}
            <g>
              <ellipse cx="34" cy="32" rx="6.5" ry="7" fill="#FFFFFF" stroke="#365314" strokeWidth="1.5" />
              <ellipse cx="34" cy="31.5" rx="3" ry="3.2" fill="#0F172A" />
              <circle cx="32.5" cy="30" r="1.2" fill="#FFFFFF" />
            </g>

            {/* Ojo Central (más grande y prominente) */}
            <g>
              <ellipse cx="50" cy="28.5" rx="7.5" ry="8" fill="#FFFFFF" stroke="#365314" strokeWidth="1.6" />
              <ellipse cx="50" cy="28" rx="3.5" ry="3.8" fill="#0F172A" />
              <circle cx="48" cy="26" r="1.4" fill="#FFFFFF" />
            </g>

            {/* Ojo Derecho */}
            <g>
              <ellipse cx="66" cy="32" rx="6.5" ry="7" fill="#FFFFFF" stroke="#365314" strokeWidth="1.5" />
              <ellipse cx="66" cy="31.5" rx="3" ry="3.2" fill="#0F172A" />
              <circle cx="64.5" cy="30" r="1.2" fill="#FFFFFF" />
            </g>

            {/* Sonrisa simpática de asombro "Ooooohhh!" */}
            <ellipse cx="50" cy="41" rx="3" ry="2" fill="#1E3A8A" stroke="#365314" strokeWidth="0.8" />

            {/* Cuello / Uniforme azul de Pizza Planet que descansa sobre la cabeza (y=45 a y=55) */}
            <path
              d="M17 50C27 45 38 43 50 43C62 43 73 45 83 50C83 50 73 55 50 55C27 55 17 50 17 50Z"
              fill="url(#alienCollarGrad)"
              stroke="#1E3A8A"
              strokeWidth="2"
            />

            {/* Logotipo de Pizza Planet en el centro del cuello (Planeta con anillo y cohete) */}
            <g transform="translate(50, 49)">
              <ellipse cx="0" cy="0" rx="4.5" ry="1.8" fill="#FBBF24" stroke="#B45309" strokeWidth="0.6" transform="rotate(-15)" />
              <circle cx="0" cy="0" r="2.2" fill="#EF4444" />
              <circle cx="-0.8" cy="-0.6" r="0.6" fill="#FBBF24" />
            </g>
          </svg>
        </div>
      );

    case 'rex':
      // Gorro / Casco del simpático dinosaurio Rex con ojos saltones, escamas y dientecitos
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="rexSkinGrad" x1="50" y1="12" x2="50" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ADE80" />
                <stop offset="0.6" stopColor="#22C55E" />
                <stop offset="1" stopColor="#15803D" />
              </linearGradient>
              <linearGradient id="rexRidgeGrad" x1="50" y1="5" x2="50" y2="15" gradientUnits="userSpaceOnUse">
                <stop stopColor="#86EFAC" />
                <stop offset="1" stopColor="#22C55E" />
              </linearGradient>
            </defs>

            {/* Cresta / Escamas dorsales triangulares sobre la cabeza */}
            <path d="M44 14L48 5L52 14" fill="url(#rexRidgeGrad)" stroke="#14532D" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M33 17L37 9L41 17" fill="url(#rexRidgeGrad)" stroke="#14532D" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M59 17L63 9L67 17" fill="url(#rexRidgeGrad)" stroke="#14532D" strokeWidth="1.5" strokeLinejoin="round" />

            {/* Cabeza robusta y simpática de T-Rex */}
            <path
              d="M20 48C18 28 28 14 50 14C72 14 82 28 80 48C72 45 61 43 50 43C39 43 28 45 20 48Z"
              fill="url(#rexSkinGrad)"
              stroke="#14532D"
              strokeWidth="2"
            />
            {/* Manchas de piel de reptil amigable */}
            <circle cx="28" cy="28" r="2.2" fill="#16A34A" fillOpacity="0.6" />
            <circle cx="72" cy="28" r="2.2" fill="#16A34A" fillOpacity="0.6" />
            <circle cx="50" cy="18" r="1.8" fill="#16A34A" fillOpacity="0.6" />

            {/* OJOS GRANDES Y SALTONES DE REX CON MIRADA AMIGABLE */}
            {/* Ojo Izquierdo */}
            <g>
              <circle cx="36" cy="24" r="7.5" fill="#22C55E" stroke="#14532D" strokeWidth="1.5" />
              <circle cx="36" cy="24" r="5.5" fill="#FFFFFF" />
              <circle cx="37" cy="24" r="2.8" fill="#14532D" />
              <circle cx="36" cy="22.5" r="1" fill="#FFFFFF" />
              <path d="M30 18C33 16 39 16 42 19" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Ojo Derecho */}
            <g>
              <circle cx="64" cy="24" r="7.5" fill="#22C55E" stroke="#14532D" strokeWidth="1.5" />
              <circle cx="64" cy="24" r="5.5" fill="#FFFFFF" />
              <circle cx="63" cy="24" r="2.8" fill="#14532D" />
              <circle cx="62" cy="22.5" r="1" fill="#FFFFFF" />
              <path d="M70 18C67 16 61 16 58 19" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Hocico redondeado con fosas nasales */}
            <ellipse cx="44" cy="35" rx="1.5" ry="2.2" fill="#14532D" />
            <ellipse cx="56" cy="35" rx="1.5" ry="2.2" fill="#14532D" />

            {/* Interior de la boca en tono rojizo oscuro */}
            <path
              d="M18 50C28 45 38 43 50 43C62 43 72 45 82 50C82 50 72 55 50 55C28 55 18 50 18 50Z"
              fill="#881337"
              stroke="#14532D"
              strokeWidth="1.8"
            />

            {/* DIENTECITOS BLANCOS DE CARTOON QUE MUERDEN SUAVEMENTE EL AVATAR (y=47 a y=55) */}
            <path
              d="M24 48L27 53L30 47L34 54L38 46L43 54L48 45L53 54L58 46L62 54L66 47L70 53L73 48"
              fill="#FFFFFF"
              stroke="#14532D"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'potato':
      // Bombín elegante del Señor Cara de Papa con orejitas, ojos saltones, nariz rosa y bigote emblemático
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="potatoHatGrad" x1="50" y1="6" x2="50" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#334155" />
                <stop offset="0.6" stopColor="#1E293B" />
                <stop offset="1" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="potatoBrimGrad" x1="50" y1="28" x2="50" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1E293B" />
                <stop offset="1" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="potatoNoseGrad" x1="50" y1="36" x2="50" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB7185" />
                <stop offset="1" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            {/* Oreja plástica izquierda de Papa */}
            <g transform="translate(10, 24) rotate(-10)">
              <ellipse cx="6" cy="10" rx="5" ry="8" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
              <ellipse cx="6" cy="10" rx="2.5" ry="4.5" fill="#FCE7F3" />
            </g>

            {/* Oreja plástica derecha de Papa */}
            <g transform="translate(80, 24) rotate(10)">
              <ellipse cx="4" cy="10" rx="5" ry="8" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
              <ellipse cx="4" cy="10" rx="2.5" ry="4.5" fill="#FCE7F3" />
            </g>

            {/* Copa redondeada del bombín negro clásico */}
            <path
              d="M30 32C28 15 36 6 50 6C64 6 72 15 70 32C64 31 56 30 50 30C44 30 36 31 30 32Z"
              fill="url(#potatoHatGrad)"
              stroke="#020617"
              strokeWidth="2"
            />
            {/* Cinta del bombín en rojo borgoña */}
            <path
              d="M29 28C35 26 43 25 50 25C57 25 65 26 71 28V32C65 30 57 29 50 29C43 29 35 30 29 32V28Z"
              fill="#E11D48"
              stroke="#9F1239"
              strokeWidth="0.8"
            />

            {/* Ala curvada del bombín que descansa sobre la cabeza */}
            <path
              d="M16 35C16 35 24 29 50 29C76 29 84 35 84 35C84 35 76 41 50 41C24 41 16 35 16 35Z"
              fill="url(#potatoBrimGrad)"
              stroke="#020617"
              strokeWidth="2"
            />
            <path d="M22 34C30 31 40 30 50 30C60 30 70 31 78 34" stroke="#475569" strokeWidth="1" strokeLinecap="round" />

            {/* Ojos saltones de dibujo animado del Sr. Cara de Papa */}
            <g>
              <ellipse cx="43" cy="36" rx="5.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
              <circle cx="44.5" cy="36" r="2.4" fill="#0F172A" />
              <circle cx="43.5" cy="34.8" r="0.9" fill="#FFFFFF" />

              <ellipse cx="57" cy="36" rx="5.5" ry="6.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
              <circle cx="55.5" cy="36" r="2.4" fill="#0F172A" />
              <circle cx="54.5" cy="34.8" r="0.9" fill="#FFFFFF" />
            </g>

            {/* Gran nariz redonda rosa chicle */}
            <ellipse cx="50" cy="42" rx="6.5" ry="4.5" fill="url(#potatoNoseGrad)" stroke="#9F1239" strokeWidth="1.2" />
            <circle cx="48" cy="40.5" r="1.3" fill="#FFFFFF" fillOpacity="0.8" />

            {/* El glorioso bigote negro curvado hacia arriba (y=45 a y=54) */}
            <path
              d="M50 44C44 43 38 43 32 46C26 49 22 53 23 55C25 56 29 54 34 50C40 46 45 46 50 47C55 46 60 46 66 50C71 54 75 56 77 55C78 53 74 49 68 46C62 43 56 43 50 44Z"
              fill="#0F172A"
              stroke="#020617"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Brillo en la curva del bigote */}
            <path d="M30 48C35 45 42 45 47 45.5" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <path d="M70 48C65 45 58 45 53 45.5" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'hamm':
      // Alcancía del cerdito Hamm con ranura, moneda de oro Toy Store, orejitas y hocico
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="hammPinkGrad" x1="50" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F9A8D4" />
                <stop offset="0.6" stopColor="#F472B6" />
                <stop offset="1" stopColor="#DB2777" />
              </linearGradient>
              <linearGradient id="hammCoinGold" x1="50" y1="2" x2="50" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.5" stopColor="#FBBF24" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="hammSnoutGrad" x1="50" y1="36" x2="50" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBCFE8" />
                <stop offset="1" stopColor="#F472B6" />
              </linearGradient>
            </defs>

            {/* Oreja izquierda levantada de cerdito */}
            <path
              d="M24 24L16 10C16 10 24 8 30 14L28 22"
              fill="#F472B6"
              stroke="#BE185D"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Interior de oreja izquierda */}
            <path d="M21 16L18 12C20 11 24 11 26 14" fill="#FCE7F3" />

            {/* Oreja derecha levantada de cerdito */}
            <path
              d="M76 24L84 10C84 10 76 8 70 14L72 22"
              fill="#F472B6"
              stroke="#BE185D"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Interior de oreja derecha */}
            <path d="M79 16L82 12C80 11 76 11 74 14" fill="#FCE7F3" />

            {/* Moneda de oro brillante saliendo de la ranura de la alcancía */}
            <g transform="translate(50, 8)">
              {/* Moneda dorada con borde */}
              <ellipse cx="0" cy="0" rx="9" ry="6" fill="url(#hammCoinGold)" stroke="#B45309" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="6.5" ry="4.2" stroke="#FEF08A" strokeWidth="0.8" fill="none" />
              {/* Símbolo de moneda TS */}
              <text x="0" y="2.5" textAnchor="middle" fill="#78350F" fontSize="5" fontWeight="900" fontFamily="sans-serif">$</text>
              {/* Brillo destello en la moneda */}
              <polygon points="6,-4 7,-1 10,-1 7.5,1 8.5,4 6,2 3.5,4 4.5,1 2,-1 5,-1" fill="#FFFFFF" opacity="0.9" />
            </g>

            {/* Ranura negra de alcancía donde entra la moneda */}
            <ellipse cx="50" cy="13.5" rx="10" ry="2.2" fill="#831843" stroke="#500724" strokeWidth="1" />

            {/* Cabeza redonda y simpática de cerdito Hamm */}
            <path
              d="M20 48C16 28 26 14 50 14C74 14 84 28 80 48C72 45 61 43 50 43C39 43 28 45 20 48Z"
              fill="url(#hammPinkGrad)"
              stroke="#BE185D"
              strokeWidth="2"
            />

            {/* Cejas ligeramente escépticas / pícaras de Hamm */}
            <path d="M34 26C37 24 41 24 43 26" stroke="#9D174D" strokeWidth="2" strokeLinecap="round" />
            <path d="M66 26C63 24 59 24 57 26" stroke="#9D174D" strokeWidth="2" strokeLinecap="round" />

            {/* Ojitos inteligentes de Hamm */}
            <ellipse cx="38" cy="30" rx="3" ry="3.5" fill="#4C0519" />
            <circle cx="37" cy="28.8" r="1" fill="#FFFFFF" />
            <ellipse cx="62" cy="30" rx="3" ry="3.5" fill="#4C0519" />
            <circle cx="61" cy="28.8" r="1" fill="#FFFFFF" />

            {/* Mejillitas sonrojadas */}
            <ellipse cx="28" cy="38" rx="4" ry="2.5" fill="#FB7185" opacity="0.6" />
            <ellipse cx="72" cy="38" rx="4" ry="2.5" fill="#FB7185" opacity="0.6" />

            {/* Hocico ovalado de cerdito con dos fosas nasales */}
            <ellipse cx="50" cy="38" rx="10" ry="6.5" fill="url(#hammSnoutGrad)" stroke="#BE185D" strokeWidth="1.5" />
            <ellipse cx="46" cy="38" rx="2" ry="2.8" fill="#831843" />
            <ellipse cx="54" cy="38" rx="2" ry="2.8" fill="#831843" />

            {/* Borde inferior suave que descansa sobre el avatar (y=44 a y=55) */}
            <path
              d="M17 50C27 45 38 43 50 43C62 43 73 45 83 50C83 50 73 55 50 55C27 55 17 50 17 50Z"
              fill="#DB2777"
              stroke="#BE185D"
              strokeWidth="1.8"
            />
            {/* Brillo plástico superior */}
            <path d="M30 18C36 15 44 15 48 15.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          </svg>
        </div>
      );

    case 'bopeep':
      // Gorro / Lazo de la Pastorcita Bo Peep con encaje rizado de porcelana y gran lazo de satén rosa
      return (
        <div className={`${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="boBowPink" x1="50" y1="4" x2="50" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6" />
                <stop offset="0.6" stopColor="#EC4899" />
                <stop offset="1" stopColor="#BE185D" />
              </linearGradient>
              <linearGradient id="boBonnetBlue" x1="50" y1="24" x2="50" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#BAE6FD" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="boGoldCurls" x1="50" y1="36" x2="50" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="1" stopColor="#EAB308" />
              </linearGradient>
            </defs>

            {/* Rizo de cabello rubio de porcelana en el lado izquierdo */}
            <path
              d="M20 44C16 41 15 47 18 50C21 53 25 50 24 46"
              fill="url(#boGoldCurls)"
              stroke="#CA8A04"
              strokeWidth="1.2"
            />
            {/* Rizo de cabello rubio de porcelana en el lado derecho */}
            <path
              d="M80 44C84 41 85 47 82 50C79 53 75 50 76 46"
              fill="url(#boGoldCurls)"
              stroke="#CA8A04"
              strokeWidth="1.2"
            />

            {/* Capota base en azul cielo satén suave */}
            <path
              d="M22 46C18 30 28 20 50 20C72 20 82 30 78 46C70 44 60 42 50 42C40 42 30 44 22 46Z"
              fill="url(#boBonnetBlue)"
              stroke="#0284C7"
              strokeWidth="1.8"
            />

            {/* Gran Lazo de satén rosa de Bo Peep en la parte superior */}
            {/* Ala izquierda del lazo */}
            <path
              d="M50 14C44 7 30 4 22 10C16 15 22 25 34 22C42 20 48 16 50 14Z"
              fill="url(#boBowPink)"
              stroke="#9D174D"
              strokeWidth="1.5"
            />
            <path d="M26 12C32 12 40 16 46 17" stroke="#FBCFE8" strokeWidth="1.2" strokeLinecap="round" />

            {/* Ala derecha del lazo */}
            <path
              d="M50 14C56 7 70 4 78 10C84 15 78 25 66 22C58 20 52 16 50 14Z"
              fill="url(#boBowPink)"
              stroke="#9D174D"
              strokeWidth="1.5"
            />
            <path d="M74 12C68 12 60 16 54 17" stroke="#FBCFE8" strokeWidth="1.2" strokeLinecap="round" />

            {/* Caídas de cinta del lazo */}
            <path d="M46 18L38 29L45 28L48 20" fill="#EC4899" stroke="#9D174D" strokeWidth="1" />
            <path d="M54 18L62 29L55 28L52 20" fill="#EC4899" stroke="#9D174D" strokeWidth="1" />

            {/* Nudo central del lazo */}
            <ellipse cx="50" cy="15" rx="5" ry="4.5" fill="#DB2777" stroke="#9D174D" strokeWidth="1.5" />
            <circle cx="50" cy="15" r="2" fill="#F472B6" />

            {/* Encaje festoneado blanco de novia/pastorcita (ondas de puntilla) */}
            <path
              d="M17 48 C20 45 23 45 26 44 C29 43 32 43 35 42 C38 41 41 41 44 41 C47 40.5 50 40.5 53 41 C56 41 59 41 62 42 C65 43 68 43 71 44 C74 45 77 45 80 48"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Encaje perforado decorativo */}
            <path
              d="M19 49 C22 47 25 46 28 45 C31 44 34 44 37 43 C40 42.5 43 42 46 42 C49 41.5 51 41.5 54 42 C57 42 60 42.5 63 43 C66 44 69 44 72 45 C75 46 78 47 81 49"
              stroke="#0284C7"
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
            />

            {/* Borde inferior que reposa y corona el avatar con elegancia (y=44 a y=55) */}
            <path
              d="M16 50C26 45 38 43 50 43C62 43 74 45 84 50C84 50 74 55 50 55C26 55 16 50 16 50Z"
              fill="#FFFFFF"
              stroke="#E0F2FE"
              strokeWidth="1.5"
            />

            {/* Broche dorado del cayado de pastorcita en el centro */}
            <circle cx="50" cy="46" r="2.2" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="49.5" cy="45.5" r="0.6" fill="#FFFFFF" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}
