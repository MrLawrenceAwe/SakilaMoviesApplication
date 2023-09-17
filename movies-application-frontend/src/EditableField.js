import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EditableField = ({ label, value: initialValue, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(initialValue);
    const [hasChanged, setHasChanged] = useState(false);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setTempValue(newValue);

        // Check if the new value (after trimming) is different from the initial value
        if (newValue.trim() !== initialValue) {
            setHasChanged(true);
        } else {
            setHasChanged(false);
        }
    }

    const handleSave = () => {
        onChange(tempValue);
        setIsEditing(false);
        setHasChanged(false); // Reset the changed status
    };

    const handleCancel = () => {
        setTempValue(initialValue); // Reset the temporary value
        setIsEditing(false); // Exit the edit mode
        setHasChanged(false); // Reset the changed status
    };

    return (
        <div className="editable-field">
            <span className="field-label">{label}: </span>
            {isEditing ? (
                <>
                    <input 
                        className="field-input" 
                        value={tempValue} 
                        onChange={handleInputChange} 
                    />
                    <button className="save-button" onClick={handleSave} disabled={!hasChanged}>Done</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                </>
            ) : (
                <>
                    <span className="field-value">{initialValue}</span>
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </>
            )}
        </div>
    );
}

export default EditableField;