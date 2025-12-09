import "./CourseReview.css";

function CourseReview( {username, message, rating, timestamp} ) {
    return (   
        <div className="course-review">
            <div className="review-header">
                <h4>{username}</h4>
                <p>{timestamp}</p>
            </div>
            {rating && <p> Rating: {rating} / 5 </p>}
            <span>{message}</span>

        </div>
    );
}

export default CourseReview;