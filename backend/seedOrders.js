import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const USER_EMAIL = 'sanjaybharani88@gmail.com'; // Change this if needed

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFrom = arr => arr[Math.floor(Math.random() * arr.length)];

const daysAgo = d => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date;
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const user = await User.findOne({ email: USER_EMAIL });
  if (!user) {
    console.error(`User not found: ${USER_EMAIL}`);
    process.exit(1);
  }
  console.log(`Seeding orders for user: ${user.name} (${user._id})`);

  const products = await Product.find({ isActive: true }).limit(20);
  if (products.length === 0) {
    console.error('No active products found. Please add products first.');
    process.exit(1);
  }
  console.log(`Found ${products.length} products to use`);

  const statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'confirmed', 'pending', 'cancelled'];
  const orderDays = [180, 150, 120, 100, 80, 60, 45, 30, 15, 5];

  const orders = [];
  for (let i = 0; i < 10; i++) {
    const numItems = Math.min(randomInt(1, 3), products.length);
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    const selectedProducts = shuffled.slice(0, numItems);

    const items = selectedProducts.map(p => {
      const quantity = randomInt(2, 10);
      const pricePerUnit = p.sellingPrice;
      return {
        product: p._id,
        productName: p.name,
        productId: p.productId,
        quantity,
        unit: p.unit,
        pricePerUnit,
        totalPrice: quantity * pricePerUnit
      };
    });

    const subtotal = items.reduce((s, it) => s + it.totalPrice, 0);
    const tax = Math.round(subtotal * 0.18);
    const shippingCharges = subtotal > 5000 ? 0 : 150;
    const totalAmount = subtotal + tax + shippingCharges;
    const orderStatus = randomFrom(statuses);
    const createdAt = daysAgo(orderDays[i]);

    orders.push({
      user: user._id,
      items,
      subtotal,
      tax,
      shippingCharges,
      totalAmount,
      paymentMethod: randomFrom(['razorpay', 'cod']),
      paymentStatus: orderStatus === 'cancelled' ? 'failed' : 'completed',
      orderStatus,
      customerInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone || '9999999999'
      },
      createdAt,
      updatedAt: createdAt
    });
  }

  // Insert using create() so pre-save middleware (orderId generation) runs
  const result = [];
  for (let i = 0; i < orders.length; i++) {
    try {
      const orderData = orders[i];
      const doc = new Order(orderData);
      await doc.save();
      result.push(doc);
      console.log(`  Saved order ${i + 1}/10: ₹${doc.totalAmount} | ${doc.orderStatus}`);
    } catch (err) {
      console.error(`  Error saving order ${i + 1}:`, err.message);
    }
  }

  console.log(`\n✅ Successfully inserted ${result.length} test orders`);
  console.log('Order details:');
  result.forEach((o, i) => {
    console.log(`  ${i + 1}. ${o.orderId || o._id} | ₹${o.totalAmount} | ${o.orderStatus} | ${o.paymentStatus}`);
  });

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
