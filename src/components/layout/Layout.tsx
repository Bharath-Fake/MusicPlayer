import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from '../player/Player';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 min-h-screen overflow-y-auto p-4 md:p-6 pb-24">
          <Outlet />
        </main>
      </div>
      {/* Ensure this wrapper div offsets the sidebar */}
      <div className="ml-0 md:ml-64">
        <Player />
      </div>
    </div>
  );
};

export default Layout;
