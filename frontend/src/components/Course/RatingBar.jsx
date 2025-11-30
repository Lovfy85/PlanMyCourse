import "./RatingBar.css";

function RatingBar( {type, amount, total} ) {

    const percent = total > 0 ? (amount / total) * 100 : 0;

    return (   
        <div className="rating">
            <p>{type} ★ </p>
            <div className="bar">
                <div className = "bar-fill" style = {{width: `${percent}%`}}></div>
            </div>
            <p>{amount}</p>
        </div>
    );
}

export default RatingBar;