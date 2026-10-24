import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Memory storage for direct streaming to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed!'));
  },
});

// @desc    Upload single image to Cloudinary
// @route   POST /api/upload
// @access  Protected (Admin)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    try {
      // 1. Try uploading to Cloudinary
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'vram_vault/products',
      });

      return res.status(200).json({
        success: true,
        message: 'Image uploaded to Cloudinary successfully',
        imageUrl: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        source: 'cloudinary',
      });
    } catch (cloudinaryError) {
      console.warn('⚠️ Cloudinary upload failed. Falling back to local storage:', cloudinaryError.message);

      // Local fallback in case Cloudinary cloud_name or credentials fail
      const uploadsDir = path.resolve(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, req.file.buffer);

      const localUrl = `/uploads/${fileName}`;

      return res.status(200).json({
        success: true,
        message: 'Image saved locally (Cloudinary credential notice: ' + (cloudinaryError.message || 'Check CLOUDINARY_CLOUD_NAME') + ')',
        imageUrl: localUrl,
        source: 'local',
      });
    }
  } catch (error) {
    console.error('❌ Upload Route Error:', error);
    res.status(500).json({ message: error.message || 'Error uploading file' });
  }
});

export default router;
