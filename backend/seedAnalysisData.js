import dotenv from 'dotenv'
import connectDB from './config/db.js'
import User from './models/User.js'
import Product from './models/Product.js'
import Order from './models/Order.js'
import Inventory from './models/Inventory.js'
import Sales from './models/Sales.js'

dotenv.config()

const TARGET_USERS = 10
const TARGET_PRODUCTS = 20
const TARGET_ORDERS = 20

const categories = ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Blended', 'Other']
const units = ['meters', 'kg', 'pieces', 'rolls']
const paymentMethods = ['razorpay', 'cod', 'bank_transfer']
const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const states = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Gujarat', 'West Bengal', 'Telangana']

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[rand(0, arr.length - 1)]

const daysAgo = (days) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

const pad = (n, size = 2) => String(n).padStart(size, '0')

const buildUserPayload = (idx) => {
  const n = idx + 1
  const citySeed = ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Ahmedabad', 'Kolkata'][idx % 6]

  return {
    name: `Customer ${pad(n)}`,
    email: `customer${pad(n)}@texweave.com`,
    password: 'customer123',
    role: 'user',
    phone: `9${rand(100000000, 999999999)}`,
    companyName: `Tex Client ${pad(n)}`,
    customerType: pick(['Retailer', 'Wholesaler', 'Distributor']),
    gstNumber: `29ABCDE${pad(n, 3)}F1Z${n % 9}`,
    shippingAddress: {
      street: `${rand(10, 220)} Market Road`,
      city: citySeed,
      state: pick(states),
      country: 'India',
      pincode: `${rand(100000, 999999)}`
    },
    billingAddress: {
      street: `${rand(10, 220)} Market Road`,
      city: citySeed,
      state: pick(states),
      country: 'India',
      pincode: `${rand(100000, 999999)}`
    },
    isActive: true
  }
}

const buildProductPayload = (idx) => {
  const n = idx + 1
  const costPrice = rand(120, 1200)
  const margin = rand(18, 45)
  const sellingPrice = Math.round(costPrice * (1 + margin / 100))
  const category = pick(categories)

  return {
    productId: `ANL${pad(n, 3)}`,
    name: `${category} Fabric Variant ${pad(n, 3)}`,
    category,
    costPrice,
    sellingPrice,
    reorderLevel: rand(8, 40),
    description: `Analytics seed product ${pad(n, 3)} for dashboard data enrichment.`,
    unit: pick(units),
    isActive: true,
    source: 'manual'
  }
}

const computePaymentStatus = (orderStatus) => {
  if (orderStatus === 'cancelled') return 'failed'
  if (orderStatus === 'pending') return pick(['pending', 'completed'])
  return 'completed'
}

const createOrderItems = (productPool) => {
  const copy = [...productPool].sort(() => Math.random() - 0.5)
  const count = Math.min(rand(1, 3), copy.length)
  const chosen = copy.slice(0, count)

  return chosen.map((p) => {
    const quantity = rand(1, 8)
    const pricePerUnit = Number(p.sellingPrice || 0)
    return {
      product: p._id,
      productName: p.name,
      productId: p.productId,
      quantity,
      unit: p.unit,
      pricePerUnit,
      totalPrice: quantity * pricePerUnit
    }
  })
}

const seed = async () => {
  try {
    await connectDB()

    // 1) Users
    const existingEmails = new Set((await User.find({}, { email: 1 }).lean()).map(u => u.email))
    const usersToCreate = []
    let userCursor = 1

    while (usersToCreate.length < TARGET_USERS) {
      const payload = buildUserPayload(userCursor)
      userCursor += 1
      if (!existingEmails.has(payload.email)) {
        usersToCreate.push(payload)
        existingEmails.add(payload.email)
      }
    }

    const createdUsers = []
    for (const payload of usersToCreate) {
      const u = await User.create(payload)
      createdUsers.push(u)
    }

    // 2) Products + Inventory
    const existingProductIds = new Set((await Product.find({}, { productId: 1 }).lean()).map(p => p.productId))
    const productsToCreate = []
    let productCursor = 1

    while (productsToCreate.length < TARGET_PRODUCTS) {
      const payload = buildProductPayload(productCursor)
      productCursor += 1
      if (!existingProductIds.has(payload.productId)) {
        productsToCreate.push(payload)
        existingProductIds.add(payload.productId)
      }
    }

    const createdProducts = []
    for (const payload of productsToCreate) {
      const product = await Product.create(payload)
      createdProducts.push(product)

      await Inventory.findOneAndUpdate(
        { productId: product.productId },
        {
          productName: product.name,
          quantityInStock: rand(12, 220),
          reorderLevel: product.reorderLevel,
          maxStockLevel: rand(260, 520),
          warehouseLocation: 'Main Warehouse',
          lastRestockDate: daysAgo(rand(5, 120)),
          lastUpdated: new Date()
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    }

    // 3) Orders + Sales
    const allProducts = await Product.find({ isActive: true }).limit(120)
    const customerUsers = await User.find({ role: { $in: ['user', 'customer'] }, isActive: true }).limit(200)

    if (!allProducts.length || !customerUsers.length) {
      throw new Error('Need active products and customer users before seeding orders.')
    }

    const createdOrders = []
    let salesRows = 0

    for (let i = 0; i < TARGET_ORDERS; i++) {
      const user = pick(customerUsers)
      const items = createOrderItems(allProducts)
      const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0)
      const tax = Math.round(subtotal * 0.18)
      const shippingCharges = subtotal > 10000 ? 0 : 200
      const totalAmount = subtotal + tax + shippingCharges
      const orderStatus = pick(orderStatuses)
      const paymentStatus = computePaymentStatus(orderStatus)
      const createdAt = daysAgo(rand(1, 210))

      const order = await Order.create({
        user: user._id,
        items,
        subtotal,
        tax,
        shippingCharges,
        totalAmount,
        paymentMethod: pick(paymentMethods),
        paymentStatus,
        orderStatus,
        customerInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        },
        shippingAddress: user.shippingAddress || user.billingAddress || {},
        billingAddress: user.billingAddress || user.shippingAddress || {},
        createdAt,
        updatedAt: createdAt
      })

      createdOrders.push(order)

      const shouldCreateSales = paymentStatus === 'completed' && orderStatus !== 'cancelled'
      if (shouldCreateSales) {
        for (let j = 0; j < items.length; j++) {
          const item = items[j]
          await Sales.findOneAndUpdate(
            { invoiceId: `${order.orderId}-${pad(j + 1)}`.toUpperCase() },
            {
              invoiceId: `${order.orderId}-${pad(j + 1)}`.toUpperCase(),
              productId: String(item.productId || '').toUpperCase(),
              productName: item.productName,
              quantitySold: item.quantity,
              unitPrice: item.pricePerUnit,
              totalAmount: item.totalPrice,
              costPrice: Math.max(Math.round(item.pricePerUnit * 0.72), 1),
              saleDate: createdAt,
              customerName: user.name,
              region: pick(['North', 'South', 'East', 'West', 'Central']),
              paymentStatus: 'Paid',
              salesPerson: 'Online'
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          )
          salesRows += 1

          await Inventory.findOneAndUpdate(
            { productId: String(item.productId || '').toUpperCase() },
            {
              $inc: { quantityInStock: -item.quantity },
              $set: { lastSaleDate: createdAt, lastUpdated: new Date() }
            }
          )
        }
      }
    }

    console.log('')
    console.log('Seed completed successfully:')
    console.log(`- Users created: ${createdUsers.length}`)
    console.log(`- Products created: ${createdProducts.length}`)
    console.log(`- Orders created: ${createdOrders.length}`)
    console.log(`- Sales rows upserted: ${salesRows}`)
    console.log('')
    console.log('Test login for new users: password is customer123')
    console.log(`Example new user: ${createdUsers[0]?.email || 'N/A'}`)

    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }
}

seed()
