import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, Package, BarChart3 } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <nav className="bottom-nav" id="bottom-navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}
        end
      >
        <span className="bottom-nav__icon"><Home size={22} /></span>
        <span className="bottom-nav__label">Home</span>
      </NavLink>

      <NavLink
        to="/inventory"
        className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}
      >
        <span className="bottom-nav__icon"><Package size={22} /></span>
        <span className="bottom-nav__label">Stock</span>
      </NavLink>

      <NavLink
        to="/transaction/new"
        className={({ isActive }) => `bottom-nav__add ${isActive ? 'active' : ''}`}
      >
        <Plus size={26} strokeWidth={2.5} />
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}
      >
        <span className="bottom-nav__icon"><BarChart3 size={22} /></span>
        <span className="bottom-nav__label">Analytics</span>
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}
      >
        <span className="bottom-nav__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </span>
        <span className="bottom-nav__label">History</span>
      </NavLink>
    </nav>
  );
}
