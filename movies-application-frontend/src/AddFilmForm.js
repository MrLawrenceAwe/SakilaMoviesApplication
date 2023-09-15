import React, { useState } from 'react';
import './AddFilmForm.css'
import { TextField, Button, Typography, Box, Select, MenuItem } from '@mui/material';

const FilmForm = ({ onFilmSubmit }) => {
    const [filmData, setFilmData] = useState({
        title: null,
        description: null,
        releaseYear: null,
        languageId: null,
        originalLanguageId: null,
        rentalDuration: null, 
        rentalRate: null, 
        length: null,
        replacementCost: null,
        rating: null,
        specialFeatures: []
      });

    const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
    const specialFeaturesOptions = [
        { value: 'Trailers', label: 'Trailers' },
        { value: 'Commentaries', label: 'Commentaries' },
        { value: 'Deleted Scenes', label: 'Deleted Scenes' },
        { value: 'Behind the Scenes', label: 'Behind the Scenes' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilmData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSelectChange = (event) => {
        const values = event.target.value;  
        setFilmData(prev => ({
            ...prev,
            specialFeatures: values
        }));
    };
    

    const handleSubmit = () => {
        onFilmSubmit(filmData);
        setFilmData({});
    }

    return (
        <Box>
            <Typography variant="h6">Add a New Film</Typography>
            <TextField 
                fullWidth 
                variant="outlined" 
                name="title" 
                label="Film Title" 
                onChange={handleChange} 
                value={filmData.title || ''} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                variant="outlined" 
                name="description" 
                label="Description" 
                multiline 
                rows={4} 
                onChange={handleChange} 
                value={filmData.description || ''} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                variant="outlined" 
                name="releaseYear" 
                label="Release Year" 
                onChange={handleChange} 
                value={filmData.releaseYear || ''} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                variant="outlined" 
                name="languageId" 
                label="Language ID" 
                onChange={handleChange} 
                value={filmData.languageId || ''} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                variant="outlined" 
                name="originalLanguageId" 
                label="Original Language ID" 
                onChange={handleChange} 
                value={filmData.originalLanguageId || ''} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                type="number" 
                variant="outlined" 
                name="rentalDuration" 
                label="Rental Duration" 
                onChange={handleChange} 
                value={filmData.rentalDuration || ''} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                variant="outlined" 
                name="rentalRate" 
                label="Rental Rate" 
                onChange={handleChange} 
                value={filmData.rentalRate || ''} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                type="number" 
                variant="outlined" 
                name="length" 
                label="Length" 
                onChange={handleChange} 
                value={filmData.length || ''} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                variant="outlined" 
                name="replacementCost" 
                label="Replacement Cost" 
                onChange={handleChange} 
                value={filmData.replacementCost || ''} 
                sx={{ marginTop: 2 }}
            />
            <Select
                fullWidth
                name="rating"
                value={filmData.rating || ''}
                onChange={handleChange}
                sx={{ marginTop: 2 }}
            >
                {ratings.map(rating => (
                    <MenuItem key={rating} value={rating}>
                        {rating}
                    </MenuItem>
                ))}
            </Select>
            <Select 
                multiple
                name="specialFeatures"
                className='specialFeatures'
                value={filmData.specialFeatures || []}
                placeholder="Select Special Features"
                onChange={(event) => handleSelectChange(event)}
                sx={{ marginTop: 2 }}
            >
                {specialFeaturesOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit} 
                sx={{ marginTop: 2 }}>
                Add Film
            </Button>
        </Box>
    );

}

export default FilmForm;
