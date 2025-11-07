import "./RatingBar.css";

function RatingBar( {type, amount, total} ) {
    return (   
        <div className="rating">
            <p>{type} star</p>
            <div className="bar"></div>
            <p>{amount}</p>
        </div>
    );
}

export default RatingBar;