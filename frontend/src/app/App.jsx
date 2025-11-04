import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from '../components/Navbar/Navbar'
import Home from './pages/HomePage'
import Planner from './pages/PlannerPage'
import Graph from './pages/Graph'
import Catalogue from './pages/CataloguePage'
import Course from './pages/CoursePage'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/planner' element={<Planner />}/>
        <Route path='/graph' element={<Graph />}/>
        <Route path='/catalogue/:term' element={<Catalogue />}/>
        <Route path='/course/:coursenumber' element={<Course />}/>
      </Routes>
      <Navbar />
    </div>
  )
}

export default App
