import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from '../utils/axios';

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
      const response = await axios.get('/categories');
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
      let url = `/products?page=${currentPage}&limit=5`;
      
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
        await axios.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
    setCurrentPage(1);
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
      border: state.isFocused ? '1px solid #2c3e50' : '1px solid #2c3e50',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(44, 62, 80, 0.1)' : 'none',
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      '&:hover': { borderColor: '#2c3e50' }
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
      border: '1px solid #2c3e50',
      marginTop: '0.5rem',
      marginBottom: '0.5rem'
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 10000
    })
  };

  const renderPagination = () => {
    const pages = [];
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const maxVisiblePages = isSmallMobile ? 2 : isMobile ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn page-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        <button
          className="page-btn nav-btn"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <span className="btn-text-full">Previous</span>
          <span className="btn-text-short">Prev</span>
          <span className="btn-icon">‹</span>
        </button>
        
        {!isSmallMobile && startPage > 1 && (
          <>
            <button className="page-btn page-number" onClick={() => setCurrentPage(1)}>1</button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pages}
        
        {!isSmallMobile && endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button className="page-btn page-number" onClick={() => setCurrentPage(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        
        <button
          className="page-btn nav-btn"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span className="btn-text-full">Next</span>
          <span className="btn-text-short">Next</span>
          <span className="btn-icon">›</span>
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
            menuPlacement="auto"
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <>
          <div className="products-table-container">
            <div className="products-table-wrapper">
              <div className="products-table-header">
                <div className="table-header-cell header-number">#</div>
                <div className="table-header-cell header-name">Name</div>
                <div className="table-header-cell header-description">Description</div>
                <div className="table-header-cell header-quantity">Quantity</div>
                <div className="table-header-cell header-categories">Categories</div>
                <div className="table-header-cell header-date">Added On</div>
                <div className="table-header-cell header-actions">Actions</div>
              </div>
              
              <div className="products-table-body">
                {products.map((product, index) => (
                  <div key={product._id} className="product-row">
                    <div className="table-cell cell-number">
                      {(currentPage - 1) * 5 + index + 1}
                    </div>
                    <div className="table-cell cell-name">
                      {product.name}
                    </div>
                    <div className="table-cell cell-description">
                      {product.description}
                    </div>
                    <div className="table-cell cell-quantity">
                      {product.quantity}
                    </div>
                    <div className="table-cell cell-categories">
                      <div className="categories-container">
                        {product.categories.map(category => (
                          <span key={category._id} className="category-tag">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="table-cell cell-date">
                      {formatDate(product.createdAt)}
                    </div>
                    <div className="table-cell cell-actions">
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
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default ProductList;

