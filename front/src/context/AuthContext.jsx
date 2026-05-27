import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [ageVerifiedGlobal, setAgeVerifiedGlobal] = useState(false);
  
  const [vistaAdmin, setVistaAdmin] = useState(() => {
    return sessionStorage.getItem('toy_vista_admin') === 'true';
  });

  const [isLoggedInHint, setIsLoggedInHint] = useState(() => {
    return localStorage.getItem('toy_is_logged_in') === 'true';
  });
  const [userNameHint, setUserNameHint] = useState(() => {
    return localStorage.getItem('toy_user_name_hint') || "";
  });

  useEffect(() => {
    sessionStorage.setItem('toy_vista_admin', vistaAdmin);
  }, [vistaAdmin]);

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
        localStorage.setItem('toy_age_verified', 'true');
        if (data.usuario.rol === 1 && sessionStorage.getItem('toy_vista_admin') === null) {
          setVistaAdmin(true);
        }
        localStorage.setItem('toy_user_name_hint', data.usuario.nombre);
        setUserNameHint(data.usuario.nombre);
      } else {
        setUsuario(null);
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
    localStorage.setItem('toy_age_verified', 'true');
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
    localStorage.setItem('toy_age_verified', 'true');
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
    setAgeVerifiedGlobal(false);
    localStorage.setItem('toy_age_verified', 'false');
    localStorage.setItem('toy_is_logged_in', 'false');
    localStorage.removeItem('toy_user_name_hint');
    setIsLoggedInHint(false);
    setUserNameHint("");
  };

  useEffect(() => {
    let timeoutId;
    const handleVisibilityChange = () => {
      if (document.hidden && !usuario && ageVerifiedGlobal) {
        timeoutId = setTimeout(() => {
          setAgeVerifiedGlobal(false);
          localStorage.setItem('toy_age_verified', 'false');
        }, 300000); 
      } else {
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
