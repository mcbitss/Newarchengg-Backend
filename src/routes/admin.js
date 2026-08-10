import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '../../../frontend/public/assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, assetsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    cb(null, `${timestamp}-${originalName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

// Middleware to require admin token
export const requireAdminToken = (req, res, next) => {
  const token = req.header('x-admin-token');
  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ error: 'ADMIN_TOKEN is not configured' });
  }
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Invalid admin token' });
  }
  next();
};

// Admin login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS || !process.env.ADMIN_TOKEN) {
      return res.status(500).json({ error: 'Admin credentials are not configured' });
    }

    if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ 
      token: process.env.ADMIN_TOKEN,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image (admin only)
router.post('/upload', requireAdminToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const relativePath = `/assets/${req.file.filename}`;
    res.status(201).json({ 
      path: relativePath,
      filename: req.file.filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
