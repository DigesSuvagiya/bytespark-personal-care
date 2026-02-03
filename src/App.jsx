import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Products from './pages/Products'
import LearnMore from './pages/LearnMore'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/learn-more" element={<LearnMore />} />
    </Routes>
  )
}

export default App
