import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddCourse from "../Catalogue/AddCourse.jsx";
import "./CatalogueCourse.css";

function CatalogueCourse( {title, description, courseId, id, user} ) {
    const navigate = useNavigate();
    
    return (    
        <div className="catalogue-course">
            <span className="course-title" onClick={() => navigate(`/catalogue/course/${courseId.toLowerCase()}`)}>{title}</span>
            <div className="information">
                <span className="description">{description}</span>

                <AddCourse 
                    id={id} 
                    buttonClass="add-course" 
                    user={user}
                />

            </div>
        </div>
    );
}

export default CatalogueCourse;