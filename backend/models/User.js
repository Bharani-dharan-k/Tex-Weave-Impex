import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    phone: {
      type: String,
      sparse: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'customer'],
      default: 'user'
    },
    profilePicture: {
      type: String,
      default: ''
    },
    // Customer-specific fields
    companyName: {
      type: String,
      trim: true
    },
    customerType: {
      type: String,
      enum: ['Retailer', 'Wholesaler', 'Manufacturer', 'Distributor', 'Other', ''],
      default: ''
    },
    gstNumber: {
      type: String,
      trim: true
    },
    billingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
      pincode: { type: String, trim: true }
    },
    shippingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
      pincode: { type: String, trim: true }
    },
    preferences: {
      productsInterested: [{ type: String }],
      monthlyVolume: {
        type: String,
        enum: ['Less than 1000', '1000-5000', '5000-10000', '10000+', '']
      },
      gsmRange: {
        type: String,
        enum: ['100-150', '150-200', '200-300', '300+', '']
      },
      colorPreference: {
        type: String
      }
    },
    documents: {
      gstCertificate: { type: String },
      tradeLicense: { type: String }
    },
    // Saved addresses for quick checkout
    savedAddresses: [
      {
        label: {
          type: String,
          required: true,
          trim: true
        },
        isDefault: {
          type: Boolean,
          default: false
        },
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true, default: 'India' },
        pincode: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpire: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
)

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return
  }
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
