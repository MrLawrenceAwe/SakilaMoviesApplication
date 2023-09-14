import React, { useState } from 'react';

function FilmSearchComponent(props) {
    const [title, setTitle] = useState("");
    const [film, setFilm] = useState(null);
  
    const searchFilm = async () => {
      try {
        const response = await fetch(`http://localhost:8080/films/${title}`);
        if (response.ok) {
          const data = await response.json();
          setFilm(data);
        } else {
          alert("Film not found");
        }
      } catch (error) {
        console.error("Error fetching film:", error);
        alert("Error fetching film");
      }
    };
  
    return (
      <div>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Search by title"
        />
        <button onClick={searchFilm}>Search</button>
        
        {film && 
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{film.filmId}</td>
                <td>{film.title}</td>
                <td>{film.description}</td>
              </tr>
            </tbody>
          </table>
        }
      </div>
    );
}

export default FilmSearchComponent;
