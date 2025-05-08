import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-indigo-600">404</h1>
        <p className="mt-3 text-2xl font-semibold text-gray-900">Page not found</p>
        <p className="mt-4 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
        
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Home size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;