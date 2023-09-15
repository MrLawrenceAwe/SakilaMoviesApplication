import React, { useState } from 'react';

const CollapsibleSection = ({ label, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div>
            <button onClick={() => setIsVisible(!isVisible)}>{label}</button>
            {isVisible && children}
        </div>
    );
}

export default CollapsibleSection;
