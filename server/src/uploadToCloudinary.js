import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { Product } from './models/product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  console.log('⚡ Checking Cloudinary Configuration...');
  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing'}`);

  try {
    const ping = await cloudinary.api.ping();
    console.log('✅ Cloudinary Connection verified successfully:', ping);
  } catch (err) {
    console.error('❌ Cloudinary Authentication Failed:', err.message || err);
    process.exit(1);
  }

  console.log('⚡ Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  console.log('✅ MongoDB connected.');

  const rootImagesDir = path.resolve(__dirname, '../../');
  const urlCache = new Map();

  const uploadLocalImage = async (relPath, folder = 'vram_vault/products') => {
    if (!relPath) return relPath;
    if (relPath.startsWith('http://res.cloudinary.com') || relPath.startsWith('https://res.cloudinary.com')) {
      return relPath;
    }
    if (urlCache.has(relPath)) return urlCache.get(relPath);

    // Resolve relative local path
    const cleanPath = relPath.startsWith('/') ? relPath.substring(1) : relPath;
    const fullPath = path.resolve(rootImagesDir, cleanPath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      return relPath;
    }

    try {
      console.log(`Uploading ${cleanPath} to Cloudinary...`);
      const uploadResult = await cloudinary.uploader.upload(fullPath, {
        folder,
        resource_type: 'image',
      });
      console.log(`✅ Uploaded -> ${uploadResult.secure_url}`);
      urlCache.set(relPath, uploadResult.secure_url);
      return uploadResult.secure_url;
    } catch (e) {
      console.error(`Failed to upload ${cleanPath}:`, e.message);
      return relPath;
    }
  };

  // 1. Process all Products in MongoDB Atlas
  const products = await Product.find({});
  console.log(`\n--- Uploading Product Images for ${products.length} GPUs ---`);

  let updatedProducts = 0;
  for (const prod of products) {
    let modified = false;

    if (prod.mainImage && !prod.mainImage.startsWith('http')) {
      prod.mainImage = await uploadLocalImage(prod.mainImage, 'vram_vault/products');
      modified = true;
    }

    if (prod.deskImage && !prod.deskImage.startsWith('http')) {
      prod.deskImage = await uploadLocalImage(prod.deskImage, 'vram_vault/desks');
      modified = true;
    }

    if (prod.backImage && !prod.backImage.startsWith('http')) {
      prod.backImage = await uploadLocalImage(prod.backImage, 'vram_vault/backplates');
      modified = true;
    }

    if (prod.portsImage && !prod.portsImage.startsWith('http')) {
      prod.portsImage = await uploadLocalImage(prod.portsImage, 'vram_vault/ports');
      modified = true;
    }

    if (prod.fanImage && !prod.fanImage.startsWith('http')) {
      prod.fanImage = await uploadLocalImage(prod.fanImage, 'vram_vault/fans');
      modified = true;
    }

    if (modified) {
      await prod.save();
      updatedProducts++;
    }
  }
  console.log(`✅ Updated ${updatedProducts} products in MongoDB Atlas with Cloudinary URLs.`);

  // 2. Update initialProducts.json and fallbackProducts.json so seed & cache always have Cloudinary URLs
  console.log('\n--- Syncing Cloudinary URLs to initial & fallback JSON files ---');
  const allUpdated = await Product.find({}).lean();
  const initialPath = path.resolve(__dirname, './initialProducts.json');
  const fallbackPath = path.resolve(__dirname, '../../src/data/fallbackProducts.json');

  fs.writeFileSync(initialPath, JSON.stringify(allUpdated, null, 2));
  fs.writeFileSync(fallbackPath, JSON.stringify(allUpdated, null, 2));
  console.log('✅ Updated initialProducts.json and fallbackProducts.json with Cloudinary CDN URLs.');

  // 3. Process Desk Showcase Items
  console.log('\n--- Syncing Desk Showcase Images to Cloudinary ---');
  const showcasePath = path.resolve(__dirname, '../../src/data/showcase.ts');
  if (fs.existsSync(showcasePath)) {
    let showcaseContent = fs.readFileSync(showcasePath, 'utf8');
    const deskRegex = /\/images\/grafic card on desk\/[a-zA-Z0-9_\-\.]+\.jpeg/g;
    const matches = showcaseContent.match(deskRegex) || [];
    const uniqueMatches = [...new Set(matches)];

    for (const localDeskPath of uniqueMatches) {
      const cdnUrl = await uploadLocalImage(localDeskPath, 'vram_vault/desks');
      if (cdnUrl && cdnUrl.startsWith('http')) {
        showcaseContent = showcaseContent.replaceAll(localDeskPath, cdnUrl);
      }
    }
    fs.writeFileSync(showcasePath, showcaseContent, 'utf8');
    console.log(`✅ Desk Showcase references updated with Cloudinary CDN URLs in showcase.ts.`);
  }

  console.log('\n🎉 ALL IMAGES SUCCESSFULLY MIGRATED TO CLOUDINARY CDN!');
  await mongoose.disconnect();
  process.exit(0);
}

main();
