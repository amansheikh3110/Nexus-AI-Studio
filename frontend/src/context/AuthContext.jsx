import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '');

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(() => localStorage.getItem('token'));
  const [user,  setUser]    = useState(() => {
    const u = localStorage.getItem('username');
    return u ? { username: u } : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(false); }, []);

  const _auth = async (endpoint, username, password) => {
    const res  = await fetch(`${API}${endpoint}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    if (!data.token) throw new Error('No token returned');
    localStorage.setItem('token',    data.token);
    localStorage.setItem('username', data.username || username);
    setToken(data.token);
    setUser({ username: data.username || username });
    return data;
  };

  const login    = (u, p) => _auth('/api/auth/login',    u, p);
  const register = (u, p) => _auth('/api/auth/register', u, p);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);