import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from '../utils/axios';

const ProductForm = ({ onProductAdded, editingProduct, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    categories: []
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      const selectedCats = editingProduct.categories.map(cat => ({
        value: cat._id,
        label: cat.name
      }));
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        quantity: editingProduct.quantity,
        categories: selectedCats
      });
      setSelectedCategories(selectedCats);
    }
  }, [editingProduct]);

  useEffect(() => {
    if (isCategoryModalOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsCategoryModalOpen(false);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCategoryModalOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      const categoryOptions = response.data.data.map(cat => ({
        value: cat._id,
        label: cat.name
      }));
      setCategories(categoryOptions);
    } catch (error) {
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      const exists = prev.find(cat => cat.value === category.value);
      if (exists) {
        return prev.filter(cat => cat.value !== category.value);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleAddCategories = () => {
    setFormData(prev => ({
      ...prev,
      categories: selectedCategories
    }));
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
    setIsCategoryModalOpen(false);
  };

  const handleOpenCategoryModal = () => {
    setSelectedCategories(formData.categories);
    setIsCategoryModalOpen(true);
  };

  const handleRemoveCategory = (categoryToRemove) => {
    const updatedCategories = formData.categories.filter(
      cat => cat.value !== categoryToRemove.value
    );
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
    setSelectedCategories(updatedCategories);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Product name must not exceed 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    if (formData.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        quantity: parseInt(formData.quantity),
        categories: formData.categories.map(cat => cat.value)
      };
      
      if (editingProduct) {
        await axios.put(`/products/${editingProduct._id}`, productData);
        setSuccessMessage('Product updated successfully!');
      } else {
        await axios.post('/products', productData);
        setSuccessMessage('Product added successfully!');
      }
      
      setFormData({
        name: '',
        description: '',
        quantity: '',
        categories: []
      });
      
      setTimeout(() => {
        setSuccessMessage('');
        if (onProductAdded) {
          onProductAdded();
        }
      }, 1500);
      
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.path] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ submit: editingProduct ? 'Failed to update product. Please try again.' : 'Failed to add product. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      quantity: '',
      categories: []
    });
    setErrors({});
    setSuccessMessage('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };


  return (
    <div className="product-form">
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      {errors.submit && (
        <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fed7d7', borderRadius: '8px' }}>
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            min="0"
          />
          {errors.quantity && <div className="error-message">{errors.quantity}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="categories">Categories *</label>
          <div className="category-selector" onClick={handleOpenCategoryModal}>
            {formData.categories.length > 0 ? (
              <div className="selected-categories">
                {formData.categories.map(category => (
                  <span key={category.value} className="selected-category-chip">
                    {category.label}
                    <button
                      type="button"
                      className="remove-category-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCategory(category);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="category-placeholder">Select categories...</span>
            )}
            <span className="category-dropdown-icon">▼</span>
          </div>
          {errors.categories && <div className="error-message">{errors.categories}</div>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
          </button>
          {editingProduct && (
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {isCategoryModalOpen && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Categories</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {categories.map(category => (
                <label key={category.value} className="category-checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.some(cat => cat.value === category.value)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="category-name">{category.label}</span>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="add-categories-btn"
                onClick={handleAddCategories}
              >
                Add Categories
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductForm;

