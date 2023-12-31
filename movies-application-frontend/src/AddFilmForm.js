import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FilmAPIClient } from "./APIClients/FilmAPIClient.js";

const FilmForm = ({ languages, categories, years, ratings }) => {
  const [filmData, setFilmData] = useState({
    title: null,
    description: null,
    releaseYear: null,
    language: null,
    length: null,
    rating: null,
    category: null,
  });

  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [errorFields, setErrorFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "title":
        if (value.length > 100) return;
        break;
      case "description":
        if (value.length > 1000) return;
        break;
      case "releaseYear":
        if (isNaN(value) || value < 0) return;
        break;
      case "rating":
        if (value !== "" && !ratings.includes(value)) return;
        break;
      default:
        break;
    }

    setFilmData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorFields[name]) {
      setErrorFields((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const preventInvalidNumberChars = (e) => {
    if (e.key === 'e' || e.key === '.' || e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  function handleSubmit() {
    let errors = {};
    if (!filmData.title) {
      errors.title = "Title is required";
    }
    if (!filmData.language) {
      errors.languageId = "Language is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      setFeedbackType("error");
      setFeedbackMessage("Please fill out all required fields.");
      return;
    }

    FilmAPIClient.createFilm(filmData)
      .then(() => {
        setFeedbackType("success");
        setFeedbackMessage("Film added!");
        setTimeout(() => {
          setFeedbackMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setFeedbackType("error");
        setFeedbackMessage("Could not add film.");
        setTimeout(() => {
          setFeedbackMessage(null);
        }, 5000);
      });
  }


  return (
    <Box>
      <Typography variant="h6">Add a New Film</Typography>
      <TextField
        fullWidth
        variant="outlined"
        name="title"
        label="Film Title*"
        onChange={handleChange}
        value={filmData.title || ""}
        sx={{ marginTop: 2 }}
        error={!!errorFields.title} // check if the title has an error
        helperText={errorFields.title} // display the error message
      />
      <TextField
        fullWidth
        variant="outlined"
        name="description"
        label="Description"
        multiline
        rows={4}
        onChange={handleChange}
        value={filmData.description || ""}
        sx={{ marginTop: 2 }}
      />
      <FormControl variant="outlined" fullWidth sx={{ marginTop: 2 }}>
        <InputLabel htmlFor="releaseYear">Release Year</InputLabel>
        <Select
          label="Release Year"
          name="releaseYear"
          value={filmData.releaseYear || ""}
          onChange={handleChange}
        >
          <MenuItem value="">Select Year</MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" fullWidth sx={{ marginTop: 2 }}>
        <InputLabel htmlFor="rating">Language*</InputLabel>
        <Select
          label="Language"
          name="language"
          value={filmData.language || ""}
          onChange={handleChange}
          error={!!errorFields.title} // check if the title has an error
          helperText={errorFields.title} // display the error message
        >
          {languages.map((language) => (
            <MenuItem key={language} value={language}>
              {language}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        type="number"
        variant="outlined"
        name="length"
        label="Length (minutes)"
        onChange={handleChange}
        onKeyDown={preventInvalidNumberChars}
        value={filmData.length || ""}
        sx={{ marginTop: 2 }}
      />
      <FormControl variant="outlined" fullWidth sx={{ marginTop: 2 }}>
        <InputLabel htmlFor="rating">Rating</InputLabel>
        <Select
          label="Rating"
          name="rating"
          value={filmData.rating || ""}
          onChange={handleChange}
          inputProps={{
            name: "rating",
            id: "rating",
          }}
        >
          <MenuItem value="">No Rating</MenuItem>

          {ratings.map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" fullWidth sx={{ marginTop: 2 }}>
        <InputLabel htmlFor="rating">Category</InputLabel>
        <Select
          label="Category"
          name="category"
          value={filmData.category || ""}
          onChange={handleChange}
        >
          <MenuItem value="">No Category</MenuItem>

          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2, marginBottom: 2 }}
      >
        Add Film
      </Button>
      {feedbackMessage && (
        <div className={`feedback-message feedback-${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}
    </Box>
  );
};

export default FilmForm;
