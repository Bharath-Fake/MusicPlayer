import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration, onSeek }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const seekTime = percentage * duration;
    onSeek(seekTime);
  };

  return (
    <div 
      className="h-1 bg-gray-200 cursor-pointer group"
      onClick={handleSeek}
    >
      <div 
        className="h-full bg-indigo-600 group-hover:bg-indigo-500 relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
};

export default ProgressBar;