import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConfig'
import { Home, ShoppingBag, ShoppingCart, User, AlertCircle, Phone, Menu, X, Search, Package, Truck, Handshake, Check, MapPin, Mail, Globe, Upload, Camera, Heart, Star, BarChart2, Download, RefreshCw, Plus, Edit2, Trash2, ThumbsUp } from 'lucide-react'
import { reviewService } from '../services/reviewService'
import { wishlistService } from '../services/wishlistService'
import { customerAnalyticsService } from '../services/customerAnalyticsService'
import { addressService, orderService } from '../services/extendedCustomerService'
import './CustomerDashboard.css'
import './CustomerEnhancements.css'

const CustomerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState('home')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productReviews, setProductReviews] = useState([])
  const [productReviewsLoading, setProductReviewsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Profile states
  const [profile, setProfile] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState(null)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    customerType: '',
    gstNumber: '',
    profilePicture: '',
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
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'product',
    message: ''
  })
  const [contactSubmitting, setContactSubmitting] = useState(false)

  // Cart and Order states
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Wishlist states
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Reviews states
  const [reviews, setReviews] = useState([])
  const [eligibleProducts, setEligibleProducts] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewTitle: '', reviewText: '', productId: '', orderId: '' })

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState(null)
  const [spendingData, setSpendingData] = useState([])
  const [topCategories, setTopCategories] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // Addresses states
  const [addresses, setAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({
    label: 'Home', street: '', city: '', state: '', country: 'India', pincode: '', phone: ''
  })

  // Recommendations state
  const [recommendations, setRecommendations] = useState([])

  // Fetch products for both home (featured) and products page (with filters)
  // Also resets filters when returning to home
  useEffect(() => {
    if (currentPage === 'home') {
      setSelectedCategory('All')
      setSearchQuery('')
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage === 'products' || currentPage === 'home') {
      fetchProducts()
    }
  }, [currentPage, selectedCategory, searchQuery])

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch profile on mount so avatar shows immediately
  useEffect(() => {
    fetchProfile()
  }, [])

  // Re-fetch profile when profile page is active (to pick up any edits)
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

  // Fetch wishlist on mount so heart icons are correct everywhere
  useEffect(() => {
    fetchWishlist()
    fetchOrders()
    fetchReviews()
  }, [])

  useEffect(() => {
    if (currentPage === 'wishlist') fetchWishlist()
  }, [currentPage])

  useEffect(() => {
    if (currentPage === 'reviews') fetchReviews()
  }, [currentPage])

  useEffect(() => {
    if (currentPage === 'analytics') fetchAnalytics()
  }, [currentPage])

  useEffect(() => {
    if (currentPage === 'addresses') fetchAddresses()
  }, [currentPage])

  useEffect(() => {
    fetchRecommendations()
  }, [])

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
        profilePicture: userProfile.profilePicture || '',
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

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadingPicture(true)
    try {
      const formData = new FormData()
      formData.append('profilePicture', file)

      const response = await axios.post('/api/customer/profile/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setProfileData(prev => ({
        ...prev,
        profilePicture: response.data.profilePicture
      }))
      setProfile(prev => ({
        ...prev,
        profilePicture: response.data.profilePicture
      }))
      alert('Profile picture uploaded successfully!')
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      alert(error.response?.data?.message || 'Failed to upload profile picture')
    } finally {
      setUploadingPicture(false)
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

  const formatShortOrderId = (orderLike = {}) => {
    const rawDate = orderLike.createdAt || orderLike.orderDate
    const d = rawDate ? new Date(rawDate) : null
    if (!d || Number.isNaN(d.getTime())) {
      return orderLike.orderId || orderLike._id?.slice(-8)?.toUpperCase() || 'ORD-NA'
    }

    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const datePart = `${yyyy}${mm}${dd}`

    const customerName = (orderLike.customerInfo?.name || profile?.name || user?.name || '').toUpperCase()
    const letters = customerName.replace(/[^A-Z]/g, '')
    const fallback = (orderLike.orderId || orderLike._id || 'XXX').toUpperCase().replace(/[^A-Z0-9]/g, '')
    const suffix = (letters.slice(0, 3) || fallback.slice(-3) || 'XXX').padEnd(3, 'X')

    return `ORD-${datePart}-${suffix}`
  }

  const openReviewForProduct = ({ productId, orderId, productName }) => {
    setReviewForm({
      rating: 5,
      reviewTitle: productName || '',
      reviewText: '',
      productId,
      orderId
    })
    setCurrentPage('reviews')
    setShowReviewModal(true)
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

  const fetchWishlist = async () => {
    setWishlistLoading(true)
    try {
      const data = await wishlistService.getWishlist()
      setWishlist(data.products || data.wishlist?.products || [])
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

  const fetchReviews = async () => {
    setReviewsLoading(true)
    try {
      const [myReviews, eligible] = await Promise.all([
        reviewService.getMyReviews(),
        reviewService.getEligibleProducts()
      ])
      setReviews(myReviews.reviews || [])
      setEligibleProducts(eligible.products || [])
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const [summary, spending, categories, products] = await Promise.all([
        customerAnalyticsService.getSummary(),
        customerAnalyticsService.getSpendingOverTime('monthly'),
        customerAnalyticsService.getTopCategories(),
        customerAnalyticsService.getTopProducts()
      ])
      setAnalyticsData(summary.summary || summary)
      setSpendingData(spending.data || spending)
      setTopCategories(categories.categories || categories)
      setTopProducts(products.products || products)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const fetchAddresses = async () => {
    setAddressesLoading(true)
    try {
      const data = await addressService.getSavedAddresses()
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setAddressesLoading(false)
    }
  }

  const fetchRecommendations = async () => {
    try {
      const data = await customerAnalyticsService.getRecommendations()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      // Silently fail - recommendations not critical
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item.productId?._id || item.productId) === productId)
  }

  const handleToggleWishlist = async (productId) => {
    try {
      if (isInWishlist(productId)) {
        await wishlistService.removeFromWishlist(productId)
        setWishlist(prev => prev.filter(item => (item.productId?._id || item.productId) !== productId))
      } else {
        await wishlistService.addToWishlist(productId)
        setWishlist(prev => [...prev, { productId }])
      }
    } catch (error) {
      alert('Failed to update wishlist')
    }
  }

  const handleReorder = async (orderId) => {
    try {
      const data = await orderService.reorderOrder(orderId)
      if (data.items) {
        data.items.forEach(item => {
          if (item.product) addToCart(item.product, item.quantity)
        })
        setCurrentPage('orders')
        alert('Items added to cart! Please review and checkout.')
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reorder')
    }
  }

  const handleDownloadInvoice = async (orderId) => {
    try {
      const data = await orderService.getOrderInvoice(orderId)
      const invoice = data.invoice || data
      const win = window.open('', '_blank')
      win.document.write(`
        <html>
        <head>
          <title>Invoice - ${invoice.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
            h1 { color: #667eea; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px 12px; border: 1px solid #ddd; text-align: left; }
            th { background: #f5f5f5; font-weight: 600; }
            .total-row { font-weight: bold; background: #f0f7ff; }
            .print-btn { margin-top: 30px; padding: 10px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div><h1>INVOICE</h1><p style="margin:4px 0;color:#666">Tex Weave Impex</p></div>
            <div style="text-align:right">
              <p><strong>Invoice #:</strong> ${invoice.orderId}</p>
              <p><strong>Date:</strong> ${new Date(invoice.orderDate || Date.now()).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          <p><strong>Billed To:</strong> ${invoice.customer?.name || ''} &nbsp;|&nbsp; ${invoice.customer?.email || ''}</p>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Total</th></tr></thead>
            <tbody>
              ${(invoice.items || []).map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit || '-'}</td>
                  <td>₹${(item.unitPrice || 0).toLocaleString()}</td>
                  <td>₹${(item.totalPrice || 0).toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr class="total-row"><td colspan="4" style="text-align:right">Total Amount</td><td>₹${(invoice.totalAmount || 0).toLocaleString()}</td></tr>
            </tbody>
          </table>
          <div style="text-align:right;margin-top:30px">
            <button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>
          </div>
        </body></html>
      `)
      win.document.close()
    } catch (error) {
      alert('Failed to load invoice')
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewForm.reviewText || !reviewForm.rating) {
      alert('Please provide a rating and review text')
      return
    }
    try {
      await reviewService.submitReview(reviewForm)
      setShowReviewModal(false)
      setReviewForm({ rating: 5, reviewTitle: '', reviewText: '', productId: '', orderId: '' })
      alert('Review submitted successfully!')
      fetchReviews()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await reviewService.deleteReview(reviewId)
      setReviews(prev => prev.filter(r => r._id !== reviewId))
    } catch (error) {
      alert('Failed to delete review')
    }
  }

  const handleSaveAddress = async () => {
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      alert('Please fill all required address fields')
      return
    }
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, addressForm)
      } else {
        await addressService.addAddress(addressForm)
      }
      setShowAddressModal(false)
      setEditingAddress(null)
      setAddressForm({ label: 'Home', street: '', city: '', state: '', country: 'India', pincode: '', phone: '' })
      fetchAddresses()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save address')
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await addressService.deleteAddress(addressId)
      setAddresses(prev => prev.filter(a => a._id !== addressId))
    } catch (error) {
      alert('Failed to delete address')
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await addressService.setDefaultAddress(addressId)
      fetchAddresses()
    } catch (error) {
      alert('Failed to set default address')
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
      await axios.post('/api/issues/submit', {
        type: 'issue',
        subject: issueForm.subject,
        description: issueForm.description,
        category: issueForm.category,
        priority: issueForm.priority
      })
      
      alert('Issue reported successfully! Our team will contact you soon.')
      setIssueForm({
        subject: '',
        category: 'general',
        description: '',
        priority: 'medium'
      })
    } catch (error) {
      console.error('Error submitting issue:', error)
      alert(error.response?.data?.message || 'Failed to submit issue. Please try again.')
    } finally {
      setIssueSubmitting(false)
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setContactSubmitting(true)
    try {
      await axios.post('/api/issues/submit', {
        type: 'contact',
        subject: `${contactForm.inquiryType} - ${contactForm.name}`,
        description: contactForm.message,
        category: 'general',
        priority: 'medium',
        name: contactForm.name,
        email: contactForm.email
      })
      
      alert('Thank you for contacting us! We will respond to your inquiry soon.')
      setContactForm({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'product',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert(error.response?.data?.message || 'Failed to submit inquiry. Please try again.')
    } finally {
      setContactSubmitting(false)
    }
  }

  const handleProductClick = async (product) => {
    setSelectedProduct(product)
    setProductReviews([])
    setProductReviewsLoading(true)
    try {
      const data = await reviewService.getProductReviews(product._id)
      setProductReviews(data.reviews || [])
    } catch (e) {
      // silently fail
    } finally {
      setProductReviewsLoading(false)
    }
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setProductReviews([])
  }

  // Render different pages
  const renderContent = () => {
    switch (currentPage) {
      case 'home': return renderHomePage()
      case 'products': return renderProductsPage()
      case 'orders': return renderOrdersPage()
      case 'profile': return renderProfilePage()
      case 'report': return renderReportIssuePage()
      case 'contact': return renderContactPage()
      case 'wishlist': return renderWishlistPage()
      case 'reviews': return renderReviewsPage()
      case 'analytics': return renderAnalyticsPage()
      case 'addresses': return renderAddressesPage()
      default: return renderHomePage()
    }
  }

  return (
    <div className="customer-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Shop</h2>
          {/* <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button> */}
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            <span className="nav-icon"><Home size={20} /></span>
            {sidebarOpen && <span className="nav-text">Home</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => setCurrentPage('products')}
          >
            <span className="nav-icon"><ShoppingBag size={20} /></span>
            {sidebarOpen && <span className="nav-text">Products</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentPage('orders')}
          >
            <span className="nav-icon"><ShoppingCart size={20} /></span>
            {sidebarOpen && <span className="nav-text">My Orders</span>}
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('profile')}
          >
            <span className="nav-icon"><User size={20} /></span>
            {sidebarOpen && <span className="nav-text">Profile</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'report' ? 'active' : ''}`}
            onClick={() => setCurrentPage('report')}
          >
            <span className="nav-icon"><AlertCircle size={20} /></span>
            {sidebarOpen && <span className="nav-text">Report Issue</span>}
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'contact' ? 'active' : ''}`}
            onClick={() => setCurrentPage('contact')}
          >
            <span className="nav-icon"><Phone size={20} /></span>
            {sidebarOpen && <span className="nav-text">Contact</span>}
          </button>

          <button
            className={`nav-item ${currentPage === 'wishlist' ? 'active' : ''}`}
            onClick={() => setCurrentPage('wishlist')}
          >
            <span className="nav-icon"><Heart size={20} /></span>
            {sidebarOpen && <span className="nav-text">Wishlist</span>}
          </button>

          <button
            className={`nav-item ${currentPage === 'reviews' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reviews')}
          >
            <span className="nav-icon"><Star size={20} /></span>
            {sidebarOpen && <span className="nav-text">My Reviews</span>}
          </button>

          <button
            className={`nav-item ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analytics')}
          >
            <span className="nav-icon"><BarChart2 size={20} /></span>
            {sidebarOpen && <span className="nav-text">My Analytics</span>}
          </button>

          <button
            className={`nav-item ${currentPage === 'addresses' ? 'active' : ''}`}
            onClick={() => setCurrentPage('addresses')}
          >
            <span className="nav-icon"><MapPin size={20} /></span>
            {sidebarOpen && <span className="nav-text">Saved Addresses</span>}
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
              <Menu size={24} />
            </button>
            <h1 className="page-title">
              {currentPage === 'home' && 'Welcome'}
              {currentPage === 'products' && 'Products'}
              {currentPage === 'orders' && 'My Orders'}
              {currentPage === 'profile' && 'Profile'}
              {currentPage === 'report' && 'Report Issue'}
              {currentPage === 'contact' && 'Contact Us'}
              {currentPage === 'wishlist' && 'My Wishlist'}
              {currentPage === 'reviews' && 'My Reviews'}
              {currentPage === 'analytics' && 'My Analytics'}
              {currentPage === 'addresses' && 'Saved Addresses'}
            </h1>
          </div>
          
          <div className="navbar-right">
            <div className="user-info-nav">
              <span className="user-name">{user?.name || 'Customer'}</span>
              <span className="user-role">Customer</span>
            </div>
            <div className="user-avatar">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'C'
              )}
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
            <button className="modal-close" onClick={closeProductModal}><X size={24} /></button>
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

              {/* Reviews Section */}
              <div className="modal-reviews-section">
                <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>
                  Customer Reviews
                  {productReviews.length > 0 && <span style={{ marginLeft: '8px', fontSize: '13px', color: '#888', fontWeight: 500 }}>({productReviews.length})</span>}
                </h4>
                {productReviewsLoading ? (
                  <p style={{ color: '#aaa', fontSize: '14px' }}>Loading reviews...</p>
                ) : productReviews.length === 0 ? (
                  <p style={{ color: '#bbb', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>No reviews yet. Be the first to review!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {productReviews.slice(0, 5).map((rv, i) => (
                      <div key={i} style={{ background: '#f7f8ff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #ededf5' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={13} fill={rv.rating >= s ? '#f59e0b' : 'none'} color={rv.rating >= s ? '#f59e0b' : '#ddd'} />
                            ))}
                          </div>
                          <span style={{ fontSize: '11px', color: '#aaa' }}>{new Date(rv.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        {rv.reviewTitle && <p style={{ fontWeight: 600, fontStyle: 'italic', fontSize: '13px', margin: '0 0 4px', color: '#444' }}>"{rv.reviewTitle}"</p>}
                        <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>{rv.reviewText}</p>
                        <p style={{ fontSize: '11px', color: '#999', margin: '6px 0 0' }}>— {rv.userId?.name || 'Customer'}{rv.isVerifiedPurchase && <span style={{ marginLeft: '6px', color: '#22c55e', fontWeight: 600 }}>✓ Verified</span>}</p>
                      </div>
                    ))}
                  </div>
                )}
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
          <h1>Welcome back, {user?.name}!</h1>
          <p>Discover our premium textile collection</p>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon"><Package size={32} /></div>
            <div className="stat-info">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Truck size={32} /></div>
            <div className="stat-info">
              <h3>{orders.filter(o => o.orderStatus === 'shipped' || o.orderStatus === 'out_for_delivery').length}</h3>
              <p>In Transit</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Handshake size={32} /></div>
            <div className="stat-info">
              <h3>{orders.filter(o => o.orderStatus === 'delivered').length}</h3>
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
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        </div>

        {recommendations.length > 0 && (
          <div className="products-preview-section" style={{ marginTop: '30px' }}>
            <div className="section-header">
              <h2>⭐ Recommended For You</h2>
              <button className="btn-view-all" onClick={() => setCurrentPage('products')}>View All →</button>
            </div>
            <ProductGrid
              products={recommendations.slice(0, 6)}
              onProductClick={handleProductClick}
              loading={false}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        )}
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
            <span className="search-icon"><Search size={20} /></span>
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
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
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
              <div className="empty-icon"><Package size={48} /></div>
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
                      <h4>Order #{formatShortOrderId(order)}</h4>
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
                        {order.orderStatus === 'delivered' && (
                          <button
                            className="btn-write-review"
                            onClick={() => {
                              openReviewForProduct({
                                productId: item.product?._id || item.product,
                                orderId: order._id,
                                productName: item.productName
                              })
                            }}
                          >
                            <Star size={13} style={{ marginRight: '4px' }} /> Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total Amount:</span>
                      <span className="total-amount">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="order-actions">
                      <button
                        className="btn-reorder"
                        onClick={() => handleReorder(order._id)}
                        title="Order Again"
                      >
                        <RefreshCw size={14} style={{marginRight:'4px'}} /> Order Again
                      </button>
                      <button
                        className="btn-invoice"
                        onClick={() => handleDownloadInvoice(order._id)}
                        title="Download Invoice"
                      >
                        <Download size={14} style={{marginRight:'4px'}} /> Invoice
                      </button>
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
          {/* Profile Picture Section */}
          <div className="profile-section profile-picture-section">
            <h3>Profile Picture</h3>
            <div className="profile-picture-container">
              <div className="profile-picture-display">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="profile-picture-img"
                  />
                ) : (
                  <div className="profile-picture-placeholder">
                    <User size={64} />
                  </div>
                )}
              </div>
              {editMode && (
                <div className="profile-picture-upload">
                  <label htmlFor="profile-picture-input" className="upload-label">
                    <Camera size={20} />
                    <span>{uploadingPicture ? 'Uploading...' : 'Change Picture'}</span>
                  </label>
                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    disabled={uploadingPicture}
                    style={{ display: 'none' }}
                  />
                  <p className="upload-hint">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
          </div>

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
                  <option value="technical">Technical Problem</option>
                  <option value="billing">Billing Issue</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature-request">Feature Request</option>
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
                  <option value="critical">Critical</option>
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
              <li><Check size={16} style={{display: 'inline', marginRight: '8px'}} /> Your issue will be reviewed by our support team</li>
              <li><Check size={16} style={{display: 'inline', marginRight: '8px'}} /> We'll respond within 24-48 hours</li>
              <li><Check size={16} style={{display: 'inline', marginRight: '8px'}} /> You'll receive updates via email</li>
              <li><Check size={16} style={{display: 'inline', marginRight: '8px'}} /> Track your issue status in your profile</li>
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
              <div className="contact-icon"><MapPin size={32} /></div>
              <h3>Head Office</h3>
              <p>62/52, Kamarajapuram West,</p>
              <p>Karur, Tamil Nadu 639002,</p>
              <p>India</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><Phone size={32} /></div>
              <h3>Official Contact Numbers</h3>
              <p><a href="tel:+919942320990" style={{color:'inherit',textDecoration:'none'}}>+91 99423 20990</a></p>
              <p><a href="tel:+919965535770" style={{color:'inherit',textDecoration:'none'}}>+91 99655 35770</a></p>
              <p className="contact-time">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><Mail size={32} /></div>
              <h3>Official Email</h3>
              <p><a href="mailto:info@texweaveimpex.com" style={{color:'inherit',textDecoration:'none'}}>info@texweaveimpex.com</a></p>
              <p className="contact-time">We respond within 24 hours</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon"><Globe size={32} /></div>
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
            <form className="quick-contact-form" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label>Your Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210" 
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label>Inquiry Type</label>
                <select
                  value={contactForm.inquiryType}
                  onChange={(e) => setContactForm({ ...contactForm, inquiryType: e.target.value })}
                >
                  <option value="product">Product Inquiry</option>
                  <option value="bulk">Bulk Order</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Customer Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Message *</label>
                <textarea 
                  placeholder="Tell us how we can help you..." 
                  rows="4" 
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn-send-inquiry"
                disabled={contactSubmitting}
              >
                {contactSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ── Wishlist Page ─────────────────────────────────────────────────────────
  function renderWishlistPage() {
    if (wishlistLoading) {
      return <div className="loading-state"><div className="spinner"></div><p>Loading wishlist...</p></div>
    }
    return (
      <div className="enh-page">
        <div className="enh-page-header">
          {/* <h3>My Wishlist</h3> */}
          {wishlist.length > 0 && (
            <button className="enh-btn-outline-danger" onClick={async () => {
              if (window.confirm('Clear entire wishlist?')) {
                await wishlistService.clearWishlist()
                setWishlist([])
              }
            }}>Clear All</button>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="enh-wishlist-summary-bar">
            <span className="wl-count">
              <strong>{wishlist.length}</strong> {wishlist.length === 1 ? 'item' : 'items'} saved
            </span>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Heart size={56} /></div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save products you love to browse later</p>
            <button className="btn-browse" onClick={() => setCurrentPage('products')}>Browse Products</button>
          </div>
        ) : (
          <div className="enh-wishlist-grid">
            {wishlist.map((item, index) => {
              const product = item.productId || item
              return (
                <div key={product._id || index} className="enh-wishlist-card">
                  <div className="enh-wishlist-img" onClick={() => product._id && setSelectedProduct(product)}>
                    {product.image?.url
                      ? <img src={product.image.url} alt={product.name} />
                      : <div className="product-placeholder-icon">📦</div>
                    }
                    <button
                      className="wl-delete-overlay"
                      title="Remove from wishlist"
                      onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product._id || product.productId) }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="enh-wishlist-info">
                    <h4 title={product.name || 'Product'}>{product.name || 'Product'}</h4>
                    <p className="enh-wishlist-price">₹{parseFloat(product.sellingPrice || 0).toLocaleString()}</p>
                    {product.category && <span className="product-badge">{product.category}</span>}
                  </div>
                  <div className="enh-wishlist-actions">
                    <button className="enh-btn-primary-sm" onClick={() => {
                      if (product._id) { addToCart(product, 1) }
                    }}>Add to Cart</button>
                    <button className="enh-btn-icon-danger" title="Remove" onClick={() => handleToggleWishlist(product._id || product.productId)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ── Reviews Page ──────────────────────────────────────────────────────────
  function renderReviewsPage() {
    if (reviewsLoading) {
      return <div className="loading-state"><div className="spinner"></div><p>Loading reviews...</p></div>
    }
    return (
      <div className="enh-page">
        {/* Review Submit Modal */}
        {showReviewModal && (
          <div className="enh-modal-overlay" onClick={() => setShowReviewModal(false)}>
            <div className="enh-modal" onClick={e => e.stopPropagation()}>
              <div className="enh-modal-header">
                <h3>Write a Review</h3>
                <button className="modal-close" onClick={() => setShowReviewModal(false)}><X size={20} /></button>
              </div>
              <div className="enh-modal-body">
                <div className="form-group">
                  <label>Rating *</label>
                  <div className="enh-star-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} className="enh-star-btn" onClick={() => setReviewForm(p => ({ ...p, rating: star }))}>
                        <Star size={28} fill={reviewForm.rating >= star ? '#f59e0b' : 'none'} color={reviewForm.rating >= star ? '#f59e0b' : '#ccc'} />
                      </button>
                    ))}
                    <span style={{ marginLeft: '8px', color: '#666' }}>
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewForm.rating]}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" placeholder="Summarize your experience"
                    value={reviewForm.reviewTitle}
                    onChange={e => setReviewForm(p => ({ ...p, reviewTitle: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Your Review *</label>
                  <textarea rows="4" placeholder="Share details about your experience..."
                    value={reviewForm.reviewText}
                    onChange={e => setReviewForm(p => ({ ...p, reviewText: e.target.value }))} />
                </div>
              </div>
              <div className="enh-modal-footer">
                <button className="enh-btn-outline" onClick={() => setShowReviewModal(false)}>Cancel</button>
                <button className="enh-btn-primary" onClick={handleSubmitReview}>Submit Review</button>
              </div>
            </div>
          </div>
        )}

        {/* Products eligible for review */}
        {eligibleProducts.length > 0 && (
          <div className="enh-section-card">
            <div className="enh-section-title-row">
              <h3>Ready to Review</h3>
              <span className="enh-count-pill">{eligibleProducts.length} products</span>
            </div>
            <div className="enh-eligible-list">
              {eligibleProducts.map((item, idx) => (
                <div key={idx} className="enh-eligible-item">
                  <div>
                    <h4>{item.productName}</h4>
                    <p>Order #{formatShortOrderId(item)} · {new Date(item.orderDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <button className="enh-btn-review" onClick={() => {
                    openReviewForProduct({
                      productId: item.productId,
                      orderId: item.orderId,
                      productName: item.productName
                    })
                  }}>
                    <Star size={14} style={{ marginRight: '5px' }} /> Write Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Reviews */}
        <div className="enh-section-card">
          <div className="enh-section-title-row">
            {/* <h3>My Reviews</h3> */}
            {reviews.length > 0 && <span className="enh-count-pill">{reviews.length} reviews</span>}
          </div>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#bbb' }}>
              <Star size={44} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '15px' }}>You haven't written any reviews yet</p>
            </div>
          ) : (
            <div className="enh-reviews-list">
              {reviews.map((review, idx) => (
                <div key={review._id || idx} className="enh-review-card">
                  <div className="enh-review-header">
                    <div>
                      <h4>{review.productId?.name || 'Product'}</h4>
                      <div className="enh-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={15} fill={review.rating >= s ? '#f59e0b' : 'none'} color={review.rating >= s ? '#f59e0b' : '#ddd'} />
                        ))}
                        <span style={{ marginLeft: '7px', fontSize: '13px', color: '#888', fontWeight: 600 }}>{review.rating}/5</span>
                      </div>
                    </div>
                    <div className="enh-review-badge-row">
                      <span className={`enh-status-badge status-${review.status}`}>{review.status}</span>
                      <button className="enh-btn-icon-danger" title="Delete review" onClick={() => handleDeleteReview(review._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {review.reviewTitle && <p className="enh-review-title">"{review.reviewTitle}"</p>}
                  <p className="enh-review-text">{review.reviewText}</p>
                  <p className="enh-review-date">{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Analytics Page ────────────────────────────────────────────────────────
  function renderAnalyticsPage() {
    if (analyticsLoading) {
      return <div className="loading-state"><div className="spinner"></div><p>Loading analytics...</p></div>
    }
    return (
      <div className="enh-page">
        {/* KPI Cards */}
        <div className="enh-kpi-grid">
          <div className="enh-kpi-card">
            <div className="enh-kpi-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}><Package size={26} /></div>
            <div>
              <div className="enh-kpi-value">{analyticsData?.totalOrders || 0}</div>
              <div className="enh-kpi-label">Total Orders</div>
            </div>
          </div>
          <div className="enh-kpi-card">
            <div className="enh-kpi-icon" style={{ background: '#e8f5e9', color: '#388e3c' }}><ShoppingCart size={26} /></div>
            <div>
              <div className="enh-kpi-value">₹{parseFloat(analyticsData?.totalSpent || 0).toLocaleString()}</div>
              <div className="enh-kpi-label">Total Spent</div>
            </div>
          </div>
          <div className="enh-kpi-card">
            <div className="enh-kpi-icon" style={{ background: '#fff3e0', color: '#f57c00' }}><BarChart2 size={26} /></div>
            <div>
              <div className="enh-kpi-value">₹{Math.round(analyticsData?.avgOrderValue || 0).toLocaleString()}</div>
              <div className="enh-kpi-label">Avg Order Value</div>
            </div>
          </div>
          <div className="enh-kpi-card">
            <div className="enh-kpi-icon" style={{ background: '#fce4ec', color: '#c62828' }}><Star size={26} /></div>
            <div>
              <div className="enh-kpi-value">{analyticsData?.totalReviews || 0}</div>
              <div className="enh-kpi-label">Reviews Given</div>
            </div>
          </div>
        </div>

        {/* Monthly Spending Bar Chart */}
        {Array.isArray(spendingData) && spendingData.length > 0 && (() => {
          const max = Math.max(...spendingData.map(d => d.totalSpending || d.totalSpent || d.amount || 0), 1)
          const CHART_H = 200
          const yTicks = [max, max * 0.75, max * 0.5, max * 0.25, 0]
          const fmtTick = v => v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `₹${Math.round(v)}`
          return (
            <div className="enh-section-card">
              <div className="enh-chart-header">
                <h3>Monthly Spending</h3>
                <span className="enh-chart-subtitle">Last {spendingData.slice(-8).length} months</span>
              </div>
              <div className="enh-chart-container">
                {/* Y-axis rotated label */}
                <div className="enh-y-axis-label">Amount (₹)</div>
                {/* Y-axis tick values */}
                <div className="enh-y-axis">
                  {yTicks.map((tick, i) => (
                    <span key={i} className="enh-y-tick">{fmtTick(tick)}</span>
                  ))}
                </div>
                {/* Chart plot area */}
                <div className="enh-chart-area">
                  <div className="enh-bar-chart">
                    {spendingData.slice(-8).map((item, idx) => {
                      const value = item.totalSpending || item.totalSpent || item.amount || 0
                      const heightPct = Math.max((value / max) * CHART_H, value > 0 ? 6 : 2)
                      const monthNum = item._id?.month
                      const label = monthNum
                        ? new Date(2000, monthNum - 1).toLocaleString('default', { month: 'short' })
                        : (item.month || item.period || `M${idx + 1}`)
                      return (
                        <div key={idx} className="enh-bar-col">
                          <div className="enh-bar-tooltip">₹{value.toLocaleString()}<br/><small>{label} {item._id?.year || ''}</small></div>
                          <div className="enh-bar" style={{ height: `${heightPct}px` }}></div>
                          <span className="enh-bar-label">{label}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="enh-x-axis-label">Month</div>
                </div>
              </div>
            </div>
          )
        })()}

        <div className="enh-two-col">
          {/* Top Categories */}
          {Array.isArray(topCategories) && topCategories.length > 0 && (
            <div className="enh-section-card">
              <h3>Top Categories</h3>
              {topCategories.slice(0, 5).map((cat, idx) => {
                const max = Math.max(...topCategories.map(c => c.totalSpent || c.count || 0), 1)
                const value = cat.totalSpent || cat.count || 0
                const pct = (value / max) * 100
                return (
                  <div key={idx} className="enh-cat-row">
                    <span className="enh-cat-name">{cat._id || cat.category || 'Other'}</span>
                    <div className="enh-cat-track"><div className="enh-cat-fill" style={{ width: `${pct}%` }}></div></div>
                    <span className="enh-cat-value">₹{parseFloat(value).toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Top Products */}
          {Array.isArray(topProducts) && topProducts.length > 0 && (
            <div className="enh-section-card">
              <h3>Most Purchased</h3>
              {topProducts.slice(0, 5).map((prod, idx) => (
                <div key={idx} className="enh-top-prod-row">
                  <span className="enh-rank">#{idx + 1}</span>
                  <span className="enh-prod-name">{prod.product?.name || prod.productName || 'Product'}</span>
                  <span className="enh-prod-meta">{prod.totalQuantity || prod.quantity || 0} units</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!analyticsData && spendingData.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><BarChart2 size={52} /></div>
            <h2>No Analytics Data Yet</h2>
            <p>Place orders to see your purchase analytics here</p>
          </div>
        )}
      </div>
    )
  }

  // ── Saved Addresses Page ──────────────────────────────────────────────────
  function renderAddressesPage() {
    if (addressesLoading) {
      return <div className="loading-state"><div className="spinner"></div><p>Loading addresses...</p></div>
    }
    return (
      <div className="enh-page">
        {/* Address Modal */}
        {showAddressModal && (
          <div className="enh-modal-overlay" onClick={() => { setShowAddressModal(false); setEditingAddress(null) }}>
            <div className="enh-modal" onClick={e => e.stopPropagation()}>
              <div className="enh-modal-header">
                <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <button className="modal-close" onClick={() => { setShowAddressModal(false); setEditingAddress(null) }}><X size={20} /></button>
              </div>
              <div className="enh-modal-body">
                <div className="form-group">
                  <label>Label</label>
                  <select value={addressForm.label} onChange={e => setAddressForm(p => ({ ...p, label: e.target.value }))}>
                    <option>Home</option><option>Work</option><option>Office</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input type="text" placeholder="House No., Street, Area"
                    value={addressForm.street} onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input type="text" value={addressForm.state} onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input type="text" value={addressForm.pincode} onChange={e => setAddressForm(p => ({ ...p, pincode: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={addressForm.phone} onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="enh-modal-footer">
                <button className="enh-btn-outline" onClick={() => { setShowAddressModal(false); setEditingAddress(null) }}>Cancel</button>
                <button className="enh-btn-primary" onClick={handleSaveAddress}>Save Address</button>
              </div>
            </div>
          </div>
        )}

        <div className="enh-page-header">
          {/* <h2>Saved Addresses</h2> */}
          <button className="enh-btn-primary" onClick={() => {
            setEditingAddress(null)
            setAddressForm({ label: 'Home', street: '', city: '', state: '', country: 'India', pincode: '', phone: '' })
            setShowAddressModal(true)
          }}>
            <Plus size={16} style={{ marginRight: '6px' }} /> Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><MapPin size={52} /></div>
            <h2>No Saved Addresses</h2>
            <p>Add delivery addresses for faster checkout</p>
          </div>
        ) : (
          <div className="enh-addresses-grid">
            {addresses.map((addr, idx) => (
              <div key={addr._id || idx} className={`enh-address-card ${addr.isDefault ? 'enh-address-default' : ''}`}>
                <div className="enh-address-card-header">
                  <span className="enh-address-label">{addr.label}</span>
                  {addr.isDefault && <span className="enh-default-badge">✓ Default</span>}
                </div>
                <p className="enh-address-street">{addr.street}</p>
                <p className="enh-address-city">{addr.city}, {addr.state} &ndash; {addr.pincode}</p>
                {addr.phone && (
                  <p className="enh-address-phone">
                    <Phone size={13} /> {addr.phone}
                  </p>
                )}
                <div className="enh-address-divider"></div>
                <div className="enh-address-actions">
                  {!addr.isDefault && (
                    <button className="enh-addr-btn enh-addr-btn-ghost" onClick={() => handleSetDefaultAddress(addr._id)}>Set Default</button>
                  )}
                  <div className="enh-addr-icon-group">
                    <button className="enh-addr-icon-btn enh-addr-edit" title="Edit" onClick={() => {
                      setEditingAddress(addr)
                      setAddressForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, country: addr.country || 'India', pincode: addr.pincode, phone: addr.phone || '' })
                      setShowAddressModal(true)
                    }}><Edit2 size={15} /> Edit</button>
                    <button className="enh-addr-icon-btn enh-addr-delete" title="Delete" onClick={() => handleDeleteAddress(addr._id)}><Trash2 size={15} /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

// Product Grid Component
function ProductGrid({ products, onProductClick, loading, wishlist = [], onToggleWishlist }) {
  const isInWishlist = (productId) => {
    return wishlist.some(item => (item.productId?._id || item.productId) === productId)
  }

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
            {onToggleWishlist && (
              <button
                className="enh-wishlist-heart"
                onClick={(e) => { e.stopPropagation(); onToggleWishlist(product._id) }}
                title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  size={18}
                  fill={isInWishlist(product._id) ? '#e53e3e' : 'none'}
                  color={isInWishlist(product._id) ? '#e53e3e' : '#888'}
                />
              </button>
            )}
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
