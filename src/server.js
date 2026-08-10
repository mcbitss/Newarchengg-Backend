import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

// Verify dotenv loaded correctly
if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: dotenv not loading .env file correctly!');
  console.error('   Make sure .env file exists in the backend directory');
}

import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contacts.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// CORS Configuration - All from environment variables
const getAllowedOrigins = () => {
  const origins = [];
  
  // Read from ALLOWED_ORIGINS environment variable (comma-separated)
  if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0);
    origins.push(...envOrigins);
  }
  
  // If no origins configured, use defaults for development
  if (origins.length === 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️  No ALLOWED_ORIGINS configured. Using development defaults.');
    return [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ];
  }
  
  return origins;
};

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development mode without strict origins, allow all for easier testing
    if (process.env.NODE_ENV === 'development' && process.env.CORS_ALLOW_ALL === 'true') {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.length === 0) {
      console.error('❌ No CORS origins configured! Please set ALLOWED_ORIGINS in .env');
      return callback(new Error('CORS configuration error: No allowed origins set'));
    }
    
    // Check if origin matches (case-insensitive comparison)
    const originLower = origin.toLowerCase();
    const isAllowed = allowedOrigins.some(allowed => allowed.toLowerCase() === originLower);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`);
      console.log(`🔍 Request origin: ${origin}`);
      callback(new Error(`Not allowed by CORS. Origin ${origin} is not in the allowed list.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// Log CORS configuration on startup
console.log('\n🔧 CORS Configuration:');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  ALLOWED_ORIGINS from .env:', process.env.ALLOWED_ORIGINS || 'not set');
console.log('  CORS_ALLOW_ALL:', process.env.CORS_ALLOW_ALL || 'not set');
if (allowedOrigins.length > 0) {
  console.log('  ✅ Configured origins:', allowedOrigins.join(', '));
} else {
  console.warn('  ⚠️  No origins configured! Set ALLOWED_ORIGINS in .env');
}
console.log('');

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'NEWARCH API' });
});

// CORS Debug endpoint
app.get('/api/cors-debug', (_req, res) => {
  const requestOrigin = _req.headers.origin;
  const isAllowed = requestOrigin && allowedOrigins.indexOf(requestOrigin) !== -1;
  
  res.json({
    allowedOrigins: allowedOrigins,
    allowedOriginsCount: allowedOrigins.length,
    nodeEnv: process.env.NODE_ENV,
    corsAllowAll: process.env.CORS_ALLOW_ALL,
    requestOrigin: requestOrigin,
    isOriginAllowed: isAllowed,
    envAllowedOrigins: process.env.ALLOWED_ORIGINS,
    message: 'CORS configuration debug info',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const start = async () => {
  try {
    // Verify environment variables are loaded
    console.log('\n📋 Environment Check:');
    console.log('  MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
    console.log('  PORT:', process.env.PORT || '4000 (default)');
    console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.log('  ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS ? '✅ Set' : '❌ Missing');
    console.log('');
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is required in .env file');
      console.error('   Current working directory:', process.cwd());
      console.error('   Make sure .env file exists in:', path.join(process.cwd(), '.env'));
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Backend server running on http://localhost:${port}`);
      console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ') || 'none configured'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();
