import { useNavigate } from "react-router-dom";
import "./CatalogueCourse.css";
import AddCourse from "./AddCourse";

function CatalogueCourse( {title, description, courseId, id} ) {
    const navigate = useNavigate();
    
    return (    
        <div className="catalogue-course">
            <span className="course-title" onClick={() => navigate(`/catalogue/course/${courseId.toLowerCase()}`)}>{title}</span>
            <div className="information">
                <span className="description">{description}</span>
                <AddCourse courseId={courseId} id={id} />
            </div>
        </div>
    );
}

export default CatalogueCourse;