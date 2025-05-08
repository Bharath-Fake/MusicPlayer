import express from 'express';
import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware for all routes
router.use(auth);

// Get all playlists for the current user
router.get('/', async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ userId: req.userId }).populate('songs');
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

// Create a new playlist
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    
    const playlist = new Playlist({
      name,
      userId: req.userId,
      songs: []
    });
    
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
});

// Get a single playlist
router.get('/:id', async (req, res, next) => {
  try {
    const playlist = await Playlist.findOne({ 
      _id: req.params.id,
      userId: req.userId
    }).populate('songs');
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

// Update a playlist
router.put('/:id', async (req, res, next) => {
  try {
    const { name, songs } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (songs) updates.songs = songs;
    
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true }
    ).populate('songs');
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

// Delete a playlist
router.delete('/:id', async (req, res, next) => {
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Add a song to a playlist
router.post('/:id/songs', async (req, res, next) => {
  try {
    const { songId } = req.body;
    
    // Find the playlist
    const playlist = await Playlist.findOne({ 
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Check if song is already in the playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }
    
    // Add song to playlist
    playlist.songs.push(songId);
    await playlist.save();
    
    // Return updated playlist with populated songs
    const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');
    res.json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
});

// Remove a song from a playlist
router.delete('/:id/songs/:songId', async (req, res, next) => {
  try {
    const playlist = await Playlist.findOne({ 
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Remove song from playlist
    const songIndex = playlist.songs.findIndex(id => id.toString() === req.params.songId);
    if (songIndex === -1) {
      return res.status(404).json({ message: 'Song not found in playlist' });
    }
    
    playlist.songs.splice(songIndex, 1);
    await playlist.save();
    
    // Return updated playlist with populated songs
    const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');
    res.json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
});

export default router;