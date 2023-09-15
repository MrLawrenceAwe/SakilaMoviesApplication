import React, {useState} from 'react';
import './App.css';
import FilmList from './FilmActorList';
import AddFilmForm from './AddFilmForm';
import { filmAPIClient } from './APIClients/filmAPIClient';
import CollapsibleSection from './CollapsibleSection';
import AddActorForm from './AddActorForm';
import { Button, TextField, Box } from '@mui/material';


function App() {
  const [films, setFilms] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const searchFilm = () => {
    if (title === '') return;
    filmAPIClient.getFilmByTitle(title)
      .then(film => {
          setFilms([film]);  
          setError(null);
      })
      .catch(error => setError(error.message));
  }

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
      {/* Search Film By Title */}
      <Box sx={{ marginBottom: 3 }}>
          <form 
              onSubmit={(e) => {
                  e.preventDefault(); 
                  searchFilm();
              }}
          >
              <TextField 
                  variant="outlined" 
                  fullWidth 
                  value={title} 
                  onChange={handleTitleChange} 
                  label="Titles, actors"
              />
              <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={searchFilm} 
                  sx={{ marginTop: 2 }}
                  type="submit">
                  Search
              </Button>
          </form>
      </Box>
      <FilmList films={films}/>
      <hr />
      {/* Error Message */}
      <CollapsibleSection label="Add Film">
        <AddFilmForm onFilmSubmit={handleFilmSubmit} />
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

