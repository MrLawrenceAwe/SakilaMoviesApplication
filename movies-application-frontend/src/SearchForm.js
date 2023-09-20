import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

function SearchForm({ onSearch }) {
  const [title, setTitle] = useState('');

  const handleSearchValueChange = (e) => {
    setTitle(e.target.value);
  }

  const search = (e) => {
    e.preventDefault();
    if (title === '') return;

    onSearch(title);
  }

  return (
    <Box sx={{ marginBottom: 3 }}>
      <form onSubmit={search}>
        <TextField
          id='searchField'
          variant="outlined" 
          fullWidth 
          value={title} 
          onChange={handleSearchValueChange} 
          label="Titles, categories"
        />
        <Button
          id='searchButton'
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
