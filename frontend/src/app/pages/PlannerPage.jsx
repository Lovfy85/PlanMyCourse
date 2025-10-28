import './PlannerPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Accordion from '../../components/Planner/Accordion'

function PlannerPage() {
    return (
    <>
        <Navbar />
        <div className="content">
            <h1>Class Checklist</h1>
            <hr></hr>
            <div className="class-sections"></div>
        </div>
        <Accordion />
    </>
  )
}

export default PlannerPage
