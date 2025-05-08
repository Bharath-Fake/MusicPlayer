import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import PlaylistCard from '../components/playlists/PlaylistCard';
import PlaylistForm from '../components/playlists/PlaylistForm';

const Playlists: React.FC = () => {
  const { playlists, fetchPlaylists, createPlaylist, deletePlaylist, loading } = useMusic();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (name: string) => {
    try {
      await createPlaylist(name);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    try {
      await deletePlaylist(id);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Playlists</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <PlusCircle size={16} className="mr-2" />
          Create Playlist
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <PlaylistForm 
            onSubmit={handleCreatePlaylist} 
            onCancel={() => setShowCreateForm(false)} 
          />
        </div>
      )}

      {playlists.length === 0 && !showCreateForm ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-4">
            <PlusCircle size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">No playlists yet</h2>
          <p className="text-gray-600 mb-4">
            Create your first playlist to organize and enjoy your music collection.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              onDelete={handleDeletePlaylist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;