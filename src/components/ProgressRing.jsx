import React, { useEffect, useState } from 'react';

/**
 * ProgressRing — SVG animated progress ring
 * Used for Daily Profit target visualization
 */
export default function ProgressRing({
  value = 0,
  max = 100,
  size = 140,
  strokeWidth = 10,
  label = '',
  sublabel = '',
  color = 'var(--color-accent)',
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const dashOffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 200);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="progress-ring" style={{ width: size, height: size, position: 'relative' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${color === 'var(--color-accent)' ? 'rgba(59,130,246,0.4)' : color})`,
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <span style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
          letterSpacing: 'var(--letter-spacing-tight)',
        }}>
          {label}
        </span>
        {sublabel && (
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            marginTop: '4px',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
