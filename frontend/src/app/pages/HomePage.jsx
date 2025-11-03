import './HomePage.css'
import Redirect from '../../components/SearchCourse/Redirect'

function HomePage() {
  return (
    <>
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
