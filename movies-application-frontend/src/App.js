import React, {useState} from 'react';
import './App.css';
import FilmList from './FilmActorList';
import AddFilmForm from './AddFilmForm';
import { filmAPIClient } from './APIClients/filmAPIClient';
import CollapsibleSection from './CollapsibleSection';
import AddActorForm from './AddActorForm';
import SearchForm from './SearchForm';


function App() {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);

  const handleAddFilmFormSubmit = (newFilm) => {
    filmAPIClient.createFilm(newFilm)
        .then(film => {
            setError(null);
        })
        .catch(error => setError(error.message));
  }

  const handleSearch = (film) => {
    setFilms([film]);
    setError(null);
  }

  return (
    <div className="App">
      <h1>Sakila Movies</h1>
      <hr/>
      {/* Search*/}
      <SearchForm onSearch={handleSearch} />
      <FilmList films={films}/>
      <hr />
      {/* Error Message */}
      <CollapsibleSection label="Add Film">
        <AddFilmForm onSubmit={handleAddFilmFormSubmit} />
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