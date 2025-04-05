import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MusicContext } from '../../context/MusicContext';
import SongList from '../../components/SongList/Songlist';
import './Favorites.scss';

const Favorites = () => {
  const { favorites } = useContext(MusicContext);
  
  return (
    <Container fluid className="favorites-page">
      <p className="home-page-title">Favorites</p>
      <Row>
        <Col xs={12}>
          <SongList songs={favorites} title="Favorites" />
          
          {favorites.length === 0 && (
            <div className="empty-favorites">
              <p>You haven't added any favorites yet.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Favorites;