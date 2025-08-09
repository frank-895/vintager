import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Wines from './pages/Wines'
import WineDetails from './pages/WineDetails'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wines" element={<Wines />} />
        <Route path="/wines/:id" element={<WineDetails />} />
      </Routes>
    </BrowserRouter>
  )
}
