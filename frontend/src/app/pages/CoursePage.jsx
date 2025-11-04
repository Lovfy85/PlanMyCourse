import './CoursePage.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function CoursePage() {
    const {courseId} = useParams()
    const [course, setCourse] = useState({});
    useEffect(() => {
        axios.get(`http://localhost:3001/courses/${courseId}`)
        .then(response => {
            setCourse(response.data[0]);
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
    </div>
    )
}

export default CoursePage
