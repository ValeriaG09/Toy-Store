import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [ageVerifiedGlobal, setAgeVerifiedGlobal] = useState(false);
  
  // Nuevo estado global para alternar entre vista Admin y Cliente
  const [vistaAdmin, setVistaAdmin] = useState(() => {
    // Intentar recuperar preferencia previa de la sesión
    return sessionStorage.getItem('toy_vista_admin') === 'true';
  });

  // Hints para saber si el usuario estaba logueado recientemente (evita parpadeos)
  const [isLoggedInHint, setIsLoggedInHint] = useState(() => {
    return localStorage.getItem('toy_is_logged_in') === 'true';
  });
  const [userNameHint, setUserNameHint] = useState(() => {
    return localStorage.getItem('toy_user_name_hint') || "";
  });

  // Persistir la preferencia de vista admin
  useEffect(() => {
    sessionStorage.setItem('toy_vista_admin', vistaAdmin);
  }, [vistaAdmin]);

  // Verificar la cookie HTTP-Only al iniciar la app
  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const res = await fetch("/auth/me", {
        credentials: "include" 
      });
      const data = await res.json();
      if (res.ok && data.usuario) {
        setUsuario(data.usuario);
        setAgeVerifiedGlobal(true);
        // Si es admin y no hay preferencia marcada, por defecto mostrar la vista admin
        if (data.usuario.rol === 1 && sessionStorage.getItem('toy_vista_admin') === null) {
          setVistaAdmin(true);
        }
        localStorage.setItem('toy_user_name_hint', data.usuario.nombre);
        setUserNameHint(data.usuario.nombre);
      } else {
        setUsuario(null);
        setAgeVerifiedGlobal(false);
      }
    } catch (error) {
      console.error("Error verificando sesión", error);
      setUsuario(null);
    } finally {
      setCargandoSesion(false);
    }
  };

  const login = (usuarioData) => {
    setUsuario(usuarioData);
    setAgeVerifiedGlobal(true);
    if (usuarioData.rol === 1) {
      setVistaAdmin(true);
    }
    localStorage.setItem('toy_is_logged_in', 'true');
    localStorage.setItem('toy_user_name_hint', usuarioData.nombre);
    setIsLoggedInHint(true);
    setUserNameHint(usuarioData.nombre);
  };

  const confirmAge = () => {
    setAgeVerifiedGlobal(true);
  };

  const logout = async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error cerrando sesión", error);
    }
    setUsuario(null);
    setVistaAdmin(false);
    localStorage.setItem('toy_is_logged_in', 'false');
    localStorage.removeItem('toy_user_name_hint');
    setIsLoggedInHint(false);
    setUserNameHint("");
  };

  // --- TEMPORIZADOR DE SEGURIDAD (5 MINUTOS FUERA) ---
  useEffect(() => {
    let timeoutId;

    const handleVisibilityChange = () => {
      // Solo nos importa si es un INVITADO (no logueado)
      if (document.hidden && !usuario && ageVerifiedGlobal) {
        // Iniciamos el cronómetro de 5 minutos (300000ms)
        timeoutId = setTimeout(() => {
          setAgeVerifiedGlobal(false);
          console.log("🛠️ Seguridad: Sesión de invitado expirada por inactividad prolongada.");
        }, 300000); 
      } else {
        // Si vuelve antes de 5 mins, cancelamos el reset
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [usuario, ageVerifiedGlobal]);

  return (
    <AuthContext.Provider value={{ 
      usuario, login, logout, cargandoSesion, verificarSesion,
      ageVerifiedGlobal, confirmAge, isLoggedInHint, userNameHint,
      vistaAdmin, setVistaAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
