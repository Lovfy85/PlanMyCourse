import './Accordion.css'
import axios from 'axios'

/** AccordionClass Component
 * 
 * Displays a class row with a title and checkbox, to be inserted as an accordion list element
 * 
 * @param {string} The course title and USASK description
 * @param {number} id - The course ID in the planner
 * @param {function} onDelete - Callback function to refresh the list after deletion
 * @returns {JSX.Element}
 */
function AccordionClass({title, id, onDelete}) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/coursesadded/${id}`);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="accordion-class">
        <span>{title}</span>
        <div className="accordion-class-actions">
          <label className="accordion-class-checkbox">
              <input type="checkbox"></input>
              <span className="checkmark"></span>
          </label>
          <button className="accordion-delete-btn" onClick={handleDelete}>Remove</button>
        </div>
    </div>
  );
};

export default AccordionClass;