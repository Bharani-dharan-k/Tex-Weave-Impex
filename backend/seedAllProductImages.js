/**
 * Bulk seed images for ALL products in the database.
 * Uses category-based image pools with known-working Cloudinary-compatible URLs.
 * Only updates products that don't already have an image.
 */
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------------------------------------------------------
// Image pools per fabric category (all verified accessible by Cloudinary)
// -------------------------------------------------------------------
const imagePools = {
  // White/light cotton weaves
  cotton_light: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format',
    'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&auto=format',
    'https://images.pexels.com/photos/2977304/pexels-photo-2977304.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  // Heavier cotton / denim
  cotton_heavy: [
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format',
  ],
  // Silk & satin
  silk: [
    'https://images.pexels.com/photos/2977304/pexels-photo-2977304.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3812433/pexels-photo-3812433.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.unsplash.com/photo-1594032194509-0056023973b2?w=800&auto=format',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
  ],
  // Polyester / synthetic
  polyester: [
    'https://images.unsplash.com/photo-1575377222312-dd1a63a51638?w=800&auto=format',
    'https://images.unsplash.com/photo-1594032194509-0056023973b2?w=800&auto=format',
    'https://images.pexels.com/photos/3812433/pexels-photo-3812433.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
  ],
  // Wool & heavyweight
  wool: [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format',
  ],
  // Linen / natural fibres
  linen: [
    'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&auto=format',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format',
  ],
  // Velvet
  velvet: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
    'https://images.pexels.com/photos/2977304/pexels-photo-2977304.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  // Blended & other
  other: [
    'https://images.unsplash.com/photo-1575377222312-dd1a63a51638?w=800&auto=format',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format',
    'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&auto=format',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format',
  ],
};

/**
 * Pick the right image pool and index for a given product name.
 */
const getImageUrl = (name, index) => {
  const n = name.toLowerCase();
  let pool;
  if (n.includes('denim') || n.includes('canvas') || n.includes('twill') || n.includes('corduroy') || n.includes('terry') || n.includes('muslin') || n.includes('interlock') || n.includes('flannel') || n.includes('jute') || n.includes('hemp') || n.includes('burlap')) {
    pool = imagePools.cotton_heavy;
  } else if (n.includes('cotton') || n.includes('poplin') || n.includes('cambric') || n.includes('voile') || n.includes('sateen') || n.includes('lawn')) {
    pool = imagePools.cotton_light;
  } else if (n.includes('silk') || n.includes('charmeuse') || n.includes('organza') || n.includes('dupioni') || n.includes('habotai') || n.includes('brocade')) {
    pool = imagePools.silk;
  } else if (n.includes('polyester') || n.includes('nylon') || n.includes('lycra') || n.includes('spandex') || n.includes('microfiber') || n.includes('taffeta') || n.includes('fleece') || n.includes('mesh') || n.includes('crepe') || n.includes('ripstop') || n.includes('chiffon') || n.includes('satin')) {
    pool = imagePools.polyester;
  } else if (n.includes('wool') || n.includes('cashmere') || n.includes('merino') || n.includes('gabardine') || n.includes('tweed') || n.includes('melton')) {
    pool = imagePools.wool;
  } else if (n.includes('linen') || n.includes('chambray') || n.includes('slub') || n.includes('jacquard')) {
    pool = imagePools.linen;
  } else if (n.includes('velvet')) {
    pool = imagePools.velvet;
  } else {
    pool = imagePools.other;
  }
  return pool[index % pool.length];
};

const seedAllImages = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    // Find products missing images
    const products = await Product.find({
      $or: [{ 'image.url': { $exists: false } }, { 'image.url': '' }, { 'image.url': null }],
    }).lean();

    if (products.length === 0) {
      console.log('All products already have images!');
      process.exit(0);
    }

    console.log(`Found ${products.length} products without images\n`);

    let success = 0;
    let failed = 0;
    const failedList = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageUrl = getImageUrl(product.name, i);
      const publicId = `product_${product.productId.toLowerCase()}`;

      process.stdout.write(`[${i + 1}/${products.length}] ${product.productId} - ${product.name}... `);

      try {
        const result = await cloudinary.uploader.upload(imageUrl, {
          folder: 'texweave/products',
          public_id: publicId,
          overwrite: true,
          invalidate: true,
          transformation: [{ width: 800, height: 800, crop: 'fill', gravity: 'center' }],
        });

        await Product.findByIdAndUpdate(product._id, {
          $set: { 'image.url': result.secure_url, 'image.publicId': result.public_id },
        });

        console.log(`✓`);
        success++;
      } catch (e) {
        console.log(`✗ ${e.message}`);
        failedList.push({ productId: product.productId, name: product.name, url: imageUrl, error: e.message });
        failed++;
      }
    }

    console.log(`\n====================================`);
    console.log(`✓ Success: ${success} products updated`);
    if (failed > 0) {
      console.log(`✗ Failed:  ${failed} products`);
      failedList.forEach(f => console.log(`   - ${f.productId} (${f.name}): ${f.error}`));
    }
    console.log(`====================================\n`);

    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
};

seedAllImages();
