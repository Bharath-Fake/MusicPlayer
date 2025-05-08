import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Song from '../models/Song.js';
import auth from '../middleware/auth.js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Middleware for all routes
router.use(auth);

// Helper function to get MP3 duration (mocked for now)
const getMp3Duration = (filePath) => {
  // In a real app, you would use a library like music-metadata to get actual duration
  // For simplicity, we'll return a random duration between 2-5 minutes
  return Math.floor(Math.random() * (300 - 120 + 1) + 120);
};

// Helper function to extract title, artist and album from filename
const parseFilename = (filename) => {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Try to parse artist - title format
  const match = nameWithoutExt.match(/^(.*?)\s*-\s*(.*?)$/);
  
  if (match) {
    return {
      artist: match[1].trim(),
      title: match[2].trim(),
      album: ''
    };
  }
  
  // If no artist - title format, just use the filename as title
  return {
    artist: '',
    title: nameWithoutExt,
    album: ''
  };
};

// Get all songs
router.get('/', async (req, res, next) => {
  try {
    // Check the /songs directory for new files
    const songsDir = path.join(__dirname, '../../public/songs');
    if (fs.existsSync(songsDir)) {
      const files = fs.readdirSync(songsDir);
      
      for (const file of files) {
        if (path.extname(file).toLowerCase() === '.mp3') {
          // Check if song already exists in database
          const existingSong = await Song.findOne({ filename: file });
          if (!existingSong) {
            const filePath = path.join(songsDir, file);
            const duration = getMp3Duration(filePath);
            const { title, artist, album } = parseFilename(file);
            
            // Create new song record
            const newSong = new Song({
              title,
              artist,
              album,
              duration,
              path: file,
              filename: file
            });
            
            await newSong.save();
          }
        }
      }
    }
    
    // Fetch all songs from database
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
});

// Get a single song
router.get('/:id', async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.json(song);
  } catch (error) {
    next(error);
  }
});

export default router;