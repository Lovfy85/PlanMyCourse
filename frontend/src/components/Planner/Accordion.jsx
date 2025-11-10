import { useState } from 'react'
import './Accordion.css'
import Class from './AccordionClass'

/** Accordion Component
 * 
 * Displays an accordion ui element, with title and hidden body list. Body contents can be toggled through dropdown.
 * 
 * @returns {JSX.Element}
 */
function Accordion({level, courses, onDelete}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="accordion">
        <div className="accordion-header" onClick={() => setIsExpanded(!isExpanded)}>
            <span>{level} Level Classes</span>
        </div>
        <div className={`accordion-body ${isExpanded ? "expanded" : ""}`}>
            <div className="accordion-classes">
              {courses.map(course => (
                <Class key={course.id} title={course.title} id={course.id} onDelete={onDelete}/>
              ))}
            </div>
        </div>
    </div>
  );
};

export default Accordion;