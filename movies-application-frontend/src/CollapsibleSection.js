import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CollapsibleSection = ({ label, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    const computedLabel = isVisible ? `` : `${label}`;
    const ArrowIcon = isVisible ? ExpandLessIcon : ExpandMoreIcon; 

    return (
        <div>
            <button id='add-btn' onClick={() => setIsVisible(!isVisible)}>
                <ArrowIcon /> {computedLabel}
            </button>
            {isVisible && children}
        </div>
    );
}

export default CollapsibleSection;

