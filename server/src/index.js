import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Fail fast if required secrets are missing
const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// Connect to Database
connectDB();

const app = express();

// Behind Render/Railway proxy: needed for correct client IPs (rate limiting)
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false, // frontend loads Google Fonts and Cloudinary images
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Flexible CORS setup: allows localhost in development and client domain in production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors((req, callback) => {
    const origin = req.header('Origin');
    const sameOrigin = origin && req.headers.host && new URL(origin).host === req.headers.host;
    const ok =
      !origin || // curl, Postman, server-to-server
      sameOrigin || // frontend served by this same server (Option A)
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== 'production';
    callback(null, { origin: ok, credentials: true });
  })
);

// Rate limiting: slows down bots and password guessing
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve static images and uploads
const imagesDir = path.resolve(__dirname, '../../images');
const uploadsDir = path.resolve(__dirname, '../public/uploads');

app.use('/images', express.static(imagesDir));
app.use('/uploads', express.static(uploadsDir));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'VRAM Vault E-Commerce API',
  });
});

// Production: Serve client build if available
const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));

// For any non-API route, send back index.html (SPA client routing - Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/images') && !req.path.startsWith('/uploads')) {
    return res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.send('VRAM Vault API is running... (Front-end build running separately in dev)');
      }
    });
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
