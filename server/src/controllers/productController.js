import { Product } from '../models/product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all products (with optional filtering & sorting)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, sort, inStock } = req.query;
    const filter = { isActive: { $ne: false } };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (inStock === 'true') {
      filter.inStock = true;
    }

    if (search) {
      const safe = String(search).slice(0, 60).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { code: { $regex: safe, $options: 'i' } },
        { tagline: { $regex: safe, $options: 'i' } },
      ];
    }

    let query = Product.find(filter);

    if (sort === 'price-asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      query = query.sort({ price: -1 });
    } else if (sort === 'vram-desc') {
      query = query.sort({ vramGB: -1 });
    } else if (sort === 'rating-desc') {
      query = query.sort({ rating: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query.exec();
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const param = req.params.id;
    let product = await Product.findOne({
      $or: [
        { id: param },
        { slug: param.toLowerCase() },
        { _id: param.length === 24 ? param : null },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// @desc    Create a product (Admin Only)
// @route   POST /api/products
// @access  Protected (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, mainImage, ...rest } = req.body;

    if (!name || price === undefined || !category || !mainImage) {
      return res.status(400).json({ message: 'Missing required fields: name, price, category, mainImage' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `gpu-${Date.now()}`;

    const product = new Product({
      id,
      name,
      slug,
      price: Number(price),
      category,
      mainImage,
      stockUnits: rest.stock !== undefined ? Number(rest.stock) : (rest.stockUnits !== undefined ? Number(rest.stockUnits) : 10),
      stock: rest.stock !== undefined ? Number(rest.stock) : 10,
      inStock: true,
      ...rest,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('❌ Product Creation Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A product with this name or slug already exists.',
      });
    }
    res.status(500).json({ message: error.message || 'Server error creating product' });
  }
};

// @desc    Update a product (Admin Only)
// @route   PUT /api/products/:id
// @access  Protected (Admin)
export const updateProduct = async (req, res) => {
  try {
    const param = req.params.id;
    let product = await Product.findOne({
      $or: [
        { id: param },
        { _id: param.length === 24 ? param : null },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);
    if (req.body.stockUnits !== undefined) {
      product.stock = req.body.stockUnits;
      product.inStock = Number(req.body.stockUnits) > 0;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating product' });
  }
};

// @desc    Delete a product (Admin Only)
// @route   DELETE /api/products/:id
// @access  Protected (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const param = req.params.id;
    const deleted = await Product.findOneAndDelete({
      $or: [
        { id: param },
        { _id: param.length === 24 ? param : null },
      ],
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', id: param });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// @desc    Seed initial catalog into MongoDB Atlas
// @route   POST /api/products/seed
// @access  Public / Admin
export const seedProducts = async (req, res) => {
  try {
    const seedPath = path.resolve(__dirname, '../initialProducts.json');
    if (!fs.existsSync(seedPath)) {
      return res.status(404).json({ message: 'Initial seed data file not found' });
    }

    const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

    // Upsert each product so we don't duplicate
    let inserted = 0;
    for (const item of data) {
      await Product.findOneAndUpdate(
        { $or: [{ id: item.id }, { name: item.name }] },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      inserted++;
    }

    res.json({ message: `Successfully seeded ${inserted} graphics cards into MongoDB Atlas!` });
  } catch (error) {
    console.error('❌ Seed Error:', error);
    res.status(500).json({ message: error.message || 'Server error during seeding' });
  }
};
