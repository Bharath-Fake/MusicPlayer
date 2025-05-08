import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Song {
  _id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  path: string;
  filename: string;
}

export interface Playlist {
  _id: string;
  name: string;
  userId: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

interface MusicContextType {
  songs: Song[];
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  fetchSongs: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<Playlist>;
  updatePlaylist: (playlistId: string, data: { name?: string; songs?: string[] }) => Promise<Playlist>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<Playlist>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<Playlist>;
  searchSongs: (query: string) => Song[];
  searchPlaylists: (query: string) => Playlist[];
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (user) {
      fetchSongs();
      fetchPlaylists();
    }
  }, [user]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/songs`, { withCredentials: true });
      setSongs(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/playlists`, { withCredentials: true });
      setPlaylists(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (name: string): Promise<Playlist> => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/playlists`, { name }, { withCredentials: true });
      setPlaylists([...playlists, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlaylist = async (playlistId: string, data: { name?: string; songs?: string[] }): Promise<Playlist> => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/playlists/${playlistId}`, data, { withCredentials: true });
      setPlaylists(playlists.map(p => p._id === playlistId ? response.data : p));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (playlistId: string): Promise<void> => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/playlists/${playlistId}`, { withCredentials: true });
      setPlaylists(playlists.filter(p => p._id !== playlistId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addSongToPlaylist = async (playlistId: string, songId: string): Promise<Playlist> => {
    if (!playlistId || !songId) {
      console.error('Missing required parameters:', { playlistId, songId });
      throw new Error('Missing required parameters');
    }

    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_URL}/playlists/${playlistId}/songs`,
        { songId },
        { withCredentials: true }
      );
      
      console.log('song added to Playlist');
      
      // Update the playlist with the new song
      const updatedPlaylist = response.data;
      setPlaylists(prevPlaylists => {
        const newPlaylists = prevPlaylists.map(p => 
          p._id === playlistId 
            ? { ...p, songs: updatedPlaylist.songs } 
            : p
        );
        return newPlaylists;
      });
      
      return updatedPlaylist;
    } catch (err: any) {
      console.error('Error in addSongToPlaylist:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add song to playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string): Promise<Playlist> => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_URL}/playlists/${playlistId}/songs/${songId}`,
        { withCredentials: true }
      );
      
      // Update the playlist by removing the song
      const updatedPlaylist = response.data;
      setPlaylists(prevPlaylists => 
        prevPlaylists.map(p => 
          p._id === playlistId 
            ? { ...p, songs: updatedPlaylist.songs } 
            : p
        )
      );
      
      return updatedPlaylist;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove song from playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchSongs = (query: string): Song[] => {
    if (!query.trim()) return songs;
    const lowercasedQuery = query.toLowerCase();
    return songs.filter(song => 
      song.title.toLowerCase().includes(lowercasedQuery) || 
      song.filename.toLowerCase().includes(lowercasedQuery) ||
      (song.artist && song.artist.toLowerCase().includes(lowercasedQuery)) ||
      (song.album && song.album.toLowerCase().includes(lowercasedQuery))
    );
  };

  const searchPlaylists = (query: string): Playlist[] => {
    if (!query.trim()) return playlists;
    const lowercasedQuery = query.toLowerCase();
    return playlists.filter(playlist => 
      playlist.name.toLowerCase().includes(lowercasedQuery)
    );
  };

  return (
    <MusicContext.Provider 
      value={{ 
        songs, 
        playlists, 
        loading, 
        error, 
        fetchSongs, 
        fetchPlaylists, 
        createPlaylist, 
        updatePlaylist, 
        deletePlaylist, 
        addSongToPlaylist, 
        removeSongFromPlaylist,
        searchSongs,
        searchPlaylists
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};