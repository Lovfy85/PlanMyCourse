import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import "./CataloguePage.css";
import CatalogueCourse from '../../components/Catalogue/CatalogueCourse';

function CataloguePage() {
  let {term} = useParams()
  const [courses, setCourses] = useState([]);
  //const [mappableCourses, setMappableCourses] = useState([]);

  useEffect(() => {
        axios.get(`http://localhost:3001/courses/search?term=${term}`)
        .then(response => {
            const data = response.data;
            setCourses(data);
        })
        .catch(error => {
            console.error("Error fetching courses added", error)
        });
        
        // axios.get("http://localhost:3001/coursesadded/")
        // .then(response => {
        //     // console.log(response.data);
        //     const processedData = processData(response.data);
        //     setMappableCourses(processedData);
        // })
        // .catch(error => {
        //     console.error("Error fetching courses added", error)
        // });
    }, [term]);
    
  return (
    <div className="content">
      <div className="catalogue-header">
        <h1>Course Catalogue</h1>
        <hr></hr>
      </div>
      <div className='catalogue-courses'>
          {courses.map((course, index) => {
              return (
                <CatalogueCourse id={course.courseId} title={course.title} description={course.description}/>
              );
          })}
      </div>
    </div>
  )
}

export default CataloguePage
