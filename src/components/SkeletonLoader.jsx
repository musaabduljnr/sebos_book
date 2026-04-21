import React from 'react';
import './SkeletonLoader.css';

export default function SkeletonLoader({ variant = 'text', width, height, style }) {
  const className = `skeleton skeleton--${variant}`;
  
  return (
    <div 
      className={className} 
      style={{ 
        width: width || undefined, 
        height: height || undefined,
        ...style 
      }} 
    />
  );
}

export const CardSkeleton = () => (
  <div className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
    <SkeletonLoader variant="circle" width="48px" height="48px" />
    <div style={{ flex: 1 }}>
      <SkeletonLoader variant="title" width="40%" />
      <SkeletonLoader variant="text" width="70%" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="card" style={{ height: '240px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
    <SkeletonLoader variant="title" width="30%" />
    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
      {[...Array(7)].map((_, i) => (
        <SkeletonLoader 
          key={i} 
          variant="text" 
          style={{ flex: 1, height: `${Math.random() * 60 + 20}%`, marginBottom: 0 }} 
        />
      ))}
    </div>
  </div>
);
