import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/HomePage'
import Planner from './pages/PlannerPage'
import CourseGraph from './pages/G/CourseGraph'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/planner' element={<Planner />}/>
      <Route path='/graph' element={<CourseGraph />}/>
    </Routes>
  )
}

export default App
