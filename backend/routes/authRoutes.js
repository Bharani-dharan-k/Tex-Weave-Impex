import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import Order from '../models/Order.js'
import Review from '../models/Review.js'
import Issue from '../models/Issue.js'
import jwt from 'jsonwebtoken'
import { protect } from '../middleware/authMiddleware.js'
import { sendPasswordResetEmail } from '../config/email.js'
import crypto from 'crypto'

const router = express.Router()

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  })
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password, role } = req.body

      // Check if user exists
      const userExists = await User.findOne({ email })
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' })
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
      })

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Check for user
      const user = await User.findOne({ email }).select('+password')

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' })
      }

      // Check password
      const isMatch = await user.comparePassword(password)

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Please enter a valid email')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email } = req.body

      console.log('🔍 Password reset requested for:', email)

      // Check if user exists
      const user = await User.findOne({ email })

      if (!user) {
        console.log('⚠️  User not found:', email)
        // For security, always return success even if user doesn't exist
        return res.json({ 
          message: 'If an account exists with this email, a password reset link has been sent.' 
        })
      }

      console.log('✅ User found:', user.name, user.email)

      // Generate reset token using crypto for security
      const resetToken = crypto.randomBytes(32).toString('hex')
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

      console.log('🔑 Generated reset token')

      // Save hashed token to user with expiry (1 hour)
      // Use findByIdAndUpdate to avoid triggering password hash middleware
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: Date.now() + 60 * 60 * 1000 // 1 hour
      })

      console.log('💾 Token saved to database')

      // Send email with reset link
      console.log('📧 Sending email to:', user.email)
      const emailResult = await sendPasswordResetEmail(
        user.email,
        resetToken,
        user.name
      )

      if (!emailResult.success) {
        console.error('❌ Failed to send email:', emailResult.error)
        // Clear the reset token if email fails
        await User.findByIdAndUpdate(user._id, {
          resetPasswordToken: undefined,
          resetPasswordExpire: undefined
        })
        
        return res.status(500).json({ 
          message: 'Failed to send reset email. Please try again later.' 
        })
      }

      console.log('✅ Email sent successfully to:', user.email)

      res.json({ 
        message: 'Password reset link has been sent to your email.'
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { token, password } = req.body

      // Hash the token to compare with database
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

      // Find user with valid token and not expired
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      }).select('+password +resetPasswordToken +resetPasswordExpire')

      if (!user) {
        return res.status(400).json({ 
          message: 'Invalid or expired reset token' 
        })
      }

      // Set new password and clear reset token
      user.password = password
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save()

      console.log('✅ Password reset successful for:', user.email)

      res.json({ 
        message: 'Password reset successful. You can now login with your new password.' 
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', protect, async (req, res) => {
  try {
    // Only allow admin users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' })
    }

    const users = await User.find({}).select('-password')
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   GET /api/auth/users/:userId/details
// @desc    Get a specific user's profile + orders + reviews + issues (Admin only)
// @access  Private/Admin
router.get('/users/:userId/details', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' })
    }

    const { userId } = req.params

    const [user, orders, reviews, issues] = await Promise.all([
      User.findById(userId).select('-password'),
      Order.find({ user: userId }).sort({ createdAt: -1 }),
      Review.find({ userId }).populate('productId', 'name productId').sort({ createdAt: -1 }),
      Issue.find({ 'submittedBy.userId': userId }).sort({ createdAt: -1 })
    ])

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user, orders, reviews, issues })
  } catch (error) {
    console.error('Error fetching user details:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
