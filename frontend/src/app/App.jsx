import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/HomePage'
import Planner from './pages/PlannerPage'
import CourseGraph from './pages/G/CourseGraph'
import Courses from './pages/Courses'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/planner' element={<Planner />}/>
      <Route path='/graph' element={<CourseGraph />}/>
      <Route path='/courses' element={<Courses/>}/>
    </Routes>
  )
}

export default App
