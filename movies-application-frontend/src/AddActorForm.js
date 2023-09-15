import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const AddActorForm = ({ onActorSubmit }) => {
    const [actorData, setActorData] = useState({
        first_name: '',
        last_name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActorData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = () => {
        onActorSubmit(actorData);
        setActorData({ first_name: '', last_name: '' });
    }

    return (
        <Box>
            <Typography variant="h6">Add a New Actor</Typography>
            <TextField 
                fullWidth 
                variant="outlined" 
                name="first_name" 
                label="First Name" 
                onChange={handleChange} 
                value={actorData.first_name} 
                sx={{ marginTop: 2 }}
            />
            <TextField 
                fullWidth 
                variant="outlined" 
                name="last_name" 
                label="Last Name" 
                onChange={handleChange} 
                value={actorData.last_name} 
                sx={{ marginTop: 2 }}
            />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit} 
                sx={{ marginTop: 2 }}>
                Add Actor
            </Button>
        </Box>
    );
}

export default AddActorForm;
