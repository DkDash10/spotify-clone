import React, { useContext } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { MusicContext } from '../../context/MusicContext';
import './SearchBar.scss';
import SearchIcon from "../../assets/icons/search.png"

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useContext(MusicContext);
  
  return (
    <div className="search-bar">
      <InputGroup>
        <Form.Control
          placeholder="Search Song, Artist"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <InputGroup.Text 
            className="clear-search"
            onClick={() => setSearchQuery('')}
          >
            <i className="bi bi-x"></i>
          </InputGroup.Text>
        )}
          <InputGroup.Text>
            <img src={SearchIcon} className="search-bar-icon" alt="search" />
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
};

export default SearchBar;