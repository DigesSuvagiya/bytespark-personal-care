import React from 'react'
import Navigation from './components/Navigation'
import About from './components/Hero'
import FeaturedProducts from './components/FeaturedProducts'
import Categories from './components/Categories'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="app">
      <Navigation />
      <About />
      <FeaturedProducts />
      <Categories />
      <Footer />
    </div>
  )
}
