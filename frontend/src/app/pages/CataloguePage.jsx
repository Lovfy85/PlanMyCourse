import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import "./CataloguePage.css";
import CatalogueCourse from '../../components/Catalogue/CatalogueCourse';

function CataloguePage() {
  let {term} = useParams()
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
        axios.get(`http://localhost:3001/courses/search?term=${term}`)
        .then(response => {
            const data = response.data;
            setCourses(data);
        })
        .catch(error => {
            axios.get(`http://localhost:3001/courses/search?term=${"CMPT"}`)
            const data = response.data;
            console.error("Error fetching courses added", error)
        });
    }, [term]);
    
  return (
    <div className="catalogue-content">
      <div className="catalogue-header">
        <h1>Course Catalogue</h1>
        <hr></hr>
      </div>
      <div className='catalogue-courses'>
          {courses.map((course) => {
              return (
                <CatalogueCourse title={course.title} description={course.description} courseId={course.class_name} id={course.courseId}/>
              );
          })}
      </div>
    </div>
  )
}

export default CataloguePage

