import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from '../components/Navbar/Navbar'
import Home from './pages/HomePage'
import Planner from './pages/PlannerPage'
import CourseGraph from './pages/G/CourseGraph'
import Catalogue from './pages/CataloguePage'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/planner' element={<Planner />}/>
        <Route path='/graph' element={<CourseGraph />}/>
        <Route path='/courses' element={<Catalogue/>}/>
      </Routes>
      <Navbar />
    </div>
  )
}

export default App
