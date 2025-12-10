import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Recommendation from "../Recommend/Recommendations";
import "./Redirect.css"
import Courses from "../../../../web-scraper/courses.json"

// redirect component
function Redirect() {
    const [searchTerm, setSearchTerm] = useState("");
    const [onFocus, setOnFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
            const stored = localStorage.getItem("recentSearches");
            return stored ? JSON.parse(stored) : [];
        });
    const navigate = useNavigate();
    
    useEffect(() => {
        const term = searchTerm.trim().toUpperCase();

        var filtered;

        if (Number(term)) { // search by course level
            filtered = Courses.filter(item => item.number == term)
        } else if (String(term) & term.length == 4) { // search by department
            filtered = Courses.filter(item => item.class_name == term)
        } else if (searchTerm.length >= 1) { // search by title
            filtered = Courses.filter(item => item.title.toUpperCase().trim().includes(searchTerm.trim().toUpperCase()));
        }

        if (filtered) {
            document.getElementById("searchBox").classList.add("showDropdown");
        } else {
            if (recentSearches.length == 0) {
                document.getElementById("searchBox").classList.remove("showDropdown");
            }
        }
    }, [searchTerm]);

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
        } else if (term.length == 4) { // search by depertment
            var filtered = Courses.filter(item => item.subject == term);
        } else { // search by exact course subject
            var filtered = Courses.filter(item => item.title.trim().toUpperCase().includes(term));
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
        navigate(`./catalogue/${term}`);
    }

    // hides the dropdown recommended courses
    const handleBlur = (e) => {
        // to prevent blur when the user tabs onto the drop down recommended courses
        const nextFocused = e.relatedTarget;
        if (document.getElementById("recommendation").contains(nextFocused)) {
            return;
        }
        document.getElementById("searchBox").classList.remove("showDropdown");
        setOnFocused(false);
    }

    // shows the dropdown recommended courses
    const handleFocus = (e) => {
        if (recentSearches.length > 0) {
            document.getElementById("searchBox").classList.add("showDropdown")
        }
        setOnFocused(true);
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