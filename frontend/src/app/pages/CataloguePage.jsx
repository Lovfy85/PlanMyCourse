import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import "./CataloguePage.css";
import CatalogueCourse from '../../components/Catalogue/CatalogueCourse';

function CataloguePage() {
  const { term } = useParams();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // If term exists → search
    // If no term → fetch ALL courses
    const url = term
      ? `http://localhost:3001/courses/search?term=${term}`
      : `http://localhost:3001/courses`;

    axios.get(url)
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error("Error fetching courses", error);
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
            <CatalogueCourse
              key={course.courseId}
              title={course.title}
              description={course.description}
              courseId={course.class_name}
              id={course.courseId}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CataloguePage;