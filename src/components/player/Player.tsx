import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, List, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import QueueDrawer from './QueueDrawer';
import ProgressBar from './ProgressBar';
import SongMenu from '../songs/SongMenu';

const Player: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration, 
    volume,
    togglePlay, 
    playNext, 
    playPrevious, 
    seek, 
    setVolume 
  } = usePlayer();
  
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [showSongMenu, setShowSongMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSongMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-lg flex items-center justify-center text-gray-500">
        No song selected
      </div>
    );
  }
  
  return (
    <>
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <ProgressBar 
        currentTime={currentTime} 
        duration={duration} 
        onSeek={seek} 
      />
        
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center w-1/3">
            <div className="w-12 h-12 bg-indigo-100 rounded-md flex-shrink-0 flex items-center justify-center">
              <Play size={24} className="text-indigo-500" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="font-medium text-gray-800 truncate text-sm">{currentSong.title}</p>
              <p className="text-xs text-gray-500 truncate">{currentSong.artist || 'Unknown Artist'}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <button 
              onClick={playPrevious}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600"
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="mx-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            
            <button 
              onClick={playNext}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600"
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-end w-1/3">
            <div className="hidden sm:flex items-center">
              <button className="text-gray-600 hover:text-indigo-600 mr-2">
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-gray-300 rounded-full accent-indigo-600"
              />
            </div>
            
            <div className="text-xs text-gray-500 mx-4 hidden md:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={() => setIsQueueOpen(true)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600"
              >
                <List size={20} />
              </button>

              <div className="relative ml-2" ref={menuRef}>
                <button
                  onClick={() => setShowSongMenu(!showSongMenu)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600"
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {showSongMenu && (
                  <div className="absolute bottom-full right-0 mb-2">
                    <SongMenu 
                      song={currentSong}
                      onClose={() => setShowSongMenu(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
    </>
  );
};

export default Player;