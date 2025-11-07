import { useNavigate, } from 'react-router-dom';
import "./CatalogueCourse.css";
import axios from "axios";

<<<<<<< HEAD
function CatalogueCourse( {id, title, description} ) {

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
    
=======
function CatalogueCourse( {title, description, courseId} ) {
    const navigate = useNavigate();
>>>>>>> f730b1251bb9de6f197d76639a5d10406603be00
    return (    
        <div className="catalogue-course" onClick={() => navigate(`/catalogue/course/${courseId}`)}>
            <span className="course-title">{title}</span>
            <div className="information">
                <span className="description">{description}</span>
                <span><button className="add-course" onClick={handleAddCourse}>Add to Planner</button></span>
            </div>
        </div>
    );
}

export default CatalogueCourse;