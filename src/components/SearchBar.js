import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [isActive, setIsActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearchToggle = (event) => {
    event.preventDefault();
    setIsActive(!isActive);
    if (!isActive) {
      // If opening the search bar
      setTimeout(() => {
        document.querySelector('.search-input')?.focus();
      }, 500);
    } else {
      // If closing the search bar
      setSearchText('');
      onSearch && onSearch('');
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    onSearch && onSearch(e.target.value);
  };

  return (
    <div className={`search-wrapper ${isActive ? 'active' : ''}`}>
      <div className="input-holder">
        <input
          type="text"
          className="search-input"
          placeholder="Enter passenger's name"
          value={searchText}
          onChange={handleSearch}
        />
        <button className="search-icon" onClick={handleSearchToggle}>
          <span></span>
        </button>
      </div>
      <span className="close" onClick={handleSearchToggle}></span>
    </div>
  );
};

export default SearchBar;