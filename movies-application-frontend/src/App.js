import React, {useState} from 'react';
import './App.css';
import FilmActorList from './FilmActorList';
import AddFilmForm from './AddFilmForm';
import { FilmAPIClient } from './APIClients/FilmAPIClient';
import CollapsibleSection from './CollapsibleSection';
import AddActorForm from './AddActorForm';
import SearchForm from './SearchForm';




function App() {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [lastSearchQuery, setLastSearchQuery] = useState(null);

  function search(searchQuery) {
    FilmAPIClient.getFilmByTitle(searchQuery)
        .then(responseFilms => {
            handleSearch(responseFilms, searchQuery)
        })
        .catch(error => { 
          setFilms([]);
          setError(error.message)
        });
  }

  const handleSearch = (responseFilms, searchQuery) => {
    setLastSearchQuery(searchQuery);

    setFilms([responseFilms]);
    setError(null);
  }

  return (
    <div className="App">
      <h1>Sakila Movies</h1>
      <hr/>
      {/* Search*/}
      <SearchForm onSearch={search} />
      <FilmActorList films={films} onUpdate={search} lastSearchQuery={lastSearchQuery}/>
      <hr />
      {/* Error Message */}
      <CollapsibleSection label="Add Film">
        <AddFilmForm />
        <hr />
      </CollapsibleSection>
      <CollapsibleSection label="Add Actor">
        <AddActorForm />
      </CollapsibleSection>
      <hr />
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;