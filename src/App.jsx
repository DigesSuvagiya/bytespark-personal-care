import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Products from './pages/Products'
import LearnMore from './pages/LearnMore'
import OrderHistory from './pages/OrderHistory'
import OrderSuccess from './pages/OrderSuccess'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/learn-more" element={<LearnMore />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/order-success" element={<OrderSuccess />} />
    </Routes>
  )
}

export default App
