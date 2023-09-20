import React, { useState } from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import EditableField from './EditableField';
import { FilmAPIClient } from './APIClients/FilmAPIClient';


const FilmList = ({ films, actors, onChangesSavedToDatabase, lastSearchQuery }) => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmationModal] = useState(false);
    const [currentFilm, setCurrentFilm] = useState(null);
    const [originalFilm, setOriginalFilm] = useState(null);
    const [editsSaved, setEditsSaved] = useState(false);
    // feedback for edit modal
    const [filmViewFeedbackMessage, setEditFeedbackMessage] = useState(null);
    const [filmViewFeedbackType, setEditFeedbackType] = useState(null); // "success" or "error"
    // feedback for delete modal
    const [deleteFeedbackMessage, setDeleteFeedbackMessage] = useState(null);
    const [deleteFeedbackType, setDeleteFeedbackType] = useState(null); // "success" or "error"

    const handleFilmTitleClick = film => {
        setCurrentFilm({ ...film });
        setOriginalFilm(film);
        setEditsSaved(false);  // Reset the saved state
        setShowModal(true);
    };

    const handleFieldChange = (fieldName, newValue) => {
        setCurrentFilm(prevFilm => ({ ...prevFilm, [fieldName]: newValue }));
        setEditsSaved(false);
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
    

    const handleEditSaveToDatabase = () => {
        const changes = getChanges();

        if (Object.keys(changes).length === 0) {
            return;
        }

        FilmAPIClient.updateFilm(currentFilm.filmId, changes)
            .then(() => {
                setEditsSaved(true);
                setEditFeedbackType('success');
                setEditFeedbackMessage("Saved!");
                setTimeout(() => {
                    setEditFeedbackMessage(null);
                }, 2000);
                setEditsSaved(true);
                setOriginalFilm({ ...currentFilm });
                onChangesSavedToDatabase(lastSearchQuery);
            })
            .catch(error => {
                setEditFeedbackType('error');
                setEditFeedbackMessage('Error saving changes')
                setTimeout(() => {
                    setEditFeedbackMessage(null);
                }, 2000);
            });
    };
    
    const hideModalThenSetModalFeedbackMessagesToNull = () => {
        setShowModal(false);
        setEditFeedbackMessage(null);
        setDeleteFeedbackMessage(null);
    }

    const handleDeleteFilm = () => {
        FilmAPIClient.deleteFilm(currentFilm.filmId)
            .then(() => {
                setShowDeleteConfirmationModal(false);
                hideModalThenSetModalFeedbackMessagesToNull();
                onChangesSavedToDatabase(lastSearchQuery);
            })
            .catch(error => {
                setDeleteFeedbackType('error');
                setDeleteFeedbackMessage('Error deleting film')
                setTimeout(() => {
                    setDeleteFeedbackMessage(null);
                }, 2000);
            }); 
    }



    
    return (
        <div>
            {/* List of Films */}
            {films && films.length > 0 && (
                <div id='film-list'>
                    <h2>Films</h2>
                    {films.map(film => (
                        <div key={film.film_id} className="film-item">
                            <h3 onClick={() => handleFilmTitleClick(film)}>{film.title}</h3>
                            <p>{film.description}</p>
                            <div className="film-actions">
                            <button className="delete-film-btn" onClick={() => { setCurrentFilm(film); setShowDeleteConfirmationModal(true); }}>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            )}
            
            {/* Divider if both films and actors are present */}
            {films && films.length > 0 && actors && actors.length > 0 && <hr />}

            {/* List of Actors
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
            )} */}

            {/* Film View Modal */}
            <Modal show={showModal} onClose={hideModalThenSetModalFeedbackMessagesToNull}>
                {currentFilm && (
                    <>
                        <h3>{currentFilm.title}</h3>
                        <EditableField 
                            label="Title" 
                            initialValue={currentFilm.title} 
                            onChange={newTitle => handleFieldChange('title', newTitle)}
                        />
                        <EditableField 
                            label="Description" 
                            initialValue={currentFilm.description} 
                            onChange={newDesc => handleFieldChange('description', newDesc)}
                        />
                        <EditableField
                            label="Release Year"
                            initialValue={currentFilm.releaseYear}
                            onChange={newReleaseYear => handleFieldChange('releaseYear', newReleaseYear)}
                        />
                        <EditableField
                            label="Language"
                            initialValue={currentFilm.language}
                            onChange={newLanguage => handleFieldChange('language', newLanguage)}
                        />
                        <EditableField
                            label="Length (minutes)"
                            initialValue={currentFilm.length}
                            onChange={newLength => handleFieldChange('length', newLength)}
                        />
                        <EditableField
                            label="Rating"
                            initialValue={currentFilm.rating}
                            onChange={newRating => handleFieldChange('rating', newRating)}
                        />

                        {filmHasChanges() && !editsSaved && <button className="modal-button" onClick={handleEditSaveToDatabase}>Save</button>}
                        <button onClick={hideModalThenSetModalFeedbackMessagesToNull} style={{ marginBottom: '20px' }}>Close</button>
                        {filmViewFeedbackMessage && <div className={`feedback-message feedback-${filmViewFeedbackType}`}>{filmViewFeedbackMessage}</div>}
                    </>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmationModal(false)}>
                <h3>Are you sure you want to delete this film?</h3>
                {deleteFeedbackMessage && <div className={`feedback-message feedback-${deleteFeedbackType}`}>{deleteFeedbackMessage}</div>}
                <button className='modal-button' onClick={handleDeleteFilm}>Yes, Delete</button>
                <button className='modal-button' onClick={() => setShowDeleteConfirmationModal(false)}>Cancel</button>
            </Modal>
        </div>
    );
}

export default FilmList;