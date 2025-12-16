import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const categoryOptions = response.data.data.map(cat => ({
        value: cat._id,
        label: cat.name
      }));
      setCategories(categoryOptions);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/products?page=${currentPage}&limit=5`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      if (selectedCategories.length > 0) {
        const categoryIds = selectedCategories.map(cat => cat.value).join(',');
        url += `&categories=${categoryIds}`;
      }
      
      const response = await axios.get(url);
      setProducts(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryFilterChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '0.375rem 0.5rem',
      borderRadius: '8px',
      border: state.isFocused ? '1px solid #377DFF' : '1px solid #EFEFEF',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(55, 125, 255, 0.1)' : 'none',
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      '&:hover': { borderColor: state.isFocused ? '#377DFF' : '#CBCBCB' }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#377DFF' : state.isFocused ? '#F7F9FC' : 'white',
      color: state.isSelected ? 'white' : '#1A1D1F',
      cursor: 'pointer',
      padding: '0.75rem 1rem',
      '&:active': { backgroundColor: '#377DFF' }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#F4F4F4',
      borderRadius: '6px',
      padding: '0.125rem 0.25rem'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#1A1D1F',
      fontSize: '0.875rem',
      fontWeight: '500'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#6F767E',
      cursor: 'pointer',
      '&:hover': { backgroundColor: '#E8E8E8', color: '#1A1D1F' }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9A9FA5',
      fontSize: '0.9375rem'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #EFEFEF',
      marginTop: '0.5rem',
      marginBottom: '0.5rem',
      zIndex: 9999,
      position: 'absolute',
      width: '100%',
      left: 0
    })
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button className="page-btn" onClick={() => setCurrentPage(1)}>1</button>
            {startPage > 2 && <span style={{ padding: '0 0.5rem' }}>...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ padding: '0 0.5rem' }}>...</span>}
            <button className="page-btn" onClick={() => setCurrentPage(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        
        <button
          className="page-btn"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="product-list">
      <h2>Product Inventory</h2>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search by Name</label>
          <input
            type="text"
            id="search"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Categories</label>
          <Select
            isMulti
            options={categories}
            value={selectedCategories}
            onChange={handleCategoryFilterChange}
            placeholder="Select categories to filter..."
            styles={selectStyles}
            className="category-filter"
            menuPlacement="bottom"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-header">
                  <div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-date">
                      Added on: {formatDate(product.createdAt)}
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <p className="product-description">{product.description}</p>
                
                <div className="product-quantity">
                  Quantity: {product.quantity}
                </div>
                
                <div className="categories-container">
                  {product.categories.map(category => (
                    <span key={category._id} className="category-tag">
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default ProductList;

