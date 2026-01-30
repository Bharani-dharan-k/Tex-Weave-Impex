// Session timeout management (30 minutes of inactivity)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
let sessionTimer = null;

// Reset session timer on user activity
const resetSessionTimer = (onTimeout) => {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }

  sessionTimer = setTimeout(() => {
    // Session expired
    console.log('Session expired due to inactivity');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (onTimeout) {
      onTimeout();
    } else {
      window.location.href = '/login?expired=true';
    }
  }, SESSION_TIMEOUT);
};

// Track user activity
export const initSessionMonitor = (onTimeout) => {
  // Only monitor if user is authenticated
  const token = localStorage.getItem('token');
  if (!token) return;

  // Start initial timer
  resetSessionTimer(onTimeout);

  // Reset timer on user activity
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  
  events.forEach(event => {
    document.addEventListener(event, () => resetSessionTimer(onTimeout), true);
  });
};

// Stop monitoring session
export const stopSessionMonitor = () => {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
};

// Check if token is expired (JWT token)
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

// Get remaining session time
export const getRemainingSessionTime = () => {
  const token = localStorage.getItem('token');
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const remaining = exp - Date.now();
    return Math.max(0, remaining);
  } catch (error) {
    return 0;
  }
};
