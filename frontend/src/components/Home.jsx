import './Home.css'

function Home() {

  return (
    <>
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
    
        <div className="main-container">
            <div className="website-name">
              <h1>PlanMyCourse</h1>
            </div>
          <div className="search-bar">
            <input type="text" placeholder="Search courses..." />
            
          </div>
        </div>
    </>
  )
}

export default Home
