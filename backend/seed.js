import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import connectDB from './config/db.js'

dotenv.config()

const seedAdmin = async () => {
  try {
    await connectDB()

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@example.com' })

    if (adminExists) {
      console.log('Admin user already exists')
      process.exit()
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    })

    console.log('Admin user created successfully')
    console.log('Email: admin@example.com')
    console.log('Password: admin123')
    console.log('\nPlease change the password after first login!')

    process.exit()
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()
