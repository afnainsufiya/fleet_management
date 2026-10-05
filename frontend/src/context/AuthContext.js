'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  const [loading, setLoading] = useState(true);

  // Read localStorage only in the browser
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setAuth({
        token: storedToken,
        user: JSON.parse(storedUser),
      });
    }

    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setAuth({
      token,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuth({
      token: null,
      user: null,
    });
  };

  const isAuthenticated = !!auth.token;

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}