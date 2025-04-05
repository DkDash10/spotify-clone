import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import './Layout.scss';

const Layout = ({ children }) => {
  
  return (
    <div className="layout">
    <Sidebar /> {/* Always render it; handle display inside Sidebar.jsx */}
    <Container fluid>
      <Row>
        {/* Desktop Sidebar space (empty at small screens) */}
        <Col lg={2} className="sidebar-placeholder d-none d-lg-block"></Col>

        {/* Main Content */}
        <Col lg={4} className="content-container">
          <main>{children}</main>
        </Col>

        {/* Music Player */}
        <Col lg={6} className="music-container">
          <MusicPlayer />
        </Col>
      </Row>
    </Container>
  </div>
  );
};

export default Layout;