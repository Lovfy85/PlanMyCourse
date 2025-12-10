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
        const term = searchTerm.trim().toUpperCase();

        // check for invalid terms
        if (!term || term.trim().length == 0)  {
            setSearchTerm("");
            document.getElementById("searchBox").placeholder = "Oops, it seems you tried entering nothing!";

            setTimeout(() => {
                searchBox.placeholder = "Search for courses...";
            }, 3000);
            return;
        }

        // different filters depending on search input
        if (Number(term)) { // search by course level
            var filtered = Courses.filter(item => Math.floor(Number(item.number)/100)*100 == Number(term));
        } else if (term.length >= 2 && term.length <= 4) { // search by subject
            var filtered = Courses.filter(item => item.subject == term);
        }  else if (term.length > 4 && term.length <= 7 && /\d/.test(term.slice(-1))) { // search by subject + number, checks if last character is a number
            var filtered = Courses.filter(item => (item.subject + item.number) == term);
        } else { // search by exact course subject
            var filtered = Courses.filter(item => item.title.trim().toUpperCase().indexOf(term));
        }

        // check if filters return nothing so don't redirect the user to catalogue page
        if (filtered.length == 0) {
            setSearchTerm("");
            document.getElementById("searchBox").placeholder = "Oops, it seems that we can't find what you're looking for!";

            setTimeout(() => {
                searchBox.placeholder = "Search for courses...";
            }, 3000);
            return;
        }

        // redirect the user to the catalogue page with their search result
        navigate(`./catalogue/${searchTerm}`);
    }

    // hides the dropdown recommended courses
    const handleBlur = (e) => {
        // to prevent blur when the user tabs onto the drop down recommended courses
        const nextFocused = e.relatedTarget;
        if (document.getElementById("recommendation").contains(nextFocused)) {
            return;
        }
        setOnFocused(false);
    }

    // shows the dropdown recommended courses
    const handleFocus = (e) => {
        setOnFocused(true);
        setSearchTerm("")
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