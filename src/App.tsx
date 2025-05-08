import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import { PlayerProvider } from './contexts/PlayerContext';
import PrivateRoute from './components/routes/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <PlayerProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="playlists" element={<Playlists />} />
                <Route path="playlists/:id" element={<PlaylistDetail />} />
                <Route path="search" element={<Search />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PlayerProvider>
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;