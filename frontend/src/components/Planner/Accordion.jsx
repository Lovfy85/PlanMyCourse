import { useState, useEffect } from 'react'
import './Accordion.css'
import Class from './AccordionClass'
import ProgressBar from './ProgressBar'

/** Accordion Component
 * 
 * Displays an accordion ui element, with title and hidden body list. Body contents can be toggled through dropdown.
 * 
 * @returns {JSX.Element}
 */
function Accordion({level, courses, onDelete, onTakenChange}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [courseStates, setCourseStates] = useState(courses);

  useEffect(() => {
    setCourseStates(courses);
  }, [courses]);

  const handleTakenChange = (id, taken) => {
    setCourseStates(prev => prev.map(c => c.id === id ? {...c, taken} : c));
  };

  const completed = courseStates.filter(c => c.taken).length;
  const total = courseStates.length;

  return (
    <div className="accordion">
        <div className="accordion-header" onClick={() => setIsExpanded(!isExpanded)}>
          <span>{level} Level Classes</span>
          <ProgressBar completed={completed} total={total}/>
          <div className="accordion-header-indicator">
            <i className={`bx bx-chevron-down chevron ${isExpanded ? "expanded" : ""}`}></i>
          </div>
        </div>
        <div className={`accordion-body ${isExpanded ? "expanded" : ""}`}>
            <div className="accordion-classes">
              {courses.map(course => (
                <Class key={course.id} title={course.title} id={course.id} courseId={course.courseId} taken={course.taken} courseName={course.class_name} onDelete={onDelete} onTakenChange={onTakenChange}/>
              ))}
            </div>
        </div>
    </div>
  );
};

export default Accordion;