import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check env
if (!process.env.MONGODB_URI) {
  throw new Error('❌ Missing MONGODB_URI in .env');
}

const app = express();

const allowedOrigins = ['https://rtrp-temp.vercel.app', 'http://localhost:5173', 'http://127.0.0.1:5173'];

// 🛡️ CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// 🔁 Handle OPTIONS preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// JSON parsing
app.use(express.json());

// 🔒 Cache control
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Expires', '-1');
  res.set('Pragma', 'no-cache');
  next();
});

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// API routes
app.use('/api/auth', authRoutes);

// Static React files
app.use(express.static(path.join(__dirname, '../web/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/dist', 'index.html'));
});

// Launch
const PORT = process.env.AUTH_PORT || process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Auth Server running on port ${PORT}`);
});

