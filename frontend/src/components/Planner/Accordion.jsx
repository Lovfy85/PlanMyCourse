import { useState } from 'react'
import './Accordion.css'
import Class from './AccordionClass'

function Accordion() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="accordion">
        <div className="accordion-header" onClick={() => setIsExpanded(!isExpanded)}>
            <span>100 Level Classes</span>
        </div>
        <div className={`accordion-body ${isExpanded ? "expanded" : ""}`}>
            <div className="accordion-classes">
                <Class title="CMPT140 - Introduction to Creative Computing"/>
                <Class title="CMPT141 - Introduction to Computer Science"/>
                <Class title="CMPT145 - Principles of Computer Science"/>
            </div>
        </div>
    </div>
  );
};

export default Accordion;