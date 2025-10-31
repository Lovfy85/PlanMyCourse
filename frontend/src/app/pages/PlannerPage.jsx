import './PlannerPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Accordion from '../../components/Planner/Accordion'

import axios from 'axios'
import React, { useEffect } from 'react'

function PlannerPage() {
    useEffect(() => {
        axios.get("http://localhost:3001/coursesadded/")
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error("Error fetching courses added", error)
        });
    });
    return (
    <>
        <Navbar />
        <div className="content">
            <div className="planner-header">
                <h1>Class Planner</h1>
                <hr></hr>
            </div>
            <div className="class-sections">
                <Accordion />
                <Accordion />
                <Accordion />
                <Accordion />
                <Accordion />
            </div>
        </div>
    </>
  )
}

export default PlannerPage
