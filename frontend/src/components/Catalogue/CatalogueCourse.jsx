import { useNavigate } from "react-router-dom";
import "./CatalogueCourse.css";

function CatalogueCourse( {title, description} ) {
    const navigate = useNavigate();
    return (    
        <div className="catalogue-course">
            <span className="course-title">{title}</span>
            <span className="description">{description}</span>
        </div>
    );
}

export default CatalogueCourse;