import React, { useState } from 'react';
import { History as HistoryIcon, Search, Download } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from '../components/TransactionCard';
import SearchBar from '../components/SearchBar';
import { CardSkeleton } from '../components/SkeletonLoader';

export default function History() {
  const [search, setSearch] = useState('');
  const { transactions, loading } = useTransactions({ limit: 50 });

  const filteredTransactions = transactions.filter(tx => 
    tx.phoneModel.toLowerCase().includes(search.toLowerCase()) ||
    tx.imei.includes(search) ||
    tx.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="history-page page-enter">
      <div className="inventory-header">
        <div className="inventory-header__top">
          <h1 className="inventory-title">History</h1>
          <button className="btn btn--secondary btn--icon" title="Export CSV">
            <Download size={18} />
          </button>
        </div>

        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search transactions..." 
        />
      </div>

      <div className="activity-list" style={{ marginTop: 'var(--space-6)' }}>
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, i) => (
            <TransactionCard 
              key={tx.id} 
              transaction={tx} 
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))
        ) : (
          <div className="empty-state card card--flat">
            <div className="empty-state__icon">
              <HistoryIcon size={32} />
            </div>
            <h3 className="empty-state__title">No history found</h3>
            <p className="empty-state__text">
              {search ? "No matches found for your search." : "Transactions will appear here once recorded."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
