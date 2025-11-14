import { useEffect, useState } from "react";
import "./Recommendation.css";
import Courses from "../../../../web-scraper/courses.json"
import { Navigate, useNavigate } from "react-router-dom";

// redirect component
function Recommendation( {searchTerm} ) {
    const [recommendResult, setRecommendResult] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (searchTerm.length > 3) {
            var filtered = Courses.filter(item => item.subject == searchTerm.slice(0,4).toUpperCase());
            if (searchTerm.length > 4) {
                filtered = filtered.filter(item => item.number.toString().includes(searchTerm.slice(4,8).trim()));
            }

            setRecommendResult(filtered)
            document.getElementById("recommendation").style.visibility = "visible"

        } else {
            document.getElementById("recommendation").style.visibility = "hidden"
            setRecommendResult([])
        }
    }, [searchTerm])

    function autoFillSearch(course) {
        navigate(`./catalogue/${course.class_name.toUpperCase().trim()}`);
    }

    return (
        <div 
        className='recommendation'
        id='recommendation'
        >
            {recommendResult.map((course, index) => {
                return (
                    <button
                    key={index}
                    className="courseRecommended"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            autoFillSearch(course)
                        }
                    }}
                    onClick={() => autoFillSearch(course)}
                    >
                        {course.title}
                    </button>
                );
            })}
        </div>
    );
}

export default Recommendation