import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from '../components/Navbar/Navbar'
import Home from './pages/HomePage'
import Planner from './pages/PlannerPage'
import CourseGraph from './pages/G/CourseGraph'
import Courses from './pages/Courses'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/courses/:term' element={<Courses />}/>
        <Route path='/planner' element={<Planner />}/>
        <Route path='/graph' element={<CourseGraph />}/>
      </Routes>
      <Navbar />
    </div>
  )
}

export default App
