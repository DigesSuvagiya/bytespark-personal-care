import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Products from './pages/Products'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  )
}

export default App
