import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Inicio from "./pages/Inicio";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/resetpassword";
import GoogleAuthMock from "./pages/GoogleAuthMock";
import GoogleLoginMock from "./pages/GoogleLoginMock";
import Tienda from "./pages/Tienda";
import Contacto from "./pages/Contacto";
import Guia from "./pages/Guia";
import Explora from "./pages/Explora";
import Configuracion from "./pages/Configuracion";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInventory from "./pages/AdminInventory";
import Vestier from "./pages/Vestier";
import Carrito from "./pages/Carrito";
import PerfilPublico from "./pages/PerfilPublico";
import "./SpaceTheme.css";

function RutaProtegida({ children }) {
  const { usuario, cargandoSesion, isLoggedInHint } = useContext(AuthContext);

  // Si está validando en segundo plano pero hay sesión o hint previo, renderizar directamente
  if (cargandoSesion && (usuario || isLoggedInHint)) {
    return children;
  }

  // Mientras termina la primera comprobación sin sesión previa, no mostrar pantalla azul invasiva
  if (cargandoSesion) {
    return null;
  }

  return usuario ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/google-auth-mock" element={<GoogleAuthMock />} />
          <Route path="/google-login-mock" element={<GoogleLoginMock />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/factura" element={<Carrito />} />
          <Route path="/pago" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/guia" element={<Guia />} />
          <Route path="/explora" element={<Explora />} />
          <Route path="/vestier" element={<Vestier />} />
          <Route path="/perfil/:username" element={<PerfilPublico />} />
          <Route path="/u/:username" element={<PerfilPublico />} />
          <Route path="/usuario/:username" element={<PerfilPublico />} />
          <Route path="/configuracion" element={<RutaProtegida><Configuracion /></RutaProtegida>} />
          <Route path="/admin" element={<RutaProtegida><AdminDashboard /></RutaProtegida>} />
          <Route path="/admin/productos" element={<RutaProtegida><AdminInventory /></RutaProtegida>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}