import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import salesAnalyticsRoutes from "./routes/salesAnalyticsRoutes.js";
import inventoryAnalyticsRoutes from "./routes/inventoryAnalyticsRoutes.js";
import slowStockRoutes from "./routes/slowStockRoutes.js";
import forecastRoutes from "./routes/forecastRoutes.js";
import profitabilityRoutes from "./routes/profitabilityRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import customerAnalyticsRoutes from "./routes/customerAnalyticsRoutes.js";
import productViewRoutes from "./routes/productViewRoutes.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics/sales", salesAnalyticsRoutes);
app.use("/api/analytics/inventory", inventoryAnalyticsRoutes);
app.use("/api/analytics/slow-stock", slowStockRoutes);
app.use("/api/analytics/forecast", forecastRoutes);
app.use("/api/analytics/profitability", profitabilityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/issues", issueRoutes);

// New customer module routes
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/customer/analytics", customerAnalyticsRoutes);
app.use("/api/product-views", productViewRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

