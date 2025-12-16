import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        quantity: editingProduct.quantity,
        categories: editingProduct.categories.map(cat => ({
          value: cat._id,
          label: cat.name
        }))
      });
    }
  }, [editingProduct]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
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

  const handleCategoryChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      categories: selectedOptions || []
    }));
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
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
        await axios.put(`${API_URL}/products/${editingProduct._id}`, productData);
        setSuccessMessage('Product updated successfully!');
      } else {
        await axios.post(`${API_URL}/products`, productData);
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
          <Select
            isMulti
            options={categories}
            value={formData.categories}
            onChange={handleCategoryChange}
            placeholder="Select categories..."
            styles={selectStyles}
            className="category-select"
            menuPlacement="bottom"
          />
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
    </div>
  );
};

export default ProductForm;

