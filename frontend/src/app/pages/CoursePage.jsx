import './CoursePage.css'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

function CoursePage() {
    const test = 0;
    useEffect(() => {
        axios.get("http://localhost:3001/")
        .then(response => {
            
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
