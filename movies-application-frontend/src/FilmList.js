const FilmList = ({films}) => {
    return (
        <div>
            {/* List of Films */}
            <div>
              <h2>Films</h2>
              {films.map(film => (
                 <div key={film.film_id} className="film-item">
                    <h3>{film.title}</h3>
                    <p>{film.description}</p>
                </div>
            ))}
            </div>
    
            <hr />
        </div>
    );
}

export default FilmList;

