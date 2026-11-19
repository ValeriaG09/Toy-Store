import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    try {
      const cached = localStorage.getItem('toy_usuario');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [cargandoSesion, setCargandoSesion] = useState(() => {
    try {
      return !localStorage.getItem('toy_usuario') && localStorage.getItem('toy_is_logged_in') !== 'true';
    } catch (e) {
      return false;
    }
  });
  const [ageVerifiedGlobal, setAgeVerifiedGlobal] = useState(() => {
    const isLoggedIn = localStorage.getItem('toy_is_logged_in') === 'true';
    const hasCachedUser = !!localStorage.getItem('toy_usuario');
    const ageVerified = localStorage.getItem('toy_age_verified') === 'true';
    return isLoggedIn || hasCachedUser || ageVerified;
  });
  
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

  const todosLosGorritos = ['potato', 'woody', 'jessie', 'buzz', 'lotso', 'alien', 'rex', 'hamm', 'bopeep', 'none'];
  const gorritosInicialesUsuario = ['woody', 'jessie', 'none'];

  // Accesorio / Sombrerito activo para el avatar en toda la aplicación
  const [avatarHat, setAvatarHatState] = useState(() => {
    try {
      const storedUser = localStorage.getItem('toy_usuario');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.avatar_hat || localStorage.getItem('toy_avatar_hat') || 'woody';
      }
      // Si entra como invitado (sin sesión), NO debe aparecer sombrero
      return 'none';
    } catch (e) {
      return 'none';
    }
  });

  const esAdmin = Boolean(
    usuario && (
      usuario.rol === 1 || 
      usuario.id_rol === 1 || 
      usuario.rol === 'admin' || 
      usuario.email === 'alvarezfrancomariana@gmail.com' || 
      usuario.email === 'saraguevara192@gmail.com'
    )
  );

  // Lista de sombreros desbloqueados para el usuario
  const gorritosDesbloqueados = usuario
    ? (esAdmin
        ? todosLosGorritos
        : (Array.isArray(usuario.gorritos_desbloqueados) ? usuario.gorritos_desbloqueados : gorritosInicialesUsuario))
    : [];

  const cambiarAvatarHat = async (nuevoHat) => {
    setAvatarHatState(nuevoHat);
    try {
      localStorage.setItem('toy_avatar_hat', nuevoHat);
      if (usuario) {
        const userKey = usuario.id_usuario || usuario.id || usuario.email;
        if (userKey) {
          localStorage.setItem(`toy_avatar_hat_${userKey}`, nuevoHat);
        }
        setUsuario(prev => {
          if (!prev) return prev;
          const updated = { ...prev, avatar_hat: nuevoHat };
          localStorage.setItem('toy_usuario', JSON.stringify(updated));
          return updated;
        });

        // Guardar en la base de datos a través de la API
        await fetch("/auth/avatar-hat", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ avatarHat: nuevoHat })
        });
      }
    } catch (e) {
      console.error("Error guardando sombrero:", e);
    }
  };

  const cambiarFotoPerfil = async (nuevaFoto) => {
    try {
      const res = await fetch("/auth/foto-perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ foto_perfil: nuevaFoto })
      });
      const data = await res.json();
      if (res.ok && data.usuario) {
        updateUsuario(data.usuario);
        return { ok: true, mensaje: data.mensaje, usuario: data.usuario };
      } else {
        return { ok: false, error: data.error || 'Error al actualizar foto' };
      }
    } catch (e) {
      console.error("Error al guardar foto de perfil:", e);
      return { ok: false, error: 'Error de conexión' };
    }
  };

  // Sincronizar cambios de sombrero entre pestañas o recargas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'toy_avatar_hat' && e.newValue) {
        setAvatarHatState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
        localStorage.setItem('toy_usuario', JSON.stringify(data.usuario));
        localStorage.setItem('toy_is_logged_in', 'true');
        localStorage.setItem('toy_age_verified', 'true');
        // Si es admin y no hay preferencia marcada, por defecto mostrar la vista admin
        const esAdminRol = data.usuario.rol === 1 || data.usuario.id_rol === 1;
        if (esAdminRol && sessionStorage.getItem('toy_vista_admin') === null) {
          setVistaAdmin(true);
        }
        localStorage.setItem('toy_user_name_hint', data.usuario.nombre);
        setUserNameHint(data.usuario.nombre);

        // Restaurar sombrero oficial del usuario desde base de datos o almacenamiento
        const hat = data.usuario.avatar_hat || 'woody';
        setAvatarHatState(hat);
        localStorage.setItem('toy_avatar_hat', hat);
      } else {
        setUsuario(null);
        setAvatarHatState('none');
        localStorage.removeItem('toy_usuario');
        localStorage.removeItem('toy_avatar_hat');
        localStorage.setItem('toy_is_logged_in', 'false');
        setAgeVerifiedGlobal(localStorage.getItem('toy_age_verified') === 'true');
      }
    } catch (error) {
      console.error("Error verificando sesión", error);
      // No borrar usuario si fue un simple fallo de red temporal
    } finally {
      setCargandoSesion(false);
    }
  };

  const login = (usuarioData) => {
    setUsuario(usuarioData);
    setAgeVerifiedGlobal(true);
    localStorage.setItem('toy_age_verified', 'true');
    const esAdminRol = usuarioData.rol === 1 || usuarioData.id_rol === 1;
    if (esAdminRol) {
      setVistaAdmin(true);
    }
    localStorage.setItem('toy_usuario', JSON.stringify(usuarioData));
    localStorage.setItem('toy_is_logged_in', 'true');
    localStorage.setItem('toy_user_name_hint', usuarioData.nombre);
    setIsLoggedInHint(true);
    setUserNameHint(usuarioData.nombre);

    // Restaurar sombrero del usuario logueado
    const hat = usuarioData.avatar_hat || 'woody';
    setAvatarHatState(hat);
    localStorage.setItem('toy_avatar_hat', hat);
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
    setAvatarHatState('none');
    localStorage.removeItem('toy_usuario');
    localStorage.removeItem('toy_avatar_hat');
    localStorage.setItem('toy_is_logged_in', 'false');
    localStorage.removeItem('toy_user_name_hint');
    localStorage.removeItem('toy_age_verified');
    setAgeVerifiedGlobal(false);
    setIsLoggedInHint(false);
    setUserNameHint("");
  };

  // --- TEMPORIZADOR DE SEGURIDAD (5 MINUTOS FUERA) ---
  useEffect(() => {
    let timeoutId;

    const handleVisibilityChange = () => {
      // Solo nos importa si es un INVITADO temporal (sin sesión iniciada)
      const tieneSesion = localStorage.getItem('toy_is_logged_in') === 'true' || !!usuario;
      if (document.hidden && !tieneSesion && ageVerifiedGlobal) {
        // Iniciamos el cronómetro de 5 minutos (300000ms)
        timeoutId = setTimeout(() => {
          setAgeVerifiedGlobal(false);
          localStorage.removeItem('toy_age_verified');
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

  const updateUsuario = (nuevosDatos) => {
    setUsuario(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...nuevosDatos };
      if (nuevosDatos.nombre) {
        localStorage.setItem('toy_user_name_hint', nuevosDatos.nombre);
        setUserNameHint(nuevosDatos.nombre);
      }
      localStorage.setItem('toy_usuario', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, login, logout, cargandoSesion, verificarSesion,
      ageVerifiedGlobal, confirmAge, isLoggedInHint, userNameHint,
      vistaAdmin, setVistaAdmin, updateUsuario,
      avatarHat, cambiarAvatarHat, gorritosDesbloqueados, todosLosGorritos, esAdmin,
      cambiarFotoPerfil
    }}>
      {children}
    </AuthContext.Provider>
  );
};
