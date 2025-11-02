import React from "react";
import Navbar from "../../components/Navbar/Navbar"
import './Graph.css'

function Graph() {
    return (
        <>
        <Navbar />
        <div className="search-bar">
            <input type="text" placeholder="Search courses..." />
            <button className="search-button">
                <p>Search</p>
            </button>
        </div>
        </>
    )
}

export default Graph