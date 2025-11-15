/**
 * SearchBar Component
 * 
 * Reusable search input component for course prerequisite search.
 * Supports Enter key to trigger search.
 * 
 * @param {string} query - Current search query value
 * @param {Function} onQueryChange - Handler for query input changes
 * @param {Function} onSearch - Handler for search button click
 */

import './SearchBar.css';

function SearchBar({ query, onQueryChange, onSearch }) {
    /**
     * Handle keyboard events in the search input
     * Triggers search when Enter key is pressed
     */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="search-bar-container">
            <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter course name, e.g., CMPT280 or cmpt370"
                className="search-input"
            />
            <button onClick={onSearch} className="search-button">
                Search
            </button>
        </div>
    );
}

export default SearchBar;
