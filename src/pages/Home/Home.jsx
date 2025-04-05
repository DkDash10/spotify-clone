import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MusicContext } from '../../context/MusicContext';
import SongList from '../../components/SongList/Songlist';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.scss';

const Home = () => {
  const { songs, filteredSongs, searchQuery } = useContext(MusicContext);
  const displayedSongs = searchQuery ? filteredSongs : songs;
  const hasResults = displayedSongs && displayedSongs.length > 0;
  
  return (
    <Container fluid className="home-page">
      <p className="home-page-title">For You</p>
      <Row>
        <Col xs={12}>
          <SearchBar />
        </Col>
      </Row>
      
      <Row>
        <Col xs={12}>
          {hasResults ? (
            <SongList 
              songs={displayedSongs} 
              title={searchQuery ? `Search results for "${searchQuery}"` : "All Songs"} 
            />
          ) : (
            <div className="empty-search">
              <p>No songs available</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;