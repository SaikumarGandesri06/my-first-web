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
import WelcomePage from './Pages/WelcomePage'
import AlbumsListPage from './Pages/AlbumsListPage'
import AlbumPage from './Pages/AlbumPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      

     <Router>
  <Routes>
    <Route path="/" element={<Jarvis />} />
    <Route path="/welcome" element={<WelcomePage />} />
    // Add these routes:
     <Route path="/albums" element={<AlbumsListPage />} />
    <Route path="/albums/:slug" element={<AlbumPage />} />
    <Route path="/family" element={<FamilysPage />} />
    <Route path="/family/:id" element={<MemberDetailPage />} />  {/* ← must be here */}
    <Route path="/admin-login" element={<AdminLogin />} />
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
