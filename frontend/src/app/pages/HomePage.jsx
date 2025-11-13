import './HomePage.css'
import Redirect from '../../components/SearchBar/Redirect'
import Recommendations from '../../components/SearchBar/Recommendations'

function HomePage() {
  return (
    <>
        <div className="main-container">
            <div className="website-name">
              <h1>PlanMyCourse</h1>
            </div>
          <div className="search-bar">
            <Redirect />
            <Recommendations />
          </div>
        </div>
    </>
  )
}

export default HomePage
