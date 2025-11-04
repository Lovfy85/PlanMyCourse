import { useState } from "react";
import { useNavigate } from "react-router-dom";

const deperatment = 'cmpt'

// redirect component
function Redirect() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) {
            navigate(`./catalogue/${deperatment}`);
            alert("Opps, it seems that the input is invalid!")
            return
        };

        const searchTerm = query.toUpperCase().trim();

        navigate(`./catalogue/${searchTerm}`);
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

export default Redirect