import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EditableField = ({ label, initialValue, onChange, onEditModeChange, type, options }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(initialValue);
    const [hasChanged, setHasChanged] = useState(false);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        switch (label) {
            case "Title":
              if (newValue.length > 255) return;
              break;
            case "Description":
              if (newValue.length > 65_535) return;
              break;
            case "Release Year":
              console.log(newValue);
              if (isNaN(newValue) || newValue < 0) return;
              break;
            case "Language ID":
            case "Original Language ID":
              if (isNaN(newValue) || newValue < 0) return;
              break;
            default:
              break;
          }

        setTempValue(newValue);

        if (newValue.trim() !== initialValue) {
            setHasChanged(true);
        } else {
            setHasChanged(false);
        }
    }

    const handleDone = () => {
        onChange(tempValue);
        setIsEditing(false);
        setHasChanged(false); 
    };

    const handleCancel = () => {
        setTempValue(initialValue); 
        setIsEditing(false); 
        setHasChanged(false);
    };

    useEffect(() => {
        if (onEditModeChange) {
          onEditModeChange(isEditing);
        }
      }, [isEditing, onEditModeChange]);
      


    return (
        <div className="editable-field">
            <span className="field-label">{label}: </span>
            {isEditing ? (
                <>
                    {type === "selector" ? (
                        <select
                            className="field-input"
                            value={tempValue}
                            onChange={e => {
                                setTempValue(e.target.value);
                                if (e.target.value !== initialValue) {
                                    setHasChanged(true);
                                } else {
                                    setHasChanged(false);
                                }
                            }}
                        >
                            {options.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                    ) : (
                        <input 
                            className="field-input" 
                            value={tempValue} 
                            onChange={handleInputChange} 
                        />
                    )}
                    <button className="done-button" onClick={handleDone} disabled={!hasChanged}>Done</button>
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