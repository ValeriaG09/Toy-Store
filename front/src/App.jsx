import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
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
import Vestier from "./pages/Vestier";
import Pagar from "./pages/Pagar";
import Confirmacion from "./pages/Confirmacion";
import MisPedidos from "./pages/MisPedidos";
import "./SpaceTheme.css";

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
      <CartProvider>
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
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/guia" element={<Guia />} />
          <Route path="/explora" element={<Explora />} />
          <Route path="/vestier" element={<Vestier />} />
          <Route path="/configuracion" element={<RutaProtegida><Configuracion /></RutaProtegida>} />
          <Route path="/admin" element={<RutaProtegida><AdminDashboard /></RutaProtegida>} />
          <Route path="/pagar/:id" element={<RutaProtegida><Pagar /></RutaProtegida>} />
          <Route path="/confirmacion/:id" element={<RutaProtegida><Confirmacion /></RutaProtegida>} />
          <Route path="/mis-pedidos" element={<RutaProtegida><MisPedidos /></RutaProtegida>} />
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}