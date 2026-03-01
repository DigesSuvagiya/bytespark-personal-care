import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Products from './pages/Products'
import LearnMore from './pages/LearnMore'
import OrderSuccess from './pages/OrderSuccess'
import AdminDashboard from './pages/AdminDashboard'
import RequireAdmin from './components/RequireAdmin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/learn-more" element={<LearnMore />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route
        path="/admin/dashboard"
        element={(
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        )}
      />
    </Routes>
  )
}

export default App
