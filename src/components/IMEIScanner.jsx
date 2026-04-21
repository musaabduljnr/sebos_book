import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import './IMEIScanner.css';

export default function IMEIScanner({ onScan }) {
  const [isScanning, setIsScanning] = useState(true);

  // Mock scanning logic
  useEffect(() => {
    if (!isScanning) return;

    const timer = setTimeout(() => {
      // Generate a realistic mock IMEI
      const mockIMEI = '35' + Math.random().toString().slice(2, 15);
      onScan(mockIMEI);
      setIsScanning(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isScanning, onScan]);

  return (
    <div className="imei-scanner">
      {/* Simulation Background */}
      <div className="imei-scanner__simulation">
        <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
           <Camera size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: 'var(--space-2)' }} />
           <p style={{ fontSize: 'var(--text-xs)' }}>Initializing camera interface...</p>
        </div>
      </div>

      <div className="imei-scanner__overlay">
        <div className="imei-scanner__frame">
          <div className="imei-scanner__line" />
        </div>
      </div>

      <div className="imei-scanner__status">
        {isScanning ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <RefreshCw size={12} className="syncing" /> Align IMEI within frame
          </span>
        ) : (
          <span style={{ color: 'var(--color-success)' }}>Scan complete!</span>
        )}
      </div>
      
      {!isScanning && (
        <button 
          className="btn btn--secondary btn--sm" 
          style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', zIndex: 10 }}
          onClick={() => setIsScanning(true)}
        >
          Rescan
        </button>
      )}
    </div>
  );
}
