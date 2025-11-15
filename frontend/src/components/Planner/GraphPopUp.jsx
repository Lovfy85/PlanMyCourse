import './GraphPopUp.css';

function GraphPopUp() {
    return (
        <div className="pop-up-footer">
            <div className="pop-up-window">
                <div className="course-node">
                    <div className="course-colour taken"></div>
                    <span>Taken</span>
                </div>
                <div className="course-node">
                    <div className="course-color not-taken"></div>
                    <span>Not Taken</span>
                </div>
            </div>
        </div>
    );
}

export default GraphPopUp;
