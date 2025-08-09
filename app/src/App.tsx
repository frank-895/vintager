import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Wines from './pages/Wines'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wines" element={<Wines />} />
      </Routes>
    </BrowserRouter>
  )
}
