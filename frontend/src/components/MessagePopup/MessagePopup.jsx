/**
 * MessagePopup Component
 * 
 * A reusable popup component for displaying messages with consistent styling.
 * 
 * @param {boolean} isOpen - Whether the popup is visible
 * @param {Function} onClose - Handler for closing the popup
 * @param {string} title - Title text for the popup header
 * @param {string} message - Message text to display
 * @param {string} buttonText - Text for the close button (optional, defaults to "OK")
 */

import './MessagePopup.css';

function MessagePopup({ isOpen, onClose, title, message, buttonText = "OK" }) {
    if (!isOpen) return null;

    return (
        <div className="message-popup-overlay" onClick={onClose}>
            <div className="message-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="message-popup-header">
                    <h2>{title}</h2>
                    <button className="message-popup-close" onClick={onClose}>×</button>
                </div>
                <div className="message-popup-body">
                    <p className="message-popup-text">{message}</p>
                    <button className="message-popup-button" onClick={onClose}>
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessagePopup;