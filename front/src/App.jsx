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
import Home from "./pages/Home";
import Tienda from "./pages/Tienda";
import Contacto from "./pages/Contacto";
import Guia from "./pages/Guia";
import Explora from "./pages/Explora";
import Categoria from "./pages/categoria"; // ← NUEVO

function RutaProtegida({ children }) {
  const { usuario, cargandoSesion } = useContext(AuthContext);

  if (cargandoSesion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-300 text-white font-bold text-2xl animate-pulse">
        🧸 Cargando la magia de Toy Store...
      </div>
    );
  }

  return usuario ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/google-auth-mock" element={<GoogleAuthMock />} />
          <Route path="/google-login-mock" element={<GoogleLoginMock />} />
          <Route path="/inicio" element={
            <RutaProtegida><Inicio /></RutaProtegida>
          }/>
          <Route path="/categoria/:nombre" element={
            <RutaProtegida><Categoria /></RutaProtegida>
          }/>
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/guia" element={<Guia />} />
          <Route path="/explora" element={<Explora />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}