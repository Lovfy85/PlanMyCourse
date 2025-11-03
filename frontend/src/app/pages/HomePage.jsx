import './HomePage.css'
import Navbar from '../../components/Navbar/Navbar'

function HomePage() {
  return (
    <>
        <Navbar />
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

export default HomePage
