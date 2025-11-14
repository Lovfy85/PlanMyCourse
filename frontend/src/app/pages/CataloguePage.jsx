import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import "./CataloguePage.css";
import CatalogueCourse from '../../components/Catalogue/CatalogueCourse';

function CataloguePage() {
  const { term } = useParams();
  const [courses, setCourses] = useState([]);
  const [setSortVariant] = useState(null);

  useEffect(() => {
  let url = `http://localhost:3001/courses`;

  if (term) {
    url += `/search?term=${term}`;
  }

  axios.get(url)
    .then(res => setCourses(res.data))
    .catch(console.error);
}, [term]);

const getSortVariant = (variant) => {
  axios.get(`http://localhost:3001/courses/sort/${variant}`).then(res => {
    setCourses(res.data);
    setSortVariant(variant);
  }).catch(console.error);
};

  return (
    <div className="catalogue-content">
      <div className="catalogue-header">
        <h1>Course Catalogue</h1>
        <hr></hr>

    <div className="catalogue-sort">
        <button onClick = {() => getSortVariant("alphabetical")}>
          Course Name Alphabetical Sort
        </button>

        <button onClick = {() => getSortVariant("number")}>
          Course Number Sort
        </button>

        <button onClick = {() => getSortVariant("taken")}>
          Taken/Untaken Sort
        </button>

        </div>
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