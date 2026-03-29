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

const ADMIN_ROLES = ['superadmin', 'admin'];

function P({ children, roles }) {
  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/"                      element={<LoginPage />} />
          <Route path="/recuperar-contrasena"  element={<RecuperarContrasenaPage />} />

          {/* Solo admin y superadmin */}
          <Route path="/dashboard"             element={<P roles={ADMIN_ROLES}><DashboardPage /></P>} />
          <Route path="/empleados"             element={<P roles={ADMIN_ROLES}><ControlEmpleadosPage /></P>} />
          <Route path="/empleados/nuevo"       element={<P roles={ADMIN_ROLES}><RegistrarEmpleadoPage /></P>} />
          <Route path="/vacantes"              element={<P roles={ADMIN_ROLES}><ControlVacantesPage /></P>} />
          <Route path="/vacantes/nueva"        element={<P roles={ADMIN_ROLES}><RegistrarVacantePage /></P>} />
          <Route path="/evaluacion/:id"        element={<P roles={ADMIN_ROLES}><RegistrarEvaluacionPage /></P>} />

          {/* Accesibles para todos los roles autenticados */}
          <Route path="/vacantes/listado"          element={<P><ListadoVacantesPage /></P>} />
          <Route path="/perfil-evaluado/:id"       element={<P><PerfilEvaluadoPage /></P>} />
          <Route path="/perfil-sin-evaluacion/:id" element={<P><PerfilSinEvaluacionPage /></P>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
