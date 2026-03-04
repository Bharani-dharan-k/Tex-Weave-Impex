import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import './Login.css'

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate()

  const [view, setView] = useState('select') // 'select', 'admin-login', 'customer-login', 'customer-signup', 'forgot-password'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('expired') === 'true') {
      setSessionExpired(true)
      setError('Your session has expired. Please login again.')
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
    setSessionExpired(false)
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      })
      
      console.log('=== LOGIN RESPONSE DEBUG ===')
      console.log('Full response.data:', JSON.stringify(response.data, null, 2))
      console.log('response.data.role:', response.data.role)
      console.log('response.data._id:', response.data._id)
      console.log('response.data.token:', response.data.token)
      console.log('Keys in response.data:', Object.keys(response.data))
      
      // Backend returns flat structure: { _id, name, email, role, token }
      const isAdmin = view === 'admin-login'
      const userRole = response.data.role  // role is at top level
      
      if (!userRole) {
        console.error('❌ User role is undefined or empty!')
        console.error('response.data type:', typeof response.data)
        console.error('response.data value:', response.data)
        setError('Invalid server response. Please try again.')
        setLoading(false)
        return
      }
      
      console.log('✅ User role found:', userRole)
      
      if (isAdmin && userRole !== 'admin') {
        setError('Access denied. Admin credentials required.')
        setLoading(false)
        return
      }
      if (!isAdmin && userRole === 'admin') {
        setError('Please use admin login for administrator accounts.')
        setLoading(false)
        return
      }
      
      // Format response to match expected structure
      const loginData = {
        token: response.data.token,
        user: {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }
      }
      
      console.log('✅ Calling onLoginSuccess with:', loginData)
      onLoginSuccess(loginData)
    } catch (err) {
      console.error('❌ Login error:', err)
      console.error('Error response:', err.response)
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      })
      
      setSuccess('Account created successfully! Please login with your credentials.')
      setTimeout(() => {
        setView('customer-login')
        setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' })
        setSuccess('')
      }, 2000)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.errors?.[0]?.msg || 
                       'Signup failed. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post('/api/auth/forgot-password', {
        email: formData.email
      })
      
      setSuccess('Password reset link has been sent to your email! Please check your inbox.')
      
      setTimeout(() => {
        setView('customer-login')
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
        setSuccess('')
      }, 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    setError('')
    setSuccess('')
  }

  // Role Selection View
  if (view === 'select') {
    return (
      <div className="login-container">
        <div className="login-card">
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Home
          </button>

          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Select your login type to continue</p>
          </div>

          <div className="role-selection">
            <div className="role-card" onClick={() => { setView('admin-login'); resetForm(); }}>
              <div className="role-icon">👨‍💼</div>
              <h3>Admin Login</h3>
              <p>Access administrative dashboard</p>
            </div>

            <div className="role-card" onClick={() => { setView('customer-login'); resetForm(); }}>
              <div className="role-icon">👤</div>
              <h3>Customer Login</h3>
              <p>Access your customer account</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Admin Login View
  if (view === 'admin-login') {
    return (
      <div className="login-container">
        <div className="login-card">
          <button className="back-button" onClick={() => { setView('select'); resetForm(); }}>
            Back
          </button>

          <div className="login-header">
            <h1>Admin Login</h1>
            <p>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            {error && (
              <div className={`error-message ${sessionExpired ? 'session-expired' : ''}`}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Customer Login View
  if (view === 'customer-login') {
    return (
      <div className="login-container">
        <div className="login-card">
          <button className="back-button" onClick={() => { setView('select'); resetForm(); }}>
            Back
          </button>

          <div className="login-header">
            <h1>Customer Login</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="forgot-password-link">
              <button type="button" className="link-button" onClick={() => { setView('forgot-password'); resetForm(); }}>
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="signup-link">
              Don't have an account?{' '}
              <button type="button" className="link-button" onClick={() => { setView('customer-signup'); resetForm(); }}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Customer Signup View
  if (view === 'customer-signup') {
    return (
      <div className="login-container">
        <div className="login-card">
          <button className="back-button" onClick={() => { setView('customer-login'); resetForm(); }}>
            Back
          </button>

          <div className="login-header">
            <h1>Create Account</h1>
            <p>Sign up for a new customer account</p>
          </div>

          <form onSubmit={handleSignupSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="signup-link">
              Already have an account?{' '}
              <button type="button" className="link-button" onClick={() => { setView('customer-login'); resetForm(); }}>
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Forgot Password View
  if (view === 'forgot-password') {
    return (
      <div className="login-container">
        <div className="login-card">
          <button className="back-button" onClick={() => { setView('customer-login'); resetForm(); }}>
            Back
          </button>

          <div className="login-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleForgotPasswordSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="signup-link">
              Remember your password?{' '}
              <button type="button" className="link-button" onClick={() => { setView('customer-login'); resetForm(); }}>
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return null
}

export default Login
