import './PlannerPage.css'
import Accordion from '../../components/Planner/Accordion'

import axios from 'axios'
import { useEffect, useState } from 'react'

function PlannerPage() {
    const [mappableCourses, setMappableCourses] = useState([]);
    const [undoData, setUndoData] = useState(null);
    const [undoTimer, setUndoTimer] = useState(null);

    function processData(data) {
        const sortedCourses = {};
        data.forEach(course => {
            const level = Math.floor(course.number / 100) * 100
            if (!sortedCourses[level]) {
                sortedCourses[level] = [];
            }
            sortedCourses[level].push(course);
        })
        Object.values(sortedCourses).forEach(courseList => {
            courseList.sort((a, b) => a.number - b.number);
        });
        const mappableList = Object.entries(sortedCourses).map(([level, courses]) => ({
            level: Number(level),
            courses
        }));
        return mappableList;
    }

    const fetchCourses = () => {
        axios.get("http://localhost:3001/coursesadded/")
        .then(response => {
            const processedData = processData(response.data);
            setMappableCourses(processedData);
        })
        .catch(error => {
            console.error("Error fetching courses added", error)
        });
    };

    const handleDelete = (deletedCourse) => {
        // Clear any existing undo timer
        if (undoTimer) {
            clearTimeout(undoTimer);
        }

        // Store the deleted course data for undo
        setUndoData({
            id: deletedCourse.id,
            courseId: deletedCourse.courseId,
            taken: deletedCourse.taken,
            title: deletedCourse.title
        });

        // Set up auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
            setUndoData(null);
        }, 5000);

        setUndoTimer(timer);
        fetchCourses();
    };

    const handleUndo = async () => {
        if (!undoData) return;

        try {
            // Re-add the course to the planner
            await axios.post("http://localhost:3001/coursesadded/", {
                courseId: undoData.courseId,
                taken: undoData.taken
            });

            // Clear undo data and timer
            if (undoTimer) {
                clearTimeout(undoTimer);
            }
            setUndoData(null);
            setUndoTimer(null);

            // Refresh the courses list
            fetchCourses();
        } catch (error) {
            console.error("Error restoring course:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
        
        // Cleanup timer on unmount
        return () => {
            if (undoTimer) {
                clearTimeout(undoTimer);
            }
        };
    }, []);

    return (
    <>
        <div className="planner-content">
            <div className="planner-header">
                <div className='header-line'>
                    <h1>Class Planner</h1>
                    <button className='planner-graph'>Planner Graph</button>
                </div>
                <hr></hr>
            </div>
            <div className="class-sections">
                {mappableCourses.map(({ level, courses }) => (
                    <Accordion key={level} level={level} courses={courses} onDelete={handleDelete} />
                ))}
            </div>

            {/* Undo Notification */}
            {undoData && (
                <div className="undo-notification">
                    <span>"{undoData.title}" removed from planner</span>
                    <button className="undo-btn" onClick={handleUndo}>Undo</button>
                    <button className="close-btn" onClick={() => setUndoData(null)}>✕</button>
                </div>
            )}
        </div>
    </>
  )
}

export default PlannerPage

