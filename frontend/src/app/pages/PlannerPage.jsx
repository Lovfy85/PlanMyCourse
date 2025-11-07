import './PlannerPage.css'
import Accordion from '../../components/Planner/Accordion'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

function PlannerPage() {
    const [mappableCourses, setMappableCourses] = useState([]);
    function processData(data) {
        const sortedCourses = {};
        data.forEach(course => {
            const level = Math.floor(course.number / 100) * 100
            if (!sortedCourses[level]) {
                sortedCourses[level] = [];
            }
            sortedCourses[level].push(course);
        })
        Object.values(sortedCourses).forEach(courseList => {
            courseList.sort((a, b) => a.number - b.number);
        });
        const mappableList = Object.entries(sortedCourses).map(([level, courses]) => ({
            level: Number(level),
            courses
        }));
        // console.log(mappableList);

        return mappableList;
    }
    useEffect(() => {
        axios.get("http://localhost:3001/coursesadded/")
        .then(response => {
            // console.log(response.data);
            const processedData = processData(response.data);
            setMappableCourses(processedData);
        })
        .catch(error => {
            console.error("Error fetching courses added", error)
        });
    }, []);
    return (
    <>
        <div className="planner-content">
            <div className="planner-header">
                <h1>Class Planner</h1>
                <hr></hr>
            </div>
            <div className="class-sections">
                {mappableCourses.map(({ level, courses }) => (
                    <Accordion level={level} courses={courses} />
                ))}
            </div>
        </div>
    </>
  )
}

export default PlannerPage

