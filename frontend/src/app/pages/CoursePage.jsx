import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './CoursePage.css';
import RatingBar from '../../components/Course/RatingBar.jsx';
import CourseReview from '../../components/Course/CourseReview.jsx'
import AddCourse from '../../components/Catalogue/AddCourse.jsx';

function CoursePage({user}) {
    const {courseId} = useParams()
    const [id, setId] = useState(0);
    const [course, setCourse] = useState({});
    const [courseNotes, setCourseNotes] = useState("");
    const [coursePrerequisites, setPrerequisites] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (rating === 0) {
            
        }
    }

    function processNotes(rawNotes) {
        const cleanData = rawNotes.split("Prerequisite(s):")[1] || "";

        const [prerequisites, notes] = cleanData.split("Note:");
        
        return { prerequisites, notes };
    }
    useEffect(() => {
        axios.get(`http://localhost:3001/courses/name/${courseId}`)
        .then(response => {
            const courseData = response.data[0];
            setCourse(courseData);
            const { prerequisites, notes } = processNotes(courseData.notes);
            setPrerequisites(prerequisites);
            setCourseNotes(notes);
            setId(courseData.courseId);
        })
        .catch(error => {
            console.error("Error fetching by courseNumber", error)
        });
    }, [courseId]);

    return (
    <div className="course-content">
        <div className="course-top-section">
            <div className="course-header">
                <h1>{course.title}</h1>
                <hr></hr>
            </div>
            <div className="course-info">
                <h3>Description:</h3>
                <span className="course-description">{course.description}</span>
                {coursePrerequisites?.trim() && (
                <>
                    <h5>Prerequisite(s):</h5>      
                    <span className="course-prerequisites">{coursePrerequisites}</span>
                </>
                )}
                {courseNotes?.trim() && (
                <>
                    <h5>Notes:</h5>
                    <span className="course-notes">{courseNotes}</span>
                </>
                )}
                <div className="course-buttons">
                    <AddCourse courseId={courseId} id={id} user={user} buttonClass="course-planner-add" />
                    <button className="course-view">View Prerequisite Graph</button>
                </div>
            </div>
        </div>
        <div className="course-review-section">
            <div className="course-statistics">
                <div className="course-rating">
                    <h3>Course not reviewed yet</h3>
                    {/* <p>Average rating</p> */}
                </div>
                <div className="course-distribution">
                    <RatingBar type="5" amount="0" total="0"/>
                    <RatingBar type="4" amount="0" total="0"/>
                    <RatingBar type="3" amount="0" total="0"/>
                    <RatingBar type="2" amount="0" total="0"/>
                    <RatingBar type="1" amount="0" total="0"/>
                </div>
            </div>
            <div className="divider"></div>
            <form className="course-new-review">
                <h3>Create new review</h3>
                <textarea required placeholder="Write your review..."></textarea>
                <div className="course-new-buttons">
                    <div className="course-new-stars">
                        {[1,2,3,4,5].map((n) => (
                            <span
                                key={n}
                                onClick={() => setRating(n)}
                                onMouseEnter={() => setHover(n)}
                                onMouseLeave={() => setHover(0)}
                                className={(hover || rating) >= n ? "new-star filled" : "new-star"}
                            >
★
                            </span>
                        ))}
                    </div>
                    <button className="course-new-submit">Post Review</button>
                </div>
            </form>
        </div>
        <div className="course-reviews">
            <CourseReview username="USERNAME" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam imperdiet." timestamp="November 11, 2025" rating="3" />
            <div className="course-review-divider"></div>
        </div>
    </div>
    )
}

export default CoursePage