import "./CatalogueCourse.css";
import axios from "axios";

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
    
    return (    
        <div className="catalogue-course">
            <span className="course-title">{title}</span>
            <div className="information">
                <span className="description">{description}</span>
                <span><button className="add-course" onClick={handleAddCourse}>Add to Planner</button></span>
            </div>
        </div>
    );
}

export default CatalogueCourse;