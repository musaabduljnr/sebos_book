import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart2, PieChart, Activity } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import TrendChart from '../components/TrendChart';
import { ChartSkeleton } from '../components/SkeletonLoader';
import './Analytics.css';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function Analytics() {
  const [period, setPeriod] = useState(7);
  const { topBrands, monthlyGrowth, periodStats, dailyBreakdown, loading } = useAnalytics(period);

  const periods = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
  ];

  return (
    <div className="analytics-page page-enter">
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics</h1>
        <div className="period-selector">
          {periods.map(p => (
            <button
              key={p.value}
              className={`period-btn ${period === p.value ? 'active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <section className="stats-grid">
        <div className="card stat-card stagger-1">
          <span className="stat-card__label">Revenue</span>
          <div className="stat-card__value">
            {loading ? '...' : formatCurrency(periodStats?.current?.totalRevenue)}
          </div>
          {!loading && (
            <div className={`stat-card__change ${periodStats?.revenueChange >= 0 ? 'stat-card__change--up' : 'stat-card__change--down'}`}>
              {periodStats?.revenueChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(Math.round(periodStats?.revenueChange))}%
            </div>
          )}
        </div>

        <div className="card stat-card stagger-2">
          <span className="stat-card__label">Profit</span>
          <div className="stat-card__value">
            {loading ? '...' : formatCurrency(periodStats?.current?.totalProfit)}
          </div>
          {!loading && (
            <div className={`stat-card__change ${periodStats?.profitChange >= 0 ? 'stat-card__change--up' : 'stat-card__change--down'}`}>
              {periodStats?.profitChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(Math.round(periodStats?.profitChange))}%
            </div>
          )}
        </div>
      </section>

      <section className="analytics-chart-section stagger-3">
        <div className="dashboard-section__header">
          <h2 className="chart-title">Performance Trend</h2>
          <Activity size={16} className="text-muted" />
        </div>
        {loading ? <ChartSkeleton /> : (
          <div className="card">
            <TrendChart data={dailyBreakdown} height={200} />
          </div>
        )}
      </section>

      <section className="analytics-chart-section stagger-4">
        <div className="dashboard-section__header">
          <h2 className="chart-title">Top Selling Brands</h2>
          <BarChart2 size={16} className="text-muted" />
        </div>
        <div className="card">
          <div className="brand-list">
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '12px', borderRadius: '4px' }} />)}
              </div>
            ) : topBrands.length > 0 ? (
              topBrands.slice(0, 5).map((brand, i) => {
                const maxRevenue = Math.max(...topBrands.map(b => b.revenue));
                const percentage = (brand.revenue / maxRevenue) * 100;
                return (
                  <div key={brand.brand} className="brand-item">
                    <span className="brand-item__name">{brand.brand}</span>
                    <div className="brand-item__bar-container">
                      <div 
                        className="brand-item__bar" 
                        style={{ width: `${percentage}%`, transitionDelay: `${i * 100}ms` }} 
                      />
                    </div>
                    <span className="brand-item__value">₦{(brand.revenue / 1000).toFixed(0)}K</span>
                  </div>
                );
              })
            ) : (
              <p className="text-muted" style={{ textAlign: 'center', fontSize: 'var(--text-xs)' }}>No data for this period</p>
            )}
          </div>
        </div>
      </section>

      <section className="analytics-chart-section stagger-5" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="dashboard-section__header">
          <h2 className="chart-title">Monthly Growth</h2>
          <PieChart size={16} className="text-muted" />
        </div>
        <div className="card">
           <div className="brand-list">
              {loading ? '...' : monthlyGrowth.slice(-4).reverse().map(m => (
                <div key={m.month} className="review-item" style={{ borderBottom: '1px solid var(--color-divider)' }}>
                  <span className="review-item__label">{m.label}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div className="review-item__value">{formatCurrency(m.revenue)}</div>
                    <div className={`stat-card__change ${m.growth >= 0 ? 'stat-card__change--up' : 'stat-card__change--down'}`} style={{ justifyContent: 'flex-end', marginTop: '2px' }}>
                       {m.growth >= 0 ? '+' : ''}{Math.round(m.growth)}%
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
