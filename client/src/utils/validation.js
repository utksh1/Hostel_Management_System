/**
 * Utility functions for form validation and common operations
 */

// Email validation regex
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return null;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) return `${fieldName} is required`;
  return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (!value || value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

// Form validation helper
export const validateForm = (fields, validations) => {
  const errors = {};
  
  Object.keys(validations).forEach(field => {
    const value = fields[field];
    const validation = validations[field];
    
    if (Array.isArray(validation)) {
      for (const validator of validation) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } else {
      const error = validation(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if user has permission
export const hasPermission = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const roleHierarchy = {
    admin: 3,
    student: 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// API error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return 'An unexpected error occurred';
  }
};