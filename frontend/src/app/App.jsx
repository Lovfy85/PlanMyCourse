import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from '../components/Navbar/Navbar'
import Home from './pages/HomePage'
import Planner from './pages/PlannerPage'
import Graph from './pages/Graph'
import Catalogue from './pages/CataloguePage'
import Course from './pages/CoursePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'

import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

function App() {
  const user = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setIsDarkMode(true);
  }, []);  

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    );
  }, [isDarkMode]);

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/planner' element={<Planner />}/>
        <Route path='/graph' element={<Graph user={user} />}/>
        <Route path='/catalogue' element={<Catalogue user={user} />}/>
        <Route path='/catalogue/:term' element={<Catalogue user={user}/>}/>
        <Route path='/catalogue/course/:courseId' element={<Course user={user} />}/>
        <Route path='/signup' element={<SignUpPage />}/>
        <Route path='/login' element={<LoginPage />}/>
      </Routes>
      <Navbar user={user} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
    </div>
  )
}
export default App
