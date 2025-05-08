import React, { useRef} from 'react';
import { ListPlus, ListX, Play, Plus } from 'lucide-react';
import { Song } from '../../contexts/MusicContext';
import { usePlayer } from '../../contexts/PlayerContext';
import AddToPlaylistModal from '../playlists/AddToPlaylistModal';


interface SongMenuProps {
  song: Song;
  onClose: () => void;
  playlistId?: string;
  onRemove?: (songId: string) => void;
}

const SongMenu: React.FC<SongMenuProps> = ({ song, onClose, playlistId, onRemove }) => {
  const { playSong, addToQueue } = usePlayer();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAddToPlaylist, setShowAddToPlaylist] = React.useState(false);


  const handlePlaySong = () => {
    playSong(song);
    onClose();
  };

  const handleAddToQueue = () => {
    addToQueue(song);
    onClose();
  };

  const handleRemove = () => {
    if (onRemove && playlistId) {
      onRemove(song._id);
      onClose();
    }
  };

  return (
    <>
      <div
        ref={menuRef}
        className="w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
      >
        <button
          onClick={handlePlaySong}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <Play size={16} className="mr-2" />
          Play now
        </button>
        <button
          onClick={handleAddToQueue}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add to queue
        </button>
        <button
          onClick={() => setShowAddToPlaylist(true)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <ListPlus size={16} className="mr-2" />
          Add to playlist
        </button>
        {playlistId && onRemove && (
          <button
            onClick={handleRemove}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <ListX size={16} className="mr-2" />
            Remove from playlist
          </button>
        )}
      </div>
      
      {showAddToPlaylist && (
        <AddToPlaylistModal 
          song={song} 
          onClose={() => {
            setShowAddToPlaylist(false);
            onClose();
          }} 
        />
      )}
    </>
  );
};

export default SongMenu;