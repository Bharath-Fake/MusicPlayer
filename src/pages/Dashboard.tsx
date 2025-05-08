import React, { useEffect } from 'react';
import { Music, ListMusic, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContext';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import SongList from '../components/songs/SongList';

const Dashboard: React.FC = () => {
  const { songs, playlists, loading, fetchSongs } = useMusic();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchSongs();
  }, []);

  const recentSongs = songs.slice(0, 10);
  const recentPlaylists = playlists.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Enjoy your personal music collection</p>
      </div>

      {songs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <Music size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No songs found</h2>
          <p className="text-gray-600 mb-4">
            Add MP3 files to the /public/songs folder to start listening.
          </p>
        </div>
      ) : (
        <>
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recently Added</h2>
              <Link to="/search" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all
              </Link>
            </div>
            <SongList songs={recentSongs} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Playlists</h2>
              <Link to="/playlists" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all
              </Link>
            </div>
            
            {playlists.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
                <ListMusic size={36} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
                <p className="text-gray-600 mb-4">Create your first playlist to organize your music</p>
                <Link 
                  to="/playlists" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Playlist
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPlaylists.map(playlist => (
                  <Link 
                    to={`/playlists/${playlist._id}`}
                    key={playlist._id} 
                    className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-24 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                      <ListMusic size={36} className="text-indigo-300" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Play size={18} className="ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{playlist.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{playlist.songs.length} songs</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;