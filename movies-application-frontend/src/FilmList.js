import React, { useState } from 'react';
import { filmAPIClient } from './APIClients/filmAPIClient';
import FilmForm from './AddFilmForm';
import { Button, TextField, Typography, Box } from '@mui/material';

const FilmList = () => {
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

    return (
        <div>
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

            {/* List of Films */}
            <div>
              <h2>Films</h2>
              {films.map(film => (
                 <div key={film.film_id} className="film-item">
                    <h3>{film.title}</h3>
                    <p>{film.description}</p>
                </div>
            ))}
            </div>
    
            <hr />
        </div>
    );
}

export default FilmList;

