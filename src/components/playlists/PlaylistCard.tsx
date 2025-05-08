import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Play, MoreHorizontal } from 'lucide-react';
import { Playlist } from '../../contexts/MusicContext';
import PlaylistMenu from './PlaylistMenu';

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete: (id: string) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  
  const handleClick = () => {
    navigate(`/playlists/${playlist._id}`);
  };

  return (
    <div 
      className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 rounded-full bg-white bg-opacity-80 text-gray-700 hover:text-indigo-600 focus:outline-none"
        >
          <MoreHorizontal size={18} />
        </button>
        
        {showMenu && (
          <PlaylistMenu 
            playlistId={playlist._id} 
            onDelete={() => onDelete(playlist._id)} 
            onClose={() => setShowMenu(false)} 
          />
        )}
      </div>
      
      <div onClick={handleClick} className="h-full flex flex-col">
        <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
          <Music size={48} className="text-indigo-300" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Play size={20} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-gray-900 truncate">{playlist.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{playlist.songs.length} songs</p>
          <p className="text-xs text-gray-400 mt-auto">
            Created: {new Date(playlist.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;