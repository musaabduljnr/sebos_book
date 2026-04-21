import React from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useRecentActivity } from '../hooks/useTransactions';
import ProgressRing from '../components/ProgressRing';
import TrendChart from '../components/TrendChart';
import TransactionCard from '../components/TransactionCard';
import SkeletonLoader, { CardSkeleton, ChartSkeleton } from '../components/SkeletonLoader';
import './Home.css';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function Home() {
  const { dailyStats, weeklyData, stockCount, loading: dashLoading } = useDashboard();
  const { activity, loading: activityLoading } = useRecentActivity(5);

  const profitGoal = 50000; // Mock daily goal
  const profitProgress = dailyStats ? (dailyStats.totalProfit / profitGoal) * 100 : 0;

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="card card--accent stagger-1">
          <div className="dashboard-hero__stats">
            <span className="dashboard-hero__label">Daily Profit</span>
            <div className="dashboard-hero__value">
              {dashLoading ? <SkeletonLoader width="120px" height="28px" /> : formatCurrency(dailyStats?.totalProfit)}
            </div>
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: '4px' }}>
              Target: {formatCurrency(profitGoal)}
            </span>
          </div>
          <ProgressRing 
            value={dailyStats?.totalProfit || 0} 
            max={profitGoal} 
            size={80} 
            strokeWidth={8}
            label={Math.round(profitProgress) + '%'}
          />
        </div>

        <div className="card stagger-2">
          <div className="summary-card">
            <div className="summary-card__icon">
              <Package size={18} />
            </div>
            <div className="summary-card__value">
              {dashLoading ? <SkeletonLoader width="40px" height="24px" /> : stockCount}
            </div>
            <span className="summary-card__label">Active Stock</span>
          </div>
        </div>

        <div className="card stagger-3">
          <div className="summary-card">
            <div className="summary-card__icon" style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)' }}>
              <TrendingUp size={18} />
            </div>
            <div className="summary-card__value">
              {dashLoading ? <SkeletonLoader width="60px" height="24px" /> : dailyStats?.salesCount}
            </div>
            <span className="summary-card__label">Sales Today</span>
          </div>
        </div>
      </section>

      {/* Revenue Trend */}
      <section className="dashboard-section stagger-4">
        <div className="dashboard-section__header">
          <h2 className="dashboard-section__title">Weekly Revenue</h2>
          <Link to="/analytics" className="btn btn--ghost btn--sm">View Analytics</Link>
        </div>
        {dashLoading ? <ChartSkeleton /> : (
          <div className="card">
            <TrendChart data={weeklyData} />
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="dashboard-section stagger-5">
        <div className="dashboard-section__header">
          <h2 className="dashboard-section__title">Recent Activity</h2>
          <Link to="/transactions" className="btn btn--ghost btn--sm">View All</Link>
        </div>
        <div className="activity-list">
          {activityLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : activity.length > 0 ? (
            activity.map((tx, i) => (
              <TransactionCard 
                key={tx.id} 
                transaction={tx} 
                style={{ animationDelay: `${(i + 5) * 60}ms` }}
              />
            ))
          ) : (
            <div className="empty-state card card--flat">
               <Clock className="text-muted" size={32} />
               <p className="summary-card__label">No transactions today</p>
               <Link to="/transaction/new" className="btn btn--primary btn--sm">Record First Sale</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
