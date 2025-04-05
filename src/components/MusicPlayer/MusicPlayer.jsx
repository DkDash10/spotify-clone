import React, { useContext, useState, useEffect } from 'react';
import { Container, ProgressBar, Button, Dropdown } from 'react-bootstrap';
import { MusicContext } from '../../context/MusicContext';
import './MusicPlayer.scss';
import Fav from "../../assets/icons/favorites.png";
import { extractDominantColor } from '../../utils/extractDominantColor ';

const MusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    playNextSong, 
    playPrevSong,
    audioRef,
    toggleFavorite, 
    favorites,
    togglePlayPause
  } = useContext(MusicContext);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isFavorite = favorites.some(fav => fav?.id === currentSong?.id);

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const toggleExpand = (e) => {
    if (e) e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', playNextSong);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', playNextSong);
    };
  }, [audioRef, playNextSong]);
  
  const handleProgressChange = (newValue) => {
    const audio = audioRef.current;
    audio.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const applyBackgroundGradient = async () => {
      if (!currentSong?.thumbnail) {
        document.body.style.background = 'linear-gradient(120deg, rgba(33, 43, 62, 1) 0%, rgba(0, 0, 0, 1) 100%)';
        return;
      }
  
      try {
        const [r, g, b] = await extractDominantColor(currentSong.thumbnail);
  
        // Create a darkened version of the color
        const darkColor = `rgba(${r * 0.5}, ${g * 0.5}, ${b * 0.5}, 1)`;
        const darkFade = `rgba(${r * 0.25}, ${g * 0.25}, ${b * 0.25}, 1)`;
  
        document.body.style.background = `linear-gradient(135deg, ${darkColor}, ${darkFade})`;
        document.body.style.transition = 'background 0.5s ease-in-out';
      } catch (err) {
        console.error('Color extraction failed:', err);
        document.body.style.background = 'linear-gradient(120deg, rgba(33, 43, 62, 1) 0%, rgba(0, 0, 0, 1) 100%)';
      }
    };
  
    applyBackgroundGradient();
  }, [currentSong]);

  // Mobile expanded view
  if (isExpanded) {
    return (
      <div className="expanded-music-player">
        <div className="player-header">
          <Button 
            variant="link" 
            className="close-btn"
            onClick={toggleExpand}
          >
            <i className="bi bi-chevron-down"></i>
          </Button>
        </div>
        
        <Container fluid>
          <div className="player-content">
            <img 
              src={currentSong.thumbnail} 
              alt={currentSong.title} 
              className="expanded-thumbnail" 
            />
            
            <div className="expanded-details">
              <h2 className="expanded-title">{currentSong.title}</h2>
              <p className="expanded-artist">{currentSong.artistName}</p>
            </div>
            
            <div className="progress-container">
              <span className="time">{formatTime(currentTime)}</span>
              <ProgressBar 
                now={currentTime} 
                max={duration || 1} 
                className="song-progress"
                variant="success"
                onClick={(e) => {
                  const clickPosition = e.nativeEvent.offsetX;
                  const progressBarWidth = e.currentTarget.offsetWidth;
                  const newTime = (clickPosition / progressBarWidth) * duration;
                  handleProgressChange(newTime);
                }}
              />
              <span className="time">{formatTime(duration)}</span>
            </div>
            
            <div className="controls">
              <Button variant="link" onClick={playPrevSong}>
                <i className="bi bi-skip-backward-fill"></i>
              </Button>
              
              <Button 
                variant="link" 
                className="play-pause-btn"
                onClick={togglePlayPause}
              >
                <i className={`bi ${isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}></i>
              </Button>
              
              <Button variant="link" onClick={playNextSong}>
                <i className="bi bi-skip-forward-fill"></i>
              </Button>
            </div>
            
            <div className="additional-controls">
              <Button variant="link" onClick={toggleMute} className="song-options">
                <i className={`bi ${isMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
              </Button>
              
              <div className="p-0" onClick={() => toggleFavorite(currentSong.id)}>
                <div onClick={(e) => e.stopPropagation()}>
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id={`dropdown-${currentSong.id}`} className="song-options">
                      <img src={Fav} alt="FavortiesIcon" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => toggleFavorite(currentSong.id)}>
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  
  // Desktop view and Mobile mini player
  if (!currentSong) {
    return (
      <div className="music-player empty-player">
        <p>Select a song to play</p>
      </div>
    );
  }
  
  return (
    <>
      {/* Desktop View */}
      <div className="music-player desktop-player">
        <Container fluid>
          <div className='p-2'>
            <div className="song-info">
              <div className="details">
                <p className="details-title">{currentSong.title}</p>
                <p className="details-artist">{currentSong.artistName}</p>
              </div>
              <img 
                src={currentSong.thumbnail} 
                alt={currentSong.title} 
                className="thumbnail" 
              />
            </div>
            
            <div className="controls-container">
              <div className="progress-container">
                <ProgressBar 
                  now={currentTime} 
                  max={duration || 1} 
                  className="song-progress"
                  variant="success"
                  onClick={(e) => {
                    const clickPosition = e.nativeEvent.offsetX;
                    const progressBarWidth = e.currentTarget.offsetWidth;
                    const newTime = (clickPosition / progressBarWidth) * duration;
                    handleProgressChange(newTime);
                  }}
                />
              </div>
              <div className='d-flex justify-content-between w-100'>
                <div>
                  <div className='p-0' onClick={() => toggleFavorite(currentSong.id)}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" id={`dropdown-${currentSong.id}`} className="song-options">
                          <img src={Fav} alt="FavortiesIcon" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => toggleFavorite(currentSong.id)}>
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className="controls">
                  <Button variant="link" onClick={playPrevSong}>
                    <i className="bi bi-skip-backward-fill"></i>
                  </Button>
                  
                  <Button 
                    variant="link" 
                    className="play-pause-btn"
                    onClick={togglePlayPause}
                  >
                    <i className={`bi ${isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}></i>
                  </Button>
                  
                  <Button variant="link" onClick={playNextSong}>
                    <i className="bi bi-skip-forward-fill"></i>
                  </Button>
                </div>
                <div className="volume-container">
                  <Button variant="link" onClick={toggleMute} className="song-options">
                    <i className={`bi ${isMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Mini Player */}
      <div className="mini-music-player" onClick={toggleExpand}>
        <div className="mini-progress">
          <ProgressBar 
            now={currentTime} 
            max={duration || 1} 
            className="mini-progress-bar"
          />
        </div>
        <img 
          src={currentSong.thumbnail} 
          alt={currentSong.title} 
          className="mini-thumbnail" 
        />
        <div className="mini-details">
          <p className="mini-title">{currentSong.title}</p>
          <p className="mini-artist">{currentSong.artistName}</p>
        </div>
        <div className="mini-controls">
          <Button 
            variant="link" 
            className="mini-play-btn"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
          >
            <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
          </Button>
          <Button 
            variant="link" 
            className="mini-close-btn"
            onClick={toggleExpand}
          >
            <i className="bi bi-chevron-up"></i>
          </Button>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;