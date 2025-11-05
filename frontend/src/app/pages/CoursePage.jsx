import { useParams } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './CoursePage.css';

function CoursePage() {
    const {courseId} = useParams()
    const [course, setCourse] = useState({});
    const [courseNotes, setCourseNotes] = useState("");
    const [coursePrerequisites, setPrerequisites] = useState("");

    function processNotes(rawNotes) {
        const cleanData = rawNotes.split("Prerequisite(s):")[1] || "";

        const [prerequisites, notes] = cleanData.split("Note:");
        
        return { prerequisites, notes };
    }
    useEffect(() => {
        axios.get(`http://localhost:3001/courses/${courseId}`)
        .then(response => {
            const courseData = response.data[0];
            setCourse(courseData);
            const { prerequisites, notes } = processNotes(courseData.notes);
            setPrerequisites(prerequisites);
            setCourseNotes(notes);
        })
        .catch(error => {
            console.error("Error fetching by id", error)
        });
    }, [courseId]);
    return (
    <div className="content">
        <div className="course-header">
            <h1>{course.title}</h1>
            <hr></hr>
        </div>
        <div className="course-info">
            <h3>Description:</h3>
            <span className="course-description">{course.description}</span>
            <h5>Prerequisite(s):</h5>      
            <span className="course-prerequisites">{coursePrerequisites}</span>
            <h5>Notes:</h5>
            <span className="course-notes">{courseNotes}</span>
            <div className="course-buttons">
                {/* <div className=""></div> */}
            </div>
        </div>
        <div className="course-rating">
            <div className="course-statistics">
            </div>
            <div className="divider"></div>
            <div className="course-new-review"></div>
        </div>
        <div className="course-reviews">
        </div>
    </div>
    )
}

export default CoursePage
