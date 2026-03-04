import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "./utils/axiosConfig";
import { initSessionMonitor, stopSessionMonitor } from "./utils/sessionManager";
import Home from "./Pages/Home1.jsx";
import Login from "./Pages/Login.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import CustomerDashboard from "./Pages/CustomerDashboard.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token with backend
          const response = await axios.get('/api/auth/me');
          
          if (response.data) {
            setIsAuthenticated(true);
            setUser(response.data);
            
            // Start session monitoring
            initSessionMonitor(() => {
              handleLogout();
              window.location.href = '/login';
            });
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          // Token is invalid, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    checkAuth();

    // Cleanup on unmount
    return () => {
      stopSessionMonitor();
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData.user || userData);
    
    // Store token and user in localStorage
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user || userData));
    
    // Start session monitoring after login
    initSessionMonitor(() => {
      handleLogout();
      window.location.href = '/login';
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear token from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Stop session monitoring
    stopSessionMonitor();
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#3b5998'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to={user?.role === 'admin' ? '/dashboard' : '/customer-dashboard'} replace />
            )
          } 
        />
        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />
        
        {/* Admin Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : isAuthenticated ? (
              <Navigate to="/customer-dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Customer Dashboard */}
        <Route 
          path="/customer-dashboard" 
          element={
            isAuthenticated && user?.role === 'user' ? (
              <CustomerDashboard user={user} onLogout={handleLogout} />
            ) : isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </>
  );
}

export default App;
