import React from 'react'

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: 'Skincare',
      icon: '🧴'
    },
    {
      id: 2,
      name: 'Hair Care',
      icon: '💇'
    },
    {
      id: 3,
      name: 'Body Care',
      icon: '🛁'
    },
    {
      id: 4,
      name: 'Hygiene',
      icon: '🧼'
    }
  ]

  return (
    <section className="categories">
      <div className="section-container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Explore our complete range</p>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
