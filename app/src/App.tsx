import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Wines from './pages/Wines'
import WineDetails from './pages/WineDetails'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wines" element={<Wines />} />
          <Route path="/wines/:id" element={<WineDetails />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
