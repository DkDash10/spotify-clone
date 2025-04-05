import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import songsData from '../data/songs';
import { saveRecentlyPlayed, getFavorites, saveFavorites } from '../utils/storageHelper';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [songs] = useState(songsData);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);

  const audioRef = useRef(new Audio());

  // Memoize playNextSong to avoid unnecessary re-renders
  const playNextSong = useCallback(() => {
    if (!currentSong) return;

    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  }, [currentSong, songs]);

  // Memoize updateRecentlyPlayed to avoid unnecessary re-renders
  const updateRecentlyPlayed = useCallback((song) => {
    const updatedRecent = [song, ...recentlyPlayed.filter(item => item.id !== song.id)].slice(0, 10);
    setRecentlyPlayed(updatedRecent);
    saveRecentlyPlayed(updatedRecent);
  }, [recentlyPlayed]);

  // Initialize favorites and recently played
  useEffect(() => {
    const storedFavorites = getFavorites();
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }

    const storedRecentlyPlayed = JSON.parse(sessionStorage.getItem('recentlyPlayed')) || [];
    setRecentlyPlayed(storedRecentlyPlayed);
  }, []);

  // Load audio src when currentSong changes
  useEffect(() => {
    const audio = audioRef.current;

    if (currentSong) {
      audio.src = currentSong.musicUrl;
    }

    const handleEnded = () => {
      playNextSong();
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, playNextSong]);

  // Control playback based on isPlaying and currentSong
  useEffect(() => {
    const audio = audioRef.current;

    if (!currentSong) return;

    if (isPlaying) {
      audio.play()
        .then(() => updateRecentlyPlayed(currentSong))
        .catch(err => console.error("Audio play error:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, updateRecentlyPlayed]);

  // Handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songs]);

  const toggleFavorite = (songId) => {
    const isFavorite = favorites.some(fav => fav.id === songId);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== songId);
    } else {
      const songToAdd = songs.find(song => song.id === songId);
      updatedFavorites = [...favorites, songToAdd];
    }

    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  const playSong = (song) => {
    if (song) {
      setCurrentSong(song);
    }
    setIsPlaying(true); // Play regardless of whether it's a new song or resume
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const playPrevSong = useCallback(() => {
    if (!currentSong) return;

    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  }, [currentSong, songs]);

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        updateRecentlyPlayed(currentSong);
      }).catch(err => {
        console.error("Play error:", err);
      });
    }
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        favorites,
        recentlyPlayed,
        searchQuery,
        filteredSongs,
        audioRef,
        setSearchQuery,
        playSong,
        pauseSong,
        playNextSong,
        playPrevSong,
        toggleFavorite,
        togglePlayPause
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};