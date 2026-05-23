import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//import './App.css'
import Jarvis from './Jarvis'
import FamilyPage from './components/FamilyPage'
import VigneshAlbum from './components/VigneshAlbum'
import Contacts from './components/Contacts'
import Notes from './components/Notes'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      

     <Router> 
      <Routes>
         <Route path="/" element={<Jarvis />} />
        <Route path="/Family" element={<FamilyPage />} />
        <Route path="/FamilyPage" element={<VigneshAlbum />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/Notes" element={<Notes />} />
      </Routes>
    </Router>
    
     </>
  )
}

export default App
