import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import SongList from '../components/songs/SongList';

const Search: React.FC = () => {
  const { songs, playlists, loading, searchSongs, searchPlaylists } = useMusic();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(songs);

  useEffect(() => {
    if (query.trim()) {
      setSearchResults(searchSongs(query));
    } else {
      setSearchResults(songs);
    }
  }, [query, songs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search</h1>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search songs by title, artist, or album..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {query ? 'Search Results' : 'All Songs'}
        </h2>
        <SongList songs={searchResults} />
      </div>
    </div>
  );
};

export default Search;