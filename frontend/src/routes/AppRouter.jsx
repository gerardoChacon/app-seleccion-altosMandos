import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RecuperarContrasenaPage from "../pages/RecuperarContrasenaPage";
import DashboardPage from "../pages/DashboardPage";
import RegistrarEmpleadoPage from "../pages/RegistrarEmpleadoPage";
import ControlEmpleadosPage from "../pages/ControlEmpleadosPage";
import RegistrarVacantePage from "../pages/RegistrarVacantePage";
import ControlVacantesPage from "../pages/ControlVacantesPage";
import ListadoVacantesPage from "../pages/ListadoVacantesPage";
import PerfilEvaluadoPage from "../pages/PerfilEvaluadoPage";
import PerfilSinEvaluacionPage from "../pages/PerfilSinEvaluacionPage";
import RegistrarEvaluacionPage from "../pages/RegistrarEvaluacionPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/recuperar-contrasena"
          element={<RecuperarContrasenaPage />}
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/empleados/nuevo" element={<RegistrarEmpleadoPage />} />
        <Route path="/empleados" element={<ControlEmpleadosPage />} />
        <Route path="/vacantes/nueva" element={<RegistrarVacantePage />} />
        <Route path="/vacantes" element={<ControlVacantesPage />} />
        <Route path="/vacantes/listado" element={<ListadoVacantesPage />} />
        <Route path="/perfil-evaluado" element={<PerfilEvaluadoPage />} />
        <Route
          path="/perfil-sin-evaluacion"
          element={<PerfilSinEvaluacionPage />}
        />
        <Route path="/evaluacion/nueva" element={<RegistrarEvaluacionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
