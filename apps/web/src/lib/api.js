// API Configuration and Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    // Log the request for debugging
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      endpoint
    });

    const config = {
      ...options,
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'include', // Include credentials for CORS
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Log response for debugging
      console.log('API Response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
        // Try to parse as JSON if possible
        try {
          data = JSON.parse(data);
        } catch {
          // Keep as text if not JSON
        }
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          // For auth/me endpoint, just return null instead of throwing
          if (endpoint === '/api/auth/me') {
            return null;
          }
          // Don't redirect on login/register pages
          if (typeof window !== 'undefined' && 
              !window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
        console.error('API Error:', data);
        // Return null for failed requests instead of throwing
        return null;
      }

      return data;
    } catch (error) {
      // More detailed error logging
      console.error('Network error details:', {
        message: error.message,
        endpoint,
        url,
        error
      });
      
      // Check if it's a CORS error
      if (error.message === 'Failed to fetch') {
        console.error('This is likely a CORS issue or the API server is not running.');
        console.error('Make sure the API server is running on port 3001');
      }
      
      return null;
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

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// API Service Methods
export const api = {
  // Authentication
  auth: {
    login: async (data) => {
      console.log('Attempting login with:', { email: data.email });
      const response = await apiClient.post('/api/auth/login', data);
      if (response && response.token) {
        apiClient.setToken(response.token);
        console.log('Login successful, token stored');
      } else {
        console.error('Login failed, no token in response');
      }
      return response;
    },
    register: async (data) => {
      const response = await apiClient.post('/api/auth/register', data);
      if (response && response.token) {
        apiClient.setToken(response.token);
      }
      return response;
    },
    me: () => apiClient.get('/api/auth/me'),
    logout: () => {
      apiClient.clearToken();
      return Promise.resolve();
    },
  },

  // CRM
  crm: {
    leads: {
      list: () => apiClient.get('/api/crm/leads') || [],
      create: (data) => apiClient.post('/api/crm/leads', data),
      get: (id) => apiClient.get(`/api/crm/leads/${id}`),
      update: (id, data) => apiClient.put(`/api/crm/leads/${id}`, data),
      delete: (id) => apiClient.delete(`/api/crm/leads/${id}`),
      convert: (id, data) => apiClient.post(`/api/crm/leads/${id}/convert`, data),
    },
    proposals: {
      list: () => apiClient.get('/api/crm/proposals') || [],
      create: (data) => apiClient.post('/api/crm/proposals', data),
      get: (id) => apiClient.get(`/api/crm/proposals/${id}`),
      update: (id, data) => apiClient.put(`/api/crm/proposals/${id}`, data),
      delete: (id) => apiClient.delete(`/api/crm/proposals/${id}`),
      send: (id) => apiClient.post(`/api/crm/proposals/${id}/send`),
    },
    contracts: {
      list: () => apiClient.get('/api/crm/contracts') || [],
      create: (data) => apiClient.post('/api/crm/contracts', data),
      get: (id) => apiClient.get(`/api/crm/contracts/${id}`),
      update: (id, data) => apiClient.put(`/api/crm/contracts/${id}`, data),
      delete: (id) => apiClient.delete(`/api/crm/contracts/${id}`),
      sign: (id, data) => apiClient.post(`/api/crm/contracts/${id}/sign`, data),
    },
    invoices: {
      list: () => apiClient.get('/api/crm/invoices') || [],
      create: (data) => apiClient.post('/api/crm/invoices', data),
      get: (id) => apiClient.get(`/api/crm/invoices/${id}`),
      update: (id, data) => apiClient.put(`/api/crm/invoices/${id}`, data),
      delete: (id) => apiClient.delete(`/api/crm/invoices/${id}`),
      pay: (id, data) => apiClient.post(`/api/crm/invoices/${id}/pay`, data),
    },
  },

  // Projects
  projects: {
    list: () => apiClient.get('/api/projects') || [],
    create: (data) => apiClient.post('/api/projects', data),
    get: (id) => apiClient.get(`/api/projects/${id}`),
    update: (id, data) => apiClient.put(`/api/projects/${id}`, data),
    delete: (id) => apiClient.delete(`/api/projects/${id}`),
  },

  // Guests
  guests: {
    list: (projectId) => apiClient.get(`/api/projects/${projectId}/guests`) || [],
    create: (projectId, data) => apiClient.post(`/api/projects/${projectId}/guests`, data),
    get: (id) => apiClient.get(`/api/guests/${id}`),
    update: (id, data) => apiClient.put(`/api/guests/${id}`, data),
    delete: (id) => apiClient.delete(`/api/guests/${id}`),
    import: (projectId, data) => apiClient.post(`/api/projects/${projectId}/guests/import`, data),
    submitRsvp: (data) => apiClient.post('/api/rsvp/submit', data),
  },

  // Vendors
  vendors: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/api/vendors${query ? `?${query}` : ''}`) || [];
    },
    create: (data) => apiClient.post('/api/vendors', data),
    get: (id) => apiClient.get(`/api/vendors/${id}`),
    update: (id, data) => apiClient.put(`/api/vendors/${id}`, data),
    delete: (id) => apiClient.delete(`/api/vendors/${id}`),
  },

  // Websites
  websites: {
    getByProject: (projectId) => apiClient.get(`/api/websites/projects/${projectId}/website`),
    save: (projectId, data) => apiClient.post(`/api/websites/projects/${projectId}/website`, data),
    update: (id, data) => apiClient.put(`/api/websites/${id}`, data),
    publish: (id) => apiClient.post(`/api/websites/${id}/publish`),
    unpublish: (id) => apiClient.post(`/api/websites/${id}/unpublish`),
  },

  // Budget
  budget: {
    getByProject: (projectId) => apiClient.get(`/api/budget/projects/${projectId}/budget`),
    save: (projectId, data) => apiClient.post(`/api/budget/projects/${projectId}/budget`, data),
    updateCategory: (id, data) => apiClient.put(`/api/budget/categories/${id}`, data),
    deleteCategory: (id) => apiClient.delete(`/api/budget/categories/${id}`),
  },

  // Statistics
  stats: {
    overview: () => apiClient.get('/api/stats/overview') || {
      leads: 0,
      projects: 0,
      guests: 0,
      vendors: 0,
      users: 1,
      proposals: 0,
      contracts: 0,
      revenue: 0,
      organizations: 1,
      websites: 0,
      products: 0,
      orders: 0
    },
  },
};

export default apiClient;
