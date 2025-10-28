import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    return (    
        <nav className='navbar'>
          <div className='title-section'>
            <h2 className='nav-title' onClick={() => navigate("/")}>PlanMyCourse</h2>
          </div>
          <div className='nav-links'>
            <ul>
              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/courses")}>Courses</li>
              <li onClick={() => navigate("/planner")}>Planner</li>
              <li onClick={() => navigate("/graph")}>Graph</li>
            </ul>
            <div className='profile-button'>
              <button onClick={() => navigate("/profile")}>Profile</button>
            </div>
          </div>
        </nav>
    );
}

export default Navbar;