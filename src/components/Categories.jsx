import React from 'react'

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: 'Skincare',
    },
    {
      id: 2,
      name: 'Hair Care',
    },
    {
      id: 3,
      name: 'Body Care',
    },
    {
      id: 4,
      name: 'Hygiene',
    }]
  

  return (
    <section className="categories">
      <div className="section-container">
        <div className="section-header">
          <h2>Our Categories</h2>
          <p>Explore our complete range in Products</p>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

