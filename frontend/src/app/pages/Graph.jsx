import React from "react";
<<<<<<< HEAD
import Navbar from '../../components/Navbar/Navbar'


function GraphPage () {
    <>
    <Navbar />

    <div className="seacrch-bar">
        <input type="text" placeholder="Enter a class.."/>
    </div>

    </>
}
=======
import Navbar from "../../components/Navbar/Navbar"
import './Graph.css'

function Graph() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);

    const courses = [
        { course_id: "CS101", course_name: "Introduction to Computer Science" },
        { course_id: "MATH201", course_name: "Calculus II" },
        { course_id: "ENG150", course_name: "English Literature" },
    ];

    const handleSearch = () => {
        const results
    }
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
>>>>>>> main
