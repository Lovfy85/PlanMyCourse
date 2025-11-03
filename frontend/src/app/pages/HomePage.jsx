import './HomePage.css'
import Navbar from '../../components/Navbar/Navbar'
import Redirect from '../../components/SearchCourse/Redirect'

function HomePage() {

  return (
    <>
        <Navbar />
        <div className="main-container">
            <div className="website-name">
              <h1>PlanMyCourse</h1>
            </div>
          <div className="search-bar">
            <Redirect />
          </div>
        </div>
    </>
  )
}

export default HomePage
