// API Configuration - Force port 5000 for MongoDB backend
const API_BASE_URL = 'http://localhost:5000/api';

// API Client class
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request to:', url); // Debug log
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('cinema_admin_token') || 
                  localStorage.getItem('cinema_user_token') ||
                  localStorage.getItem('admin_token') || 
                  localStorage.getItem('user_token');
    console.log('🔑 Token found:', token ? 'Yes' : 'No');
    console.log('🔑 Token keys checked:', ['cinema_admin_token', 'cinema_user_token', 'admin_token', 'user_token']);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Authorization header set');
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.errors) {
            errorMessage += ' - ' + errorData.errors.join(', ');
          }
          console.log('❌ Backend error details:', errorData);
        } catch (e) {
          console.log('❌ Could not parse error response');
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }
}

export const apiClient = new ApiClient();