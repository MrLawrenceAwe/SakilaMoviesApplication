import React, {useState} from 'react';
import './App.css';
import FilmList from './FilmList';
import AddFilmForm from './AddFilmForm';
import { filmAPIClient } from './APIClients/filmAPIClient';
import CollapsibleSection from './CollapsibleSection';
import AddActorForm from './AddActorForm';
import { Button, TextField, Typography, Box } from '@mui/material';


function App() {
  const [films, setFilms] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const searchFilm = () => {
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
          <Typography variant="h6">Search Film</Typography>
          <TextField 
              variant="outlined" 
              fullWidth 
              value={title} 
              onChange={handleTitleChange} 
              label="Search film by title"
          />
          <Button 
              variant="contained" 
              color="primary" 
              onClick={searchFilm} 
              sx={{ marginTop: 2 }}>
              Search
          </Button>
      </Box>
      <FilmList films={films} onSearch={searchFilm} />
      <AddFilmForm onFilmSubmit={handleFilmSubmit} />
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

