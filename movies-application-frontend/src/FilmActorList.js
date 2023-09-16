import React, { useState } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import EditableField from './EditableField';

const FilmActorList = ({ films, actors, onFilmUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentFilm, setCurrentFilm] = useState(null);

    const handleFilmTitleClick = film => {
        setCurrentFilm(film);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <div>
            {/* List of Films */}
            {films && films.length > 0 && (
                <div>
                    <h2>Films</h2>
                    {films.map(film => (
                        <div key={film.film_id} className="film-item">
                            <h3 onClick={() => handleFilmTitleClick(film)}>{film.title}</h3>
                            <p>{film.description}</p>
                            <div className="film-actions">
                            <button className="delete-film-btn">
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
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

            <Modal show={showModal} onClose={handleCloseModal}>
                {currentFilm && (
                    <>
                        <h3>{currentFilm.title}</h3>
                        <EditableField 
                            label="Title" 
                            value={currentFilm.title} 
                            onChange={newTitle => setCurrentFilm({ ...currentFilm, title: newTitle })}
                        />
                        <EditableField 
                            label="Description" 
                            value={currentFilm.description} 
                            onChange={newDesc => setCurrentFilm({ ...currentFilm, description: newDesc })}
                        />
                        {/* Add more fields as needed */}
                    </>
                )}
            </Modal>
        </div>
    );
}

export default FilmActorList;


