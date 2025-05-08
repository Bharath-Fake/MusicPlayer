import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Song, useMusic } from '../contexts/MusicContext';
import { Plus, Check, ArrowLeft } from 'lucide-react';

const AddToPlaylistPage: React.FC = () => {
  const { playlists, createPlaylist, addSongToPlaylist, fetchPlaylists } = useMusic();
  const location = useLocation();
  const navigate = useNavigate();
  const song: Song = location.state?.song;

  const [search, setSearch] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!song) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">No song provided.</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-blue-600 underline">Go back</button>
      </div>
    );
  }

  const filteredPlaylists = playlists.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToPlaylist = async (playlistId: string, playlistName: string) => {
    setIsLoading(true);
    try {
      await addSongToPlaylist(playlistId, song._id);
      await fetchPlaylists();
      setMessage({ text: `Added to "${playlistName}"`, isError: false });
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || 'Failed to add song',
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      setMessage({ text: 'Playlist name cannot be empty', isError: true });
      return;
    }
    setIsLoading(true);
    try {
      const newPlaylist = await createPlaylist(newPlaylistName);
      await addSongToPlaylist(newPlaylist._id, song._id);
      await fetchPlaylists();
      setMessage({ text: `Created and added to "${newPlaylistName}"`, isError: false });
      setNewPlaylistName('');
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || 'Failed to create playlist',
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-600 mb-4">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <h2 className="text-xl font-semibold mb-4">Add "{song.title}" to Playlist</h2>

      {message && (
        <div className={`p-3 rounded mb-4 ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.isError ? message.text : (
            <div className="flex items-center gap-2">
              <Check size={18} /> {message.text}
            </div>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Search playlists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="space-y-2 mb-6">
        {filteredPlaylists.length === 0 ? (
          <p className="text-sm text-gray-500">No playlists found</p>
        ) : (
          filteredPlaylists.map((playlist) => (
            <button
              key={playlist._id}
              disabled={isLoading}
              onClick={() => handleAddToPlaylist(playlist._id, playlist.name)}
              className="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-gray-100 text-sm border"
            >
              <span>{playlist.name}</span>
              <span className="text-xs text-gray-400">{playlist.songs.length} songs</span>
            </button>
          ))
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-2">Create New Playlist</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist name"
            className="flex-1 border p-2 rounded"
            disabled={isLoading}
          />
          <button
            onClick={handleCreatePlaylist}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistPage;
