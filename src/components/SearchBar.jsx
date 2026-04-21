import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <Search className="search-bar__icon" size={18} />
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button 
          className="search-bar__clear" 
          onClick={() => onChange('')}
          type="button"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
