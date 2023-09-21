import React, { useState } from "react";
import "./App.css";
import FilmList from "./FilmList";
import AddFilmForm from "./AddFilmForm";
import { FilmAPIClient } from "./APIClients/FilmAPIClient";
import CollapsibleSection from "./CollapsibleSection";
import SearchForm from "./SearchForm";

function App() {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [lastSearchQuery, setLastSearchQuery] = useState(null);
  const [showJumpButtons, setShowJumpButtons] = useState(true);
  const [filmLanguages, setFilmLanguages] = useState(null);
  const [filmCategories, setFilmCategories] = useState(null);

  const ratings = ["G", "PG", "PG-13", "R", "NC-17"];

  const addFilmRef = React.useRef(null);

  FilmAPIClient.getFilmLanguages()
    .then((responseLanguages) => {
      setFilmLanguages(responseLanguages);
    })
    .catch((error) => {
      setError(error.message);
    });

  FilmAPIClient.getFilmCategories()
    .then((responseCategories) => {
      setFilmCategories(responseCategories);
    })
    .catch((error) => {
      setError(error.message);
    });

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 110; 
  const endYear = currentYear + 10; 
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  function search(searchQuery) {
    FilmAPIClient.getFilmByTitle(searchQuery)
      .then((responseFilms) => {
        handleAfterSearch([responseFilms], searchQuery);
      })
      .catch(() => {
        FilmAPIClient.getFilmsByCategory(searchQuery)
          .then((responseFilmsByCategory) => {
            handleAfterSearch(responseFilmsByCategory, searchQuery);
          })
          .catch((error) => {
            setFilms([]);
            setError(error.message);
          });
      });
  }

  const handleAfterSearch = (responseFilms, searchQuery) => {
    setLastSearchQuery(searchQuery);

    setFilms(responseFilms);
    setError(null);
  };

  const scrollToForm = (formRef) => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    const currentRef = addFilmRef.current;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setShowJumpButtons(false);
        } else {
          setShowJumpButtons(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.01, 
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);


  return (
    <div className="App">
      <h1>Sakila Movies</h1>
      <hr />
      <SearchForm onSearch={search} />
      {error && <p>{error}</p>}
      <FilmList
        films={films}
        onChangesSavedToDatabase={search}
        lastSearchQuery={lastSearchQuery}
        languages={filmLanguages}
        categories={filmCategories}
        years={years}
        ratings={ratings}
      />

      {films.length > 3 && showJumpButtons && (
        <div className="jump-buttons-div">
          <button onClick={() => scrollToForm(addFilmRef)}>
            Jump to Add Forms
          </button>
        </div>
      )}
      <hr />

      <CollapsibleSection label="Add Film" ref={addFilmRef}>
        <AddFilmForm
        languages={filmLanguages}
        categories={filmCategories}
        years={years}
        ratings={ratings}
        />
        <hr />
      </CollapsibleSection>
      {/* <CollapsibleSection label="Add Actor">
        <AddActorForm />
      </CollapsibleSection> */}
      <hr />
    </div>
  );
}

export default App;
