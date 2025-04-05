import React,{useContext} from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { MusicContext } from '../../context/MusicContext';
import SongList from '../../components/SongList/Songlist';
import './RecentlyPlayed.scss';


const RecentlyPlayed = () => {
    const { recentlyPlayed } = useContext(MusicContext);
    return (
        <Container fluid className='recently-played'>
            <p className="home-page-title">Recently Played</p>
            {recentlyPlayed.length > 0 && (
                <Row className="mb-4">
                <Col xs={12}>
                    <SongList songs={recentlyPlayed} title="Recently Played" />
                </Col>
                </Row>
            )} 
        </Container>
    )
}

export default RecentlyPlayed