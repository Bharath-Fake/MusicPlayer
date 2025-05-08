import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ListMusic, User, LogOut, Menu, X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMusic } from '../../contexts/MusicContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { playlists } = useMusic();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Use environment variable for API URL with fallback

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('song', selectedFile);

    try {
      const response = await fetch(`${API_URL}/upload`, { // Use API_URL from environment variable
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Song uploaded successfully please refresh the page');
        setSelectedFile(null);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Error uploading song');
    }
  };

  const sidebarClasses = `bg-gradient-to-b from-indigo-900 to-indigo-800 text-white fixed md:static inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`;

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-indigo-600 text-white shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <button
        className="hidden md:flex fixed top-4 left-4 z-30 p-2 rounded-full bg-indigo-600 text-white shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className={sidebarClasses}>
        <div className="p-4 flex items-center">
          <ListMusic size={24} className="text-indigo-300" />
          <h1 className="ml-2 text-xl font-bold">MelodyStream</h1>
        </div>

        <div className="mt-2">
          <div className="p-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg ${
                  isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'
                }`
              }
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Home size={20} className="mr-3" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg mt-2 ${
                  isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'
                }`
              }
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Search size={20} className="mr-3" />
              <span>Search</span>
            </NavLink>

            <NavLink
              to="/playlists"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg mt-2 ${
                  isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'
                }`
              }
              onClick={() => isMobile && setIsOpen(false)}
            >
              <ListMusic size={20} className="mr-3" />
              <span>Playlists</span>
            </NavLink>
          </div>

          {Array.isArray(playlists) && playlists.length > 0 && (
            <div className="p-4 border-t border-indigo-700">
              <h3 className="text-sm font-semibold uppercase text-indigo-300 mb-2">
                Your Playlists
              </h3>
              <div className="max-h-48 overflow-y-auto">
                {playlists.map((playlist) => (
                  <NavLink
                    key={playlist._id}
                    to={`/playlists/${playlist._id}`}
                    className={({ isActive }) =>
                      `py-1 px-4 text-sm block rounded-lg ${
                        isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'
                      }`
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    {playlist.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="ml-2">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
            </div>
          </div>
          {/* Upload Song Button */}
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-indigo-700 hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              <Upload size={16} className="mr-2" />
              <span>Upload Song Here</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile && <p className="text-sm mt-2 text-indigo-300">{selectedFile.name}</p>}
            <button
              onClick={handleUpload}
              className="w-full mt-2 py-2 px-4 rounded-lg bg-indigo-700 hover:bg-indigo-600 transition-colors"
            >
              Upload
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-indigo-700 hover:bg-indigo-600 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
