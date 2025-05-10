import React, { useRef, useEffect } from 'react';
import { Trash2} from 'lucide-react';

interface PlaylistMenuProps {
  playlistId: string;
  onDelete: () => void;
  onClose: () => void;
}

const PlaylistMenu: React.FC<PlaylistMenuProps> = ({ onDelete, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this playlist?')) {
      onDelete();
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleDelete}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
      >
        <Trash2 size={16} className="mr-2" />
        Delete playlist
      </button>
    </div>
  );
};

export default PlaylistMenu;