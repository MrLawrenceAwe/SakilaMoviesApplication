import React, { useState } from 'react';
import { filmAPIClient } from './APIClients/filmAPIClient';
import { Button, TextField, Box } from '@mui/material';

function SearchForm({ onSearch }) {
  const [title, setTitle] = useState('');

  const handleSearchValueChange = (e) => {
    setTitle(e.target.value);
  }

  const search = (e) => {
    e.preventDefault();
    if (title === '') return;

    filmAPIClient.getFilmByTitle(title)
      .then(film => {
          onSearch(film);
      })
      .catch(error => {
      });
  }

  return (
    <Box sx={{ marginBottom: 3 }}>
      <form onSubmit={search}>
        <TextField 
          variant="outlined" 
          fullWidth 
          value={title} 
          onChange={handleSearchValueChange} 
          label="Titles, actors"
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={search} 
          sx={{ marginTop: 2 }}
          type="submit">
          Search
        </Button>
      </form>
    </Box>
  );
}

export default SearchForm;
