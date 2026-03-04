import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is disabled. Please contact administrator."
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Token expiry
    const expiresIn = rememberMe ? "7d" : "1d";

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error. Please try again later."
    });
  }
};
