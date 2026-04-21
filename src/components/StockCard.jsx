import React from 'react';
import { ShoppingCart, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StockCard.css';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function StockCard({ item, onRemove }) {
  const navigate = useNavigate();

  const handleSell = () => {
    navigate('/transaction/new', { 
      state: { 
        type: 'sale',
        phoneModel: item.phoneModel,
        imei: item.imei,
        condition: item.condition,
        costPrice: item.costPrice,
        brand: item.brand
      } 
    });
  };

  return (
    <div className="stock-card">
      <div className="stock-card__header">
        <div>
          <span className="stock-card__brand">{item.brand}</span>
          <h3 className="stock-card__model">{item.phoneModel}</h3>
        </div>
        <span className={`badge badge--${item.condition.toLowerCase()}`}>
          {item.condition}
        </span>
      </div>
      
      <div className="stock-card__imei">IMEI: {item.imei}</div>

      <div className="stock-card__footer">
        <div>
          <span className="stock-card__price-label">Cost Price</span>
          <div className="stock-card__price">{formatCurrency(item.costPrice)}</div>
        </div>
        
        <div className="stock-card__actions">
          <button 
            className="stock-card__action" 
            onClick={handleSell}
            title="Sell this item"
          >
            <ShoppingCart size={18} />
          </button>
          <button 
            className="stock-card__action"
            title="Edit item"
          >
            <Edit2 size={16} />
          </button>
          <button 
            className="stock-card__action stock-card__action--danger"
            onClick={() => onRemove(item.id)}
            title="Remove from stock"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
