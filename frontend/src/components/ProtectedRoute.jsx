import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { usuario, loading } = useAuth();

  if (loading) return null;

  return usuario ? children : <Navigate to="/" replace />;
}
