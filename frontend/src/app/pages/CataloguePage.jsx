import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import "./CataloguePage.css";
import CatalogueCourse from '../../components/Catalogue/CatalogueCourse';

function CataloguePage({user}) {
  const { term } = useParams();

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearch, setSearch] = useState('');

  //Sets that of the sort variant to null considering no type of way of sorting the catalogue has been chosen.
  const [sortVariant, setSortVariant] = useState(null);

  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [loadMore, setLoadMore] = useState(true);
  const [waiting, setWaiting] = useState(false);

  const getCourses = async (reset = false, variant = null, search = '') => {
    if(waiting){
      return;
    }

    setWaiting(true);

    let newOffset = reset ? 0 : offset;
    let url = `http://localhost:3001/courses?offset=${newOffset}&limit=${limit}`;

    if(search){
      url = `http://localhost:3001/courses/search?term=${search}&offset=${newOffset}&limit=${limit}`;
    }

    if(variant){
      url = `http://localhost:3001/courses/sort/${variant}?search=${search}&offset=${newOffset}&limit=${limit}`;
    }

    try{
      const res = await axios.get(url, {withCredentials: true});
      const fetchedCourses = res.data.courses || res.data;

      if(reset){
        setCourses(fetchedCourses);
        setOffset(fetchedCourses.length);
      }
      else{
        setCourses(prev => [...prev, ...fetchedCourses]);
        setOffset(prev => prev + fetchedCourses.length);
      }
      setLoadMore(fetchedCourses.length === limit);
    }
    catch(err){
      console.error("There seems to be an error getting the courses", err);
    }
    finally{
      setWaiting(false);
    }
  };

  useEffect(() => {
    const search = term || ''
    setSearch(search);
    setSearchTerm(search);
    setOffset(0);
    getCourses(true, sortVariant, search);
  }, [term]);

  useEffect(() => {
    const delayTime = setTimeout(() => {
      setSearch(searchTerm);
      setOffset(0);
      getCourses(true, sortVariant, searchTerm);
    }, 300)
    return () => clearTimeout(delayTime);
  }, [searchTerm]);

  useEffect(() => {
    const loadScroll = () => {
      if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300 && loadMore && !waiting){
        getCourses(false, sortVariant, currentSearch);
      }
    };

    window.addEventListener('scroll', loadScroll);
    return () => window.removeEventListener('scroll', loadScroll);
  }, [loadMore, waiting, sortVariant, currentSearch]);

  const sortHandler = (variant) => {
    setSortVariant(variant);
    setOffset(0);
    getCourses(true, variant, searchTerm);
  };

  return (
    <div className="catalogue-content">
      <div className="catalogue-header">
        <h1>Course Catalogue</h1>
        <hr />

    {/**
     * Search bar for filtering courses
     */}
    <div className="catalogue-search">
      <input
        type="text"
        placeholder="Search courses by name, code, or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="catalogue-search-input"
      />
    </div>

    {/**
     * The buttons in which are respsonible for the type of sorting options in which how the course catalogue is to be displayed.
     */}
    <div className="catalogue-sort">
        <button onClick = {() => sortHandler("alphabetical")}>
          Sort By Alphabetical
        </button>

        <button onClick = {() => sortHandler("number")}>
          Sort By Course Number
        </button>

        <button onClick = {() => sortHandler("addedtoplanner")}>
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
              user={user}
            />
          );
        })}
      </div>

    {waiting && (
      <div style = {{textAlign: 'center', margin: '20px 0'}}>More Courses Loading In...</div>
    )}
    </div>
  );
}

export default CataloguePage;


