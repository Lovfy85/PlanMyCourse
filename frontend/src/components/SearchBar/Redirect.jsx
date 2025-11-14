import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Recommendation from "../Recommend/Recommendations";
import "./Redirect.css"

// redirect component
function Redirect() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchTerm) {
            navigate(`./catalogue/${deperatment}`);
            return;
        }

        navigate(`./catalogue/${searchTerm.toUpperCase().trim()}`);
    }

    return (
        <div className="redirectSearchBar">
            <input
                type="text"
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key == "Enter" && handleSearch()}
            />
            <Recommendation searchTerm={searchTerm}/>
        </div>
    )
}

export default Redirect