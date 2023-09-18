import React, { useState } from "react";
import "./AddFilmForm.css";
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
import { FilmAPIClient } from "./APIClients/FilmAPIClient";

const FilmForm = () => {
  const [filmData, setFilmData] = useState({
    title: null,
    description: null,
    releaseYear: null,
    languageId: null,
    length: null,
    rating: null,
  });

  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [errorFields, setErrorFields] = useState({});

  const ratings = ["G", "PG", "PG-13", "R", "NC-17"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "title":
        if (value.length > 100) return;
        break;
      case "description":
        if (value.length > 1000) return;
        break;
      case "length":
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

  function handleSubmit() {
    let errors = {};
    if (!filmData.title) {
      errors.title = "Title is required";
    }
    if (!filmData.languageId) {
      errors.languageId = "Language ID is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      setFeedbackType("error");
      setFeedbackMessage("Please fill out all required fields.");
      return;
    }

    // The rest of your handleSubmit function remains unchanged.
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
      <TextField
        fullWidth
        variant="outlined"
        name="releaseYear"
        label="Release Year"
        onChange={handleChange}
        value={filmData.releaseYear || ""}
        sx={{ marginTop: 2 }}
      />
      <TextField
        fullWidth
        variant="outlined"
        name="languageId"
        label="Language ID*"
        onChange={handleChange}
        value={filmData.languageId || ""}
        sx={{ marginTop: 2 }}
        error={!!errorFields.languageId} // check if the languageId has an error
        helperText={errorFields.languageId} // display the error message
      />
      <TextField
        fullWidth
        variant="outlined"
        name="originalLanguageId"
        label="Original Language ID"
        onChange={handleChange}
        value={filmData.originalLanguageId || ""}
        sx={{ marginTop: 2 }}
      />
      <TextField
        fullWidth
        type="number"
        variant="outlined"
        name="length"
        label="Length"
        onChange={handleChange}
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
