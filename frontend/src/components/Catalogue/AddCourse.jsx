import { useState, useEffect } from "react";
import axios from "axios";
import "./AddCourse.css";

function AddCourse({ courseId, id, buttonClass = "add-course" }) {
    const [added, setAdded] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3001/coursesadded/${id}`)
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
                taken: true
            }).then(response => {
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
