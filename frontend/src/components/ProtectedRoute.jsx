import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { usuario, loading } = useAuth();

  if (loading) return null;
  if (!usuario) return <Navigate to="/" replace />;

  if (roles && !roles.includes(usuario.rol?.nombre_rol)) {
    return <Navigate to="/vacantes/listado" replace />;
  }

  return children;
}
