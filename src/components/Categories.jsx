import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Categories() {

const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate("/products", {
      state: { selectedCategory: category }
    });
  };

  const categories = [
    {
      id: 1,
      name: 'Skincare',
    },
    {
      id: 2,
      name: 'Hair',
    },
    {
      id: 3,
      name: 'Body Care',
    },
    {
      id: 4,
      name: 'Hygiene',
    }

  ]
  

  return (
    <section className="categories">
      <div className="section-container">
        <div className="section-header">
          <h2>Our Categories</h2>
          <p>Explore our complete range in Products</p>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category.name)}>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

