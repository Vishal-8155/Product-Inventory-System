import React, { useState, useEffect } from 'react';
import './App.css';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Login from './pages/Login';
import { Link, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

function App() {
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (location.pathname === '/inventory') {
      setEditingProduct(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };

    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleProductAdded = () => {
    setRefresh(prev => prev + 1);
    setEditingProduct(null);
    navigate('/inventory');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    navigate('/add-product');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    navigate('/inventory');
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
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
          <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            ☰
          </button>

          <h1>Product Inventory System</h1>

          <nav className="nav-links">
            <Link 
              to="/add-product" 
              className={`nav-link ${location.pathname === '/add-product' ? 'active' : ''}`}
            >
              Add Product
            </Link>
            <Link 
              to="/inventory" 
              className={`nav-link ${location.pathname === '/inventory' ? 'active' : ''}`}
            >
              Inventory
            </Link>
          </nav>

          <div className="header-right">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-sidebar-btn" onClick={closeSidebar} aria-label="Close menu">
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/add-product" 
            className={`sidebar-link ${location.pathname === '/add-product' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Add Product
          </Link>
          <Link 
            to="/inventory" 
            className={`sidebar-link ${location.pathname === '/inventory' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Inventory
          </Link>
          <button onClick={() => { handleLogout(); closeSidebar(); }} className="sidebar-logout-btn">
            Logout
          </button>
        </nav>
      </aside>

      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/add-product" />} />

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
