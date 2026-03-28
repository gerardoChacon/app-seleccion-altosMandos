import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token   = localStorage.getItem('token');
    const saved   = localStorage.getItem('usuario');
    if (token && saved) {
      try { setUsuario(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  async function login(correo, contrasena) {
    const data = await api.post('/auth/login', { correo, contrasena });
    localStorage.setItem('token',   data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  }

  function logout() {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
