import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';

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
            console.error("Error fetching courses added", error)
        });
    }, [term]);
    
  return (
    <div className='courseCatalogue'>
        {courses.map((course, index) => {
            return (
            <div 
              className = "course" 
              key={index} 
            >
                <div className='coursetitle'>{course.title}</div>
                <div className='description'>{course.description}</div>
            </div>
            );
        })}
    </div>
  )
}

export default CataloguePage
