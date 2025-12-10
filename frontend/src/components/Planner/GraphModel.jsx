/**
 * GraphModel Component
 * 
 * Reusable modal wrapper for displaying the graph.
 * Provides overlay, close functionality, and header.
 * 
 * @param {boolean} isOpen - Handler for opening the model
 * @param {Function} onClose - Handler for closing the model
 * @param {ReactNode} children - Content to display in the model body
 * @param {string} title - Title to display in the model header
 */

import './GraphModel.css';

function GraphModel({ isOpen, onClose, children, title }) {
    // Don't render if modal is closed
    if (!isOpen) {
        return null;
    }

    return (
        <div className="model-overlay" onClick={onClose}>
            <div className="model-content" onClick={(e) => e.stopPropagation()}>
                <div className="model-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default GraphModel;
