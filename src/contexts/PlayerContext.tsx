import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import { Song } from './MusicContext';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  playAll: (songs: Song[]) => void;
  playRandom: (songs: Song[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        playNext();
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Update audio source when currentSong changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = `/songs/${currentSong.path}`;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      }
    }
  }, [currentSong]);

  // Update play state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const playAll = (songs: Song[]) => {
    if (songs.length === 0) return;
    
    // Clear existing queue
    clearQueue();
    
    // Play first song
    playSong(songs[0]);
    
    // Add rest to queue
    const remainingSongs = songs.slice(1);
    remainingSongs.forEach(song => addToQueue(song));
  };

  const playRandom = (songs: Song[]) => {
    if (songs.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex]);
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      setCurrentSong(nextSong);
      setIsPlaying(true);
    } else {
      // If no songs in queue, play random song
      const allSongs = [...queue, currentSong].filter(Boolean) as Song[];
      if (allSongs.length > 0) {
        playRandom(allSongs);
      }
    }
  };

  const playPrevious = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      // If current time is more than 3 seconds, restart the song
      audioRef.current.currentTime = 0;
    } else if (currentSong) {
      // For now, just restart the song since we don't track history
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
  };

  const removeFromQueue = (index: number) => {
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        queue,
        currentTime,
        duration,
        volume,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        addToQueue,
        removeFromQueue,
        clearQueue,
        seek,
        setVolume,
        playAll,
        playRandom,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};