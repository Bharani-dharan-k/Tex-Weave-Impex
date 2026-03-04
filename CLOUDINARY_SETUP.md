# Cloudinary Setup Guide

This guide will help you set up Cloudinary for product image storage in your application.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- Image upload and storage
- Automatic image optimization
- Image transformations (resize, crop, etc.)
- CDN delivery for fast loading
- Free tier: 25GB storage + 25GB monthly bandwidth

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Fill in your details:
   - Email address
   - Password
   - Company name (optional)
4. Verify your email address

### 2. Get Your Credentials

1. After signing up, you'll be redirected to the Dashboard
2. At the top of the page, you'll see:
   - **Cloud Name** (e.g., `dxxxxxxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" to see it)

### 3. Configure Your Application

1. Open `backend/.env` file
2. Add your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Replace the placeholder values with your actual credentials from Cloudinary Dashboard.**

### 4. Alternative: Using MongoDB Atlas

If you want to use MongoDB Atlas instead of local MongoDB:

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier M0)
4. Get your connection string
5. Update your `.env` file:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/texweave?retryWrites=true&w=majority
```

Replace `username`, `password`, and `cluster` with your actual values.

## How It Works

### Product Image Upload Flow

1. **Admin adds a product** with an image
2. Frontend sends the image as multipart/form-data
3. Backend receives the image buffer
4. Backend uploads to Cloudinary
5. Cloudinary returns:
   - `secure_url`: Public URL to access the image
   - `public_id`: Unique identifier for the image
6. Backend stores these in MongoDB with the product
7. Customer page displays images using the `secure_url`

### Image Transformations

Images are automatically optimized when uploaded:
- Resized to max 800x800px (maintains aspect ratio)
- Quality optimized for web
- Stored in the `products` folder on Cloudinary

## Testing

### 1. Start Your Backend

```bash
cd backend
npm start
```

You should see:
```
MongoDB Connected
Server is running on port 5000
```

### 2. Add a Product with Image

1. Login as admin
2. Go to "Add Product" page
3. Fill in all fields
4. Select an image (JPEG, PNG, GIF, or WebP, max 5MB)
5. Click "Add Product"

### 3. Verify on Cloudinary

1. Go to your Cloudinary Dashboard
2. Click "Media Library" in the left menu
3. Open the "products" folder
4. You should see your uploaded image

### 4. View on Customer Page

1. Logout and login as customer
2. Go to "Products" page
3. You should see the product with its image
4. Click on the product to see full details

## Troubleshooting

### Error: "Failed to upload image"

**Possible causes:**
1. Invalid Cloudinary credentials
2. Network connection issues
3. Image file too large (>5MB)

**Solutions:**
- Double-check your credentials in `.env`
- Make sure you copied all three values correctly
- Try with a smaller image file
- Check console for detailed error messages

### Error: "Product ID already exists"

**Solution:**
- Use a unique Product ID for each product
- Product IDs are automatically converted to uppercase

### Image not displaying

**Check:**
1. Open browser console (F12) and check for errors
2. Verify the image URL in the Network tab
3. Check if the product has `image.url` in the database

### Cannot connect to MongoDB

**If using local MongoDB:**
- Make sure MongoDB service is running
- URL should be: `mongodb://127.0.0.1:27017/texweave`

**If using MongoDB Atlas:**
- Check your connection string
- Whitelist your IP address in Atlas Network Access
- Verify username and password

## Features

### Image Management Features

✅ Upload product images (JPEG, PNG, GIF, WebP)
✅ Image preview before upload
✅ Automatic image optimization
✅ Remove image before submission
✅ Update product images
✅ Delete images when product is deleted
✅ Display images in product cards
✅ Display images in product details modal
✅ Display images in admin product table

### File Size & Type Validation

- **Max file size:** 5MB
- **Allowed formats:** JPEG, JPG, PNG, GIF, WebP
- **Automatic resize:** Images larger than 800x800px are resized
- **Quality optimization:** Automatic compression for faster loading

## Free Tier Limits

Cloudinary Free Tier includes:
- **Storage:** 25GB
- **Bandwidth:** 25GB/month
- **Transformations:** 25 credits/month
- **Requests:** 50,000/month

For a small to medium-sized application, this should be sufficient!

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

## Support

If you encounter any issues:
1. Check the error messages in browser console and server logs
2. Verify all configuration values
3. Ensure your Cloudinary account is active
4. Check network connectivity

---

**Happy uploading! 🎉**
