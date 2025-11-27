import { useNavigate } from "react-router-dom";
import './Accordion.css'
import axios from 'axios'

function AccordionClass({title, id, courseId, courseName, taken, onDelete, onTakenChange}) {
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/coursesadded/${id}`, {withCredentials: true});
      if (onDelete) {
        // Pass the deleted course data for undo functionality
        onDelete({
          id,
          courseId,
          taken,
          title
        });
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleCheckboxChange = async (e) => {
    const newTakenValue = e.target.checked;
    try {
      await axios.put(`http://localhost:3001/coursesadded/${id}`, {
        taken: newTakenValue
      }, {withCredentials: true});
      if (onTakenChange) {
        onTakenChange(id, newTakenValue);
      }
    } catch (error) {
      console.error("Error updating taken status:", error);
    }
  };

  return (
    <div className="accordion-class">
        <div className="accordion-class-head">
          <label className="accordion-class-checkbox">
            <input 
              type="checkbox" 
              checked={taken}
              onChange={handleCheckboxChange}
            />
          </label>
          <span className="accordion-class-title" onClick={() => navigate(`/catalogue/course/${courseName.toLowerCase()}`)}>{title}</span>
        </div>
        <button className="accordion-delete-btn" onClick={handleDelete}></button>
    </div>
  );
};

export default AccordionClass;