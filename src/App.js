import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import './App.scss';
import RecentlyPlayed from './pages/Recplayed/RecentlyPlayed';
import Toptrack from './pages/TopTracks/Toptrack';

function App() {
  return (
    <MusicProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/top-tracks" element={<Toptrack />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recently-played" element={<RecentlyPlayed />} />
          </Routes>
        </Layout>
      </Router>
    </MusicProvider>
  );
}

export default App;