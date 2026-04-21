import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import TransactionForm from './pages/TransactionForm';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Login from './pages/Login';

// Import all styles
import './styles/global.css';
import './styles/components.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F1117' }}>
      <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="transaction/new" element={<TransactionForm />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="transactions" element={<History />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
