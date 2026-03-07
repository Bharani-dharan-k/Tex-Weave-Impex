# 📋 Frontend Files That Need Updating

## Overview
The **backend is 100% complete** with all new features, but the **frontend UI has NOT been integrated yet**. Below are all the files that need to be updated to integrate the new features.

---

## 🔴 MAIN FILE TO UPDATE

### 1. **`frontend/src/Pages/CustomerDashboard.jsx`** ⭐ PRIMARY FILE

**Current Status:** Has basic pages (home, products, orders, profile, report, contact)

**Missing New Features:**
- ❌ Wishlist page
- ❌ My Reviews page  
- ❌ My Analytics page
- ❌ Saved Addresses page
- ❌ Product comparison feature
- ❌ Reorder button on orders
- ❌ Download invoice button on orders
- ❌ Wishlist heart icons on products
- ❌ Review stars on products
- ❌ Personalized recommendations on home

**What Needs to Be Added:**

#### A. New Navigation Items (Sidebar)
Add these navigation items to sidebar:
```jsx
<div className="nav-item" onClick={() => setCurrentPage('wishlist')}>
  <Heart /> Wishlist
</div>
<div className="nav-item" onClick={() => setCurrentPage('reviews')}>
  <Star /> My Reviews
</div>
<div className="nav-item" onClick={() => setCurrentPage('analytics')}>
  <BarChart2 /> My Analytics
</div>
<div className="nav-item" onClick={() => setCurrentPage('addresses')}>
  <MapPin /> Saved Addresses
</div>
```

#### B. New Imports
```jsx
import { Heart, Star, BarChart2, ThumbsUp, Download, RefreshCw } from 'lucide-react'
import reviewService from '../services/reviewService'
import wishlistService from '../services/wishlistService'
import customerAnalyticsService from '../services/customerAnalyticsService'
import { addressService, orderService } from '../services/extendedCustomerService'
import '../Pages/CustomerEnhancements.css'
```

#### C. New State Variables
```jsx
// Wishlist state
const [wishlist, setWishlist] = useState([])
const [wishlistLoading, setWishlistLoading] = useState(false)

// Reviews state
const [reviews, setReviews] = useState([])
const [eligibleProducts, setEligibleProducts] = useState([])
const [reviewsLoading, setReviewsLoading] = useState(false)
const [showReviewModal, setShowReviewModal] = useState(false)
const [reviewForm, setReviewForm] = useState({ rating: 5, reviewTitle: '', reviewText: '' })

// Analytics state
const [analyticsData, setAnalyticsData] = useState(null)
const [spendingData, setSpendingData] = useState([])
const [topCategories, setTopCategories] = useState([])
const [topProducts, setTopProducts] = useState([])
const [analyticsLoading, setAnalyticsLoading] = useState(false)

// Addresses state
const [addresses, setAddresses] = useState([])
const [addressesLoading, setAddressesLoading] = useState(false)
const [showAddressModal, setShowAddressModal] = useState(false)
const [addressForm, setAddressForm] = useState({
  label: 'Home',
  street: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  phone: ''
})
```

#### D. New Fetch Functions
Add these functions after existing fetch functions:
```jsx
// Fetch wishlist
const fetchWishlist = async () => {
  setWishlistLoading(true)
  try {
    const data = await wishlistService.getWishlist()
    setWishlist(data)
  } catch (error) {
    console.error('Failed to fetch wishlist:', error)
  } finally {
    setWishlistLoading(false)
  }
}

// Fetch reviews
const fetchReviews = async () => {
  setReviewsLoading(true)
  try {
    const [myReviews, eligible] = await Promise.all([
      reviewService.getMyReviews(),
      reviewService.getEligibleProducts()
    ])
    setReviews(myReviews)
    setEligibleProducts(eligible)
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
  } finally {
    setReviewsLoading(false)
  }
}

// Fetch analytics
const fetchAnalytics = async () => {
  setAnalyticsLoading(true)
  try {
    const [summary, spending, categories, products] = await Promise.all([
      customerAnalyticsService.getSummary(),
      customerAnalyticsService.getSpendingOverTime('monthly'),
      customerAnalyticsService.getTopCategories(),
      customerAnalyticsService.getTopProducts()
    ])
    setAnalyticsData(summary)
    setSpendingData(spending)
    setTopCategories(categories)
    setTopProducts(products)
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
  } finally {
    setAnalyticsLoading(false)
  }
}

// Fetch addresses
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
```

#### E. New useEffect Hooks
```jsx
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
```

#### F. New Render Functions
Add complete render functions for:
- `renderWishlist()` - Grid of wishlist products
- `renderReviews()` - My reviews + eligible products
- `renderAnalytics()` - KPI cards + charts
- `renderAddresses()` - Address cards + add/edit forms

#### G. Update renderPage() Switch
```jsx
const renderPage = () => {
  switch (currentPage) {
    case 'home': return renderHome()
    case 'products': return renderProducts()
    case 'orders': return renderOrders()
    case 'profile': return renderProfile()
    case 'report': return renderReportIssue()
    case 'contact': return renderContact()
    case 'wishlist': return renderWishlist()        // NEW
    case 'reviews': return renderReviews()          // NEW
    case 'analytics': return renderAnalytics()      // NEW
    case 'addresses': return renderAddresses()      // NEW
    default: return renderHome()
  }
}
```

#### H. Update renderProducts()
Add wishlist heart icon to each product card:
```jsx
<button 
  className="wishlist-btn"
  onClick={() => handleToggleWishlist(product._id)}
>
  <Heart fill={isInWishlist(product._id) ? 'red' : 'none'} />
</button>
```

#### I. Update renderOrders()
Add reorder and invoice buttons to each order:
```jsx
<button 
  className="btn-reorder"
  onClick={() => handleReorder(order._id)}
>
  <RefreshCw /> Order Again
</button>
<button 
  className="btn-invoice"
  onClick={() => handleDownloadInvoice(order._id)}
>
  <Download /> Download Invoice
</button>
```

#### J. Update renderHome()
Add personalized recommendations section:
```jsx
<section className="recommendations-section">
  <h2>Recommended For You</h2>
  <div className="products-grid">
    {recommendations.map(product => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
</section>
```

---

## 📝 FILES ALREADY CREATED (NO UPDATE NEEDED)

These files are complete and ready to use:

✅ `frontend/src/services/reviewService.js` - Review API calls  
✅ `frontend/src/services/wishlistService.js` - Wishlist API calls  
✅ `frontend/src/services/customerAnalyticsService.js` - Analytics API calls  
✅ `frontend/src/services/extendedCustomerService.js` - Address/order/tracking APIs  
✅ `frontend/src/Pages/CustomerEnhancements.css` - Complete styling for all new features  

---

## 📦 PACKAGES TO INSTALL

Install these npm packages for charts:

```bash
cd frontend
npm install recharts
```

---

## 🎯 INTEGRATION PRIORITY

### Priority 1 (Quick Wins - 30 mins)
1. Add wishlist heart icons to products
2. Add reorder button to orders
3. Add download invoice button to orders

### Priority 2 (Medium - 1 hour)
4. Create wishlist page (navigation + render function)
5. Create saved addresses page

### Priority 3 (Complex - 2-3 hours)
6. Create reviews page with form modal
7. Create analytics page with charts
8. Add recommendations to home page

---

## 📚 DETAILED INTEGRATION GUIDE

For complete step-by-step instructions with full code snippets, see:
**`FRONTEND_INTEGRATION_GUIDE.md`**

This guide includes:
- Complete code for all render functions
- Event handler functions
- Chart component examples
- Modal components
- Form handling logic

---

## ⚠️ WHAT'S NOT INTEGRATED

Currently, **NONE** of the new features are visible in the UI because:

1. ❌ No navigation items for new pages
2. ❌ No render functions for new pages
3. ❌ No wishlist icons on products
4. ❌ No reorder/invoice buttons on orders
5. ❌ No analytics dashboard
6. ❌ No reviews interface
7. ❌ No saved addresses interface
8. ❌ No recommendations on home

**BUT:** All the backend APIs are working! You just need to connect them to the UI.

---

## ✅ VERIFICATION CHECKLIST

After updating CustomerDashboard.jsx, you should see:

- [ ] New sidebar items: Wishlist, Reviews, Analytics, Addresses
- [ ] Wishlist page showing favorite products
- [ ] Reviews page with my reviews + eligible products
- [ ] Analytics page with KPIs and charts
- [ ] Addresses page with saved addresses
- [ ] Heart icons on product cards
- [ ] Reorder button on orders
- [ ] Download invoice button on orders
- [ ] Recommendations section on home

---

## 📍 SUMMARY

**ONE MAIN FILE needs massive updates:**
- `frontend/src/Pages/CustomerDashboard.jsx`

**Updates needed:**
1. Import 4 new service files
2. Import new icons from lucide-react
3. Add new state variables (wishlist, reviews, analytics, addresses)
4. Add 4 new fetch functions
5. Add 4 new useEffect hooks
6. Add 4 new render functions (wishlist, reviews, analytics, addresses)
7. Update renderProducts() - add wishlist hearts
8. Update renderOrders() - add reorder/invoice buttons
9. Update renderHome() - add recommendations
10. Update renderPage() switch statement
11. Add 4 new navigation items in sidebar

**Estimated Time:** 4-6 hours of focused frontend work

**Start here:** Follow `FRONTEND_INTEGRATION_GUIDE.md` step-by-step

---

**TL;DR:** Backend = ✅ Done. Frontend UI = ❌ Not integrated yet. Only need to update **CustomerDashboard.jsx** to connect everything!
