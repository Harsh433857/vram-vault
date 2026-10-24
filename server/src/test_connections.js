import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

console.log('--- Testing MongoDB Atlas Connection ---');
console.log('Mongo URI:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@') : 'None');

async function testMongo() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('✅ MongoDB connection SUCCESSFUL! Connected host:', conn.connection.host);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
}

async function testCloudinary() {
  console.log('\n--- Testing Cloudinary Connection ---');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const res = await cloudinary.api.ping();
    console.log('✅ Cloudinary Ping SUCCESSFUL:', res);
  } catch (err) {
    console.error('❌ Cloudinary Ping failed full error:', err);
    console.log('Trying upload test...');
    try {
      const uploadRes = await cloudinary.uploader.upload('images/fan/mvj3x2uzqocrhg.jpeg', {
        folder: 'vram_vault_test'
      });
      console.log('✅ Upload succeeded:', uploadRes.secure_url);
    } catch(uploadErr) {
      console.error('❌ Upload error:', uploadErr);
    }
  }
}

async function run() {
  await testMongo();
  await testCloudinary();
  process.exit(0);
}

run();
