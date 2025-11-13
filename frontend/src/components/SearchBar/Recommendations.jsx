import { useEffect, useState } from "react";
import "./Recommendation.css";
import axios from "axios";

// redirect component
function Recommendation() {
    const [query, setQuery] = useState("");
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/courses/search?term=${term}`)
        .then(response => {
            const data = response.data;
            setCourses(data);
        })
        .catch(error => {
            axios.get(`http://localhost:3001/courses/search?term=${"CMPT"}`)
            const data = response.data;
            console.error("Error fetching courses added", error)
        });
    });

    return (
        <div className='recommendation'>
        {courses.map((course) => {
            return (
                <div className='courseRecommended'>
                    {course.title}
                </div>
            );
        })}
        </div>
    );
}

export default Recommendation