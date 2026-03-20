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
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/google-auth-mock" element={<GoogleAuthMock />} />
          <Route path="/google-login-mock" element={<GoogleLoginMock />} />
          <Route path="/inicio" element={
            <RutaProtegida><Inicio /></RutaProtegida>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}