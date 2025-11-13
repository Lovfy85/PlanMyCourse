import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { connect } from "../../../../backend/routes/users";

const deperatment = 'cmpt'; // default department

// redirect component
function Redirect() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) return;

        const searchTerm = query.toUpperCase().trim();

        axios.get(`http://localhost:3001/courses/search/?term=${searchTerm}`).then(Response => {
                return Response.data;
            }).catch(err => {
                console.error('Error fetching course from courses database.');
            })
    }

    return (
        <input 
              type="text"
              placeholder="Search courses..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
        );
}

export default Search