import React from 'react';
import { Music, Play, MoreHorizontal } from 'lucide-react';
import { Song } from '../../contexts/MusicContext';
import { usePlayer } from '../../contexts/PlayerContext';
import SongMenu from './SongMenu';

interface SongListProps {
  songs: Song[];
  playlistId?: string;
  onRemoveFromPlaylist?: (songId: string) => void;
}

const SongList: React.FC<SongListProps> = ({ 
  songs, 
  playlistId,
  onRemoveFromPlaylist 
}) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {songs.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-gray-500">
          <Music size={48} className="text-gray-300 mb-4" />
          <p className="text-center">No songs found</p>
        </div>
      ) : (
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-12 gap-4">
            <div className="col-span-6 sm:col-span-5 flex items-center"># Title</div>
            <div className="col-span-4 sm:col-span-3 hidden sm:flex items-center">Artist</div>
            <div className="col-span-2 sm:col-span-3 flex justify-end items-center">Duration</div>
            <div className="col-span-0 sm:col-span-1"></div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {songs.map((song, index) => {
              const isCurrentSong = currentSong?._id === song._id;
              
              return (
                <div 
                  key={song._id} 
                  className={`px-6 py-4 grid grid-cols-12 gap-4 hover:bg-gray-50 transition-colors relative ${
                    isCurrentSong ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="col-span-6 sm:col-span-5 flex items-center">
                    <div 
                      className={`w-8 h-8 mr-3 rounded-md flex items-center justify-center group relative cursor-pointer ${
                        isCurrentSong ? 'bg-indigo-100 text-indigo-500' : 'bg-gray-100 text-gray-500'
                      }`}
                      onClick={() => playSong(song)}
                    >
                      <span className={`group-hover:hidden ${isCurrentSong && isPlaying ? 'hidden' : 'block'}`}>
                        {index + 1}
                      </span>
                      <Play size={16} className={`group-hover:block ${isCurrentSong && isPlaying ? 'block' : 'hidden'}`} />
                    </div>
                    <div>
                      <p className={`font-medium text-sm truncate ${isCurrentSong ? 'text-indigo-600' : 'text-gray-900'}`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{song.album || 'Unknown Album'}</p>
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-3 hidden sm:flex items-center">
                    <p className="text-sm text-gray-500 truncate">{song.artist || 'Unknown Artist'}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-3 flex justify-end items-center">
                    <p className="text-sm text-gray-500">{formatDuration(song.duration)}</p>
                  </div>
                  <div className="col-span-0 sm:col-span-1 flex justify-end items-center">
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === song._id ? null : song._id)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {menuOpen === song._id && (
                        <div className="absolute right-0 z-50" style={{ bottom: '100%', marginBottom: '0.5rem' }}>
                          <SongMenu 
                            song={song}
                            onClose={() => setMenuOpen(null)}
                            playlistId={playlistId}
                            onRemove={onRemoveFromPlaylist}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongList;