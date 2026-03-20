import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Verificar la cookie HTTP-Only al iniciar la app
  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/me", {
        // MUY IMPORTANTE: Esto asegura que las cookies seguras viajen en el request
        credentials: "include" 
      });
      if (res.ok) {
        const data = await res.json();
        setUsuario(data.usuario);
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

  // Esta función ahora la llamamos desde Login, Registro, etc.
  const login = (usuarioData) => {
    setUsuario(usuarioData);
  };

  const logout = async () => {
    try {
      await fetch("http://127.0.0.1:5000/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error cerrando sesión", error);
    }
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargandoSesion, verificarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
