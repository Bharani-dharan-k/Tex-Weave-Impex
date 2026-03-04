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
  MessageCircle,
  Send
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
import ScatterChart from '../analytics/components/ScatterChart'
import FunnelChart from '../analytics/components/FunnelChart'
import { 
  getKPISummary, 
  getSalesData, 
  getCategoryData, 
  getRegionalData,
  getProductData,
  getInventoryData,
  getTopCustomers,
  formatCurrency,
  getProductCategoryData,
  getProcessFlowData,
  getDefectAnalysis,
  getThroughputData,
  getQualityMetrics,
  getQualityTrend,
  getPackingDispatchStatus,
  getDispatchTimeline,
  getProcessTimeBreakdown
} from '../analytics/services/dataService'

const AdminDashboard = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [analyticsTab, setAnalyticsTab] = useState('overview')

  // Analytics data state
  const [kpiData, setKpiData] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [regionalData, setRegionalData] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const [productCategoryData, setProductCategoryData] = useState([])
  const [processFlowData, setProcessFlowData] = useState([])
  const [defectData, setDefectData] = useState([])
  const [throughputData, setThroughputData] = useState([])
  const [qualityMetrics, setQualityMetrics] = useState(null)
  const [qualityTrend, setQualityTrend] = useState([])
  const [packingStatus, setPackingStatus] = useState([])
  const [dispatchTimeline, setDispatchTimeline] = useState([])
  const [processTime, setProcessTime] = useState([])

  // Load analytics data
  useEffect(() => {
    if (currentPage === 'analytics') {
      loadAnalyticsData()
    }
  }, [currentPage])

  const loadAnalyticsData = () => {
    setKpiData(getKPISummary())
    setSalesData(getSalesData(30))
    setRegionalData(getRegionalData())
    setTopCustomers(getTopCustomers().slice(0, 8))
    setProductCategoryData(getProductCategoryData())
    setProcessFlowData(getProcessFlowData())
    setDefectData(getDefectAnalysis())
    setThroughputData(getThroughputData())
    setQualityMetrics(getQualityMetrics())
    setQualityTrend(getQualityTrend())
    setPackingStatus(getPackingDispatchStatus())
    setDispatchTimeline(getDispatchTimeline())
    setProcessTime(getProcessTimeBreakdown())
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome user={user} />
      case 'add-product':
        return <AddProduct />
      case 'products':
        return <ProductManagement />
      case 'users':
        return <UserAnalysis />
      case 'chat':
        return <AdminChat />
      case 'analytics':
        return <AnalyticsSection 
          analyticsTab={analyticsTab}
          setAnalyticsTab={setAnalyticsTab}
          kpiData={kpiData}
          salesData={salesData}
          regionalData={regionalData}
          topCustomers={topCustomers}
          productCategoryData={productCategoryData}
          processFlowData={processFlowData}
          defectData={defectData}
          throughputData={throughputData}
          qualityMetrics={qualityMetrics}
          qualityTrend={qualityTrend}
          packingStatus={packingStatus}
          dispatchTimeline={dispatchTimeline}
          processTime={processTime}
        />
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
              className={`sidebar-item ${currentPage === 'chat' ? 'active' : ''}`}
              onClick={() => setCurrentPage('chat')}
            >
              <MessageCircle size={20} />
              {sidebarOpen && <span>Chat</span>}
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
const DashboardHome = ({ user }) => {
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
          <div className="action-card">
            <PackagePlus size={24} />
            <h4>Add New Product</h4>
            <p>Create a new product listing</p>
          </div>
          <div className="action-card">
            <Package size={24} />
            <h4>Manage Products</h4>
            <p>View and edit existing products</p>
          </div>
          <div className="action-card">
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
const UserAnalysis = () => {
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
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={`status-badge ${user.role === 'admin' ? 'active' : ''}`}>{user.role}</span></td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className="status-badge active">Active</span>
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

// Admin Chat Component
const AdminChat = () => {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      // Load messages for selected customer
      loadMessages(selectedCustomer._id)
    }
  }, [selectedCustomer])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/auth/users')
      const usersData = response.data || []
      // Filter only customer users (role !== 'admin')
      const customerUsers = usersData.filter(u => u.role !== 'admin')
      setCustomers(customerUsers)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = (customerId) => {
    // Mock messages - replace with actual API call
    const mockMessages = [
      { id: 1, sender: 'customer', text: 'Hello, I need help with my order', timestamp: new Date(Date.now() - 3600000) },
      { id: 2, sender: 'admin', text: 'Hi! I\'d be happy to help. What\'s your order number?', timestamp: new Date(Date.now() - 3000000) },
      { id: 3, sender: 'customer', text: 'Order #12345', timestamp: new Date(Date.now() - 2400000) },
      { id: 4, sender: 'admin', text: 'Let me check that for you...', timestamp: new Date(Date.now() - 1800000) }
    ]
    setMessages(mockMessages)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedCustomer) return

    const message = {
      id: messages.length + 1,
      sender: 'admin',
      text: newMessage,
      timestamp: new Date()
    }

    setMessages([...messages, message])
    setNewMessage('')
    
    // TODO: Send message to backend
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="admin-chat-page">
      <div className="page-header">
        <h2>Customer Chat</h2>
        <p>Communicate with your customers</p>
      </div>

      <div className="chat-container">
        {/* Customer List Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Customers ({customers.length})</h3>
          </div>
          <div className="customer-list">
            {loading ? (
              <div className="empty-state-small">Loading...</div>
            ) : customers.length === 0 ? (
              <div className="empty-state-small">
                <Users size={32} />
                <p>No customers yet</p>
              </div>
            ) : (
              customers.map((customer) => (
                <div
                  key={customer._id || customer.id}
                  className={`customer-item ${selectedCustomer?._id === customer._id ? 'active' : ''}`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="customer-avatar">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-info">
                    <h4>{customer.name}</h4>
                    <p>{customer.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedCustomer ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="customer-avatar large">
                    {selectedCustomer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedCustomer.name}</h3>
                    <p className="status-online">Online</p>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="empty-state-small">
                    <MessageCircle size={48} />
                    <p>Start a conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${msg.sender === 'admin' ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p>{msg.text}</p>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="chat-input"
                />
                <button type="submit" className="send-button">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <MessageCircle size={64} />
              <h3>Select a Customer</h3>
              <p>Choose a customer from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Analytics Section Component
const AnalyticsSection = ({ 
  analyticsTab, 
  setAnalyticsTab,
  kpiData,
  salesData,
  regionalData,
  topCustomers,
  productCategoryData,
  processFlowData,
  defectData,
  throughputData,
  qualityMetrics,
  qualityTrend,
  packingStatus,
  dispatchTimeline,
  processTime
}) => {
  if (!kpiData || !qualityMetrics) {
    return <div className="loading-state">Loading analytics data...</div>
  }

  const analyticsTabs = [
    { id: 'overview', label: 'Business Overview', icon: BarChart3 },
    { id: 'product', label: 'Product Analytics', icon: Package },
    { id: 'process', label: 'Process Flow', icon: Factory },
    { id: 'manufacturing', label: 'Time & Throughput', icon: Settings },
    { id: 'quality', label: 'Quality Control', icon: CheckCircle },
    { id: 'dispatch', label: 'Packing & Dispatch', icon: Truck }
  ]

  const renderAnalyticsContent = () => {
    switch (analyticsTab) {
      case 'overview':
        return renderOverview()
      case 'product':
        return renderProductAnalytics()
      case 'process':
        return renderProcessFlow()
      case 'manufacturing':
        return renderManufacturingAnalytics()
      case 'quality':
        return renderQualityAnalytics()
      case 'dispatch':
        return renderDispatchAnalytics()
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <>
      <div className="kpi-grid">
        <KPICard
          title="Total Revenue"
          value={kpiData.totalRevenue.value}
          change={kpiData.totalRevenue.change}
          currency="₹"
          icon={DollarSign}
        />
        <KPICard
          title="Total Orders"
          value={kpiData.totalOrders.value}
          change={kpiData.totalOrders.change}
          icon={ShoppingCart}
        />
        <KPICard
          title="Total Customers"
          value={kpiData.totalCustomers.value}
          change={kpiData.totalCustomers.change}
          icon={Users}
        />
        <KPICard
          title="Avg Order Value"
          value={kpiData.avgOrderValue.value}
          change={kpiData.avgOrderValue.change}
          currency="₹"
          icon={TrendingUp}
        />
        <KPICard
          title="Low Stock Items"
          value={kpiData.lowStockProducts.value}
          icon={Package}
        />
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <LineChart
            data={salesData}
            xKey="date"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#667eea']}
            title="Revenue Over Time (Last 30 Days)"
            valuePrefix="₹"
            height={350}
          />
        </div>
        <div className="chart-half">
          <LineChart
            data={salesData}
            xKey="date"
            yKeys={[
              { dataKey: 'orders', name: 'Orders' },
              { dataKey: 'customers', name: 'Customers' }
            ]}
            colors={['#43e97b', '#fa709a']}
            title="Orders & Customers Trend"
            height={350}
          />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-half">
          <PieChart
            data={regionalData}
            dataKey="revenue"
            nameKey="region"
            title="Revenue Distribution by Region"
            valuePrefix="₹"
            height={350}
          />
        </div>
        <div className="chart-half">
          <BarChart
            data={topCustomers}
            xKey="name"
            yKeys={[{ dataKey: 'revenue', name: 'Revenue' }]}
            colors={['#f093fb']}
            title="Top 8 Customers by Revenue"
            valuePrefix="₹"
            height={350}
            layout="vertical"
          />
        </div>
      </div>
    </>
  )

  const renderProductAnalytics = () => {
    if (!productCategoryData.length) return <div>Loading product data...</div>
    
    return (
      <>
        <div className="kpi-grid">
          <KPICard
            title="Total Product Categories"
            value={productCategoryData.length}
            icon={Package}
          />
          <KPICard
            title="Total SKUs"
            value={productCategoryData.reduce((acc, cat) => acc + (cat?.skuCount || 0), 0)}
            icon={BarChart3}
          />
          <KPICard
            title="Avg Units per Category"
            value={Math.round(productCategoryData.reduce((acc, cat) => acc + (cat?.units || 0), 0) / productCategoryData.length) || 0}
            icon={ShoppingCart}
          />
          <KPICard
            title="Total Production"
            value={productCategoryData.reduce((acc, cat) => acc + (cat?.units || 0), 0)}
            icon={Factory}
          />
        </div>

        <div className="charts-row">
          <div className="chart-half">
            <BarChart
              data={productCategoryData}
              xKey="category"
              yKeys={[{ dataKey: 'units', name: 'Units Produced' }]}
              colors={['#667eea']}
              title="Production by Product Category"
              height={350}
            />
          </div>
          <div className="chart-half">
            <PieChart
              data={productCategoryData}
              dataKey="revenue"
              nameKey="category"
              title="Revenue Contribution by Product"
              valuePrefix="₹"
              height={350}
            />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-full">
            <div className="analytics-card">
              <h3 className="card-title">Product Category Details</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Units Produced</th>
                    <th>Revenue</th>
                    <th>SKU Count</th>
                    <th>Market Segment</th>
                  </tr>
                </thead>
                <tbody>
                  {productCategoryData.map((cat, index) => (
                    <tr key={cat?.category || index}>
                      <td>{cat?.category || 'N/A'}</td>
                      <td>{cat?.units?.toLocaleString() || '0'}</td>
                      <td>{formatCurrency(cat?.revenue || 0)}</td>
                      <td>{cat?.skuCount || 0}</td>
                      <td>{cat?.segment || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderProcessFlow = () => {
    if (!processFlowData.length) return <div>Loading process data...</div>
    
    return (
      <>
        <div className="kpi-grid">
          <KPICard
            title="Process Stages"
            value={processFlowData.length}
            icon={Factory}
          />
          <KPICard
            title="Total Loss %"
            value={processFlowData[0]?.input && processFlowData[processFlowData.length - 1]?.output ? ((1 - processFlowData[processFlowData.length - 1].output / processFlowData[0].input) * 100).toFixed(1) + '%' : '0.0%'}
            icon={TrendingUp}
          />
          <KPICard
            title="Avg Utilization"
            value={Math.round(processFlowData.reduce((acc, stage) => acc + (stage?.utilization || 0), 0) / processFlowData.length) + '%'}
            icon={Settings}
          />
          <KPICard
            title="Total Defects"
            value={processFlowData.reduce((acc, stage) => acc + stage.defects, 0)}
            icon={Package}
          />
        </div>

        <div className="charts-row">
          <div className="chart-full">
            <FunnelChart
              data={processFlowData}
              title="Manufacturing Process Pipeline"
              height={400}
            />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-half">
            <BarChart
              data={defectData}
              xKey="stage"
              yKeys={[
                { dataKey: 'colorMismatch', name: 'Color Mismatch' },
                { dataKey: 'stitchError', name: 'Stitch Error' },
                { dataKey: 'printBlur', name: 'Print Blur' },
                { dataKey: 'fabricTear', name: 'Fabric Tear' },
                { dataKey: 'other', name: 'Other' }
              ]}
              colors={['#f093fb', '#f5576c', '#ffa726', '#43e97b', '#667eea']}
              title="Defect Analysis by Stage"
              height={350}
              stacked={true}
            />
          </div>
          <div className="chart-half">
            <div className="analytics-card">
              <h3 className="card-title">Process Stage Details</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Input</th>
                    <th>Output</th>
                    <th>Loss %</th>
                    <th>Defects</th>
                    <th>Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {processFlowData.map((stage, index) => (
                    <tr key={stage?.stage || index}>
                      <td>{stage?.stage || 'N/A'}</td>
                      <td>{stage?.input?.toLocaleString() || '0'}</td>
                      <td>{stage?.output?.toLocaleString() || '0'}</td>
                      <td className={(stage?.loss || 0) > 2 ? 'text-danger' : ''}>
                        {stage?.loss?.toFixed(1) || '0.0'}%
                      </td>
                      <td>{stage?.defects || 0}</td>
                      <td>{stage?.utilization || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderManufacturingAnalytics = () => {
    if (!processFlowData.length || !throughputData.length || !processTime.length || !dispatchTimeline.length) {
      return <div>Loading manufacturing data...</div>
    }
    
    return (
      <>
        <div className="kpi-grid">
          <KPICard
            title="Avg Process Time"
            value={Math.round(processFlowData.reduce((acc, stage) => acc + (stage?.time || 0), 0) / processFlowData.length) + ' hrs'}
            icon={Settings}
          />
          <KPICard
            title="Orders Received"
            value={throughputData.reduce((acc, day) => acc + (day?.received || 0), 0)}
            icon={ShoppingCart}
          />
          <KPICard
            title="Orders Completed"
            value={throughputData.reduce((acc, day) => acc + (day?.completed || 0), 0)}
            change={5.2}
            icon={CheckCircle}
          />
          <KPICard
            title="On-Time Delivery"
            value={dispatchTimeline.length ? ((dispatchTimeline.filter(d => d?.onTime).length / dispatchTimeline.length) * 100).toFixed(0) + '%' : '0%'}
            change={3.4}
            icon={Truck}
          />
        </div>

        <div className="charts-row">
          <div className="chart-half">
            <LineChart
              data={throughputData}
              xKey="date"
              yKeys={[
                { dataKey: 'received', name: 'Received' },
                { dataKey: 'completed', name: 'Completed' }
              ]}
              colors={['#667eea', '#43e97b']}
              title="Daily Order Throughput (Last 30 Days)"
              height={350}
            />
          </div>
          <div className="chart-half">
            <BarChart
              data={processTime}
              xKey="stage"
              yKeys={[{ dataKey: 'hours', name: 'Hours' }]}
              colors={['#f093fb']}
              title="Process Time Breakdown"
              height={350}
              layout="horizontal"
            />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-full">
            <div className="analytics-card">
              <h3 className="card-title">Process Time Details</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Average Time (hrs)</th>
                    <th>% of Total Time</th>
                    <th>Bottleneck</th>
                  </tr>
                </thead>
                <tbody>
                  {processTime.map((stage, index) => (
                    <tr key={stage?.stage || index}>
                      <td>{stage?.stage || 'N/A'}</td>
                      <td>{stage?.hours || 0}</td>
                      <td>{stage?.percentage || 0}%</td>
                      <td>{stage?.bottleneck ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderQualityAnalytics = () => {
    if (!qualityMetrics || !qualityTrend.length) return <div>Loading quality data...</div>
    
    return (
      <>
        <div className="kpi-grid">
          <KPICard
            title="Pass Rate"
            value={(qualityMetrics?.passRate?.toFixed(1) || '0.0') + '%'}
            change={2.3}
            icon={CheckCircle}
          />
          <KPICard
            title="Fail Rate"
            value={(qualityMetrics?.failRate?.toFixed(1) || '0.0') + '%'}
            change={-1.2}
            icon={Package}
          />
          <KPICard
            title="Rework Rate"
            value={(qualityMetrics?.reworkRate?.toFixed(1) || '0.0') + '%'}
            icon={Settings}
          />
          <KPICard
            title="Scrap Rate"
            value={(qualityMetrics?.scrapRate?.toFixed(1) || '0.0') + '%'}
            change={-0.8}
            icon={TrendingUp}
          />
        </div>

        <div className="charts-row">
          <div className="chart-half">
            <PieChart
              data={[
                { name: 'Passed', value: qualityMetrics.passed },
                { name: 'Failed', value: qualityMetrics.failed },
                { name: 'Rework', value: qualityMetrics.rework },
                { name: 'Scrap', value: qualityMetrics.scrap }
              ]}
              dataKey="value"
              nameKey="name"
              title="Quality Status Distribution"
              height={350}
            />
          </div>
          <div className="chart-half">
            <LineChart
              data={qualityTrend}
              xKey="date"
              yKeys={[
                { dataKey: 'passRate', name: 'Pass Rate' },
                { dataKey: 'failRate', name: 'Fail Rate' },
                { dataKey: 'reworkRate', name: 'Rework Rate' }
              ]}
              colors={['#43e97b', '#f5576c', '#ffa726']}
              title="Quality Metrics Trend (Last 30 Days)"
              valueSuffix="%"
              height={350}
            />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-full">
            <div className="analytics-card">
              <h3 className="card-title">Quality Summary</h3>
              <div className="quality-summary">
                <div className="quality-stat">
                  <div className="stat-label">Total Inspected</div>
                  <div className="stat-value">{qualityMetrics?.totalInspected?.toLocaleString() || '0'}</div>
                </div>
                <div className="quality-stat">
                  <div className="stat-label">Passed</div>
                  <div className="stat-value text-success">{qualityMetrics?.passed?.toLocaleString() || '0'}</div>
                </div>
                <div className="quality-stat">
                  <div className="stat-label">Failed</div>
                  <div className="stat-value text-danger">{qualityMetrics?.failed?.toLocaleString() || '0'}</div>
                </div>
                <div className="quality-stat">
                  <div className="stat-label">Rework</div>
                  <div className="stat-value text-warning">{qualityMetrics?.rework?.toLocaleString() || '0'}</div>
                </div>
                <div className="quality-stat">
                  <div className="stat-label">Scrap</div>
                  <div className="stat-value text-danger">{qualityMetrics?.scrap?.toLocaleString() || '0'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderDispatchAnalytics = () => {
    if (!packingStatus.length || !dispatchTimeline.length) return <div>Loading dispatch data...</div>
    
    return (
      <>
        <div className="kpi-grid">
          {packingStatus.map((status, index) => (
            <KPICard
              key={status?.status || index}
              title={status?.status || 'N/A'}
              value={status?.count || 0}
              icon={status?.status?.includes('Ready') ? Truck : Package}
            />
          ))}
        </div>

        <div className="charts-row">
          <div className="chart-half">
            <BarChart
              data={packingStatus}
              xKey="status"
              yKeys={[{ dataKey: 'count', name: 'Orders' }]}
              colors={['#667eea']}
              title="Packing & Dispatch Status"
              height={350}
            />
          </div>
          <div className="chart-half">
            <BarChart
              data={[
                { status: 'Scheduled', count: dispatchTimeline.length },
                { status: 'On-Time', count: dispatchTimeline.filter(d => d.onTime).length },
                { status: 'Delayed', count: dispatchTimeline.filter(d => d.delayed).length }
              ]}
              xKey="status"
              yKeys={[{ dataKey: 'count', name: 'Dispatches' }]}
              colors={['#43e97b']}
              title="Dispatch Performance"
              height={350}
            />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-full">
            <div className="analytics-card">
              <h3 className="card-title">Recent Dispatch Schedule</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Scheduled</th>
                    <th>On-Time</th>
                    <th>Delayed</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatchTimeline.slice(0, 10).map((day, index) => (
                    <tr key={day?.date || index}>
                      <td>{day?.date || 'N/A'}</td>
                      <td>{day?.scheduled || 0}</td>
                      <td className="text-success">{day?.onTime || 0}</td>
                      <td className="text-danger">{day?.delayed || 0}</td>
                      <td>{day?.scheduled ? ((day.onTime / day.scheduled) * 100).toFixed(0) : '0'}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="analytics-section-container">
      <div className="analytics-header">
        <h2>Business Analytics & Insights</h2>
        <p>Comprehensive manufacturing and business analytics for Tex Weave Impex</p>
      </div>

      {/* Sub-navigation for analytics tabs */}
      <div className="analytics-tabs">
        {analyticsTabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`tab-button ${analyticsTab === tab.id ? 'active' : ''}`}
              onClick={() => setAnalyticsTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Analytics content */}
      <div className="analytics-content">
        {renderAnalyticsContent()}
      </div>
    </div>
  )
}

export default AdminDashboard
