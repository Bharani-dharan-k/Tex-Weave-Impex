import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import connectDB from './config/db.js'

dotenv.config()

const checkAndCreateAdmin = async () => {
  try {
    await connectDB()

    console.log('Checking for admin user...')

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@example.com' })

    if (adminExists) {
      console.log('✅ Admin user already exists!')
      console.log('Email: admin@example.com')
      console.log('Role:', adminExists.role)
      console.log('Active:', adminExists.isActive)
      console.log('\nYou can login with:')
      console.log('Email: admin@example.com')
      console.log('Password: admin123')
    } else {
      console.log('❌ Admin user not found. Creating...')
      
      // Create admin user
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      })

      console.log('✅ Admin user created successfully!')
      console.log('Email: admin@example.com')
      console.log('Password: admin123')
      console.log('\n⚠️  Please change the password after first login!')
    }

    process.exit()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkAndCreateAdmin()
