import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    // Simulate auth bootstrap for demo mode
    setTimeout(() => {
      if (mounted.current) {
        // Check if user has been marked as authenticated in localStorage
        const isLoggedIn = localStorage.getItem('demo_auth') === 'true';
        setIsAuthenticated(isLoggedIn);
        setLoading(false);
      }
    }, 300);

    return () => {
      mounted.current = false;
    };
  }, []);

  // ---------- Login ----------
  const login = useCallback(async (email, password) => {
    // Demo mode: accept any credentials and store in localStorage
    localStorage.setItem('demo_auth', 'true');
    localStorage.setItem('demo_user_email', email);
    setIsAuthenticated(true);
    setLoading(false);
    return { email, id: 'demo-user' };
  }, []);

  // ---------- Logout ----------
  const logout = useCallback(async () => {
    localStorage.removeItem('demo_auth');
    localStorage.removeItem('demo_user_email');
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Protected route wrapper
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Beautiful premium TEDx Red Loading Spinner */}
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(235, 0, 40, 0.1)',
          borderTopColor: '#EB0028',
          borderRadius: '50%',
          animation: 'tedx-spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes tedx-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
