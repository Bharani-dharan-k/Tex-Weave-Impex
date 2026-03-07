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
        return <DashboardHome user={user} setCurrentPage={setCurrentPage} />
      case 'add-product':
        return <AddProduct />
      case 'products':
        return <ProductManagement />
      case 'users':
        return <UserAnalysis />
      case 'issues':
        return <IssuesManagement />
      case 'orders':
        return <AdminOrders />
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
