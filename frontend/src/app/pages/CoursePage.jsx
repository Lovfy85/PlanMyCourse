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
    
    const [reviews, setReviews] = useState([]);
    const [ratingsArray, setRatingsArray] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [newReview, setNewReview] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        setError("");

        if (!newReview && rating === 0) {
            setError("Give a review or star rating to submit either one.");
            return;
        }

        if(rating > 0){
            const ratingCurrent = {rating, courseId: id};

            axios.post('http://localhost:3001/reviewsmade/rating', ratingCurrent, {withCredentials: true})
                .then((res) => {
                    setRatingsArray((prev) => {
                        let newRatings = [...prev];
                        const existingIndex = prev.findIndex(r => r.reviewId === res.data.reviewId);

                        if(existingIndex >= 0){
                            newRatings[existingIndex] = res.data;
                        }
                        else{
                            newRatings.push(res.data);
                        }

                        const average = newRatings.reduce((sum, r) => sum + r.rating, 0) / newRatings.length;
                        setAverageRating(parseFloat(average.toFixed(2)));

                        return newRatings;
                    });

                    setHover(0);
                })
                .catch(err => {
                    console.error("Error in rating:", err);
                    setError("There seems to be an error when submitting a rating to the course.")});
        }

        if(newReview){
            const reviewCurrent = {post: newReview, courseId: id};
            axios.post('http://localhost:3001/reviewsmade/review', reviewCurrent, {withCredentials: true})
                .then((res) => {
                    setReviews((prev) => [...prev, res.data]);
                    setNewReview("");
                })
                .catch(err => 
                    setError("There seems to be an error when submitting a review to the course."));
        }

    };

    function processNotes (rawNotes) {
        const cleanData = rawNotes.split("Prerequisite(s):")[1] || "";
        const [prerequisites, notes] = cleanData.split("Note:");
        return { prerequisites, notes };
    }

    useEffect(() => {
        axios.get(`http://localhost:3001/courses/name/${courseId}`)
        .then((response) => {
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

        axios.get(`http://localhost:3001/reviewsmade/review/${id}`)
        .then((res) => {
            console.log("All reviews fetched:", res.data);
            setReviews(res.data);       
        })
        .catch(err => console.error("There seems to be an error getting that of the review comments made in a course", err));
    
        axios.get(`http://localhost:3001/reviewsmade/rating/${id}`)
        .then(res => {
            console.log("All ratings fetched:", res.data);
            setRatingsArray(res.data);

            if(res.data.length > 0){
                const average = res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length;
                setAverageRating(parseFloat(average.toFixed(2)));
            }
            else{
                setAverageRating(0);
            }
            const myRating = res.data.find(r => r.username === user?.username);
            if(myRating){
                setRating(myRating.rating);
            }   
        })
        .catch(err => console.error("There seems to be an error getting that of the star ratings made in a course", err));
    }, [id, user]);

    function calculateRatingsOverall() {
        return [5,4,3,2,1].map(star => {
            const total = ratingsArray.filter(r => r.rating === star).length;
            return {star, total};
        });
    }

    const ratingsOverall = calculateRatingsOverall();

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
                    <h3>
                        {ratingsArray.length > 0
                            ? `Average rating: ${averageRating}`
                            : "The course has not been rated yet"}
                    </h3>
                    {/* <p>Average rating</p> */}
                </div>
                <div className="course-distribution">
                    {ratingsOverall.map(r => (
                        <RatingBar key = {r.star} type = {r.star} amount = {r.total} total = {ratingsArray.length}/>
                    ))}
                </div>
            </div>

            <div className="divider"></div>

            <form className="course-new-review" onSubmit={handleSubmit}>
                <h3>Create new review</h3>
                <textarea 
                    value = {newReview}
                    onChange={e => setNewReview(e.target.value)}
                    placeholder="Write your review...">
                </textarea>
                {error && <p className="error-message">{error}</p>}

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
                    <button className="course-new-submit" type = "submit">Post Review</button>
                </div>
            </form>
        </div>

        <div className="course-reviews">
            {reviews.map(r => (
                <div key = {r.reviewId}>
                    <CourseReview
                        username={r.username}
                        message = {r.post || ""}
                        timestamp = {new Date(r.createdAt).toLocaleDateString()}
                    />
                <div className="course-review-divider"></div>
                </div>
            ))}
        </div>
    </div>
    );
}

export default CoursePage;