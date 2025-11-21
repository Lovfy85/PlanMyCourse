import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import "./AddCourse.css";

function AddCourse({ id, buttonClass = "add-course", user}) {
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!user) return; // don't fetch if logged out or loading

        axios.get(`http://localhost:3001/coursesadded/${id}`, { withCredentials: true })
            .then(res => {
                setAdded(res.data.exists ? true : false);
            })
            .catch(() => setAdded(false));
    }, [id, user]);  // re-run when user becomes logged in

    const handleAddCourse = () => {
        if (!user) {
            alert("You need to log in to use the planner.");
            return;
        }

        axios.post("http://localhost:3001/coursesadded/", {
            courseId: id,
            taken: false
        }, { withCredentials: true })
            .then(() => setAdded(true))
            .catch(() => console.error("Failed to add course."));
    };

    return (
        <>
            {/* Only show button if user is authenticated */}
            {user && (
                <button
                    className={`${buttonClass} ${added ? "added" : ""}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddCourse();
                    }}
                >
                    {added ? "Course Added" : "Add to Planner"}
                </button>
            )}
        </>
    );
}

export default AddCourse;
