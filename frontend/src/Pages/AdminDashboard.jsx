import React, { useState, useEffect } from 'react'
import axios from '../utils/axiosConfig'
import { 
  LayoutDashboard, 
  Package, 
  PackagePlus, 
  Users, 
  LogOut,
  Menu,
  X,
  XCircle,
  CheckCircle,
  AlertCircle,
  BarChart3,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Factory,
  Settings,
  Truck,
  PieChart as PieChartIcon,
  HelpCircle,
  ClipboardList,
  Clock,
  ChevronLeft,
  ChevronRight,
  Edit2
} from 'lucide-react'
import './AdminDashboard.css'
import './Dashboard.css'
import '../analytics/components/KPICard.css'
import '../analytics/components/Charts.css'
import '../analytics/pages/AnalyticsDashboard.css'
import KPICard from '../analytics/components/KPICard'
import LineChart from '../analytics/components/LineChart'
import BarChart from '../analytics/components/BarChart'
import PieChart from '../analytics/components/PieChart'
import AreaChart from '../analytics/components/AreaChart'

const AdminDashboard = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome user={user} setCurrentPage={setCurrentPage} />
      case 'add-product':
        return <AddProduct />
      case 'products':
        return <ProductManagement />
      case 'users':
        return <UserAnalysis onSelectUser={(id) => { setSelectedUserId(id); setCurrentPage('user-detail') }} />
      case 'user-detail':
        return <UserDetail userId={selectedUserId} onBack={() => setCurrentPage('users')} />
      case 'issues':
        return <IssuesManagement />
      case 'orders':
        return <AdminOrders />
      case 'analytics':
        return <AnalyticsSection />
      default:
        return <DashboardHome user={user} />
    }
  }

  return (
    <div className="admin-dashboard-container">
      {/* Top Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="navbar-title">Admin Dashboard</h1>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <span className="user-name">{user?.name || 'Admin'}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="admin-main-container">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-menu">
            <button
              className={`sidebar-item ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>Dashboard</span>}
            </button>

            <button
              className={`sidebar-item ${currentPage === 'analytics' ? 'active' : ''}`}
              onClick={() => setCurrentPage('analytics')}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span>Analytics</span>}
            </button>

            <button
              className={`sidebar-item ${currentPage === 'add-product' ? 'active' : ''}`}
              onClick={() => setCurrentPage('add-product')}
            >
              <PackagePlus size={20} />
              {sidebarOpen && <span>Add Product</span>}
            </button>

            <button
              className={`sidebar-item ${currentPage === 'products' ? 'active' : ''}`}
              onClick={() => setCurrentPage('products')}
            >
              <Package size={20} />
              {sidebarOpen && <span>Products</span>}
            </button>

            <button
              className={`sidebar-item ${currentPage === 'users' ? 'active' : ''}`}
              onClick={() => setCurrentPage('users')}
            >
              <Users size={20} />
              {sidebarOpen && <span>User Analysis</span>}
            </button>

            <button
              className={`sidebar-item ${currentPage === 'issues' ? 'active' : ''}`}
              onClick={() => setCurrentPage('issues')}
            >
              <HelpCircle size={20} />
              {sidebarOpen && <span>Issues & Support</span>}
            </button>

            <button
              className={`sidebar-item ${currentPage === 'orders' ? 'active' : ''}`}
              onClick={() => setCurrentPage('orders')}
            >
              <ClipboardList size={20} />
              {sidebarOpen && <span>Orders</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

// Dashboard Home Component
const DashboardHome = ({ user, setCurrentPage }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    lowStock: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [productsRes, usersRes] = await Promise.all([
        axios.get('/api/products').catch(() => ({ data: { products: [] } })),
        axios.get('/api/auth/users').catch(() => ({ data: [] }))
      ])
      
      const products = productsRes.data?.products || []
      const users = usersRes.data || []
      const lowStockCount = products.filter(p => p.stock < 10).length

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        lowStock: lowStockCount
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h2>Welcome back, {user?.name || 'Admin'}!</h2>
        <p>Here's what's happening with your store today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Package size={32} />
          </div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{loading ? '...' : stats.totalProducts}</p>
            <span className="stat-label">Active products</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Users size={32} />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{loading ? '...' : stats.totalUsers}</p>
            <span className="stat-label">Registered users</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <PackagePlus size={32} />
          </div>
          <div className="stat-info">
            <h3>Low Stock</h3>
            <p className="stat-value">{loading ? '...' : stats.lowStock}</p>
            <span className="stat-label">Items below threshold</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-cards">
          <div className="action-card" onClick={() => setCurrentPage('add-product')} style={{ cursor: 'pointer' }}>
            <PackagePlus size={24} />
            <h4>Add New Product</h4>
            <p>Create a new product listing</p>
          </div>
          <div className="action-card" onClick={() => setCurrentPage('products')} style={{ cursor: 'pointer' }}>
            <Package size={24} />
            <h4>Manage Products</h4>
            <p>View and edit existing products</p>
          </div>
          <div className="action-card" onClick={() => setCurrentPage('users')} style={{ cursor: 'pointer' }}>
            <Users size={24} />
            <h4>User Analysis</h4>
            <p>View user insights and analytics</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add Product Component
const AddProduct = () => {
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    reorderLevel: '10',
    description: '',
    unit: 'meters'
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setMessage({ type: '', text: '' }) // Clear message on input
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' })
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' })
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setMessage({ type: '', text: '' })
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData()
      formDataToSend.append('productId', formData.productId)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('costPrice', formData.costPrice)
      formDataToSend.append('sellingPrice', formData.sellingPrice)
      formDataToSend.append('reorderLevel', formData.reorderLevel)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('unit', formData.unit)
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      const response = await axios.post('/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setMessage({ type: 'success', text: 'Product added successfully!' })
      
      // Reset form on success
      setFormData({
        productId: '',
        name: '',
        category: '',
        costPrice: '',
        sellingPrice: '',
        reorderLevel: '10',
        description: '',
        unit: 'meters'
      })
      setImageFile(null)
      setImagePreview(null)
      
      // Reset file input
      const fileInput = document.getElementById('productImage')
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      console.error('Error adding product:', error.response || error)
      
      // Show detailed error message
      let errorMessage = 'Failed to add product. Please try again.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      // If there are validation errors, show them
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage += '\n' + error.response.data.errors.join('\n')
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-product-page">
      <div className="page-header">
        <h2>Add New Product</h2>
        <p>Fill in the details to create a new product</p>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ whiteSpace: 'pre-line' }}>{message.text}</span>
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productId">Product ID *</label>
              <input
                type="text"
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="e.g., PROD001"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Cotton">Cotton</option>
                <option value="Polyester">Polyester</option>
                <option value="Silk">Silk</option>
                <option value="Wool">Wool</option>
                <option value="Linen">Linen</option>
                <option value="Blended">Blended</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unit *</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="meters">Meters</option>
                <option value="kg">Kilograms</option>
                <option value="pieces">Pieces</option>
                <option value="rolls">Rolls</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="costPrice">Cost Price (₹) *</label>
              <input
                type="number"
                id="costPrice"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sellingPrice">Selling Price (₹) *</label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reorderLevel">Reorder Level *</label>
              <input
                type="number"
                id="reorderLevel"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                placeholder="10"
                min="0"
                required
              />
              <small>Minimum stock level before reorder alert</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productImage">Product Image</label>
            <input
              type="file"
              id="productImage"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>Max size: 5MB. Formats: JPEG, PNG, GIF, WebP</small>
            
            {imagePreview && (
              <div className="image-preview-container">
                <img 
                  src={imagePreview} 
                  alt="Preview"
                />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="remove-image-btn"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              <PackagePlus size={18} />
              {loading ? 'Adding...' : 'Add Product'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => {
                setFormData({
                  productId: '',
                  name: '',
                  category: '',
                  costPrice: '',
                  sellingPrice: '',
                  reorderLevel: '10',
                  description: '',
                  unit: 'meters'
                })
                setMessage({ type: '', text: '' })
              }}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Product Management Component
const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory !== 'All') params.category = selectedCategory
      if (searchQuery) params.search = searchQuery

      const response = await axios.get('/api/products', { params })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    try {
      await axios.delete(`/api/products/${productId}`)
      fetchProducts() // Refresh list
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <div className="product-management-page">
      <div className="page-header">
        <h2>Product Management</h2>
        <p>View and manage all products</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Cotton">Cotton</option>
            <option value="Polyester">Polyester</option>
            <option value="Silk">Silk</option>
            <option value="Wool">Wool</option>
            <option value="Linen">Linen</option>
            <option value="Blended">Blended</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="products-table-container">
        {loading ? (
          <div className="empty-state">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>No Products Found</h3>
            <p>Add your first product to get started</p>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Unit</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id || product.id}>
                  <td>
                    {product.image && product.image.url ? (
                      <img 
                        src={product.image.url} 
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        📦
                      </div>
                    )}
                  </td>
                  <td><strong>{product.productId}</strong></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{parseFloat(product.costPrice || 0).toFixed(2)}</td>
                  <td>₹{parseFloat(product.sellingPrice || 0).toFixed(2)}</td>
                  <td>{product.unit}</td>
                  <td>{product.reorderLevel}</td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'in-stock' : 'out-of-stock'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action delete" onClick={() => handleDelete(product._id || product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// User Analysis Component
const UserAnalysis = ({ onSelectUser }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/auth/users')
      const usersData = response.data || []
      setUsers(usersData)
      
      // Calculate stats
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const newUsers = usersData.filter(u => new Date(u.createdAt) >= thisMonthStart)
      
      setStats({
        total: usersData.length,
        active: usersData.filter(u => u.role === 'user').length,
        newThisMonth: newUsers.length
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="user-analysis-page">
      <div className="page-header">
        <h2>User Analysis</h2>
        <p>Monitor user activity and insights</p>
      </div>

      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="stat-header">
            <h4>Total Users</h4>
            <Users size={24} />
          </div>
          <p className="stat-number">{loading ? '...' : stats.total}</p>
          <span className="stat-change">All registered users</span>
        </div>

        <div className="user-stat-card">
          <div className="stat-header">
            <h4>Customer Users</h4>
            <Users size={24} />
          </div>
          <p className="stat-number">{loading ? '...' : stats.active}</p>
          <span className="stat-change">Active customer accounts</span>
        </div>

        <div className="user-stat-card">
          <div className="stat-header">
            <h4>New Users</h4>
            <Users size={24} />
          </div>
          <p className="stat-number">{loading ? '...' : stats.newThisMonth}</p>
          <span className="stat-change">This month</span>
        </div>
      </div>

      <div className="users-list-container">
        <h3>User List</h3>
        {loading ? (
          <div className="empty-state">
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No Users Found</h3>
            <p>No registered users yet</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id || user.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectUser && onSelectUser(user._id || user.id)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f4ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                  <td style={{ fontWeight: '500', color: '#667eea' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={`status-badge ${user.role === 'admin' ? 'active' : ''}`}>{user.role}</span></td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={(e) => { e.stopPropagation(); onSelectUser && onSelectUser(user._id || user.id) }}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// User Detail Component
const UserDetail = ({ userId, onBack }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    if (!userId) return
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/auth/users/${userId}/details`)
        setData(res.data)
      } catch (err) {
        console.error('Error fetching user details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>Loading user profile...</div>
  if (!data) return <div style={{ padding: '3rem', textAlign: 'center', color: '#e53e3e' }}>Failed to load user profile.</div>

  const { user, orders, reviews, issues } = data

  const tabStyle = (tab) => ({
    padding: '0.625rem 1.25rem',
    border: 'none',
    background: activeTab === tab ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f7fafc',
    color: activeTab === tab ? 'white' : '#4a5568',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  })

  const statusBadge = (label, color) => (
    <span style={{
      background: color + '20',
      color,
      border: `1px solid ${color}40`,
      borderRadius: '12px',
      padding: '0.2rem 0.6rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      textTransform: 'capitalize'
    }}>{label}</span>
  )

  const orderStatusColor = { pending: '#d69e2e', confirmed: '#3182ce', processing: '#805ad5', shipped: '#2b6cb0', delivered: '#38a169', cancelled: '#e53e3e' }
  const issueStatusColor = { open: '#3182ce', 'in-progress': '#d69e2e', resolved: '#38a169', closed: '#718096' }

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#667eea', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
      >
        ← Back to User List
      </button>

      {/* User profile card */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: '700', flexShrink: 0 }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>{user.name}</h2>
          <p style={{ margin: '0 0 0.5rem', color: '#718096', fontSize: '0.95rem' }}>{user.email}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Role: <strong style={{ color: '#4a5568' }}>{user.role}</strong></span>
            <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Joined: <strong style={{ color: '#4a5568' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</strong></span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem', textAlign: 'center', flexShrink: 0 }}>
          {[['Orders', orders.length, '#667eea'], ['Reviews', reviews.length, '#f093fb'], ['Reports', issues.length, '#f97316']].map(([label, count, color]) => (
            <div key={label}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color }}>{count}</div>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[['orders', `Orders (${orders.length})`], ['reviews', `Reviews (${reviews.length})`], ['reports', `Reports & Issues (${issues.length})`]].map(([key, label]) => (
          <button key={key} style={tabStyle(key)} onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {orders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#a0aec0' }}>
              <ShoppingCart size={48} style={{ opacity: 0.4 }} />
              <p style={{ marginTop: '1rem' }}>No orders found for this user.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Order ID', 'Items', 'Total Amount', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #e2e8f0' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '0.9rem 1rem', fontFamily: 'monospace', color: '#667eea', fontWeight: '600' }}>{order.orderId || '#' + order._id.slice(-6)}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#4a5568' }}>{order.items?.length || 0} item(s)</td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#2d3748' }}>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>{statusBadge(order.paymentStatus, order.paymentStatus === 'completed' ? '#38a169' : order.paymentStatus === 'failed' ? '#e53e3e' : '#d69e2e')}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>{statusBadge(order.orderStatus, orderStatusColor[order.orderStatus] || '#718096')}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#718096', fontSize: '0.8rem' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {reviews.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#a0aec0' }}>
              <TrendingUp size={48} style={{ opacity: 0.4 }} />
              <p style={{ marginTop: '1rem' }}>No reviews submitted by this user.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Product', 'Rating', 'Title', 'Review', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review._id} style={{ borderBottom: '1px solid #e2e8f0' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '0.9rem 1rem', color: '#4a5568', fontWeight: '500' }}>{review.productId?.name || 'N/A'}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ color: '#d69e2e', fontWeight: '700', fontSize: '1rem' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      <span style={{ color: '#718096', fontSize: '0.8rem', marginLeft: '0.35rem' }}>({review.rating}/5)</span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '500', color: '#2d3748' }}>{review.reviewTitle || '—'}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#718096', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.reviewText}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>{statusBadge(review.status, review.status === 'approved' ? '#38a169' : review.status === 'rejected' ? '#e53e3e' : '#d69e2e')}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#718096', fontSize: '0.8rem' }}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Reports / Issues Tab */}
      {activeTab === 'reports' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {issues.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#a0aec0' }}>
              <HelpCircle size={48} style={{ opacity: 0.4 }} />
              <p style={{ marginTop: '1rem' }}>No issues or reports submitted by this user.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Type', 'Subject', 'Priority', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue._id} style={{ borderBottom: '1px solid #e2e8f0' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ background: issue.type === 'issue' ? '#3182ce' : issue.type === 'contact' ? '#38a169' : '#718096', color: 'white', borderRadius: '12px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: '500', textTransform: 'capitalize' }}>{issue.type}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#2d3748', fontWeight: '500', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.subject}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ color: issue.priority === 'critical' ? '#e53e3e' : issue.priority === 'high' ? '#dd6b20' : issue.priority === 'medium' ? '#d69e2e' : '#38a169', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{issue.priority}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>{statusBadge(issue.status.replace('-', ' '), issueStatusColor[issue.status] || '#718096')}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#718096', fontSize: '0.8rem' }}>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

// Issues Management Component
const IssuesManagement = () => {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [issueStats, setIssueStats] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    fetchIssues()
    fetchIssueStats()
  }, [filterStatus, filterType])

  const fetchIssues = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterType !== 'all') params.append('type', filterType)
      
      const response = await axios.get(`/api/issues?${params.toString()}`)
      setIssues(response.data.issues || [])
    } catch (error) {
      console.error('Error fetching issues:', error)
      setIssues([])
    } finally {
      setLoading(false)
    }
  }

  const fetchIssueStats = async () => {
    try {
      const response = await axios.get('/api/issues/admin/stats')
      setIssueStats(response.data.stats)
    } catch (error) {
      console.error('Error fetching issue stats:', error)
    }
  }

  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      setUpdatingStatus(true)
      await axios.put(`/api/issues/${issueId}/status`, {
        status: newStatus,
        adminNotes: adminNotes
      })
      
      alert('Issue status updated successfully')
      fetchIssues()
      fetchIssueStats()
      setSelectedIssue(null)
      setAdminNotes('')
    } catch (error) {
      console.error('Error updating issue status:', error)
      alert(error.response?.data?.message || 'Failed to update issue status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return
    
    try {
      await axios.delete(`/api/issues/${issueId}`)
      alert('Issue deleted successfully')
      fetchIssues()
      fetchIssueStats()
      setSelectedIssue(null)
    } catch (error) {
      console.error('Error deleting issue:', error)
      alert('Failed to delete issue')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#dc3545'
      case 'high': return '#fd7e14'
      case 'medium': return '#ffc107'
      case 'low': return '#28a745'
      default: return '#6c757d'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#007bff'
      case 'in-progress': return '#ffc107'
      case 'resolved': return '#28a745'
      case 'closed': return '#6c757d'
      default: return '#6c757d'
    }
  }

  return (
    <div className="issues-management-page" style={{ padding: '1.5rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
          Issues & Support Management
        </h2>
        <p style={{ color: '#718096', fontSize: '0.95rem' }}>
          Manage customer issues and support requests
        </p>
      </div>

      {/* Stats Cards */}
      {issueStats && (
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <HelpCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>Total Issues</h3>
              <p className="stat-value">{issueStats.total || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <AlertCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>Open Issues</h3>
              <p className="stat-value">{issueStats.byStatus?.open || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <CheckCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>Resolved</h3>
              <p className="stat-value">{issueStats.byStatus?.resolved || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <AlertCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>Critical</h3>
              <p className="stat-value">{issueStats.byPriority?.critical || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ 
        background: 'white', 
        padding: '1.25rem', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-end'
      }}>
        <div style={{ flex: '0 0 200px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            color: '#4a5568', 
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            STATUS:
          </label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ 
              width: '100%',
              padding: '0.625rem 0.75rem', 
              borderRadius: '6px', 
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'all 0.2s'
            }}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div style={{ flex: '0 0 200px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            color: '#4a5568', 
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            TYPE:
          </label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{ 
              width: '100%',
              padding: '0.625rem 0.75rem', 
              borderRadius: '6px', 
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'all 0.2s'
            }}
          >
            <option value="all">All Types</option>
            <option value="issue">Issue</option>
            <option value="contact">Contact</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="issues-list" style={{ 
        background: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div className="loading-state" style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: '#718096' }}>Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
            <HelpCircle size={64} color="#cbd5e0" />
            <h3 style={{ marginTop: '1rem', fontSize: '1.25rem', color: '#2d3748' }}>No Issues Found</h3>
            <p style={{ marginTop: '0.5rem', color: '#718096' }}>No support requests or issues to display</p>
          </div>
        ) : (
          <div className="issues-table-container" style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.875rem'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted By</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                    <td style={{ padding: '1rem', color: '#718096', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      #{issue._id.slice(-6)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        backgroundColor: issue.type === 'issue' ? '#3182ce' : 
                                        issue.type === 'contact' ? '#38a169' : '#718096',
                        color: 'white',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        display: 'inline-block'
                      }}>
                        {issue.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#2d3748', fontWeight: '500', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {issue.subject}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500', color: '#2d3748', marginBottom: '0.25rem' }}>
                        {issue.submittedBy?.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                        {issue.submittedBy?.email || ''}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        color: getPriorityColor(issue.priority),
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em'
                      }}>
                        {issue.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        backgroundColor: getStatusColor(issue.status) + '20',
                        color: getStatusColor(issue.status),
                        padding: '0.25rem 0.625rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        display: 'inline-block',
                        border: `1px solid ${getStatusColor(issue.status)}40`
                      }}>
                        {issue.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#718096', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {formatDate(issue.createdAt)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => setSelectedIssue(issue)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)'
                          e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ 
            maxWidth: '700px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div className="modal-header" style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Issue Details</h3>
              <button className="modal-close" onClick={() => setSelectedIssue(null)} style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#718096',
                cursor: 'pointer',
                padding: '0.25rem',
                lineHeight: 1
              }}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>ID:</strong>
                  <span style={{ color: '#2d3748', fontFamily: 'monospace' }}>#{selectedIssue._id}</span>
                </div>
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Type:</strong>
                  <span style={{ 
                    backgroundColor: selectedIssue.type === 'issue' ? '#3182ce' : 
                                    selectedIssue.type === 'contact' ? '#38a169' : '#718096',
                    color: 'white',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    display: 'inline-block'
                  }}>
                    {selectedIssue.type}
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Category:</strong>
                  <span style={{ color: '#2d3748', textTransform: 'capitalize' }}>{selectedIssue.category}</span>
                </div>
                <div>
                  <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Priority:</strong>
                  <span style={{ 
                    color: getPriorityColor(selectedIssue.priority),
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    fontSize: '0.875rem'
                  }}>
                    {selectedIssue.priority}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Subject:</strong>
                <p style={{ color: '#2d3748', fontSize: '1rem', fontWeight: '500', margin: 0 }}>{selectedIssue.subject}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Description:</strong>
                <p style={{ 
                  marginTop: '0.5rem', 
                  padding: '1rem', 
                  background: '#f7fafc', 
                  borderRadius: '8px',
                  color: '#2d3748',
                  lineHeight: '1.6',
                  border: '1px solid #e2e8f0',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedIssue.description}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Submitted By:</strong>
                <div style={{ color: '#2d3748', fontWeight: '500' }}>{selectedIssue.submittedBy?.name}</div>
                <div style={{ color: '#718096', fontSize: '0.875rem' }}>{selectedIssue.submittedBy?.email}</div>
                <div style={{ color: '#a0aec0', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {formatDate(selectedIssue.createdAt)}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Current Status:</strong>
                <span style={{ 
                  backgroundColor: getStatusColor(selectedIssue.status) + '20',
                  color: getStatusColor(selectedIssue.status),
                  padding: '0.375rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  display: 'inline-block',
                  border: `1px solid ${getStatusColor(selectedIssue.status)}40`
                }}>
                  {selectedIssue.status.replace('-', ' ')}
                </span>
              </div>
              
              {selectedIssue.adminNotes && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: '#4a5568', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Admin Notes:</strong>
                  <p style={{ 
                    marginTop: '0.5rem', 
                    padding: '1rem', 
                    background: '#fffbeb', 
                    borderRadius: '8px',
                    color: '#78350f',
                    lineHeight: '1.6',
                    border: '1px solid #fde68a',
                    margin: 0
                  }}>
                    {selectedIssue.adminNotes}
                  </p>
                </div>
              )}

              <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  color: '#4a5568', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  Update Status:
                </label>
                <select 
                  defaultValue={selectedIssue.status}
                  onChange={(e) => {
                    if (window.confirm(`Change status to ${e.target.value.replace('-', ' ')}?`)) {
                      handleUpdateStatus(selectedIssue._id, e.target.value)
                    }
                  }}
                  disabled={updatingStatus}
                  style={{ 
                    width: '100%', 
                    padding: '0.625rem 0.75rem', 
                    marginTop: '0.25rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  color: '#4a5568', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  Add Admin Notes:
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this issue..."
                  rows="4"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    marginTop: '0.25rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedIssue(null)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    background: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#cbd5e0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this issue?')) {
                      handleDeleteIssue(selectedIssue._id)
                    }
                  }}
                  style={{
                    padding: '0.625rem 1.25rem',
                    background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 2px 4px rgba(245, 101, 101, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)'
                    e.target.style.boxShadow = '0 4px 8px rgba(245, 101, 101, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 2px 4px rgba(245, 101, 101, 0.3)'
                  }}
                >
                  Delete Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Analytics Section Component
const AnalyticsSection = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState(null)

  const toInputDate = (rawDate) => {
    if (!rawDate) return ''
    const d = new Date(rawDate)
    if (Number.isNaN(d.getTime())) return ''
    const offsetMs = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offsetMs).toISOString().slice(0, 10)
  }

  const toDisplayDate = (inputDate) => {
    if (!inputDate || !/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) return inputDate || ''
    const [year, month, day] = inputDate.split('-')
    return `${day}-${month}-${year}`
  }

  const getDefaultDates = () => {
    const end = new Date()
    const start = new Date(end)
    start.setDate(start.getDate() - 89)
    return {
      startDate: toInputDate(start),
      endDate: toInputDate(end)
    }
  }

  const defaults = getDefaultDates()
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)
  const [datePreset, setDatePreset] = useState('last90')
  const [trendGranularity, setTrendGranularity] = useState('month')
  const [drillStack, setDrillStack] = useState([])
  const [salesDrillCategory, setSalesDrillCategory] = useState('')
  const [salesDrillProductId, setSalesDrillProductId] = useState('')
  const [salesDrillProductName, setSalesDrillProductName] = useState('')

  const fetchAnalytics = async (opts = {}) => {
    const start = opts.startDate || startDate
    const end = opts.endDate || endDate
    const granularity = opts.granularity || trendGranularity

    if (!start || !end) return

    const normalizedStart = start <= end ? start : end
    const normalizedEnd = end >= start ? end : start

    try {
      setLoading(true)
      setError(null)
      const res = await axios.get('/api/analytics/dashboard', {
        params: {
          startDate: normalizedStart,
          endDate: normalizedEnd,
          granularity,
          drillCategory: salesDrillCategory || undefined,
          drillProductId: salesDrillProductId || undefined
        }
      })
      setData(res.data)
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [startDate, endDate, trendGranularity, salesDrillCategory, salesDrillProductId])

  if (loading) return <div className="loading-state">Loading analytics data...</div>
  if (error) return <div className="loading-state" style={{ color: '#e53e3e' }}>{error}</div>
  if (!data) return null

  const kpis = data.kpiCards || {}
  const cancRate = data.cancellationData?.cancellationRate ?? 0

  const presets = [
    { id: 'last7', label: 'Last 7 Days', days: 6 },
    { id: 'last30', label: 'Last 30 Days', days: 29 },
    { id: 'last90', label: 'Last 90 Days', days: 89 },
    { id: 'last180', label: 'Last 180 Days', days: 179 },
    { id: 'ytd', label: 'Year to Date', ytd: true },
    { id: 'custom', label: 'Custom' }
  ]

  const applyPreset = (presetId) => {
    setDatePreset(presetId)
    if (presetId === 'custom') return

    const now = new Date()
    let nextStart = new Date(now)

    if (presetId === 'ytd') {
      nextStart = new Date(now.getFullYear(), 0, 1)
    } else {
      const preset = presets.find(p => p.id === presetId)
      const days = preset?.days ?? 89
      nextStart.setDate(now.getDate() - days)
    }

    setStartDate(toInputDate(nextStart))
    setEndDate(toInputDate(now))
    setDrillStack([])
    setSalesDrillCategory('')
    setSalesDrillProductId('')
    setSalesDrillProductName('')
  }

  const getRangeLabel = () => {
    const start = data?.dateRange?.startDate ? toInputDate(data.dateRange.startDate) : startDate
    const end = data?.dateRange?.endDate ? toInputDate(data.dateRange.endDate) : endDate
    return `${toDisplayDate(start)} to ${toDisplayDate(end)}`
  }

  const handleTrendPointDrillDown = (point) => {
    if (trendGranularity !== 'month' || !point?.year || !point?.month) return

    const monthStart = new Date(point.year, point.month - 1, 1)
    const monthEnd = new Date(point.year, point.month, 0)

    setDrillStack(prev => [
      ...prev,
      {
        startDate,
        endDate,
        granularity: trendGranularity,
        label: point.label
      }
    ])

    setStartDate(toInputDate(monthStart))
    setEndDate(toInputDate(monthEnd))
    setTrendGranularity('day')
    setDatePreset('custom')
  }

  const handleDrillUp = () => {
    if (drillStack.length === 0) return
    const previous = drillStack[drillStack.length - 1]
    setDrillStack(prev => prev.slice(0, -1))
    setStartDate(previous.startDate)
    setEndDate(previous.endDate)
    setTrendGranularity(previous.granularity)
  }

  const handleCategoryDrillDown = (raw) => {
    const category = raw?.category || raw?.name
    if (!category) return
    setSalesDrillCategory(category)
    setSalesDrillProductId('')
    setSalesDrillProductName('')
  }

  const handleProductDrillDown = (raw) => {
    const productId = String(raw?.productId || '').trim().toUpperCase()
    const productName = raw?.productName || raw?.name || ''
    if (!productId) return
    setSalesDrillProductId(productId)
    setSalesDrillProductName(productName)
  }

  const handleSalesDrillUp = () => {
    if (salesDrillProductId) {
      setSalesDrillProductId('')
      setSalesDrillProductName('')
      return
    }
    if (salesDrillCategory) {
      setSalesDrillCategory('')
    }
  }

  const handleChartDrillUp = () => {
    if (salesDrillProductId || salesDrillCategory) {
      handleSalesDrillUp()
      return
    }
    handleDrillUp()
  }

  const clearSalesDrill = () => {
    setSalesDrillCategory('')
    setSalesDrillProductId('')
    setSalesDrillProductName('')
  }

  // ── Gauge Chart (Cancellation Rate) ──────────────────────────────────────
  const GaugeChart = ({ rate, title }) => {
    const gaugeData = [{ name: 'Rate', value: parseFloat(rate), fill: rate > 20 ? '#f5576c' : rate > 10 ? '#ffa726' : '#43e97b' }]
    const { RadialBarChart, RadialBar, PolarAngleAxis } = window.Recharts || {}
    const safeRate = Math.min(100, Math.max(0, parseFloat(rate) || 0))
    return (
      <div className="chart-container">
        {title && <h3 className="chart-title">{title}</h3>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280 }}>
          <div style={{
            width: 180, height: 180, borderRadius: '50%',
            background: `conic-gradient(${safeRate > 20 ? '#f5576c' : safeRate > 10 ? '#ffa726' : '#43e97b'} ${safeRate * 3.6}deg, #e2e8f0 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: 130, height: 130, borderRadius: '50%', background: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: safeRate > 20 ? '#f5576c' : safeRate > 10 ? '#ffa726' : '#43e97b' }}>
                {safeRate.toFixed(1)}%
              </span>
              <span style={{ fontSize: '0.75rem', color: '#718096', marginTop: 2 }}>Cancellation</span>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 24, fontSize: '0.8rem' }}>
            <span style={{ color: '#43e97b', fontWeight: 600 }}>● &lt;10% Good</span>
            <span style={{ color: '#ffa726', fontWeight: 600 }}>● 10–20% Warning</span>
            <span style={{ color: '#f5576c', fontWeight: 600 }}>● &gt;20% High</span>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview',   label: 'Overview',   icon: BarChart3 },
    { id: 'sales',      label: 'Sales',      icon: TrendingUp },
    { id: 'customers',  label: 'Customers',  icon: Users },
    { id: 'inventory',  label: 'Inventory',  icon: Package },
  ]

  // ── Tab 1: Overview ───────────────────────────────────────────────────────
  const renderOverview = () => (
    <>
      {/* #1 #2 #12 + extras — KPI Cards */}
      <div className="kpi-grid">
        <KPICard title="Total Orders"    value={kpis.totalOrders || 0}                     icon={ShoppingCart} />
        <KPICard title="Total Revenue"   value={kpis.totalRevenue || 0}       currency="₹" icon={DollarSign} />
        <KPICard title="Total Customers" value={kpis.totalCustomers || 0}                  icon={Users} />
        <KPICard title="Avg Order Value" value={kpis.averageOrderValue || 0}  currency="₹" icon={TrendingUp} />
        <KPICard title="Low Stock Items" value={(data.lowStockProducts || []).length}       icon={Package} />
      </div>

      {/* #3 Monthly Sales Trend → Line Chart | #4 Daily Order Activity → Area Chart */}
      <div className="charts-row">
        <div className="chart-half">
          <LineChart
            data={(data.monthlySalesTrend || []).map(m => ({
              label: m.label,
              revenue: m.totalRevenue,
              orders: m.orderCount,
              year: m.year,
              month: m.month,
              week: m.week,
              day: m.day
            }))}
            xKey="label"
            yKeys={[
              { dataKey: 'revenue', name: 'Revenue' },
              { dataKey: 'orders',  name: 'Orders'  },
            ]}
            colors={['#667eea', '#43e97b']}
            title={`Sales Trend (${trendGranularity === 'month' ? 'Monthly' : trendGranularity === 'week' ? 'Weekly' : 'Daily'})`}
            height={350}
            onPointClick={handleTrendPointDrillDown}
            onChartClick={handleChartDrillUp}
          />
        </div>
        <div className="chart-half">
          <AreaChart
            data={(data.dailyOrderActivity || []).map(d => ({
              date: d.date, orders: d.orderCount, revenue: d.totalRevenue
            }))}
            xKey="date"
            yKeys={[
              { dataKey: 'orders',  name: 'Orders'  },
              { dataKey: 'revenue', name: 'Revenue' },
            ]}
            colors={['#fa709a', '#667eea']}
            title="Daily Order Activity"
            height={350}
            onChartClick={handleChartDrillUp}
          />
        </div>
      </div>
      <div className="charts-row">
        <div className="chart-half">
          <PieChart
            data={(data.orderStatusDistribution || []).map(s => ({ name: s.status, value: s.count }))}
            dataKey="value"
            nameKey="name"
            title="Order Status Distribution"
            height={350}
            onChartClick={handleChartDrillUp}
          />
        </div>
        <div className="chart-half">
          <GaugeChart rate={cancRate} title="Order Cancellation Rate" />
        </div>
      </div>
    </>
  )

  // ── Tab 2: Sales & Products ───────────────────────────────────────────────
  const renderSales = () => {
    const categoryProducts = data.categoryProductBreakdown || []
    const productTrend = data.productDrillTrend || []
    const productSummary = data.productDrillSummary || null
    const isCategoryDrilled = !!salesDrillCategory
    const isProductDrilled = !!salesDrillProductId

    return (
      <>
        {/* Category level */}
        {!isCategoryDrilled && (
          <div className="charts-row">
            <div className="chart-half">
              <BarChart
                data={data.salesByCategory || []}
                xKey="category"
                yKeys={[{ dataKey: 'totalQuantity', name: 'Units Sold' }]}
                colors={['#667eea']}
                title="Sales by Product Category (Click to Drill Down)"
                height={380}
                layout="horizontal"
                onBarClick={handleCategoryDrillDown}
                onChartClick={handleChartDrillUp}
              />
            </div>
            <div className="chart-half">
              <PieChart
                data={(data.revenueByCategory || []).map(c => ({ category: c.category, name: c.category, value: c.totalRevenue }))}
                dataKey="value"
                nameKey="name"
                title="Revenue by Product Category (Click Slice to Drill Down)"
                valuePrefix="₹"
                height={380}
                onSliceClick={handleCategoryDrillDown}
                onChartClick={handleChartDrillUp}
              />
            </div>
          </div>
        )}

        {/* Category -> Product level */}
        {isCategoryDrilled && !isProductDrilled && (
          <div className="charts-row">
            <div className="chart-half">
              <BarChart
                data={categoryProducts}
                xKey="productName"
                yKeys={[{ dataKey: 'totalQuantity', name: 'Units Sold' }]}
                colors={['#43e97b']}
                title={`Products in ${salesDrillCategory} (Click Product to Drill Down)`}
                height={420}
                layout="vertical"
                onBarClick={handleProductDrillDown}
                onChartClick={handleChartDrillUp}
              />
            </div>
            <div className="chart-half">
              <BarChart
                data={categoryProducts}
                xKey="productName"
                yKeys={[{ dataKey: 'totalRevenue', name: 'Revenue' }]}
                colors={['#764ba2']}
                title={`Revenue by Product in ${salesDrillCategory}`}
                valuePrefix="₹"
                height={420}
                layout="vertical"
                onBarClick={handleProductDrillDown}
                onChartClick={handleChartDrillUp}
              />
            </div>
          </div>
        )}

        {/* Product level */}
        {isProductDrilled && (
          <>
            {productSummary && (
              <div className="kpi-grid">
                <KPICard title="Product Orders" value={productSummary.orderCount || 0} icon={ShoppingCart} />
                <KPICard title="Units Sold" value={productSummary.totalQuantity || 0} icon={Package} />
                <KPICard title="Revenue" value={productSummary.totalRevenue || 0} currency="₹" icon={DollarSign} />
                <KPICard title="Avg Unit Price" value={productSummary.avgUnitPrice || 0} currency="₹" icon={TrendingUp} />
              </div>
            )}
            <div className="charts-row">
              <div className="chart-full">
                <LineChart
                  data={productTrend.map(p => ({
                    label: p.label,
                    quantity: p.totalQuantity,
                    revenue: p.totalRevenue,
                    orders: p.orderCount
                  }))}
                  xKey="label"
                  yKeys={[
                    { dataKey: 'quantity', name: 'Units Sold' },
                    { dataKey: 'orders', name: 'Orders' },
                    { dataKey: 'revenue', name: 'Revenue' }
                  ]}
                  colors={['#43e97b', '#30cfd0', '#667eea']}
                  title={`Product Trend - ${salesDrillProductName || salesDrillProductId}`}
                  valuePrefix="₹"
                  height={420}
                  onChartClick={handleChartDrillUp}
                />
              </div>
            </div>
          </>
        )}

        {/* Global sales analytics */}
        {!isCategoryDrilled && !isProductDrilled && (
          <>
            <div className="charts-row">
              <div className="chart-half">
                <LineChart
                  data={data.cumulativeRevenueTrend || []}
                  xKey="label"
                  yKeys={[
                    { dataKey: 'dailyRevenue', name: 'Daily Revenue' },
                    { dataKey: 'cumulativeRevenue', name: 'Cumulative Revenue' }
                  ]}
                  colors={['#f093fb', '#667eea']}
                  title="Cumulative Revenue Progress"
                  valuePrefix="₹"
                  height={380}
                  onChartClick={handleChartDrillUp}
                />
              </div>
              <div className="chart-half">
                <BarChart
                  data={data.revenueByWeekday || []}
                  xKey="day"
                  yKeys={[
                    { dataKey: 'orderCount', name: 'Orders' },
                    { dataKey: 'totalRevenue', name: 'Revenue' }
                  ]}
                  colors={['#30cfd0', '#764ba2']}
                  title="Weekday Revenue Pattern"
                  height={380}
                  layout="horizontal"
                  onChartClick={handleChartDrillUp}
                />
              </div>
            </div>

            <div className="charts-row">
              <div className="chart-half">
                <BarChart
                  data={data.topSellingProducts || []}
                  xKey="productName"
                  yKeys={[{ dataKey: 'totalQuantity', name: 'Units Sold' }]}
                  colors={['#43e97b']}
                  title="Top Selling Products"
                  height={420}
                  layout="vertical"
                  onBarClick={handleProductDrillDown}
                  onChartClick={handleChartDrillUp}
                />
              </div>
              <div className="chart-half">
                <BarChart
                  data={data.leastSellingProducts || []}
                  xKey="productName"
                  yKeys={[{ dataKey: 'totalQuantity', name: 'Units Sold' }]}
                  colors={['#f5576c']}
                  title="Least Selling Products"
                  height={420}
                  layout="vertical"
                  onBarClick={handleProductDrillDown}
                  onChartClick={handleChartDrillUp}
                />
              </div>
            </div>

            <div className="charts-row">
              <div className="chart-half">
                <BarChart
                  data={data.priceRangePerformance || []}
                  xKey="priceRange"
                  yKeys={[
                    { dataKey: 'count',        name: 'Transactions' },
                    { dataKey: 'totalRevenue', name: 'Revenue (₹)'  },
                  ]}
                  colors={['#667eea', '#f093fb']}
                  title="Price Range Performance — Histogram"
                  height={420}
                  layout="horizontal"
                  onChartClick={handleChartDrillUp}
                />
              </div>
              <div className="chart-half">
                <LineChart
                  data={data.revenueGrowthRate || []}
                  xKey="label"
                  yKeys={[{ dataKey: 'growthRate', name: 'Growth %' }]}
                  colors={['#43e97b']}
                  title="Revenue Growth Rate (%)"
                  height={420}
                  onChartClick={handleChartDrillUp}
                />
              </div>
            </div>
          </>
        )}
      </>
    )
  }

  // ── Tab 3: Customers ──────────────────────────────────────────────────────
  const renderCustomers = () => (
    <>
      {/* #9 Customer Growth → Line Chart | #10 Top Customers → Bar Chart */}
      <div className="charts-row">
        <div className="chart-half">
          <LineChart
            data={data.customerGrowth || []}
            xKey="label"
            yKeys={[{ dataKey: 'newCustomers', name: 'New Customers' }]}
            colors={['#43e97b']}
            title="Customer Growth Analysis"
            height={380}
            onChartClick={handleChartDrillUp}
          />
        </div>
        <div className="chart-half">
          <BarChart
            data={(data.topCustomers || []).map(c => ({
              name: c.customerName, revenue: c.totalRevenue, orders: c.orderCount
            }))}
            xKey="name"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#f093fb']}
            title="Top Customers by Revenue"
            valuePrefix="₹"
            height={380}
            layout="vertical"
            onChartClick={handleChartDrillUp}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <PieChart
            data={[
              { name: 'New Customers', value: data.customerPurchasePattern?.newCustomers || 0 },
              { name: 'Returning Customers', value: data.customerPurchasePattern?.returningCustomers || 0 }
            ]}
            dataKey="value"
            nameKey="name"
            title="New vs Returning Customers"
            height={380}
            onChartClick={handleChartDrillUp}
          />
        </div>
      </div>
    </>
  )

  // ── Tab 4: Inventory ──────────────────────────────────────────────────────
  const renderInventory = () => {
    const lowStock = data.lowStockProducts || []
    const inventoryTopItems = (data.inventoryStockLevels || []).slice(0, 10)
    return (
      <>
        <div className="kpi-grid">
          <KPICard title="Total SKUs"        value={(data.inventoryStockLevels || []).length} icon={Package} />
          <KPICard title="Low Stock Alerts"  value={lowStock.length}                           icon={AlertCircle} />
          <KPICard title="Fast Moving (90d)" value={(data.fastMovingProducts || []).length}    icon={TrendingUp} />
          <KPICard title="Slow Moving (90d)" value={(data.slowMovingProducts || []).length}    icon={ShoppingCart} />
        </div>

        {/* #14 Inventory Stock Levels → Horizontal Bar */}
        <div className="charts-row">
          <div className="chart-full">
            <BarChart
              data={inventoryTopItems.map(p => ({
                productName: p.productName, quantityInStock: p.quantityInStock, reorderLevel: p.reorderLevel
              }))}
              xKey="productName"
              yKeys={[
                { dataKey: 'quantityInStock', name: 'In Stock'      },
                { dataKey: 'reorderLevel',    name: 'Reorder Level' },
              ]}
              colors={['#43e97b', '#f5576c']}
              title="Inventory Stock Levels (Top 10 Products)"
              height={360}
              layout="vertical"
              onChartClick={handleChartDrillUp}
            />
          </div>
        </div>

        {/* #15 Low Stock Detection → Table + Alert */}
        {lowStock.length > 0 && (
          <div className="charts-row">
            <div className="chart-full">
              <div className="analytics-card">
                <h3 className="card-title" style={{ color: '#f5576c', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={18} /> Low Stock Detection — {lowStock.length} items need attention
                </h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>In Stock</th>
                      <th>Reorder Level</th>
                      <th>Deficit</th>
                      <th>Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item, i) => (
                      <tr key={item.productId || i}>
                        <td>{item.productName || 'N/A'}</td>
                        <td>{item.category || 'N/A'}</td>
                        <td style={{ color: item.quantityInStock === 0 ? '#f5576c' : '#2d3748', fontWeight: 600 }}>
                          {item.quantityInStock}
                        </td>
                        <td>{item.reorderLevel}</td>
                        <td style={{ color: '#f5576c', fontWeight: 600 }}>{item.deficit}</td>
                        <td>
                          <span style={{
                            background: item.alert === 'CRITICAL' ? '#f8d7da' : '#fff3cd',
                            color: item.alert === 'CRITICAL' ? '#842029' : '#856404',
                            padding: '2px 10px', borderRadius: '12px',
                            fontSize: '0.72rem', fontWeight: 700
                          }}>
                            {item.alert}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* #16 Fast Moving | #17 Slow Moving */}
        {(data.fastMovingProducts || []).length < 2 && (data.slowMovingProducts || []).length === 0 && (
          <div style={{ background: '#fffbeb', border: '1px solid #f6ad55', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#7b341e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span>
            <span><strong>Limited dataset:</strong> You need at least 2 distinct products with sales data in the last 90 days to split Fast vs Slow moving. Add more sales data to see the comparison.</span>
          </div>
        )}
        <div className="charts-row">
          <div className="chart-half">
            <BarChart
              data={data.fastMovingProducts || []}
              xKey="productName"
              yKeys={[{ dataKey: 'totalQuantity', name: 'Units (90d)' }]}
              colors={['#43e97b']}
              title="Fast Moving Products (Last 90 Days)"
              height={400}
              layout="vertical"
              onChartClick={handleChartDrillUp}
            />
          </div>
          <div className="chart-half">
            <BarChart
              data={data.slowMovingProducts || []}
              xKey="productName"
              yKeys={[{ dataKey: 'totalQuantity', name: 'Units (90d)' }]}
              colors={['#ffa726']}
              title="Slow Moving Products (Last 90 Days)"
              height={400}
              layout="vertical"
              onChartClick={handleChartDrillUp}
            />
          </div>
        </div>
      </>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sales':     return renderSales()
      case 'customers': return renderCustomers()
      case 'inventory': return renderInventory()
      default:          return renderOverview()
    }
  }

  return (
    <div className="analytics-section-container">
      <div className="analytics-header">
        <h2>Business Analytics &amp; Insights</h2>
        <p>Dynamic analytics for {getRangeLabel()} with drill-down exploration</p>
      </div>

      <div className="analytics-filters">
        <div className="analytics-filter-group">
          <label>Quick Range</label>
          <select value={datePreset} onChange={(e) => applyPreset(e.target.value)}>
            {presets.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="analytics-filter-group">
          <label>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setDatePreset('custom')
              setStartDate(e.target.value)
            }}
          />
        </div>
        <div className="analytics-filter-group">
          <label>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setDatePreset('custom')
              setEndDate(e.target.value)
            }}
          />
        </div>
        <div className="analytics-filter-group">
          <label>Trend View</label>
          <select
            value={trendGranularity}
            onChange={(e) => {
              setTrendGranularity(e.target.value)
              setDrillStack([])
            }}
          >
            <option value="month">Monthly</option>
            <option value="week">Weekly</option>
            <option value="day">Daily</option>
          </select>
        </div>
        <div className="analytics-filter-actions">
          <button
            type="button"
            className="analytics-secondary-btn"
            onClick={() => {
              const reset = getDefaultDates()
              setDatePreset('last90')
              setStartDate(reset.startDate)
              setEndDate(reset.endDate)
              setTrendGranularity('month')
              setDrillStack([])
              clearSalesDrill()
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="analytics-primary-btn"
            onClick={() => fetchAnalytics()}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="analytics-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="analytics-content">
        {renderTabContent()}
      </div>
    </div>
  )
}

// ─── Admin Orders Component ───────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [filterStatus, filterPayment, page])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterPayment !== 'all') params.append('paymentStatus', filterPayment)
      params.append('page', page)
      params.append('limit', 15)
      const res = await axios.get(`/api/orders/admin/all?${params.toString()}`)
      setOrders(res.data.orders || [])
      setTotalPages(res.data.totalPages || 1)
      setTotalOrders(res.data.totalOrders || 0)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return
    try {
      setUpdating(true)
      const body = { orderStatus: newStatus }
      if (trackingNumber) body.trackingNumber = trackingNumber
      if (estimatedDelivery) body.estimatedDelivery = estimatedDelivery
      await axios.put(`/api/orders/${selectedOrder._id}/status`, body)
      setSelectedOrder(null)
      setNewStatus('')
      setTrackingNumber('')
      setEstimatedDelivery('')
      fetchOrders()
    } catch (err) {
      console.error('Error updating status:', err)
      alert(err.response?.data?.message || 'Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const openModal = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.orderStatus)
    setTrackingNumber(order.trackingNumber || '')
    setEstimatedDelivery(
      order.estimatedDelivery ? order.estimatedDelivery.slice(0, 10) : ''
    )
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const statusColors = {
    pending:    { bg: '#fff3cd', color: '#856404' },
    confirmed:  { bg: '#cfe2ff', color: '#084298' },
    processing: { bg: '#e2d9f3', color: '#432874' },
    shipped:    { bg: '#d1ecf1', color: '#0c5460' },
    delivered:  { bg: '#d1e7dd', color: '#0f5132' },
    cancelled:  { bg: '#f8d7da', color: '#842029' },
  }
  const paymentColors = {
    pending:   { bg: '#fff3cd', color: '#856404' },
    completed: { bg: '#d1e7dd', color: '#0f5132' },
    failed:    { bg: '#f8d7da', color: '#842029' },
    refunded:  { bg: '#e2d9f3', color: '#432874' },
  }

  const Badge = ({ value, map }) => {
    const c = map[value] || { bg: '#e2e8f0', color: '#4a5568' }
    return (
      <span style={{
        background: c.bg, color: c.color,
        padding: '3px 10px', borderRadius: '20px',
        fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize'
      }}>{value}</span>
    )
  }

  const filteredOrders = orders.filter(o => {
    if (!search.trim()) return true
    const s = search.toLowerCase()
    return (
      (o.orderId || '').toLowerCase().includes(s) ||
      (o.customerInfo?.name || o.user?.name || '').toLowerCase().includes(s) ||
      (o.customerInfo?.email || o.user?.email || '').toLowerCase().includes(s)
    )
  })

  const thStyle = {
    padding: '12px 14px', textAlign: 'left', fontWeight: '600',
    color: '#4a5568', fontSize: '0.72rem', textTransform: 'uppercase',
    letterSpacing: '0.05em', whiteSpace: 'nowrap'
  }
  const tdStyle = {
    padding: '12px 14px', fontSize: '0.875rem',
    color: '#2d3748', borderBottom: '1px solid #e2e8f0', verticalAlign: 'middle'
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.25rem' }}>
          Orders Management
        </h2>
        <p style={{ color: '#718096', fontSize: '0.95rem' }}>
          {totalOrders} total orders — view, filter, and update order statuses
        </p>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Orders', value: totalOrders,                                          iconEl: <ClipboardList size={22} color="white" />, grad: 'linear-gradient(135deg,#667eea,#764ba2)' },
          { label: 'Pending',      value: orders.filter(o=>o.orderStatus==='pending').length,   iconEl: <Clock size={22} color="white" />,          grad: 'linear-gradient(135deg,#f6d365,#fda085)' },
          { label: 'Shipped',      value: orders.filter(o=>o.orderStatus==='shipped').length,   iconEl: <Truck size={22} color="white" />,          grad: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
          { label: 'Delivered',    value: orders.filter(o=>o.orderStatus==='delivered').length, iconEl: <CheckCircle size={22} color="white" />,    grad: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
          { label: 'Cancelled',    value: orders.filter(o=>o.orderStatus==='cancelled').length, iconEl: <XCircle size={22} color="white" />,        grad: 'linear-gradient(135deg,#f093fb,#f5576c)' },
        ].map(k => (
          <div key={k.label} style={{
            background: 'white', borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '14px'
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '10px',
              background: k.grad, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0
            }}>{k.iconEl}</div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a202c', lineHeight: 1.1 }}>{k.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#718096', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        padding: '1rem 1.25rem', marginBottom: '1.25rem',
        display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: 5, fontSize: '0.78rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Search</label>
          <input
            type="text" value={search} placeholder="Order ID / Customer..."
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '7px',
              fontSize: '0.875rem', width: '220px', outline: 'none'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 5, fontSize: '0.78rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Order Status</label>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '0.875rem', background: 'white', cursor: 'pointer' }}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 5, fontSize: '0.78rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Payment Status</label>
          <select value={filterPayment} onChange={e => { setFilterPayment(e.target.value); setPage(1) }}
            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '0.875rem', background: 'white', cursor: 'pointer' }}>
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <button onClick={() => fetchOrders()}
          style={{
            padding: '8px 18px', background: 'linear-gradient(135deg,#667eea,#764ba2)',
            color: 'white', border: 'none', borderRadius: '7px',
            fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer'
          }}>Refresh</button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <ClipboardList size={56} color="#cbd5e0" />
            <h3 style={{ marginTop: '1rem', color: '#2d3748' }}>No Orders Found</h3>
            <p style={{ color: '#718096' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Items</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Payment</th>
                  <th style={thStyle}>Order Status</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    style={{ transition: 'background 0.15s', cursor: 'default' }}>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '0.8rem', color: '#4a5568' }}>
                        {order.orderId || order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '600', color: '#2d3748' }}>
                        {order.customerInfo?.name || order.user?.name || '—'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#718096' }}>
                        {order.customerInfo?.email || order.user?.email || ''}
                      </div>
                    </td>
                    <td style={tdStyle}>{formatDate(order.createdAt)}</td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '600' }}>{order.items?.length || 0}</span>
                      <span style={{ color: '#718096', fontSize: '0.8rem' }}> item{order.items?.length !== 1 ? 's' : ''}</span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#2d3748' }}>
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td style={tdStyle}>
                      <Badge value={order.paymentStatus} map={paymentColors} />
                    </td>
                    <td style={tdStyle}>
                      <Badge value={order.orderStatus} map={statusColors} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button
                        onClick={() => openModal(order)}
                        style={{
                          padding: '6px 14px',
                          background: 'linear-gradient(135deg,#667eea,#764ba2)',
                          color: 'white', border: 'none', borderRadius: '6px',
                          fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '5px'
                        }}
                      ><Edit2 size={13} /> Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.25rem', alignItems: 'center' }}>
          <button disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={{
              padding: '7px 16px', borderRadius: '7px', border: '1px solid #e2e8f0',
              background: page === 1 ? '#f7fafc' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600', fontSize: '0.875rem', color: page === 1 ? '#a0aec0' : '#2d3748'
            }}><ChevronLeft size={16} style={{ verticalAlign: 'middle' }} /> Prev</button>
          <span style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: '500' }}>
            Page {page} of {totalPages}
          </span>
          <button disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: '7px 16px', borderRadius: '7px', border: '1px solid #e2e8f0',
              background: page === totalPages ? '#f7fafc' : 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600', fontSize: '0.875rem', color: page === totalPages ? '#a0aec0' : '#2d3748'
            }}>Next <ChevronRight size={16} style={{ verticalAlign: 'middle' }} /></button>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={e => { if (e.target === e.currentTarget) setSelectedOrder(null) }}>
          <div style={{
            background: 'white', borderRadius: '14px', width: '100%', maxWidth: '560px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              padding: '1.25rem 1.5rem', color: 'white',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '2px' }}>Update Order Status</h3>
                <p style={{ fontSize: '0.82rem', opacity: 0.85 }}>
                  {selectedOrder.orderId || selectedOrder._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                  width: 32, height: 32, cursor: 'pointer', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Order summary */}
              <div style={{ background: '#f7fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.875rem' }}>
                  <div><span style={{ color: '#718096' }}>Customer: </span><strong>{selectedOrder.customerInfo?.name || selectedOrder.user?.name || '—'}</strong></div>
                  <div><span style={{ color: '#718096' }}>Amount: </span><strong>₹{(selectedOrder.totalAmount || 0).toLocaleString()}</strong></div>
                  <div><span style={{ color: '#718096' }}>Items: </span><strong>{selectedOrder.items?.length}</strong></div>
                  <div><span style={{ color: '#718096' }}>Payment: </span><Badge value={selectedOrder.paymentStatus} map={paymentColors} /></div>
                </div>
                {selectedOrder.items?.length > 0 && (
                  <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                    {selectedOrder.items.slice(0, 3).map((item, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '3px' }}>
                        • {item.productName || item.product?.productName || 'Product'} × {item.quantity} {item.unit || ''}
                      </div>
                    ))}
                    {selectedOrder.items.length > 3 && <div style={{ fontSize: '0.78rem', color: '#718096' }}>+{selectedOrder.items.length - 3} more items</div>}
                  </div>
                )}
              </div>

              {/* Status select */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: '600', fontSize: '0.85rem', color: '#2d3748' }}>New Order Status *</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
                    borderRadius: '8px', fontSize: '0.9rem', background: 'white', cursor: 'pointer'
                  }}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Tracking */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: '600', fontSize: '0.85rem', color: '#2d3748' }}>Tracking Number <span style={{ fontWeight: 400, color: '#718096' }}>(optional)</span></label>
                <input type="text" value={trackingNumber} placeholder="e.g. DTDC1234567890"
                  onChange={e => setTrackingNumber(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
                    borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box'
                  }} />
              </div>

              {/* Estimated delivery */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: '600', fontSize: '0.85rem', color: '#2d3748' }}>Estimated Delivery <span style={{ fontWeight: 400, color: '#718096' }}>(optional)</span></label>
                <input type="date" value={estimatedDelivery}
                  onChange={e => setEstimatedDelivery(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
                    borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box'
                  }} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedOrder(null)}
                  style={{
                    padding: '9px 22px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
                    background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', color: '#4a5568'
                  }}>Cancel</button>
                <button onClick={handleUpdateStatus} disabled={updating}
                  style={{
                    padding: '9px 22px',
                    background: updating ? '#a0aec0' : 'linear-gradient(135deg,#667eea,#764ba2)',
                    color: 'white', border: 'none', borderRadius: '8px',
                    fontWeight: '600', fontSize: '0.9rem', cursor: updating ? 'not-allowed' : 'pointer'
                  }}>
                  {updating ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
