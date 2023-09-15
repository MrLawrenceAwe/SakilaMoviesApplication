const FilmActorList = ({ films, actors }) => {
    return (
        <div>
            {/* List of Films */}
            {films && films.length > 0 && (
                <div>
                    <h2>Films</h2>
                    {films.map(film => (
                        <div key={film.film_id} className="film-item">
                            <h3>{film.title}</h3>
                            <p>{film.description}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Divider if both films and actors are present */}
            {films && films.length > 0 && actors && actors.length > 0 && <hr />}

            {/* List of Actors */}
            {actors && actors.length > 0 && (
                <div>
                    <h2>Actors</h2>
                    {actors.map(actor => (
                    <div key={actor.actor_id} className="actor-item">
                        <span className="actor-last-name">{actor.lastName}</span>
                        <span className="actor-first-name">{actor.firstName}</span>
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FilmActorList;


