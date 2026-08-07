import { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('taller_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('taller_token');
    if (!token) {
      setCargando(false);
      return;
    }
    AuthAPI.yo()
      .then((res) => {
        setUsuario(res.data.data);
        localStorage.setItem('taller_usuario', JSON.stringify(res.data.data));
      })
      .catch(() => {
        localStorage.removeItem('taller_token');
        localStorage.removeItem('taller_usuario');
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  const login = async (email, password) => {
    const res = await AuthAPI.login(email, password);
    const { token, usuario: u } = res.data.data;
    localStorage.setItem('taller_token', token);
    localStorage.setItem('taller_usuario', JSON.stringify(u));
    setUsuario(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('taller_token');
    localStorage.removeItem('taller_usuario');
    setUsuario(null);
  };

  const esAdmin = usuario?.rol === 'ADMIN';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando, autenticado: !!usuario, esAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
