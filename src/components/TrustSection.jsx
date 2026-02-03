import React from 'react'

export default function TrustSection() {
  const trustPoints = [
    {
      id: 1,
      title: 'Dermatologically Tested',
      description: 'Clinically proven formulations suitable for all skin types'
    },
    {
      id: 2,
      title: 'Safe Ingredients',
      description: 'Natural and scientifically validated components'
    },
    {
      id: 3,
      title: 'No Harsh Chemicals',
      description: 'Free from parabens, sulfates, and harmful additives'
    },
    {
      id: 4,
      title: 'Quality Assured',
      description: 'Rigorous testing and quality standards maintained'
    }
  ]

  return (
    <section className="trust-section">
      <div className="trust-container">
        {trustPoints.map(point => (
          <div key={point.id} className="trust-item">
            <div className="trust-content">
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
