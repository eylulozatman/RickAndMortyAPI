import React, { useState, useEffect, useCallback } from 'react';
import './homepage.css';
import Header from './Components/Header';
import PagingBar from './Components/pagingBar';
import Footer from './Components/Footer';

const Homepage = () => {
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [filterBy, setFilterBy] = useState('random');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const firstSeen = useCallback(async (episodeUrl) => {
    try {
      const response = await fetch(episodeUrl);
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error('Error fetching episode name:', error);
      return 'Unknown';
    }
  }, []);

  const fetchRandomCharacters = useCallback(async () => {
    try {
      const totalCharacters = 826;
      const randomIds = new Set();

      while (randomIds.size < 6) {
        const randomId = Math.floor(Math.random() * totalCharacters) + 1;
        randomIds.add(randomId);
      }

      const data = await Promise.all(
        Array.from(randomIds).map(async (id) => {
          const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
          const character = await response.json();
          return character;
        })
      );

      const charactersWithDetails = await Promise.all(data.map(async (character) => {
        const episodeName = await firstSeen(character.episode[0]);
        return { ...character, firstSeen: episodeName };
      }));

      setCharacters(charactersWithDetails);
      setTotalPages(1); // Random function does not require paging
    } catch (error) {
      console.error('Error fetching random characters:', error);
    }
  }, [firstSeen]);

  const fetchCharacters = useCallback(async () => {
    try {
      let data = [];

      if (filterBy === 'location' && selectedLocation) {
        const response = await fetch(`https://rickandmortyapi.com/api/location/${selectedLocation}`);
        const location = await response.json();
        data = await Promise.all(location.residents.map(url => fetch(url).then(res => res.json())));
      } else if (filterBy === 'episode' && selectedEpisode) {
        const response = await fetch(`https://rickandmortyapi.com/api/episode/${selectedEpisode}`);
        const episode = await response.json();
        data = await Promise.all(episode.characters.map(url => fetch(url).then(res => res.json())));
      }

      if (selectedGender) {
        
        data = data.filter(character => character.gender === selectedGender);
      }

      if (data.length) {
        const charactersWithDetails = await Promise.all(data.map(async (character) => {
          const episodeName = await firstSeen(character.episode[0]);
          return { ...character, firstSeen: episodeName };
        }));

        const itemsPerPage = 6;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = charactersWithDetails.slice(startIndex, endIndex);

        setCharacters(paginatedData);
        setTotalPages(Math.ceil(charactersWithDetails.length / itemsPerPage));
      } else {
        console.error('Data fetched is not in the expected format:', data);
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  }, [filterBy, selectedLocation, selectedEpisode, selectedGender, firstSeen, currentPage]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/location');
      const data = await response.json();
      const locationNames = data.results.map(location => ({
        id: location.id,
        name: location.name
      }));
      setLocations(locationNames);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchEpisodes = async () => {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/episode');
      const data = await response.json();
      const episodeNames = data.results.map(episode => ({
        id: episode.id,
        name: episode.name
      }));
      setEpisodes(episodeNames);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  useEffect(() => {
    if (filterBy === 'random') {
      fetchRandomCharacters();
    } else {
      fetchCharacters();
    }
  }, [filterBy, selectedLocation, selectedEpisode, selectedGender, currentPage, fetchCharacters, fetchRandomCharacters]);
  
  
  useEffect(() => {
    fetchLocations();
    fetchEpisodes();
  }, []); // Bu useEffect, sadece bileşen ilk yüklendiğinde çalışır.
  

  useEffect(() => {
    if (selectedGender) {
      setCurrentPage(1); // Reset page number when gender filter changes
    }
  }, [selectedGender]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Alive':
        return 'green';
      case 'Dead':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedLocation('');
    setSelectedEpisode('');
    setSelectedGender('');
    setFilterBy('');

  };

 

  return (
    <div className="homepage">
      <Header />
      <div className="filters">
        <div className="buttons">
          <button
            className={`filter-button ${filterBy === 'random' ? 'active' : ''}`}
            onClick={() => {
              setFilterBy('random');
              setCurrentPage(1);
              fetchRandomCharacters();
            }}
          >
            Randomize
          </button>
          <div className="filter-group">
            <input
              type="radio"
              id="location"
              name="filter"
              value="location"
              checked={filterBy === 'location'}
              onChange={() => {
                setFilterBy('location');
                setCurrentPage(1);
              }}
            />
            <label htmlFor="location">By Location</label>
            <select
              disabled={filterBy !== 'location'}
              onChange={(e) => setSelectedLocation(e.target.value)}
              value={selectedLocation}
            >
              <option value="">Select Location</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>

            <input
              type="radio"
              id="episode"
              name="filter"
              value="episode"
              checked={filterBy === 'episode'}
              onChange={() => {
                setFilterBy('episode');
                setCurrentPage(1);
              }}
            />
            <label htmlFor="episode">By Episode</label>
            <select
              disabled={filterBy !== 'episode'}
              onChange={(e) => setSelectedEpisode(e.target.value)}
              value={selectedEpisode}
            >
              <option value="">Select Episode</option>
              {episodes.map(episode => (
                <option key={episode.id} value={episode.id}>{episode.name}</option>
              ))}
            </select>

            <div className="gender-filter">
              <span> Gender:</span>
              <select
                onChange={(e) => setSelectedGender(e.target.value)}
                value={selectedGender}
              >
                <option value="">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

          
            <button className="reset-filters-button" onClick={resetFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="character-cards">
        {characters.map(character => (
          <div key={character.id} className="one-card">
            <div className="character-img">
              <img src={character.image} alt={character.name} />
            </div>
            <div className="character-info">
              <span id="charName" className="info">{character.name}</span>
              <span className="info-stat">
                <span
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(character.status) }}
                ></span>
                <span className="status-text">
                  {character.status} - {character.species}
                </span>
              </span>
              <span className="info">
                <span className="lbl">Last known location:</span> {character.location.name}
              </span>
              <span className="info">
                <span className="lbl">First seen in:</span> {character.firstSeen}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filterBy !== 'random' && (
        <PagingBar
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      <Footer />
    </div>
  );
};

export default Homepage;
