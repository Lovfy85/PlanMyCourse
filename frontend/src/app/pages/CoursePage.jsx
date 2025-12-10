import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './CoursePage.css';
import RatingBar from '../../components/Course/RatingBar.jsx';
import CourseReview from '../../components/Course/CourseReview.jsx'
import AddCourse from '../../components/Catalogue/AddCourse.jsx';
import GraphPopup from '../../components/Course/GraphPopup.jsx';

export default function CoursePage({ user }) {
    const { courseId } = useParams();
    const [id, setId] = useState(0);
    const [course, setCourse] = useState({});
    const [courseNotes, setCourseNotes] = useState('');
    const [coursePrerequisites, setPrerequisites] = useState('');

    const [reviews, setReviews] = useState([]);
    const [ratingsArray, setRatingsArray] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [newReview, setNewReview] = useState('');
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editPost, setEditPost] = useState('');
    const [editRating, setEditRating] = useState(0);
    
    const [isGraphPopupOpen, setIsGraphPopupOpen] = useState(false);

    function processNotes(rawNotes) {
        const cleanData = rawNotes?.split('Prerequisite(s):')[1] || '';
        const [prerequisites, notes] = cleanData.split('Note:');
        return { prerequisites, notes };
    }

    function handleStartEdit(review) {
        setEditingId(review.reviewId);
        setEditPost(review.post || '');
        setEditRating(review.rating || 0);
        setError('');
    }

    function handleCancelEdit() {
        setEditingId(null);
        setEditPost('');
        setEditRating(0);
        setError('');
    }

    async function handleSaveEdit(reviewId) {
        setError('');
        try {

            let updatedReview = null;

            // update comment
            if (editPost !== undefined) {
                const res = await axios.put(`http://localhost:3001/reviewsmade/review/${reviewId}`, { post: editPost }, { withCredentials: true });
                // update local reviews list with returned row if present
                if (res.data && res.data.reviewId) {
                    setReviews((prev) => prev.map((r) => (r.reviewId === reviewId ? res.data : r)));
                }
            }

            // update rating
            if (Number.isInteger(editRating) && editRating >= 1 && editRating <= 5) {
                const res2 = await axios.put(`http://localhost:3001/reviewsmade/rating/${reviewId}`, { rating: editRating }, { withCredentials: true });
                if (res2.data && res2.data.reviewId) {
                    updatedReview = res2.data;
                    setReviews((prev) => prev.map((r) => (r.reviewId === reviewId ? res2.data : r)));
                    setRatingsArray((prev) => {
                        const updated = prev.map((r) => (r.reviewId === reviewId ? res2.data : r));
                        const avg = updated.reduce((s,r) => s + r.rating, 0) / updated.length;
                        setAverageRating(parseFloat(avg.toFixed(2)));
                        return updated;
                    });
                }
            }

            handleCancelEdit();
        } catch (err) {
            const msg = err.response?.data?.message || 'Could not save edit.';
            setError(msg);
        }
    }

    async function handleDelete(reviewId) {
        setError('');
        // Try to delete both post and rating (best-effort)
        try {
            await axios.delete(`http://localhost:3001/reviewsmade/review/${reviewId}`, { withCredentials: true }).catch(() => {});
            await axios.delete(`http://localhost:3001/reviewsmade/rating/${reviewId}`, { withCredentials: true }).catch(() => {});
            // remove locally
            setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
            setRatingsArray((prev) => prev.filter((r) => r.reviewId !== reviewId));
            if (editingId === reviewId) handleCancelEdit();
        } catch (err) {
            const msg = err.response?.data?.message || 'Could not delete review.';
            setError(msg);
        }
    }

    useEffect(() => {
        axios.get(`http://localhost:3001/courses/name/${courseId}`)
            .then((response) => {
                const courseData = response.data[0];
                setCourse(courseData || {});
                const { prerequisites, notes } = processNotes(courseData?.notes || '');
                setPrerequisites(prerequisites || '');
                setCourseNotes(notes || '');
                setId(courseData?.courseId || 0);
            })
            .catch((err) => console.error('Error fetching course', err));
    }, [courseId]);

    useEffect(() => {
        if (!id) return;
        axios.get(`http://localhost:3001/reviewsmade/review/${id}`)
            .then((res) => setReviews(res.data || []))
            .catch(() => {});
        axios.get(`http://localhost:3001/reviewsmade/rating/${id}`)
            .then((res) => {
                const data = res.data || [];
                setRatingsArray(data);
                if (data.length > 0) {
                    const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
                    setAverageRating(parseFloat(avg.toFixed(2)));
                } else setAverageRating(0);
            })
            .catch(() => {});
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('You must be logged in to submit a review');
            return;
        }

        if (rating === 0) {
            setError('Must include a star');
            return;
        }
        if (!newReview || newReview.trim() === '') {
            setError('A comment is required');
            return;
        }

        const payload = { post: newReview.trim(), rating, courseId: id };
        axios.post('http://localhost:3001/reviewsmade/reviews', payload, { withCredentials: true })
            .then((res) => {
                setReviews((p) => [...p, res.data]);
                setRatingsArray((p) =>{
                    const updated = [...p, res.data];
                    const avg = updated.reduce((s, r) => s + r.rating, 0) / updated.length;
                    setAverageRating(parseFloat(avg.toFixed(2)));
                    return updated;
                });

                setNewReview('');
                setRating(0);
                setHover(0);
            })
            .catch((err) => {
                const msg = err.response?.data?.message || 'There was an error submitting your review.';
                setError(msg);
            });
    }

    const ratingsOverall = [5, 4, 3, 2, 1].map((star) => ({ star, total: ratingsArray.filter((r) => r.rating === star).length }));

    return (
        <div className="course-content">
            <div className="course-top-section">
                <div className="course-header">
                    <h1>{course.title}</h1>
                    <hr />
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
                        <button className="course-view" onClick={() => setIsGraphPopupOpen(true)}>
                            View Prerequisite Graph
                        </button>

                    </div>
                </div>
            </div>

            <div className="course-review-section">
                <div className="course-statistics">
                    <div className="course-rating">
                        <h3>{ratingsArray.length > 0 ? `Average rating: ${averageRating}` : 'The course has not been rated yet'}</h3>
                    </div>
                    <div className="course-distribution">
                        {ratingsOverall.map((r) => (
                            <RatingBar key={r.star} type={r.star} amount={r.total} total={ratingsArray.length} />
                        ))}
                    </div>
                </div>

                <div className="divider" />

                <form className="course-new-review" onSubmit={handleSubmit}>
                    <h3>Create new review</h3>
                    <textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} placeholder="Write your review..." />
                    {error && <p className="error-message">{error}</p>}

                    <div className="course-new-buttons">
                        <div className="course-new-stars">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <span key={n} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} className={(hover || rating) >= n ? 'new-star filled' : 'new-star'}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <button className="course-new-submit" type="submit">
                            Post Review
                        </button>
                    </div>
                </form>
            </div>

            <div className="course-reviews">
                {reviews.map((r) => (
                    <div key={r.reviewId} className="course-review-block">
                        <div className="course-review-main">
                            <CourseReview username={r.username} message={r.post || ''} rating={r.rating} timestamp={new Date(r.createdAt).toLocaleDateString()} />

                            {user?.username === r.username && (
                                <div className="review-actions">
                                    <button className="review-edit" onClick={() => handleStartEdit(r)}>Edit</button>
                                    <button className="review-delete" onClick={() => handleDelete(r.reviewId)}>Delete</button>
                                </div>
                            )}
                        </div>

                        {editingId === r.reviewId && (
                            <div className="course-review-edit">
                                <textarea value={editPost} onChange={(e) => setEditPost(e.target.value)} />
                                <div className="edit-stars">
                                    {[1,2,3,4,5].map((n) => (
                                        <span key={n} onClick={() => setEditRating(n)} className={(editRating || 0) >= n ? 'new-star filled' : 'new-star'}>★</span>
                                    ))}
                                </div>
                                <div className="edit-buttons">
                                    <button onClick={() => handleSaveEdit(r.reviewId)}>Save</button>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                </div>
                            </div>
                        )}

                        <div className="course-review-divider" />
                    </div>
                ))}
            </div>
            <GraphPopup 
                isOpen={isGraphPopupOpen} 
                onClose={() => setIsGraphPopupOpen(false)} 
                courseId={courseId} 
            />
        </div>
    
    );
}