// Enhanced Database Schema for Ruban Bleu Planning Suite
// This is an in-memory database structure that mirrors a real database

const database = {
  // Core Entities
  organizations: [],
  users: [],
  roles: [],
  permissions: [],
  
  // CRM & Sales (HoneyBook parity)
  leads: [],
  contacts: [],
  pipelines: [],
  pipelineStages: [],
  proposals: [],
  contracts: [],
  invoices: [],
  payments: [],
  estimates: [],
  appointments: [],
  
  // Project & Wedding Management (Aisle Planner parity)
  projects: [],
  projectTemplates: [],
  checklists: [],
  checklistItems: [],
  tasks: [],
  timelines: [],
  timelineItems: [],
  
  // Guest Management
  guests: [],
  households: [],
  rsvps: [],
  mealSelections: [],
  tables: [],
  seats: [],
  
  // Vendor Management
  vendors: [],
  vendorCategories: [],
  vendorDocuments: [],
  vendorRequests: [],
  vendorReviews: [],
  
  // Budget Management
  budgets: [],
  budgetCategories: [],
  budgetLines: [],
  paymentSchedules: [],
  
  // Wedding Websites
  weddingWebsites: [],
  websitePages: [],
  websiteThemes: [],
  websiteAnalytics: [],
  
  // Digital Shop
  products: [],
  productCategories: [],
  orders: [],
  orderItems: [],
  downloads: [],
  coupons: [],
  licenses: [],
  
  // Communications
  messages: [],
  emailTemplates: [],
  smsTemplates: [],
  notifications: [],
  workflows: [],
  automations: [],
  
  // Files & Documents
  files: [],
  folders: [],
  documents: [],
  
  // Design Studio
  moodBoards: [],
  colorPalettes: [],
  designElements: [],
  
  // System
  auditLogs: [],
  settings: [],
  integrations: [],
  webhooks: []
};

// Helper Functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Data Model Schemas
const schemas = {
  // Organization/Account
  organization: {
    id: String,
    name: String,
    logo: String,
    primaryColor: String,
    secondaryColor: String,
    domain: String,
    subdomain: String,
    email: String,
    phone: String,
    address: Object,
    timezone: String,
    currency: String,
    subscription: Object,
    settings: Object,
    createdAt: Date,
    updatedAt: Date
  },

  // User with Roles
  user: {
    id: String,
    organizationId: String,
    email: String,
    password: String, // hashed
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    role: String, // OWNER, ADMIN, PLANNER, CLIENT, VENDOR, GUEST
    permissions: Array,
    isActive: Boolean,
    emailVerified: Boolean,
    twoFactorEnabled: Boolean,
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date
  },

  // Lead/Contact
  lead: {
    id: String,
    organizationId: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    source: String,
    status: String, // NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST
    pipelineStageId: String,
    tags: Array,
    eventDate: Date,
    eventType: String,
    budget: Number,
    guestCount: Number,
    venue: String,
    notes: String,
    assignedTo: String,
    score: Number,
    lastContactDate: Date,
    createdAt: Date,
    updatedAt: Date
  },

  // Project/Event
  project: {
    id: String,
    organizationId: String,
    clientId: String,
    name: String,
    type: String, // WEDDING, CORPORATE, BIRTHDAY, etc
    status: String, // PLANNING, ACTIVE, COMPLETED, CANCELLED
    eventDate: Date,
    eventEndDate: Date,
    venue: Object,
    guestCount: Number,
    budget: Number,
    package: String,
    templateId: String,
    teamMembers: Array,
    timeline: Object,
    checklist: Object,
    files: Array,
    websiteId: String,
    customFields: Object,
    createdAt: Date,
    updatedAt: Date
  },

  // Proposal
  proposal: {
    id: String,
    organizationId: String,
    projectId: String,
    leadId: String,
    number: String,
    title: String,
    status: String, // DRAFT, SENT, VIEWED, ACCEPTED, DECLINED, EXPIRED
    lineItems: Array,
    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number,
    validUntil: Date,
    terms: String,
    notes: String,
    viewedAt: Date,
    acceptedAt: Date,
    signature: Object,
    createdAt: Date,
    updatedAt: Date
  },

  // Contract
  contract: {
    id: String,
    organizationId: String,
    projectId: String,
    proposalId: String,
    number: String,
    title: String,
    status: String, // DRAFT, SENT, SIGNED, CANCELLED
    content: String,
    terms: String,
    signatures: Array,
    signedAt: Date,
    signedDocument: String,
    createdAt: Date,
    updatedAt: Date
  },

  // Invoice
  invoice: {
    id: String,
    organizationId: String,
    projectId: String,
    clientId: String,
    number: String,
    status: String, // DRAFT, SENT, VIEWED, PAID, PARTIAL, OVERDUE, CANCELLED
    dueDate: Date,
    lineItems: Array,
    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number,
    amountPaid: Number,
    balance: Number,
    paymentTerms: String,
    notes: String,
    paymentSchedule: Array,
    reminders: Array,
    createdAt: Date,
    updatedAt: Date
  },

  // Guest
  guest: {
    id: String,
    projectId: String,
    householdId: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: Object,
    rsvpStatus: String, // PENDING, YES, NO, MAYBE
    rsvpCode: String,
    plusOne: Boolean,
    plusOneName: String,
    mealSelection: String,
    dietaryRestrictions: String,
    tableId: String,
    seatNumber: Number,
    ageGroup: String, // ADULT, CHILD, INFANT
    side: String, // BRIDE, GROOM, BOTH
    tags: Array,
    notes: String,
    rsvpDate: Date,
    createdAt: Date,
    updatedAt: Date
  },

  // Vendor
  vendor: {
    id: String,
    organizationId: String,
    name: String,
    category: String,
    email: String,
    phone: String,
    website: String,
    address: Object,
    serviceArea: Array,
    priceRange: String,
    description: String,
    images: Array,
    documents: Array,
    insurance: Object,
    rating: Number,
    reviews: Array,
    featured: Boolean,
    verified: Boolean,
    status: String, // ACTIVE, INACTIVE, PENDING
    availability: Object,
    portalAccess: Boolean,
    createdAt: Date,
    updatedAt: Date
  },

  // Wedding Website
  weddingWebsite: {
    id: String,
    projectId: String,
    subdomain: String,
    url: String,
    templateId: String,
    theme: Object,
    pages: Array,
    navigation: Array,
    coupleNames: Object,
    story: String,
    photos: Array,
    eventDetails: Object,
    schedule: Array,
    venue: Object,
    accommodations: Array,
    registry: Array,
    rsvpEnabled: Boolean,
    rsvpDeadline: Date,
    privacy: String, // PUBLIC, LINK_ONLY, PASSWORD
    password: String,
    customCss: String,
    customJs: String,
    analytics: Object,
    isPublished: Boolean,
    publishedAt: Date,
    createdAt: Date,
    updatedAt: Date
  },

  // Product (Digital Shop)
  product: {
    id: String,
    organizationId: String,
    name: String,
    slug: String,
    category: String,
    type: String, // DIGITAL_DOWNLOAD, TEMPLATE, GUIDE, CONTRACT
    description: String,
    price: Number,
    comparePrice: Number,
    images: Array,
    files: Array,
    downloadLimit: Number,
    licenseTerms: String,
    tags: Array,
    featured: Boolean,
    status: String, // ACTIVE, DRAFT, ARCHIVED
    sales: Number,
    stock: Number,
    createdAt: Date,
    updatedAt: Date
  },

  // Workflow/Automation
  workflow: {
    id: String,
    organizationId: String,
    name: String,
    trigger: Object,
    conditions: Array,
    actions: Array,
    status: String, // ACTIVE, PAUSED, DRAFT
    runs: Number,
    lastRun: Date,
    createdAt: Date,
    updatedAt: Date
  }
};

// Export database and helpers
module.exports = {
  database,
  generateId,
  generateSlug,
  schemas,
  
  // CRUD operations
  create: (collection, data) => {
    const record = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    database[collection].push(record);
    return record;
  },
  
  findById: (collection, id) => {
    return database[collection].find(item => item.id === id);
  },
  
  findAll: (collection, filter = {}) => {
    let results = database[collection];
    Object.keys(filter).forEach(key => {
      results = results.filter(item => item[key] === filter[key]);
    });
    return results;
  },
  
  update: (collection, id, data) => {
    const index = database[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    database[collection][index] = {
      ...database[collection][index],
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };
    return database[collection][index];
  },
  
  delete: (collection, id) => {
    const index = database[collection].findIndex(item => item.id === id);
    if (index === -1) return false;
    
    database[collection].splice(index, 1);
    return true;
  }
};
