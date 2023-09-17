import React, { useState } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import EditableField from './EditableField';
import { FilmAPIClient } from './APIClients/FilmAPIClient';


const FilmActorList = ({ films, actors, onUpdate, lastSearchQuery }) => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [currentFilm, setCurrentFilm] = useState(null);
    const [originalFilm, setOriginalFilm] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackType, setFeedbackType] = useState(null); // "success" or "error"

    const handleFilmTitleClick = film => {
        setCurrentFilm({ ...film });
        setOriginalFilm(film);
        setIsSaved(false);  // Reset the saved state
        setShowModal(true);
    };

    const handleFieldChange = (fieldName, newValue) => {
        setCurrentFilm(prevFilm => ({ ...prevFilm, [fieldName]: newValue }));
        setIsSaved(false);
    };
    

    const filmHasChanges = () => {
        if (!currentFilm || !originalFilm) return false;
        return JSON.stringify(currentFilm) !== JSON.stringify(originalFilm);
    };

    const getChanges = () => {
        const changes = {};
        for (const key in currentFilm) {
            if (currentFilm[key] !== originalFilm[key]) {
                changes[key] = currentFilm[key];
            }
        }
        return changes;
    };
    

    const handleSave = () => {
        const changes = getChanges();

        if (Object.keys(changes).length === 0) {
            return;
        }

        FilmAPIClient.updateFilm(currentFilm.filmId, changes)
            .then(() => {
                setIsSaved(true);
                setFeedbackType('success');
                setFeedbackMessage("Saved!");
                setTimeout(() => {
                    setFeedbackMessage(null);
                }, 2000);
                setIsSaved(true);
                setOriginalFilm({ ...currentFilm });
                onUpdate(lastSearchQuery);
            })
            .catch(error => {
                setFeedbackType('error');
                setFeedbackMessage('Error saving changes')
            });
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
        setFeedbackMessage(null);
    }

    const handleDeleteFilm = () => {
        FilmAPIClient.deleteFilm(currentFilm.filmId)
            .then(() => {
                setShowDeleteConfirmation(false);
                setTimeout(() => {
                    setFeedbackMessage(null);
                }, 2000);
                handleCloseModal();
                onUpdate(lastSearchQuery);
            })
            .catch(error => {
                setFeedbackMessage('Error deleting film')
                setFeedbackType('error');
            }); 
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
                            <button className="delete-film-btn" onClick={() => { setCurrentFilm(film); setShowDeleteConfirmation(true); }}>
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

            {/* Edit Film Modal */}
            <Modal show={showModal} onClose={handleCloseModal}>
                {currentFilm && (
                    <>
                        <h3>{currentFilm.title}</h3>
                        <EditableField 
                            label="Title" 
                            value={currentFilm.title} 
                            onChange={newTitle => handleFieldChange('title', newTitle)}
                        />
                        <EditableField 
                            label="Description" 
                            value={currentFilm.description} 
                            onChange={newDesc => handleFieldChange('description', newDesc)}
                        />

                        {filmHasChanges() && !isSaved && <button className="modal-button" onClick={handleSave}>Save</button>}
                        <button onClick={handleCloseModal} style={{ marginBottom: '20px' }}>Close</button>
                        {feedbackMessage && <div className={`feedback-message feedback-${feedbackType}`}>{feedbackMessage}</div>}
                    </>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <h3>Are you sure you want to delete this film?</h3>
                {feedbackMessage && <div className={`feedback-message feedback-${feedbackType}`}>{feedbackMessage}</div>}
                <button className='modal-button' onClick={handleDeleteFilm}>Yes, Delete</button>
                <button className='modal-button' onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
            </Modal>
        </div>
    );
}

export default FilmActorList;