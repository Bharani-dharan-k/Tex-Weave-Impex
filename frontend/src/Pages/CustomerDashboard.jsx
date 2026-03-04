import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import './CustomerDashboard.css'

const CustomerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState('home')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Profile states
  const [profile, setProfile] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    customerType: '',
    gstNumber: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    preferences: {
      productsInterested: [],
      monthlyVolume: '',
      gsmRange: '',
      colorPreference: ''
    }
  })

  // Report Issue and Contact states
  const [issueForm, setIssueForm] = useState({
    subject: '',
    category: 'general',
    description: '',
    priority: 'medium'
  })
  const [issueSubmitting, setIssueSubmitting] = useState(false)

  // Cart and Order states
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Fetch products
  useEffect(() => {
    if (currentPage === 'products') {
      fetchProducts()
    }
  }, [currentPage, selectedCategory, searchQuery])

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])



  // Fetch profile when profile page is active
  useEffect(() => {
    if (currentPage === 'profile') {
      fetchProfile()
    }
  }, [currentPage])

  // Fetch orders when orders page is active
  useEffect(() => {
    if (currentPage === 'orders') {
      fetchOrders()
    }
  }, [currentPage])

  const fetchProfile = async () => {
    setProfileLoading(true)
    try {
      const response = await axios.get('/api/customer/profile')
      const userProfile = response.data.profile
      setProfile(userProfile)
      setProfileData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        companyName: userProfile.companyName || '',
        customerType: userProfile.customerType || '',
        gstNumber: userProfile.gstNumber || '',
        billingAddress: {
          street: userProfile.billingAddress?.street || '',
          city: userProfile.billingAddress?.city || '',
          state: userProfile.billingAddress?.state || '',
          country: userProfile.billingAddress?.country || 'India',
          pincode: userProfile.billingAddress?.pincode || ''
        },
        shippingAddress: {
          street: userProfile.shippingAddress?.street || '',
          city: userProfile.shippingAddress?.city || '',
          state: userProfile.shippingAddress?.state || '',
          country: userProfile.shippingAddress?.country || 'India',
          pincode: userProfile.shippingAddress?.pincode || ''
        },
        preferences: {
          productsInterested: userProfile.preferences?.productsInterested || [],
          monthlyVolume: userProfile.preferences?.monthlyVolume || '',
          gsmRange: userProfile.preferences?.gsmRange || '',
          colorPreference: userProfile.preferences?.colorPreference || ''
        }
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleProfileChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSaveProfile = async () => {
    setProfileLoading(true)
    try {
      const response = await axios.put('/api/customer/profile', profileData)
      setProfile(response.data.profile)
      setEditMode(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleCopyAddress = async () => {
    try {
      const response = await axios.post('/api/customer/profile/copy-address')
      setProfile(response.data.profile)
      setProfileData(prev => ({
        ...prev,
        shippingAddress: { ...prev.billingAddress }
      }))
      alert('Billing address copied to shipping address!')
    } catch (error) {
      console.error('Error copying address:', error)
      alert('Failed to copy address')
    }
  }

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item._id === product._id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
    
    alert(`${product.name} added to cart!`)
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId))
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(cart.map(item =>
      item._id === productId ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0)
  }

  // Order functions
  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const response = await axios.get('/api/orders/my-orders')
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    if (!profile || !profile.shippingAddress || !profile.shippingAddress.street) {
      alert('Please complete your profile with shipping address before placing an order.')
      setCurrentPage('profile')
      return
    }

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        alert('Failed to load payment gateway. Please try again.')
        return
      }

      // Create order items for backend
      const items = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }))

      // Create Razorpay order
      const orderResponse = await axios.post('/api/orders/create-razorpay-order', {
        items,
        shippingAddress: profile.shippingAddress,
        billingAddress: profile.billingAddress || profile.shippingAddress
      })

      const { razorpayOrderId, amount, currency, keyId, orderId } = orderResponse.data.order

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: currency,
        name: 'Tex Weave Impex',
        description: 'Purchase Order',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post('/api/orders/verify-payment', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderId
            })

            if (verifyResponse.data.success) {
              alert('Payment successful! Your order has been placed.')
              clearCart()
              setCurrentPage('orders')
              fetchOrders()
            }
          } catch (error) {
            console.error('Payment verification failed:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: profile.name || user.name,
          email: profile.email || user.email,
          contact: profile.phone || ''
        },
        theme: {
          color: '#667eea'
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to initiate checkout. Please try again.')
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedCategory !== 'All') params.category = selectedCategory
      if (searchQuery) params.search = searchQuery

      const response = await axios.get('/api/products', { params })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories/list')
      setCategories(['All', ...(response.data.categories || [])])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleIssueSubmit = async (e) => {
    e.preventDefault()
    if (!issueForm.subject.trim() || !issueForm.description.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setIssueSubmitting(true)
    try {
      // TODO: Replace with actual API call to submit issue
      // await axios.post('/api/support/issue', issueForm)
      
      // Mock success for now
      setTimeout(() => {
        alert('Issue reported successfully! Our team will contact you soon.')
        setIssueForm({
          subject: '',
          category: 'general',
          description: '',
          priority: 'medium'
        })
        setIssueSubmitting(false)
      }, 500)
    } catch (error) {
      console.error('Error submitting issue:', error)
      alert('Failed to submit issue. Please try again.')
      setIssueSubmitting(false)
    }
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  // Render different pages
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return renderHomePage()
      case 'products':
        return renderProductsPage()
      case 'orders':
        return renderOrdersPage()
      case 'profile':
        return renderProfilePage()
      case 'report':
        return renderReportIssuePage()
      case 'contact':
        return renderContactPage()
      default:
        return renderHomePage()
    }
  }

  return (
    <div className="customer-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Shop</h2>
          {/* <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '✕' : '☰'}
          </button> */}
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            <span className="nav-icon">🛖</span>
            {sidebarOpen && <span className="nav-text">Home</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => setCurrentPage('products')}
          >
            <span className="nav-icon">🛍️</span>
            {sidebarOpen && <span className="nav-text">Products</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentPage('orders')}
          >
            <span className="nav-icon">🛒</span>
            {sidebarOpen && <span className="nav-text">My Orders</span>}
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('profile')}
          >
            <span className="nav-icon">👤</span>
            {sidebarOpen && <span className="nav-text">Profile</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'report' ? 'active' : ''}`}
            onClick={() => setCurrentPage('report')}
          >
            <span className="nav-icon">⚠️</span>
            {sidebarOpen && <span className="nav-text">Report Issue</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'contact' ? 'active' : ''}`}
            onClick={() => setCurrentPage('contact')}
          >
            <span className="nav-icon">📞</span>
            {sidebarOpen && <span className="nav-text">Contact</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-nav" onClick={onLogout}>
            <span className="nav-icon"></span>
            {sidebarOpen && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header/Navbar */}
        <header className="customer-navbar">
          <div className="navbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <h1 className="page-title">
              {currentPage === 'home' && 'Welcome'}
              {currentPage === 'products' && 'Products'}
              {currentPage === 'orders' && 'My Orders'}
              {currentPage === 'profile' && 'Profile'}
              {currentPage === 'report' && 'Report Issue'}
              {currentPage === 'contact' && 'Contact Us'}
            </h1>
          </div>
          
          <div className="navbar-right">
            <div className="user-info-nav">
              <span className="user-name">{user?.name || 'Customer'}</span>
              <span className="user-role">Customer</span>
            </div>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {renderContent()}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProductModal}>✕</button>
            <div className="modal-content">
              <div className="modal-header-section">
                <h2>{selectedProduct.name}</h2>
                <span className="product-badge">{selectedProduct.category}</span>
              </div>
              
              {selectedProduct.image && selectedProduct.image.url && (
                <div style={{ marginBottom: '20px' }}>
                  <img 
                    src={selectedProduct.image.url} 
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}
              
              <div className="modal-body-section">
                <div className="modal-info-row">
                  <span className="info-label">Product ID:</span>
                  <span className="info-value">{selectedProduct.productId}</span>
                </div>
                <div className="modal-info-row">
                  <span className="info-label">Price:</span>
                  <span className="info-value price">₹{parseFloat(selectedProduct.sellingPrice || 0).toLocaleString()}</span>
                </div>
                <div className="modal-info-row">
                  <span className="info-label">Unit:</span>
                  <span className="info-value">{selectedProduct.unit}</span>
                </div>
                {selectedProduct.description && (
                  <div className="modal-description">
                    <h4>Description</h4>
                    <p>{selectedProduct.description}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer-section">
                <button 
                  className="btn-add-to-cart" 
                  onClick={() => {
                    addToCart(selectedProduct, 1)
                    setSelectedProduct(null)
                  }}
                >
                  Add to Cart
                </button>
                <button className="btn-contact">Contact for Bulk Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Home Page
  function renderHomePage() {
    return (
      <div className="home-page">
        <div className="welcome-banner">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Discover our premium textile collection</p>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚚</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>In Transit</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🤝</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Delivered</p>
            </div>
          </div>
        </div>

        <div className="products-preview-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <button className="btn-view-all" onClick={() => setCurrentPage('products')}>
              View All →
            </button>
          </div>
          <ProductGrid 
            products={products.slice(0, 6)} 
            onProductClick={handleProductClick}
            loading={loading}
          />
        </div>
      </div>
    )
  }

  // Products Page
  function renderProductsPage() {
    return (
      <div className="products-page">
        <div className="products-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid 
          products={products} 
          onProductClick={handleProductClick}
          loading={loading}
        />
      </div>
    )
  }

  // Orders Page
  function renderOrdersPage() {
    if (ordersLoading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      )
    }

    return (
      <div className="orders-page">
        {/* Cart Section */}
        {cart.length > 0 && (
          <div className="cart-section">
            <div className="cart-header">
              <h3>Shopping Cart ({cart.length} items)</h3>
              <button className="btn-clear-cart" onClick={clearCart}>Clear Cart</button>
            </div>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-id">ID: {item.productId}</p>
                    <p className="cart-item-price">₹{item.sellingPrice.toLocaleString()} / {item.unit}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateCartQuantity(item._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <p className="cart-item-total">₹{(item.sellingPrice * item.quantity).toLocaleString()}</p>
                    <button className="btn-remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (18% GST):</span>
                  <span>₹{(getCartTotal() * 0.18).toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{getCartTotal() > 10000 ? 'FREE' : '₹200'}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{(getCartTotal() * 1.18 + (getCartTotal() > 10000 ? 0 : 200)).toLocaleString()}</span>
                </div>
              </div>
              <button className="btn-checkout" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/* Orders History */}
        <div className="orders-history">
          <h3>Order History</h3>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h2>No Orders Yet</h2>
              <p>Start browsing our products to place your first order</p>
              <button className="btn-browse" onClick={() => setCurrentPage('products')}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h4>Order #{order.orderId}</h4>
                      <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                    <div className="order-status-badges">
                      <span className={`status-badge ${order.orderStatus}`}>
                        {order.orderStatus.toUpperCase()}
                      </span>
                      <span className={`status-badge ${order.paymentStatus}`}>
                        {order.paymentStatus === 'completed' ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.productName}</span>
                        <span>Qty: {item.quantity} {item.unit}</span>
                        <span>₹{item.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total Amount:</span>
                      <span className="total-amount">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    {order.orderStatus === 'pending' && order.paymentStatus === 'completed' && (
                      <button 
                        className="btn-cancel-order"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            try {
                              await axios.put(`/api/orders/${order._id}/cancel`, {
                                reason: 'Customer request'
                              })
                              alert('Order cancelled successfully')
                              fetchOrders()
                            } catch (error) {
                              alert('Failed to cancel order')
                            }
                          }
                        }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Profile Page
  function renderProfilePage() {
    if (profileLoading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      )
    }

    return (
      <div className="profile-page">
        <div className="profile-header-actions">
          <h2>My Profile</h2>
          {!editMode ? (
            <button className="btn-edit-profile" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="profile-action-buttons">
              <button className="btn-save-profile" onClick={handleSaveProfile}>
                Save Changes
              </button>
              <button 
                className="btn-cancel-profile" 
                onClick={() => {
                  setEditMode(false)
                  fetchProfile()
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="profile-sections">
          {/* Basic Information */}
          <div className="profile-section">
            <h3>Basic Information</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="profile-section">
            <h3>Company Information</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={profileData.companyName}
                  onChange={(e) => handleProfileChange('companyName', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="form-group">
                <label>Customer Type</label>
                <select
                  value={profileData.customerType}
                  onChange={(e) => handleProfileChange('customerType', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                >
                  <option value="">Select Type</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  value={profileData.gstNumber}
                  onChange={(e) => handleProfileChange('gstNumber', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="profile-section">
            <h3>Billing Address</h3>
            <div className="profile-form-grid">
              <div className="form-group full-width">
                <label>Street Address</label>
                <input
                  type="text"
                  value={profileData.billingAddress.street}
                  onChange={(e) => handleProfileChange('billingAddress.street', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                  placeholder="House/Flat No., Street Name"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={profileData.billingAddress.city}
                  onChange={(e) => handleProfileChange('billingAddress.city', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={profileData.billingAddress.state}
                  onChange={(e) => handleProfileChange('billingAddress.state', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={profileData.billingAddress.country}
                  onChange={(e) => handleProfileChange('billingAddress.country', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={profileData.billingAddress.pincode}
                  onChange={(e) => handleProfileChange('billingAddress.pincode', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                  placeholder="600001"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="profile-section">
            <div className="section-header-with-action">
              <h3>Shipping Address</h3>
              {editMode && (
                <button 
                  className="btn-copy-address" 
                  onClick={handleCopyAddress}
                  type="button"
                >
                  Copy from Billing
                </button>
              )}
            </div>
            <div className="profile-form-grid">
              <div className="form-group full-width">
                <label>Street Address</label>
                <input
                  type="text"
                  value={profileData.shippingAddress.street}
                  onChange={(e) => handleProfileChange('shippingAddress.street', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                  placeholder="House/Flat No., Street Name"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={profileData.shippingAddress.city}
                  onChange={(e) => handleProfileChange('shippingAddress.city', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={profileData.shippingAddress.state}
                  onChange={(e) => handleProfileChange('shippingAddress.state', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={profileData.shippingAddress.country}
                  onChange={(e) => handleProfileChange('shippingAddress.country', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={profileData.shippingAddress.pincode}
                  onChange={(e) => handleProfileChange('shippingAddress.pincode', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                  placeholder="600001"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-section">
            <h3>Business Preferences</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label>Monthly Volume</label>
                <select
                  value={profileData.preferences.monthlyVolume}
                  onChange={(e) => handleProfileChange('preferences.monthlyVolume', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                >
                  <option value="">Select Volume</option>
                  <option value="Less than 1000">Less than 1000</option>
                  <option value="1000-5000">1000-5000</option>
                  <option value="5000-10000">5000-10000</option>
                  <option value="10000+">10000+</option>
                </select>
              </div>
              <div className="form-group">
                <label>GSM Range</label>
                <select
                  value={profileData.preferences.gsmRange}
                  onChange={(e) => handleProfileChange('preferences.gsmRange', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                >
                  <option value="">Select GSM Range</option>
                  <option value="100-150">100-150</option>
                  <option value="150-200">150-200</option>
                  <option value="200-300">200-300</option>
                  <option value="300+">300+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Color Preference</label>
                <input
                  type="text"
                  value={profileData.preferences.colorPreference}
                  onChange={(e) => handleProfileChange('preferences.colorPreference', e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? 'disabled' : ''}
                  placeholder="e.g., White, Colored, Mixed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Report Issue Page
  function renderReportIssuePage() {
    return (
      <div className="report-issue-page">
        <div className="page-header">
          <h2>Report an Issue</h2>
          <p>Having a problem? Let us know and we'll help you resolve it.</p>
        </div>

        <div className="report-issue-form-container">
          <form className="report-issue-form" onSubmit={handleIssueSubmit}>
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                value={issueForm.subject}
                onChange={(e) => setIssueForm({ ...issueForm, subject: e.target.value })}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={issueForm.category}
                  onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="order">Order Related</option>
                  <option value="payment">Payment Issue</option>
                  <option value="product">Product Quality</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="technical">Technical Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={issueForm.priority}
                  onChange={(e) => setIssueForm({ ...issueForm, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={issueForm.description}
                onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                placeholder="Please provide detailed information about the issue..."
                rows="6"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-submit-issue"
              disabled={issueSubmitting}
            >
              {issueSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </form>

          <div className="issue-info">
            <h3>What happens next?</h3>
            <ul>
              <li>✓ Your issue will be reviewed by our support team</li>
              <li>✓ We'll respond within 24-48 hours</li>
              <li>✓ You'll receive updates via email</li>
              <li>✓ Track your issue status in your profile</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Contact Page
  function renderContactPage() {
    return (
      <div className="contact-page">
        <div className="page-header">
          <h2>Contact Us</h2>
          <p>Get in touch with Tex Weave Impex. We're here to help!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info-section">
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Office Address</h3>
              <p>Tex Weave Impex Pvt. Ltd.</p>
              <p>123 Textile Street, Commercial District</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>India</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone</h3>
              <p><strong>Sales:</strong> +91 98765 43210</p>
              <p><strong>Support:</strong> +91 98765 43211</p>
              <p><strong>Office:</strong> +91 22 1234 5678</p>
              <p className="contact-time">Mon - Sat: 9:00 AM - 6:00 PM</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email</h3>
              <p><strong>General:</strong> info@texweaveimpex.com</p>
              <p><strong>Sales:</strong> sales@texweaveimpex.com</p>
              <p><strong>Support:</strong> support@texweaveimpex.com</p>
              <p className="contact-time">We respond within 24 hours</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🌐</div>
              <h3>Business Hours</h3>
              <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
              <p><strong>Saturday:</strong> 9:00 AM - 2:00 PM</p>
              <p><strong>Sunday:</strong> Closed</p>
              <p className="contact-time">Indian Standard Time (IST)</p>
            </div>
          </div>

          <div className="quick-contact-section">
            <h3>Quick Contact Form</h3>
            <p>Need immediate assistance? Fill out this form and we'll get back to you shortly.</p>
            <form className="quick-contact-form" onSubmit={(e) => {
              e.preventDefault()
              alert('Thank you for contacting us! We will respond to your inquiry soon.')
              e.target.reset()
            }}>
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" placeholder="Enter your full name" required />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="your.email@example.com" required />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" />
              </div>
              
              <div className="form-group">
                <label>Inquiry Type</label>
                <select>
                  <option value="product">Product Inquiry</option>
                  <option value="bulk">Bulk Order</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Customer Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Message *</label>
                <textarea placeholder="Tell us how we can help you..." rows="4" required></textarea>
              </div>
              
              <button type="submit" className="btn-send-inquiry">Send Inquiry</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

// Product Grid Component
function ProductGrid({ products, onProductClick, loading }) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-products">
        <p>No products found</p>
      </div>
    )
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div 
          key={product._id} 
          className="product-card"
          onClick={() => onProductClick(product)}
        >
          <div className="product-image-placeholder">
            <span className="product-category-badge">{product.category}</span>
            {product.image && product.image.url ? (
              <img 
                src={product.image.url} 
                alt={product.name}
              />
            ) : (
              <div className="product-placeholder-icon">📦</div>
            )}
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-id">ID: {product.productId}</p>
            <div className="product-footer">
              <span className="product-price">₹{parseFloat(product.sellingPrice || 0).toLocaleString()}</span>
              <span className="product-unit">{product.unit}</span>
            </div>
          </div>
          <button className="product-view-btn">View Details</button>
        </div>
      ))}
    </div>
  )
}

export default CustomerDashboard
