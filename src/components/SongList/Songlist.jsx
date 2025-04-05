import React, { useContext } from 'react';
import { MusicContext } from '../../context/MusicContext';
import './SongList.scss';

const Songlist = ({ songs, title }) => {
  const { currentSong, isPlaying, playSong, pauseSong} = useContext(MusicContext);
  
  return (
    <div className="song-list">
      <div className="songs-table">
        <div className="tbody">
          {songs.map((song, index) => {
            const isActive = currentSong && currentSong.id === song.id;

            const defaultClass = 'tr';
            const conditionalClass = isActive ? 'active' : '';

            return (
              <div
                key={song.id} 
                className={`${defaultClass} ${conditionalClass}`}
                onClick={() => isActive && isPlaying ? pauseSong() : playSong(song)}
              >
                <div className="song-info">
                  <div className='d-flex justify-content-between gap-4'>
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="song-thumbnail" 
                    />
                    <div className='d-flex flex-column'>
                      <span className="song-title">{song.title}</span>
                      <span className="song-artist">{song.artistName}</span>
                    </div>
                  </div>
                  <span className="song-duration">{song.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {songs.length === 0 && (
        <div className="no-songs">
          <p>No songs found</p>
        </div>
      )}
    </div>
  );
};

export default Songlist;