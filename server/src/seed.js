import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Product } from './models/product.js';
import { User } from './models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    console.log('⚡ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Seed Users (Admin and Customer)
    console.log('\n--- Seeding Users ---');
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword || adminPassword.length < 8) {
      throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (min 8 chars) in server/.env before seeding.');
    }
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`✅ Created Admin user: ${adminEmail}`);
    } else {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    // Optional demo customer (set DEMO_EMAIL and DEMO_PASSWORD to create one for reviewers)
    const demoEmail = (process.env.DEMO_EMAIL || '').toLowerCase();
    const demoPassword = process.env.DEMO_PASSWORD;
    if (demoEmail && demoPassword) {
      const demo = await User.findOne({ email: demoEmail });
      if (!demo) {
        await User.create({ name: 'Demo Customer', email: demoEmail, password: demoPassword, role: 'customer' });
        console.log(`✅ Created demo customer: ${demoEmail}`);
      }
    }

    // 2. Seed Products
    console.log('\n--- Seeding Graphics Cards Catalog ---');
    const seedPath = path.resolve(__dirname, './initialProducts.json');
    if (!fs.existsSync(seedPath)) {
      throw new Error(`initialProducts.json not found at ${seedPath}`);
    }

    const rawProducts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    console.log(`Found ${rawProducts.length} GPU cards to seed.`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const item of rawProducts) {
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const doc = {
        ...item,
        slug,
        stock: item.stockUnits || 15,
        stockUnits: item.stockUnits || 15,
        isActive: true,
      };

      const existing = await Product.findOne({ $or: [{ id: item.id }, { slug }] });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: doc });
        updatedCount++;
      } else {
        await Product.create(doc);
        createdCount++;
      }
    }

    console.log(`✅ Seeding Complete! Created: ${createdCount}, Updated: ${updatedCount}, Total in DB: ${createdCount + updatedCount}`);

    const totalInDB = await Product.countDocuments();
    console.log(`📊 Total products currently in MongoDB Atlas: ${totalInDB}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
