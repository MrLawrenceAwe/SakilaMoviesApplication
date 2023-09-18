import React, { useState } from "react";
import "./App.css";
import FilmActorList from "./FilmActorList";
import AddFilmForm from "./AddFilmForm";
import { FilmAPIClient } from "./APIClients/FilmAPIClient";
import CollapsibleSection from "./CollapsibleSection";
import AddActorForm from "./AddActorForm";
import SearchForm from "./SearchForm";

function App() {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [lastSearchQuery, setLastSearchQuery] = useState(null);
  const [showJumpButtons, setShowJumpButtons] = useState(true);

  const addFilmRef = React.useRef(null);

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
      <FilmActorList
        films={films}
        onUpdate={search}
        lastSearchQuery={lastSearchQuery}
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
        <AddFilmForm />
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
