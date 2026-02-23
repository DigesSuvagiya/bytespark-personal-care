import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/learn-more.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { CartProvider } from './context/CartContext'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('bytesparkTheme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

document.documentElement.setAttribute('data-theme', getInitialTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
)
