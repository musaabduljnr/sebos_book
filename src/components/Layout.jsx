import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { syncLayer } from '../db/syncLayer';
import BottomNav from './BottomNav';
import './Layout.css';

export default function Layout() {
  const { isLoading, toasts } = useApp();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    await syncLayer.sync();
    setTimeout(() => setSyncing(false), 600);
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading__logo">SB</div>
        <div className="app-loading__spinner" />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo">SB</div>
          <span className="app-header__title">Sebos Book</span>
        </div>
        <div className="app-header__actions">
          <button
            className={`app-header__sync-btn ${syncing ? 'syncing' : ''}`}
            onClick={handleSync}
            title="Sync data"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast--${toast.type}`}>
              {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              {toast.message}
            </div>
          ))}
        </div>
      )}

      <main className="app-content">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
