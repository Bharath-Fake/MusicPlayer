import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import axios from 'axios';
import authRoutes from './routes/auth.js';
import playlistRoutes from './routes/playlists.js';
import songRoutes from './routes/songs.js';

// Load environment variables
dotenv.config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection string
const mgdburl = "mongodb+srv://bharathk:Bharath+8510@cluster0.nw4rmjo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(mgdburl, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  w: 'majority'
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  // Attempt to reconnect
  mongoose.connect(mgdburl);
});

// Create public/songs directory if it doesn't exist
const songsDir = path.join(__dirname, '../public/songs');
if (!fs.existsSync(songsDir)){
  fs.mkdirSync(songsDir, { recursive: true });
  console.log('Created songs directory');
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, songsDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, extension);
    cb(null, originalName + extension);
  }
});

const upload = multer({ storage });

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Upload route for songs
app.post('/api/upload', upload.single('song'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const songPath = path.join('songs', req.file.filename);
  try {
    //const response = await axios.post(`${API_URL}/playlists`, { name: req.file.filename });
    // res.json({ message: 'Song uploaded successfully', file: songPath, playlistResponse: response.data });
    res.json({ message: 'Song uploaded successfully', file: songPath });
  } catch (error) {
    console.error('Error creating playlist:', error.stack || error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

