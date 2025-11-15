import { useEffect, useState, useRef } from "react";
import "./Recommendation.css";
import Courses from "../../../../web-scraper/courses.json"
import { useNavigate } from "react-router-dom";

// recommendation component
function Recommendation( {searchTerm, onFocused} ) {
    const [recommendResult, setRecommendResult] = useState([])
    const [recentSearches, setRecentSearches] = useState(() => {
        const stored = localStorage.getItem("recentSearches");
        return stored ? JSON.parse(stored) : [];
    })
    const navigate = useNavigate()
    const maxRecentSearches = 5; // limit the recent searchs to prevent overflow
    const hasMounted = useRef(false)

    //localStorage.removeItem("recentSearches"); // to clear the user's recent searches when the page reloads

    // update the localstorage for recent searches to save locally
    useEffect(() => {
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }, [recentSearches]);

    // collects recommended courses by the course subject similar to the given term
    useEffect(() => {
        if (searchTerm.length >= 4) {
            var filtered = Courses.filter(item => item.subject == searchTerm.slice(0,4).toUpperCase());
            if (searchTerm.length > 4) {
                filtered = filtered.filter(item => item.number.toString().includes(searchTerm.slice(4,8).trim()));
            }
            filtered = filtered.filter(item => !recentSearches.includes(item))

            setRecommendResult(filtered)
        } else {
            setRecommendResult([]);
        }
    }, [searchTerm])

    // controls the visibility of the drop down recommendations
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            document.getElementById("recommendation").style.visibility = "hidden";
            return;
        }

        if (onFocused == false || recommendResult.length == 0 && recentSearches.length == 0) {
            document.getElementById("recommendation").style.visibility = "hidden";
            return;
        } else if (onFocused == true) {
            document.getElementById("recommendation").style.visibility = "visible";
        }
    }, [onFocused, recommendResult, recentSearches])

    // redirect the user to another page if any of the recommended courses is interacted with
    function redirect(course) {
        if (course) {
            setRecentSearches(recentSearches => {
                const filtered = recentSearches.filter(item => item.title != course.title)
                const updated = [course, ...filtered]
                return updated.slice(0,maxRecentSearches - 1);
            });
            navigate(`./catalogue/${course.class_name.toUpperCase().trim()}`);
        }
    }

    return (
        <div 
        className='recommendation'
        id='recommendation'
        >
            {recentSearches.map((course, index) => {
                return (
                    <button
                        key={course.number}
                        className="courseRecommended"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                redirect(course)
                            }
                        }}
                        onClick={() => redirect(course)}
                        >
                        {course.title}
                        <img 
                            className="icon"
                            src="https://images.icon-icons.com/2024/PNG/512/clockwise_refresh_arrow_icon_123836.png"
                        />
                    </button>
            )})}
            {recommendResult.map((course, index) => {
                return (
                    <button
                        key={course.number}
                        className="courseRecommended"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                redirect(course)
                            }
                        }}
                        onClick={() => redirect(course)}
                        >
                        {course.title}
                        <img 
                            className="icon"
                            src="https://images.icon-icons.com/2024/PNG/512/searcher_magnifyng_glass_search_locate_find_icon_123813.png"
                        />
                    </button>
            )})}
        </div>
    );
}

export default Recommendation