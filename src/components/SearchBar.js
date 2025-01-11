import React, { useState, useRef } from 'react';

const SearchBar = ({ onSearch }) => {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  const toggleSearch = (e) => {
    e.preventDefault();
    setIsActive(!isActive);
    if (!isActive) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    } else {
      setSearchQuery('');
      onSearch('');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className={`search-wrapper ${isActive ? 'active' : ''}`} style={{
      position: 'relative',
      margin: '20px auto'
    }}>
      <div className="input-holder" style={{
        height: '70px',
        width: isActive ? '450px' : '70px',
        overflow: 'hidden',
        backgroundColor: isActive ? 'rgba(0,0,0,0.05)' : 'transparent',
        borderRadius: isActive ? '50px' : '6px',
        position: 'relative',
        transition: 'all .5s cubic-bezier(0.000, 0.105, 0.035, 1.570)'
      }}>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Enter passenger's name"
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: '100%',
            height: '50px',
            padding: '0px 70px 0 20px',
            opacity: isActive ? 1 : 0,
            position: 'absolute',
            top: '0px',
            left: '0px',
            background: 'transparent',
            boxSizing: 'border-box',
            border: 'none',
            outline: 'none',
            fontFamily: '"Open Sans", Arial, Verdana',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '20px',
            color: '#212121',
            transform: isActive ? 'translate(0, 10px)' : 'translate(0, 60px)',
            transition: 'all .3s cubic-bezier(0.000, 0.105, 0.035, 1.570)',
            transitionDelay: '0.3s'
          }}
        />
        <button 
          className="search-icon" 
          onClick={toggleSearch}
          style={{
            width: isActive ? '50px' : '70px',
            height: isActive ? '50px' : '70px',
            border: 'none',
            borderRadius: isActive ? '30px' : '6px',
            background: '#FFF',
            padding: '0px',
            outline: 'none',
            position: 'relative',
            zIndex: 2,
            float: 'right',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            margin: isActive ? '10px' : '0px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{
            width: '22px',
            height: '22px',
            display: 'inline-block',
            verticalAlign: 'middle',
            position: 'relative',
            transform: isActive ? 'rotate(-45deg)' : 'rotate(45deg)',
            transition: 'all .4s cubic-bezier(0.650, -0.600, 0.240, 1.650)'
          }}>
            <span style={{
              position: 'absolute',
              width: '4px',
              height: '11px',
              left: '9px',
              top: '18px',
              borderRadius: '2px',
              background: '#FE5F55'
            }}/>
            <span style={{
              position: 'absolute',
              width: '14px',
              height: '14px',
              left: '0px',
              top: '0px',
              borderRadius: '16px',
              border: '4px solid #FE5F55'
            }}/>
          </span>
        </button>
      </div>
      {isActive && (
        <span 
          className="close" 
          onClick={toggleSearch}
          style={{
            position: 'absolute',
            zIndex: 1,
            top: '24px',
            right: '-50px',
            width: '25px',
            height: '25px',
            cursor: 'pointer',
            transform: 'rotate(45deg)',
            transition: 'all .6s cubic-bezier(0.000, 0.105, 0.035, 1.570)'
          }}
        >
          <span style={{
            position: 'absolute',
            width: '5px',
            height: '25px',
            left: '10px',
            top: '0px',
            background: '#FE5F55',
            borderRadius: '2px'
          }}/>
          <span style={{
            position: 'absolute',
            width: '25px',
            height: '5px',
            left: '0px',
            top: '10px',
            background: '#FE5F55',
            borderRadius: '2px'
          }}/>
        </span>
      )}
    </div>
  );
};

export default SearchBar;