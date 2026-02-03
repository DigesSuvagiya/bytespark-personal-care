import React from 'react'

export default function Footer() {
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
    <footer className="footer">
      <div className="trust-container">
        {trustPoints.map(point => (
          <div key={point.id} className="trust-item">
            <div className="trust-icon">{point.icon}</div>
            <div className="trust-content">
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      
      <div className="footer-content">
        <div className="footer-brand">
          Byte<span>spark</span> Personal Care
        </div>
        <p className="footer-copyright">
          © 2026 Bytespark Personal Care. All rights reserved. | Dermatologically Tested | Clean Beauty
        </p>
      </div>
    </footer>
  )
}
