import React from 'react';
import { TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { calculateProfit } from '../services/transactionService';
import ReceiptPreview from './ReceiptPreview';
import './TransactionCard.css';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function TransactionCard({ transaction, style }) {
  const [showPreview, setShowPreview] = React.useState(false);
  const isSale = transaction.type === 'sale';
  const profit = calculateProfit(transaction);
  const amount = isSale ? transaction.salePrice : transaction.costPrice;

  const handleClick = () => {
    setShowPreview(true);
  };

  return (
    <div className="tx-card" style={style} onClick={handleClick} title="Click to download receipt">
      <div className={`tx-card__icon tx-card__icon--${transaction.type}`}>
        {isSale ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
      </div>
      <div className="tx-card__body">
        <div className="tx-card__model">{transaction.phoneModel}</div>
        <div className="tx-card__meta">
          <span className={`badge badge--${transaction.type}`}>
            {isSale ? 'Sale' : 'Trade‑in'}
          </span>
          <span className="tx-card__dot" />
          <span>{transaction.condition}</span>
          <span className="tx-card__dot" />
          <span>{new Date(transaction.createdAt || transaction.date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short'
          })}</span>
        </div>
      </div>
      <div className="tx-card__amount">
        <div className="tx-card__price">{formatCurrency(amount)}</div>
        {isSale && (
          <div className={`tx-card__profit tx-card__profit--${profit >= 0 ? 'positive' : 'negative'}`}>
            {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
          </div>
        )}
      </div>
      
      <ReceiptPreview 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        transaction={transaction} 
      />
    </div>
  );
}
