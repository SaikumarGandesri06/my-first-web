import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//import './App.css'
import Jarvis from './Jarvis'
import FamilyPage from './components/FamilyPage'
import VigneshAlbum from './components/VigneshAlbum'
import Contacts from './components/Contacts'
import Notes from './components/Notes'
import CommandsList from './components/CommandsList'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      

     <Router> 
      <Routes>
         <Route path="/" element={<Jarvis />} />
        <Route path="/Family" element={<FamilyPage />} />
        <Route path="/vigneshAlbum" element={<VigneshAlbum />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/Notes" element={<Notes />} />
        <Route path="/Commands" element={<CommandsList />} />
      </Routes>
    </Router>
    
     </>
  )
}

export default App
