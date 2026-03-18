import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Online fabric images mapped by productId
// All images are from Unsplash (free to use, no auth required)
const productImages = {
  PROD001: {
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format',
    label: 'Cotton Fabric',
  },
  PROD002: {
    url: 'https://images.unsplash.com/photo-1575377222312-dd1a63a51638?w=800&auto=format',
    label: 'Polyester Blend',
  },
  PROD003: {
    url: 'https://images.unsplash.com/photo-1614945647635-cd1e00c8d091?w=800&auto=format',
    label: 'Silk Material',
  },
  PROD004: {
    url: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&auto=format',
    label: 'Linen Fabric',
  },
  PROD005: {
    url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format',
    label: 'Wool Blend',
  },
  PROD006: {
    url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format',
    label: 'Denim Material',
  },
  PROD007: {
    url: 'https://images.unsplash.com/photo-1545194449-5b03f3e08bea?w=800&auto=format',
    label: 'Satin Fabric',
  },
  PROD008: {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
    label: 'Velvet Material',
  },
  PROD009: {
    url: 'https://images.unsplash.com/photo-1594032194509-0056023973b2?w=800&auto=format',
    label: 'Chiffon Fabric',
  },
  PROD010: {
    url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format',
    label: 'Tweed Fabric',
  },
};

const uploadImageToCloudinary = async (imageUrl, productId, label) => {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: 'texweave/products',
    public_id: `product_${productId.toLowerCase()}`,
    overwrite: true,
    invalidate: true,
    transformation: [{ width: 800, height: 800, crop: 'fill', gravity: 'center' }],
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const seedImages = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    const productIds = Object.keys(productImages);
    let successCount = 0;
    let failCount = 0;

    for (const productId of productIds) {
      const { url, label } = productImages[productId];
      try {
        process.stdout.write(`Uploading image for ${productId} (${label})... `);

        const { url: cloudinaryUrl, publicId } = await uploadImageToCloudinary(url, productId, label);

        await Product.findOneAndUpdate(
          { productId },
          { $set: { 'image.url': cloudinaryUrl, 'image.publicId': publicId } },
          { upsert: false }
        );

        console.log(`✓ Done → ${cloudinaryUrl}`);
        successCount++;
      } catch (err) {
        console.log(`✗ Failed: ${err.message}`);
        failCount++;
      }
    }

    console.log(`\n===========================`);
    console.log(`✓ Success: ${successCount} products updated`);
    if (failCount > 0) console.log(`✗ Failed:  ${failCount} products`);
    console.log(`===========================\n`);

    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
};

seedImages();
