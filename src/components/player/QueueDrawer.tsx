import React from 'react';
import { X, Music } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { currentSong, queue, removeFromQueue, playSong, clearQueue } = usePlayer();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      ></div>
      
      <div className="fixed top-0 right-0 bottom-0 w-80 md:w-96 bg-white z-40 shadow-lg transform transition-transform duration-300 ease-in-out overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Play Queue</h2>
          <div>
            <button 
              onClick={clearQueue}
              className="text-sm text-indigo-600 hover:text-indigo-800 mr-4"
              disabled={queue.length === 0}
            >
              Clear
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {currentSong && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Now Playing</h3>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-500 flex-shrink-0">
                  <Music size={16} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium truncate">{currentSong.title}</p>
                  <p className="text-sm text-gray-500 truncate">{currentSong.artist || 'Unknown Artist'}</p>
                </div>
              </div>
            </div>
          )}
          
          {queue.length > 0 ? (
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase p-4 pb-2">Up Next</h3>
              {queue.map((song, index) => (
                <div 
                  key={`${song._id}-${index}`}
                  className="px-4 py-2 hover:bg-gray-50 flex items-center"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 flex-shrink-0">
                    <Music size={14} />
                  </div>
                  <div 
                    className="ml-3 flex-1 cursor-pointer"
                    onClick={() => {
                      playSong(song);
                      removeFromQueue(index);
                    }}
                  >
                    <p className="font-medium text-sm truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 truncate">{song.artist || 'Unknown Artist'}</p>
                  </div>
                  <button 
                    onClick={() => removeFromQueue(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
              <Music size={48} className="text-gray-300 mb-4" />
              <p className="text-center">Your queue is empty</p>
              <p className="text-center text-sm mt-2">Add songs to your queue from playlists or the search page</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QueueDrawer;