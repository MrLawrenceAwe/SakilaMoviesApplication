import React, {useState} from 'react';
import './App.css';
import FilmList from './FilmList';
import AddFilmForm from './AddFilmForm';
import { filmAPIClient } from './APIClients/filmAPIClient';
import CollapsibleSection from './CollapsibleSection';
import AddActorForm from './AddActorForm';


function App() {
  const [error, setError] = useState(null);

  const handleFilmSubmit = (newFilm) => {
    filmAPIClient.createFilm(newFilm)
        .then(film => {
            setError(null);
        })
        .catch(error => setError(error.message));
  }

  return (
    <div className="App">
      <h1>Sakila Movies</h1>
      <hr/>
      <FilmList />
      <AddFilmForm onFilmSubmit={handleFilmSubmit} />
      <hr />
      {/* Error Message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;

