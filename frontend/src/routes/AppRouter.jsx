import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage               from "../pages/LoginPage";
import RecuperarContrasenaPage from "../pages/RecuperarContrasenaPage";
import DashboardPage           from "../pages/DashboardPage";
import RegistrarEmpleadoPage   from "../pages/RegistrarEmpleadoPage";
import ControlEmpleadosPage    from "../pages/ControlEmpleadosPage";
import RegistrarVacantePage    from "../pages/RegistrarVacantePage";
import ControlVacantesPage     from "../pages/ControlVacantesPage";
import ListadoVacantesPage     from "../pages/ListadoVacantesPage";
import PerfilEvaluadoPage      from "../pages/PerfilEvaluadoPage";
import PerfilSinEvaluacionPage from "../pages/PerfilSinEvaluacionPage";
import RegistrarEvaluacionPage from "../pages/RegistrarEvaluacionPage";

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/"                      element={<LoginPage />} />
          <Route path="/recuperar-contrasena"  element={<RecuperarContrasenaPage />} />

          {/* Protegidas */}
          <Route path="/dashboard"             element={<P><DashboardPage /></P>} />
          <Route path="/empleados"             element={<P><ControlEmpleadosPage /></P>} />
          <Route path="/empleados/nuevo"       element={<P><RegistrarEmpleadoPage /></P>} />
          <Route path="/vacantes"              element={<P><ControlVacantesPage /></P>} />
          <Route path="/vacantes/nueva"        element={<P><RegistrarVacantePage /></P>} />
          <Route path="/vacantes/listado"      element={<P><ListadoVacantesPage /></P>} />
          <Route path="/perfil-evaluado/:id"   element={<P><PerfilEvaluadoPage /></P>} />
          <Route path="/perfil-sin-evaluacion/:id" element={<P><PerfilSinEvaluacionPage /></P>} />
          <Route path="/evaluacion/:id"        element={<P><RegistrarEvaluacionPage /></P>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
