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
        const term = searchTerm.trim().toUpperCase()

        if (!term)  {
            setSearchTerm("")
            document.getElementById("searchBox").placeholder = "Oops, it seems you tried entering nothing!"

            setTimeout(() => {
                searchBox.placeholder = "Search for courses...";
            }, 3000);
            return;
        }

        if (Number(term)) {
            var filtered = Courses.filter(item => Math.floor(Number(item.number)/100)*100 == Number(term));
        } else if (term.length == 4) {
            var filtered = Courses.filter(item => item.subject == term);
        } else {
            var filtered = Courses.filter(item => item.class_name == term);
        }

        if (filtered.length == 0) {
            setSearchTerm("")
            document.getElementById("searchBox").placeholder = "Oops, it seems that we can't find what you're looking for!"

            setTimeout(() => {
                searchBox.placeholder = "Search for courses...";
            }, 3000);
            return;
        }

        navigate(`./catalogue/${term}`);
    }

    // to prevent blur when the user tabs onto the drop down recommended courses
    const handleBlur = (e) => {
        const nextFocused = e.relatedTarget;
        if (document.getElementById("recommendation").contains(nextFocused)) {
            return;
        }
        document.getElementById("searchBox").classList.remove("showDropdown");
        setOnFocused(false)
    }

    const handleFocus = (e) => {
        document.getElementById("searchBox").classList.add("showDropdown");
        setOnFocused(true)
    }

    return (
        <div className="redirectSearchBar">
            <input
                id="searchBox"
                type="text"
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key == "Enter" && handleSearch()}
                onFocus={(e) => handleFocus(e)}
                onBlur={(e) => handleBlur(e)}
            />
            <Recommendation searchTerm={searchTerm} onFocused={onFocus}/>
        </div>
    )
}

export default Redirect