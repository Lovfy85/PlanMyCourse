import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CatalogueCourse.css";
import axios from "axios";

function CatalogueCourse( {title, description, courseId, id} ) {
    const [added, setAdded] = useState(false);
    const navigate = useNavigate();

    // add course to user
    const handleAddCourse = () => {
        try {
            axios.post("http://localhost:3001/coursesadded/",{
                courseId: id,
                taken: false
            }).then(response => {
                setAdded(true)
            }).catch(error => {
                console.error("Failed to add course to user's coursesAdded data.");
            })
        } catch (err) {
            
        }
    }
    
    return (    
        <div className="catalogue-course" onClick={() => navigate(`/catalogue/course/${courseId}`)}>
            <span className="course-title">{title}</span>
            <div className="information">
                <span className="description">{description}</span>
                <button className="add-course" 
                onClick={(e) => {
                    e.stopPropagation()
                    handleAddCourse()
                }}>{added ? "Added" : "Add to Planner"}</button>
            </div>
        </div>
    );
}

export default CatalogueCourse;