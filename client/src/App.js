import React, { useState, useEffect } from 'react';
import './App.css';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Login from './pages/Login';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function App() {
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleProductAdded = () => {
    setRefresh(prev => prev + 1);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>📦 Product Inventory System</h1>

          <nav className="nav-links">
            <Link 
              to="/add-product" 
              className={`nav-link ${location.pathname === '/add-product' ? 'active' : ''}`}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Product
            </Link>
            <Link 
              to="/inventory" 
              className={`nav-link ${location.pathname === '/inventory' ? 'active' : ''}`}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              Inventory
            </Link>
          </nav>

          <div className="header-right">
            <button onClick={handleLogout} className="logout-btn">
              <svg className="logout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/add-product" />} />

          {/* Add Product */}
          <Route
            path="/add-product"
            element={
              <ProductForm
                onProductAdded={handleProductAdded}
                editingProduct={editingProduct}
                onCancelEdit={handleCancelEdit}
              />
            }
          />

          {/* Inventory */}
          <Route
            path="/inventory"
            element={
              <ProductList
                key={refresh}
                onEdit={handleEdit}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
