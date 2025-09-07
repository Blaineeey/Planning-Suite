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

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          // Don't redirect on login page or during init
          if (typeof window !== 'undefined' && 
              !window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register') &&
              endpoint !== '/api/auth/me') {
            window.location.href = '/login';
          }
          // Return a proper error for auth/me endpoint
          if (endpoint === '/api/auth/me') {
            throw new Error('Authentication failed');
          }
        }
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      // Only log non-auth errors to avoid cluttering console
      if (!error.message?.includes('Authentication failed')) {
        console.error('API Error:', error);
      }
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

// API Service Methods - Fixed endpoints
export const api = {
  // Authentication
  auth: {
    login: async (data) => {
      const response = await apiClient.post('/api/auth/login', data);
      if (response.token) {
        apiClient.setToken(response.token);
      }
      return response;
    },
    register: async (data) => {
      const response = await apiClient.post('/api/auth/register', data);
      if (response.token) {
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
      list: () => apiClient.get('/api/crm/leads'),
      create: (data) => apiClient.post('/api/crm/leads', data),
      get: (id) => apiClient.get(`/api/crm/leads/${id}`),
      update: (id, data) => apiClient.put(`/api/crm/leads/${id}`, data),
      convert: (id, data) => apiClient.post(`/api/crm/leads/${id}/convert`, data),
    },
    proposals: {
      list: () => apiClient.get('/api/crm/proposals'),
      create: (data) => apiClient.post('/api/crm/proposals', data),
      send: (id) => apiClient.post(`/api/crm/proposals/${id}/send`),
      accept: (id, data) => apiClient.post(`/api/crm/proposals/${id}/accept`, data),
    },
    contracts: {
      list: () => apiClient.get('/api/crm/contracts'),
      create: (data) => apiClient.post('/api/crm/contracts', data),
      sign: (id, data) => apiClient.post(`/api/crm/contracts/${id}/sign`, data),
    },
    invoices: {
      list: () => apiClient.get('/api/crm/invoices'),
      create: (data) => apiClient.post('/api/crm/invoices', data),
      pay: (id, data) => apiClient.post(`/api/crm/invoices/${id}/pay`, data),
    },
    appointments: {
      list: () => apiClient.get('/api/crm/appointments'),
      create: (data) => apiClient.post('/api/crm/appointments', data),
      availability: (date) => apiClient.get(`/api/crm/appointments/availability?date=${date}`),
    },
    pipelineStages: () => apiClient.get('/api/crm/pipeline-stages'),
  },

  // Projects
  projects: {
    list: () => apiClient.get('/api/projects'),
    create: (data) => apiClient.post('/api/projects', data),
    get: (id) => apiClient.get(`/api/projects/${id}`),
    update: (id, data) => apiClient.put(`/api/projects/${id}`, data),
    
    // Checklist
    getChecklist: (projectId) => apiClient.get(`/api/projects/${projectId}/checklist`),
    addChecklistItem: (projectId, data) => apiClient.post(`/api/projects/${projectId}/checklist/items`, data),
    toggleChecklistItem: (itemId) => apiClient.patch(`/api/checklist-items/${itemId}/toggle`),
    
    // Timeline
    getTimeline: (projectId) => apiClient.get(`/api/projects/${projectId}/timeline`),
    addTimelineItem: (projectId, data) => apiClient.post(`/api/projects/${projectId}/timeline/items`, data),
    
    // Tasks
    getTasks: (projectId) => apiClient.get(`/api/projects/${projectId}/tasks`),
    createTask: (projectId, data) => apiClient.post(`/api/projects/${projectId}/tasks`, data),
    updateTask: (taskId, data) => apiClient.put(`/api/tasks/${taskId}`, data),
    
    // Budget
    getBudget: (projectId) => apiClient.get(`/api/projects/${projectId}/budget`),
    addBudgetCategory: (projectId, data) => apiClient.post(`/api/projects/${projectId}/budget/categories`, data),
    addBudgetLine: (projectId, data) => apiClient.post(`/api/projects/${projectId}/budget/lines`, data),
    
    // Files
    getFiles: (projectId) => apiClient.get(`/api/projects/${projectId}/files`),
    uploadFile: (projectId, data) => apiClient.post(`/api/projects/${projectId}/files`, data),
  },

  // Guests
  guests: {
    list: (projectId) => apiClient.get(`/api/projects/${projectId}/guests`),
    add: (projectId, data) => apiClient.post(`/api/projects/${projectId}/guests`, data),
    update: (guestId, data) => apiClient.put(`/api/guests/${guestId}`, data),
    delete: (guestId) => apiClient.delete(`/api/guests/${guestId}`),
    import: (projectId, data) => apiClient.post(`/api/projects/${projectId}/guests/import`, data),
    
    // RSVP
    submitRsvp: (data) => apiClient.post('/api/rsvp/submit', data),
    lookupRsvp: (code) => apiClient.get(`/api/rsvp/lookup/${code}`),
    
    // Seating
    getSeating: (projectId) => apiClient.get(`/api/projects/${projectId}/seating`),
    createTable: (projectId, data) => apiClient.post(`/api/projects/${projectId}/tables`, data),
    assignSeat: (guestId, data) => apiClient.post(`/api/guests/${guestId}/seat`, data),
    exportSeating: (projectId) => apiClient.get(`/api/projects/${projectId}/seating/export`),
    
    // Meals
    getMeals: (projectId) => apiClient.get(`/api/projects/${projectId}/meals`),
    setMeals: (projectId, data) => apiClient.post(`/api/projects/${projectId}/meals`, data),
    getMealStats: (projectId) => apiClient.get(`/api/projects/${projectId}/meals/stats`),
  },

  // Vendors
  vendors: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/api/vendors${query ? `?${query}` : ''}`);
    },
    create: (data) => apiClient.post('/api/vendors', data),
    get: (id) => apiClient.get(`/api/vendors/${id}`),
    update: (id, data) => apiClient.put(`/api/vendors/${id}`, data),
    claim: (id, data) => apiClient.post(`/api/vendors/${id}/claim`, data),
    
    // Categories
    getCategories: () => apiClient.get('/api/vendor-categories'),
    
    // Portal
    portalLogin: (data) => apiClient.post('/api/vendor-portal/login', data),
    updateProfile: (data) => apiClient.put('/api/vendor-portal/profile', data),
    uploadDocument: (vendorId, data) => apiClient.post(`/api/vendors/${vendorId}/documents`, data),
    
    // Project Vendors
    getProjectVendors: (projectId) => apiClient.get(`/api/projects/${projectId}/vendors`),
    addToProject: (projectId, data) => apiClient.post(`/api/projects/${projectId}/vendors`, data),
    sendRequest: (requestId, data) => apiClient.post(`/api/vendor-requests/${requestId}/send`, data),
    confirmBooking: (requestId, data) => apiClient.post(`/api/vendor-requests/${requestId}/confirm`, data),
    
    // Reviews
    addReview: (vendorId, data) => apiClient.post(`/api/vendors/${vendorId}/reviews`, data),
    getReviews: (vendorId) => apiClient.get(`/api/vendors/${vendorId}/reviews`),
    
    // Comparison
    compare: (vendorIds) => apiClient.post('/api/vendors/compare', { vendorIds }),
    checkAvailability: (vendorId, date) => apiClient.post(`/api/vendors/${vendorId}/check-availability`, { date }),
  },

  // Wedding Websites
  websites: {
    get: (projectId) => apiClient.get(`/api/projects/${projectId}/website`),
    create: (projectId, data) => apiClient.post(`/api/projects/${projectId}/website`, data),
    update: (id, data) => apiClient.put(`/api/websites/${id}`, data),
    publish: (id) => apiClient.post(`/api/websites/${id}/publish`),
    unpublish: (id) => apiClient.post(`/api/websites/${id}/unpublish`),
    
    // Content
    updateStory: (id, data) => apiClient.put(`/api/websites/${id}/story`, data),
    updateSchedule: (id, data) => apiClient.put(`/api/websites/${id}/schedule`, data),
    updateVenue: (id, data) => apiClient.put(`/api/websites/${id}/venue`, data),
    updateAccommodations: (id, data) => apiClient.put(`/api/websites/${id}/accommodations`, data),
    updateRegistry: (id, data) => apiClient.put(`/api/websites/${id}/registry`, data),
    
    // Templates
    getTemplates: () => apiClient.get('/api/website-templates'),
    
    // Public
    getPublic: (subdomain) => apiClient.get(`/api/public/websites/${subdomain}`),
    submitPublicRsvp: (subdomain, data) => apiClient.post(`/api/public/websites/${subdomain}/rsvp`, data),
    
    // Analytics
    getAnalytics: (id) => apiClient.get(`/api/websites/${id}/analytics`),
  },

  // Shop
  shop: {
    products: {
      list: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get(`/api/shop/products${query ? `?${query}` : ''}`);
      },
      get: (id) => apiClient.get(`/api/shop/products/${id}`),
      create: (data) => apiClient.post('/api/shop/products', data),
      update: (id, data) => apiClient.put(`/api/shop/products/${id}`, data),
    },
    
    categories: () => apiClient.get('/api/shop/categories'),
    
    orders: {
      create: (data) => apiClient.post('/api/shop/orders', data),
      pay: (id, data) => apiClient.post(`/api/shop/orders/${id}/pay`, data),
    },
    
    downloads: {
      get: (token) => apiClient.get(`/api/shop/downloads/${token}`),
    },
    
    coupons: {
      validate: (code, subtotal) => apiClient.post('/api/shop/coupons/validate', { code, subtotal }),
      create: (data) => apiClient.post('/api/shop/coupons', data),
    },
    
    customers: {
      getOrders: (email) => apiClient.get(`/api/shop/customers/${email}/orders`),
      getDownloads: (email) => apiClient.get(`/api/shop/customers/${email}/downloads`),
    },
    
    licenses: {
      verify: (licenseKey) => apiClient.post('/api/shop/licenses/verify', { licenseKey }),
    },
    
    stats: () => apiClient.get('/api/shop/stats'),
  },

  // Statistics
  stats: {
    overview: () => apiClient.get('/api/stats/overview'),
  },
};

export default apiClient;
