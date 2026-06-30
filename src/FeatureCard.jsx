import React from 'react';
import './FeatureCard.css';

export default function FeatureCard({ title, subtitle, svgString }) {
  return (
    <div className="custom-card">
      <img src="/assets/motifs/models/model-03.svg" alt="" aria-hidden="true" className="card-blob" />
      <div 
        className="card-icon-wrapper"
        dangerouslySetInnerHTML={{ __html: svgString }} 
      />
      <div className="card-content">
        <span className="card-title">{title}</span>
        <span className="card-subtitle">{subtitle}</span>
      </div>
    </div>
  );
}
