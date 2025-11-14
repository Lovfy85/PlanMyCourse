import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Recommendation from "../Recommend/Recommendations";
import "./Redirect.css"

// redirect component
function Redirect() {
    const [searchTerm, setSearchTerm] = useState("");
    const [onFocus, setOnFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!searchTerm) {
            navigate(`./catalogue/${deperatment}`);
            return;
        }

        navigate(`./catalogue/${searchTerm.toUpperCase().trim()}`);
    }

    const handleBlur = (e) => {
        const nextFocused = e.relatedTarget;
        if (document.getElementById("recommendation").contains(nextFocused)) {
            return;
        }
        setOnFocused(false)
    }

    return (
        <div className="redirectSearchBar">
            <input
                type="text"
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key == "Enter" && handleSearch()}
                onFocus={() => setOnFocused(true)}
                onBlur={(e) => handleBlur(e)}
            />
            <Recommendation searchTerm={searchTerm} onFocused={onFocus}/>
        </div>
    )
}

export default Redirect