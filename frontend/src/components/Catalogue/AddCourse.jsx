import { useState, useEffect } from "react";
import axios from "axios";
import "./AddCourse.css";

//This function is responsible for adding that of a course in that of the planner. The default for each class in the course catalogue
// is that they have not been added yet (hence false).
function AddCourse({ courseId, id, buttonClass = "add-course", added: initialAdded = false }) {

    //Gets to see if that of the class will be added and sets that of the class of whether it is added or not.
    const [added, setAdded] = useState(initialAdded);

    //This is to check if that of the course that is added is seen in that of the planner.
    useEffect(() => {
        axios.get(`http://localhost:3001/coursesadded/${id}`, {withCredentials: true})
            .then(res => {
                try{
                    if (res.data.exists){ 
                        console.log(res.data.exists);
                        setAdded(true);
                    }
                } catch (err) {
                    setAdded(false);
                }        
            })
            .catch(err => {
                setAdded(false);
            });
    }, [id]);

    //This is responsible for that of setting up to see on that of adding a course to the planner overall.
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
            console.error(err);
        }
    }
    
    return (
        <button 
            className={`${buttonClass} ${added ? "added" : ""}`}
            onClick={(e) => {
                e.stopPropagation()
                handleAddCourse()
            }}
        >
            {added ? "Course Added" : "Add to Planner"}
        </button>
    );
}

export default AddCourse;
