import './CoursePage.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function CoursePage() {
    let {courseId} = useParams()
    useEffect(() => {
        axios.get(`http://localhost:3001/courses/search?term=${courseId}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error("Error fetching by id", error)
        });
    }, []);
    return (
    <div className="content">
        <div className="course-header">
            <h1>COURSE NAME!!</h1>
            <hr></hr>
        </div>
    </div>
    )
}

export default CoursePage
