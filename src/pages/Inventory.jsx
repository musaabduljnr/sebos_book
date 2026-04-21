import React, { useState } from 'react';
import { Package, Plus, Filter, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import SearchBar from '../components/SearchBar';
import StockCard from '../components/StockCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import './Inventory.css';

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [activeCondition, setActiveCondition] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');

  const { items, loading, stats, brands, remove } = useInventory({
    search,
    condition: activeCondition === 'All' ? null : activeCondition,
    brand: activeBrand === 'All' ? null : activeBrand
  });

  const conditions = ['All', 'New', 'Used'];

  return (
    <div className="inventory-page page-enter">
      <div className="inventory-header">
        <div className="inventory-header__top">
          <h1 className="inventory-title">Active Stock</h1>
          <Link to="/transaction/new" className="btn btn--primary btn--icon">
            <Plus size={20} />
          </Link>
        </div>

        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search by model or IMEI..." 
        />

        <div className="inventory-stats-bar">
          <div className="inventory-stat-chip">
            <Package size={14} /> 
            <span>Total Items: <b>{stats?.totalItems || 0}</b></span>
          </div>
          <div className="inventory-stat-chip">
            <Tag size={14} /> 
            <span>Value: <b>₦{stats?.totalValue?.toLocaleString() || 0}</b></span>
          </div>
        </div>

        <div className="inventory-filters">
           <Filter size={14} className="text-muted" style={{ marginRight: 'var(--space-1)' }} />
           {conditions.map(c => (
             <button 
               key={c} 
               className={`filter-chip ${activeCondition === c ? 'active' : ''}`}
               onClick={() => setActiveCondition(c)}
             >
               {c}
             </button>
           ))}
           <div style={{ width: '1px', background: 'var(--color-divider)', height: '24px', margin: '0 var(--space-2)' }} />
           <button 
             className={`filter-chip ${activeBrand === 'All' ? 'active' : ''}`}
             onClick={() => setActiveBrand('All')}
           >
             All Brands
           </button>
           {brands.map(b => (
             <button 
               key={b} 
               className={`filter-chip ${activeBrand === b ? 'active' : ''}`}
               onClick={() => setActiveBrand(b)}
             >
               {b}
             </button>
           ))}
        </div>
      </div>

      <div className="inventory-grid">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : items.length > 0 ? (
          items.map((item, i) => (
            <StockCard 
              key={item.id} 
              item={item} 
              onRemove={remove}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))
        ) : (
          <div className="empty-state card card--flat" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state__icon">
              <Package size={32} />
            </div>
            <h3 className="empty-state__title">No items found</h3>
            <p className="empty-state__text">
              {search || activeCondition !== 'All' || activeBrand !== 'All' 
                ? "Try adjusting your filters or search term."
                : "Your inventory is currently empty. Record a trade-in to add stock."}
            </p>
            <Link to="/transaction/new" className="btn btn--primary">
              Add New Stock
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
