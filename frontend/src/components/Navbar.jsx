function Navbar() {
    return (    
        <nav className='navbar'>
          <div className='title-section'>
            <h2>PlanMyCourse</h2>
          </div>
          <div className='nav-links'>
            <ul>
              <li>Home</li>
              <li>Courses</li>
              <li>Planner</li>
              <li>Graph</li>
            </ul>
            <div className='profile-button'>
              <button>Profile</button>
            </div>
          </div>
        </nav>
    );
}

export default Navbar;