import { useState } from 'react'
import './Accordion.css'

function Accordion() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="accordion">
        <div className="accordion-header" onClick={() => setIsExpanded(!isExpanded)}>
            <span>100 Level Classes</span>
        </div>
        <div className={`accordion-body ${isExpanded ? "expanded" : ""}`}>
            <div className="accordion-classes">
                <div className="accordion-class">
                    <p>CMPT140 - Introduction to Creative Computing</p>
                </div>
                <div className="accordion-class">
                    <p>CMPT141</p>
                </div>
                <div className="accordion-class">
                    <p>CMPT145</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Accordion;