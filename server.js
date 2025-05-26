import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in .env');
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add cache control headers globally
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Expires', '-1');
  res.set('Pragma', 'no-cache');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message || err);
    process.exit(1); // Exit if DB fails to connect
  });

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.use('/api/auth', authRoutes);

// Serve React App
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});