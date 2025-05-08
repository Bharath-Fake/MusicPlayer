import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Song, useMusic } from '../../contexts/MusicContext';

interface AddToPlaylistModalProps {
  song: Song;
  onClose: () => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ song, onClose }) => {
  const { playlists, createPlaylist, addSongToPlaylist, fetchPlaylists } = useMusic();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToPlaylist = async (playlistId: string, playlistName: string) => {
    setMessage(null);
    setIsLoading(true);
    try {
      await addSongToPlaylist(playlistId, song._id);
      await fetchPlaylists();
      setMessage({ text: `Added to ${playlistName}`, isError: false });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error adding to playlist:', error);
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
    console.log('Creating playlist:', { newPlaylistName });
    setMessage(null);
    setIsLoading(true);
    try {
      const newPlaylist = await createPlaylist(newPlaylistName);
      await addSongToPlaylist(newPlaylist._id, song._id);
      await fetchPlaylists();
      setMessage({ text: `Created and added to "${newPlaylistName}"`, isError: false });
      setNewPlaylistName('');
      setIsCreating(false);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error creating playlist:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to create playlist',
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white w-full max-w-sm rounded-lg shadow-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Add to Playlist</h2>
          <button
            onClick={() => {
              onClose();
            }}
            disabled={isLoading}
            className="text-gray-600 hover:text-black"
          >
            <X size={24} />
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`text-center py-4 mb-4 rounded-md ${
              message.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}
          >
            {message.isError ? (
              <p>{message.text}</p>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-200 text-green-600 flex items-center justify-center mb-2">
                  <Check size={24} />
                </div>
                <p>{message.text}</p>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {!message?.isError && (
          <>
            {/* Playlist List */}
            <div className="max-h-64 overflow-y-auto space-y-1 mb-4">
              {playlists.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">No playlists yet</p>
              ) : (
                playlists.map((playlist) => (
                  <button
                    key={playlist._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToPlaylist(playlist._id, playlist.name);
                    }}
                    disabled={isLoading}
                    className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-md text-sm disabled:opacity-50"
                  >
                    <span className="truncate">{playlist.name}</span>
                    <span className="text-xs text-gray-400">{playlist.songs.length} songs</span>
                  </button>
                ))
              )}
            </div>

            {/* Create New Playlist */}
            {isCreating ? (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Playlist name"
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100"
                    disabled={isLoading}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreatePlaylist();
                    }}
                    disabled={!newPlaylistName.trim() || isLoading}
                    className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreating(false);
                    setNewPlaylistName('');
                    setMessage(null);
                  }}
                  disabled={isLoading}
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreating(true);
                }}
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-1 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                <Plus size={16} />
                Create new playlist
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddToPlaylistModal;