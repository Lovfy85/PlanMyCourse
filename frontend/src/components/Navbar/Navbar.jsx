import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({user}) {
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        if ( !user ) return;

        await axios.get('http://localhost:3001/auth/logout', { withCredentials: true });
        window.location.href = '/login'; // reload and navigate to login
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    return (    
        <nav className='navbar'>
          <div className='title-section'>
            <h2 className='nav-title' onClick={() => navigate("/")}>PlanMyCourse</h2>
          </div>
          <div className="username">
            {user ? `Welcome, ${user.username}` : ""}
          </div>
          <div className='nav-links'>
            <ul>

              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/catalogue")}>Courses</li>
              <li onClick={() => navigate("/planner")}>Planner</li>
              <li onClick={() => navigate("/graph")}>Graph</li>
              {/* Only show these if user is not logged in */}
              {!user && (
              <>
                <li onClick={() => navigate("/login")}>Login</li>
                <li onClick={() => navigate("/signup")}>Sign Up</li>
              </>
              )}
            </ul>
            {/* Only show this if user is logged in */}
              {user && 
              <>
                <li onClick={handleLogout}>Logout</li>
                <div className='profile-button'>
                  <button onClick={() => navigate("/profile")}>Profile</button>
                </div>
              </>  
              }
          </div>
        </nav>
    );
}

export default Navbar;