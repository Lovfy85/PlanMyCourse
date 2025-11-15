import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import "./CataloguePage.css";
import CatalogueCourse from '../../components/Catalogue/CatalogueCourse';

function CataloguePage() {
  const { term } = useParams();
  const [courses, setCourses] = useState([]);

  //Sets that of the sort variant to null considering no type of way of sorting the catalogue has been chosen.
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

    {/**
     * The buttons in which are respsonible for the type of sorting options in which how the course catalogue is to be displayed.
     */}
    <div className="catalogue-sort">
        <button onClick = {() => getSortVariant("alphabetical")}>
          Sort By Alphabetical
        </button>

        <button onClick = {() => getSortVariant("number")}>
          Sort By Course Number
        </button>

        <button onClick = {() => getSortVariant("addedtoplanner")}>
          Sort By Added To Planner/Not In Planner
        </button>

        </div>
      </div>

      {/**
      * This is to display that of each of the courses to be seen in the course catalogue.
      * Also, that of the 'added' part, that is implemented to make sure that the sort for courses that are added in the planner and courses not added in the planner works.
     */}
      <div className='catalogue-courses'>
        {courses.map((course) => {
          return (
            <CatalogueCourse
              key={course.courseId}
              title={course.title}
              description={course.description}
              courseId={course.class_name}
              id={course.courseId}
              added={course.taken === 1}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CataloguePage;


