import './Accordion.css'

/** AccordionClass Component
 * 
 * Displays a class row with a title and checkbox, to be inserted as an accordion list element
 * 
 * @param {string} The course title and USASK description
 * @returns {JSX.Element}
 */
function AccordionClass({title}) {
  return (
    <div className="accordion-class">
        <span>{title}</span>
        <label className="accordion-class-checkbox">
            <input type="checkbox"></input>
            <span className="checkmark"></span>
        </label>
    </div>
  );
};

export default AccordionClass;