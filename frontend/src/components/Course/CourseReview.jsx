import "./CourseReview.css";

function CourseReview( {username, message, rating, timestamp} ) {
    return (
        <div className="course-review">
            <div className="review-header">
                <h4>{username}</h4>
                <p>{timestamp}</p>
            </div>

            {rating > 0 && (
                <div className="review-stars" aria-label={`Rating: ${rating} out of 5`}>
                    {[1,2,3,4,5].map((n) => (
                        <span key={n} className={n <= rating ? 'review-star filled' : 'review-star'}>★</span>
                    ))}
                </div>
            )}

            <span>{message}</span>

        </div>
    );
}

export default CourseReview;