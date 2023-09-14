import React from 'react';
import './App.css';
import FilmSearchComponent from './FilmSearchComponent';
import FilmAddComponent from './FilmAddComponent';

function App() {
  return (
    <div className="App">
      <h1>Movies Application</h1>
      <FilmSearchComponent />
      <FilmAddComponent />
    </div>
  );
}

export default App;

