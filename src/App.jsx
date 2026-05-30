import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//import './App.css'
import Jarvis from './Jarvis'
//import FamilyPage from './components/FamilyPage'
import VigneshAlbum from './components/VigneshAlbum'
import Contacts from './components/Contacts'
import Notes from './components/Notes'
import CommandsList from './components/CommandsList'
import FamilysPage from './Pages/FamilysPage'
import MemberDetailPage from './Pages/MemberDetailPage'
import AdminLogin from './Pages/AdminLogin'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      

     <Router> 
      <Routes>
         <Route path="/" element={<Jarvis />} />
        <Route path="/member/:id" element={<MemberDetailPage />} />
        <Route path="/vigneshAlbum" element={<VigneshAlbum />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/Notes" element={<Notes />} />
        <Route path="/Commands" element={<CommandsList />} />
        <Route path="/family" element={<FamilysPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
    
     </>
  )
}

export default App
