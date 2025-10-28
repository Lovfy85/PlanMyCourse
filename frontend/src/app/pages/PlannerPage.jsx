import './PlannerPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Accordion from '../../components/Planner/Accordion'

function PlannerPage() {
    return (
    <>
        <Navbar />
        <div className="content">
            <div className="planner-header">
                <h1>Class Planner</h1>
                <hr></hr>
            </div>
            <div className="class-sections">
                <Accordion />
            </div>
        </div>
    </>
  )
}

export default PlannerPage
