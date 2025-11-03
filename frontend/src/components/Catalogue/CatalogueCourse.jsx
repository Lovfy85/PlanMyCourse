import "./CatalogueCourse.css";

function CatalogueCourse( {title, description} ) {
    return (    
        <div className="catalogue-course">
            <span className="course-title">{title}</span>
            <span className="description">{description}</span>
        </div>
    );
}

export default CatalogueCourse;