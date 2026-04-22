import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Smartphone, 
  PlusCircle, 
  TrendingUp, 
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';
import { clearDatabase } from '../db/database';
import { useApp } from '../context/AppContext';
import './EmptyDashboard.css';

export default function EmptyDashboard() {
  const { triggerRefresh } = useApp();
  return (
    <div className="empty-dashboard animate-fade-in">
      <div className="empty-dashboard__hero">
        <div className="empty-dashboard__icon-wrapper">
          <Sparkles className="empty-dashboard__sparkle" size={48} />
        </div>
        <h1 className="empty-dashboard__title">Welcome to Sebos Book</h1>
        <p className="empty-dashboard__subtitle">
          Your digital companion for managing your phone business with precision and style.
        </p>
      </div>

      <div className="empty-dashboard__grid">
        <div className="onboarding-card">
          <div className="onboarding-card__icon onboarding-card__icon--blue">
            <PlusCircle size={24} />
          </div>
          <h3 className="onboarding-card__title">Record First Sale</h3>
          <p className="onboarding-card__text">Start tracking your revenue and customer details in seconds.</p>
          <Link to="/transaction/new" className="btn btn--primary btn--sm btn--full">Get Started</Link>
        </div>

        <div className="onboarding-card">
          <div className="onboarding-card__icon onboarding-card__icon--green">
            <Smartphone size={24} />
          </div>
          <h3 className="onboarding-card__title">Add Inventory</h3>
          <p className="onboarding-card__text">Log your current stock to monitor availability and costs.</p>
          <Link to="/inventory" className="btn btn--secondary btn--sm btn--full">Add Phones</Link>
        </div>

        <div className="onboarding-card">
          <div className="onboarding-card__icon onboarding-card__icon--purple">
            <TrendingUp size={24} />
          </div>
          <h3 className="onboarding-card__title">View Insights</h3>
          <p className="onboarding-card__text">Monitor your business growth with real-time analytics.</p>
          <Link to="/analytics" className="btn btn--ghost btn--sm btn--full">Explore</Link>
        </div>
      </div>

      <div className="empty-dashboard__footer card card--flat" style={{ border: 'none', background: 'transparent', gap: 'var(--space-6)' }}>
        <div className="empty-dashboard__footer-info">
          <ShieldCheck size={20} className="text-success" />
          <p>Your data is securely stored and synced to the cloud.</p>
        </div>
        <button 
          className="btn btn--secondary btn--sm" 
          onClick={async () => {
            if (window.confirm('This will permanently delete all local transactions and inventory. Continue?')) {
              await clearDatabase();
              triggerRefresh();
            }
          }}
          style={{ opacity: 0.7, fontSize: 'var(--text-xs)' }}
        >
          <RefreshCcw size={14} /> Wipe Current Data
        </button>
      </div>
    </div>
  );
}
