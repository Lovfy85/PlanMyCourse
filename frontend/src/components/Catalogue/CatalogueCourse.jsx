import { useNavigate } from "react-router-dom";
import "./CatalogueCourse.css";
import axios from "axios";

function CatalogueCourse( {title, description, courseId, id} ) {
    console.log(courseId)
    const navigate = useNavigate();

    // add course to user
    const handleAddCourse = () => {
        try {
            axios.post("http://localhost:3001/coursesadded/",{
                courseId: id,
                taken: false
            }).then(response => {

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
                <button className="add-course" onClick={handleAddCourse}>Add to Planner</button>
            </div>
        </div>
    );
}

export default CatalogueCourse;