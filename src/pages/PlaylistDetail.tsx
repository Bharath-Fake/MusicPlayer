import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Music, ArrowLeft, Play, Trash } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { usePlayer } from '../contexts/PlayerContext';
import SongList from '../components/songs/SongList';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playlists, fetchPlaylists, removeSongFromPlaylist, deletePlaylist, loading } = useMusic();
  const { playAll } = usePlayer();
  const [playlist, setPlaylist] = useState<any>(null);

  useEffect(() => {
    if (playlists.length === 0) {
      fetchPlaylists();
    } else {
      const found = playlists.find(p => p._id === id);
      if (found) {
        setPlaylist(found);
      } else {
        navigate('/playlists');
      }
    }
  }, [id, playlists]);

  const handleRemoveSong = async (songId: string) => {
    if (!id) return;
    
    try {
      await removeSongFromPlaylist(id, songId);
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylist(id);
        navigate('/playlists');
      } catch (error) {
        console.error('Error deleting playlist:', error);
      }
    }
  };

  const handlePlayAll = () => {
    if (!playlist || playlist.songs.length === 0) return;
    playAll(playlist.songs);
  };

  if (loading || !playlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/playlists')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Playlist: {playlist.name}</h1>
      </div>

      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 mb-6 flex flex-col sm:flex-row items-center">
        <div className="w-24 h-24 bg-indigo-200 rounded-lg flex items-center justify-center text-indigo-500 flex-shrink-0 mb-4 sm:mb-0">
          <Music size={36} />
        </div>
        <div className="sm:ml-6 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-900">{playlist.name}</h2>
          <p className="text-gray-600 mt-1">{playlist.songs.length} songs</p>
          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
            <button
              onClick={handlePlayAll}
              disabled={playlist.songs.length === 0}
              className="px-4 py-2 flex items-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={16} className="mr-2" />
              Play All
            </button>
            
            <button
              onClick={handleDeletePlaylist}
              className="px-4 py-2 flex items-center bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50"
            >
              <Trash size={16} className="mr-2" />
              Delete Playlist
            </button>
          </div>
        </div>
      </div>

      {playlist.songs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <Music size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No songs in this playlist</h2>
          <p className="text-gray-600 mb-4">
            Add songs to this playlist from your library.
          </p>
        </div>
      ) : (
        <SongList
          songs={playlist.songs}
          playlistId={playlist._id}
          onRemoveFromPlaylist={handleRemoveSong}
        />
      )}
    </div>
  );
};

export default PlaylistDetail;