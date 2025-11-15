/**
 * AlternativeSelector Component
 * 
 * Displays alternative course options floating around a selected node.
 * Allows users to swap out a prerequisite with an alternative.
 * 
 * @param {Object} selectedNode - The currently selected node
 * @param {Array} alternatives - Array of alternative course arrays
 * @param {Function} onSelectAlternative - Handler for selecting an alternative
 * @param {Function} onClose - Handler for closing the selector
 */

import { useEffect, useState } from 'react';
import './AlternativeSelector.css';

function AlternativeSelector({ selectedNode, alternatives, onSelectAlternative, onClose }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (selectedNode) {
            // Get the node's position on screen
            const nodeElement = document.querySelector(`[data-id="${selectedNode.id}"]`);
            if (nodeElement) {
                const rect = nodeElement.getBoundingClientRect();
                setPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                });
            }
        }
    }, [selectedNode]);

    if (!selectedNode || !alternatives || alternatives.length === 0) {
        return null;
    }

    // Flatten alternatives to get unique courses
    const uniqueAlternatives = new Set();
    alternatives.forEach(altGroup => {
        if (Array.isArray(altGroup)) {
            altGroup.forEach(course => {
                if (course !== selectedNode.id) {
                    uniqueAlternatives.add(course);
                }
            });
        }
    });

    const alternativesList = Array.from(uniqueAlternatives);

    if (alternativesList.length === 0) {
        return null;
    }

    // Calculate positions for alternatives in an oval/ellipse shape
    // Wider horizontally than vertically
    const baseRadiusX = 180; // Horizontal radius (wider)
    const baseRadiusY = 100; // Vertical radius (narrower)
    
    // Increase radii based on number of alternatives to prevent overlap
    const radiusIncrementX = 15; // Add more horizontal space
    const radiusIncrementY = 5; // Add less vertical space
    
    let radiusX = baseRadiusX;
    if (alternativesList.length > 4) {
        radiusX = baseRadiusX + (alternativesList.length - 4) * radiusIncrementX;
    }
    
    let radiusY = baseRadiusY;
    if (alternativesList.length > 4) {
        radiusY = baseRadiusY + (alternativesList.length - 4) * radiusIncrementY;
    }
    
    const angleStep = (2 * Math.PI) / alternativesList.length;

    return (
        <>
            {/* Backdrop to close selector */}
            <div className="alternative-selector-backdrop" onClick={onClose} />
            
            {/* Alternative buttons */}
            <div className="alternative-selector-container">
                {alternativesList.map((alt, index) => {
                    const angle = index * angleStep - Math.PI / 2; // Start from top
                    const x = position.x + radiusX * Math.cos(angle);
                    const y = position.y + radiusY * Math.sin(angle);

                    return (
                        <button
                            key={alt}
                            className="alternative-button"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            onClick={() => onSelectAlternative(selectedNode.id, alt)}
                        >
                            {alt}
                        </button>
                    );
                })}
                
                {/* Center indicator showing selected node */}
                <div
                    className="selected-node-indicator"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <span className="indicator-label">Alternatives for</span>
                    <span className="indicator-course">{selectedNode.id}</span>
                </div>
            </div>
        </>
    );
}

export default AlternativeSelector;
