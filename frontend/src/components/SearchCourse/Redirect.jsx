import { useState } from "react";
import { useNavigate } from "react-router-dom";

// redirect component
function Redirect() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) return;

        const searchTerm = query.toUpperCase().trim();

        navigate(`./Catalogue/${searchTerm}`);
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