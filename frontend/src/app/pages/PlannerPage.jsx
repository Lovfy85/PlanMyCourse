import './PlannerPage.css'
import Accordion from '../../components/Planner/Accordion'
import PlannerGraph from '../../components/Planner/PlannerGraph'

import axios from 'axios'
import { useEffect, useState } from 'react'

function PlannerPage() {
    const [mappableCourses, setMappableCourses] = useState([]);
    const [undoStack, setUndoStack] = useState([]);
    const [isGraphOpen, setIsGraphOpen] = useState(false);
    const [allCourses, setAllCourses] = useState([]);

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
            setAllCourses(response.data);
        })
        .catch(error => {
            console.error("Error fetching courses added", error)
        });
    };

    const handleDelete = (deletedCourse) => {
        // Add deleted course to undo stack with a timer
        const undoItem = {
            id: deletedCourse.id,
            courseId: deletedCourse.courseId,
            taken: deletedCourse.taken,
            title: deletedCourse.title,
            timer: setTimeout(() => {
                // Remove this item from stack after 5 seconds
                setUndoStack(prev => prev.filter(item => item.id !== deletedCourse.id));
            }, 5000)
        };

        setUndoStack(prev => [...prev, undoItem]);
        fetchCourses();
    };

    const handleTakenChange = (id, newTakenValue) => {
        // Update local state immediately for responsive UI
        setAllCourses(prevCourses => 
            prevCourses.map(course => 
                course.id === id ? { ...course, taken: newTakenValue } : course
            )
        );
        setMappableCourses(prevMappable => 
            prevMappable.map(levelGroup => ({
                ...levelGroup,
                courses: levelGroup.courses.map(course =>
                    course.id === id ? { ...course, taken: newTakenValue } : course
                )
            }))
        );
    };

    const handleUndo = async (undoItem) => {
        try {
            // Re-add the course to the planner
            await axios.post("http://localhost:3001/coursesadded/", {
                courseId: undoItem.courseId,
                taken: undoItem.taken
            });

            // Clear timer and remove from stack
            clearTimeout(undoItem.timer);
            setUndoStack(prev => prev.filter(item => item.id !== undoItem.id));

            // Refresh the courses list
            fetchCourses();
        } catch (error) {
            console.error("Error restoring course:", error);
        }
    };

    const handleDismiss = (undoItem) => {
        clearTimeout(undoItem.timer);
        setUndoStack(prev => prev.filter(item => item.id !== undoItem.id));
    };

    useEffect(() => {
        fetchCourses();
        
        // Cleanup all timers on unmount
        return () => {
            undoStack.forEach(item => clearTimeout(item.timer));
        };
    }, []);

    return (
    <>
        <div className="planner-content">
            <div className="planner-header">
                <div className='header-line'>
                    <h1>Class Planner</h1>
                    <button className='planner-graph' onClick={() => setIsGraphOpen(true)}>Planner Graph</button>
                </div>
                <hr></hr>
            </div>
            <div className="class-sections">
                {mappableCourses.map(({ level, courses }) => (
                    <Accordion key={level} level={level} courses={courses} onDelete={handleDelete} onTakenChange={handleTakenChange} />
                ))}
            </div>

            {/* Undo Notifications */}
            <div className="undo-notifications-container">
                {undoStack.map((undoItem) => (
                    <div key={undoItem.id} className="undo-notification">
                        <span>"{undoItem.title}" removed from planner</span>
                        <button className="undo-btn" onClick={() => handleUndo(undoItem)}>Undo</button>
                        <button className="close-btn" onClick={() => handleDismiss(undoItem)}>✕</button>
                    </div>
                ))}
            </div>
        </div>

        {/* Planner Graph Modal */}
        <PlannerGraph 
            isOpen={isGraphOpen} 
            onClose={() => setIsGraphOpen(false)} 
            courses={allCourses}
        />
    </>
  )
}

export default PlannerPage

