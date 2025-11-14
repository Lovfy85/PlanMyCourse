import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Recommendation from "../Recommend/Recommendations";
import "./Redirect.css"
import Courses from "../../../../web-scraper/courses.json"

// redirect component
function Redirect() {
    const [searchTerm, setSearchTerm] = useState("");
    const [onFocus, setOnFocused] = useState(false);
    const navigate = useNavigate();

    // redirect the user to the catalogue page
    const handleSearch = () => {
        if (!searchTerm) return;
        if (Number(searchTerm)) {
            var filtered = Courses.filter(item => Math.floor(Number(item.number)/100)*100 == Number(searchTerm));
        } else {
            var filtered = Courses.filter(item => item.subject == searchTerm.slice(0,4).toUpperCase());
        }

        if (filtered.length == 0) {
            return;
        }

        navigate(`./catalogue/${searchTerm.toUpperCase().trim()}`);
    }

    // to prevent blur when the user tabs onto the drop down recommended courses
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