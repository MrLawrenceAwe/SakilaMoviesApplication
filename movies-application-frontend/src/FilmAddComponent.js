import React, { useState } from 'react';
import Select from 'react-select';
import './FilmAddComponentStyles.css';


const filmAttributes = [
    { name: 'title', placeholder: 'Title', type: 'text', isRequired: true },
    { name: 'description', placeholder: 'Description (Optional)', type: 'text', isRequired: false },
    { name: 'releaseYear', placeholder: 'Release Year (Optional)', type: 'number', isRequired: false },
    { name: 'languageId', placeholder: 'Language ID', type: 'text', isRequired: true },
    { name: 'originalLanguageId', placeholder: 'Original Language ID (Optional)', type: 'text', isRequired: false },
    { name: 'rentalDuration', placeholder: 'Rental Duration (Default: 3)', type: 'number', isRequired: false },
    { name: 'rentalRate', placeholder: 'Rental Rate (Default: 4.99)', type: 'number', isRequired: false },
    { name: 'length', placeholder: 'Length (Optional)', type: 'number', isRequired: false },
    { name: 'replacementCost', placeholder: 'Replacement Cost (Default: 19.99)', type: 'number', isRequired: false },
    { name: 'rating', placeholder: 'Rating (Default: G)', type: 'text', isRequired: false },
];

const specialFeatureOptions = [
    { value: 'Trailers', label: 'Trailers' },
    { value: 'Commentaries', label: 'Commentaries' },
    { value: 'Deleted Scenes', label: 'Deleted Scenes' },
    { value: 'Behind the Scenes', label: 'Behind the Scenes' }
];

function FilmAddComponent(props) {
    const [film, setFilm] = useState({
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

    const handleChange = (e) => {
       const { name: fieldName, value } = e.target;
       setFilm(prevFilm => ({ ...prevFilm, [fieldName]: value }));
    };

    const handleSpecialFeatureChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setFilm(prevFilm => ({
          ...prevFilm,
          specialFeatures: selectedValues
        }));
      };

  const addFilm = async () => {
    try {
        const response = await fetch(`http://localhost:8080/films/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(film),
      });

      if (response.ok) {
        alert("Film added successfully");
      } else {
        alert("Failed to add film");
      }
    } catch (error) {
      console.error("Error adding film:", error);
      alert("Error adding film");
    }
  };

  return (
    <div>
      {filmAttributes.map(attr => (
        <input
          key={attr.name}
          type={attr.type}
          name={attr.name}
          value={film[attr.name]}
          onChange={handleChange}
          placeholder={attr.placeholder}
        />
      ))}
        <Select 
          isMulti 
          name="specialFeatures" 
          options={specialFeatureOptions} 
          className="basic-multi-select" 
          classNamePrefix="select"
          menuPortalTarget={document.body}
          value={film.specialFeatures.map(feature => ({ value: feature, label: feature }))}
          onChange={handleSpecialFeatureChange} 
          placeholder="Select special features..."
        />
      <button onClick={addFilm}>Add Film</button>
    </div>
  );
}

export default FilmAddComponent;