import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/HomePage'
import Planner from './pages/PlannerPage'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/planner' element={<Planner />}/>
    </Routes>
  )
}

export default App
