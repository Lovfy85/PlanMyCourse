import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CatalogueCourse.css";
import axios from "axios";

function CatalogueCourse( {title, description, courseId, id} ) {
    const [added, setAdded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/coursesadded/${id}`, {withCredentials: true})
            .then(res => {
                if (res.data.exists){ 
                    setAdded(true);
                }
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleAddCourse = () => {
        try {
            axios.post("http://localhost:3001/coursesadded/",{
                courseId: id,
                taken: false
            }, {withCredentials: true}).then(response => {
                setAdded(true)
            }).catch(error => {
                console.error("Failed to add course to user's coursesAdded data.");
            })
        } catch (err) {
            
        }
    }
    
    return (    
        <div className="catalogue-course">
            <span className="course-title" onClick={() => navigate(`/catalogue/course/${courseId.toLowerCase()}`)}>{title}</span>
            <div className="information">
                <span className="description">{description}</span>
                <button className={`add-course ${added ? "added" : ""}`}
                onClick={(e) => {
                    e.stopPropagation()
                    handleAddCourse()
                }}>{added ? "Course Added" : "Add to Planner"}</button>
            </div>
        </div>
    );
}

export default CatalogueCourse;