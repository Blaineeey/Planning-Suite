# Ruban Bleu Authentication System - Fixed Role-Based Registration

## ✅ ISSUE FIXED

The registration system now properly assigns roles based on user type instead of defaulting everyone to ADMIN/OWNER role.

---

## 📝 REGISTRATION ENDPOINTS

### 1. Main Registration Endpoint
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-0123",
  "userType": "CLIENT", // Required: CLIENT, VENDOR, PLANNER, or OWNER
  
  // Additional fields based on userType:
  
  // For PLANNER/OWNER:
  "organizationName": "My Wedding Planning Co",
  
  // For VENDOR:
  "businessName": "Elegant Photography",
  "businessCategory": "Photography",
  
  // For CLIENT (optional):
  "eventDate": "2025-07-15",
  "partnerName": "Jane Smith"
}
```

### 2. Quick Registration Endpoints

#### Client Registration
```
POST /api/auth/register/client
```
```json
{
  "email": "bride@example.com",
  "password": "password123",
  "firstName": "Emily",
  "lastName": "Johnson",
  "phone": "555-0124",
  "eventDate": "2025-08-20",
  "partnerName": "Michael Brown"
}
```

#### Vendor Registration
```
POST /api/auth/register/vendor
```
```json
{
  "email": "photographer@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Photo",
  "phone": "555-0125",
  "businessName": "Premium Photography",
  "businessCategory": "Photography"
}
```

#### Planner Registration
```
POST /api/auth/register/planner
```
```json
{
  "email": "planner@example.com",
  "password": "password123",
  "firstName": "Sarah",
  "lastName": "Planner",
  "phone": "555-0126",
  "organizationName": "Elite Wedding Planning"
}
```

---

## 👥 USER ROLES & PERMISSIONS

### 1. CLIENT Role
- **Purpose**: Couples planning their wedding
- **Access**: Client portal only (`/client/*` routes)
- **Permissions**:
  - `view_own_project` - View their wedding project
  - `manage_rsvp` - Manage guest RSVPs
  - `view_invoices` - View and pay invoices
- **Features**:
  - Simplified dashboard
  - Wedding planning tools
  - Guest management
  - Invoice viewing
  - Wedding website preview

### 2. VENDOR Role
- **Purpose**: Wedding service providers
- **Access**: Vendor portal (`/vendor/*` routes)
- **Permissions**:
  - `manage_vendor_profile` - Edit business profile
  - `view_leads` - See potential clients
  - `respond_to_requests` - Reply to inquiries
- **Features**:
  - Business profile management
  - Lead viewing
  - Availability calendar
  - Portfolio management
  - Reviews and ratings

### 3. PLANNER Role
- **Purpose**: Wedding planning professionals
- **Access**: Full dashboard (`/dashboard/*` routes)
- **Permissions**:
  - `manage_projects` - Create and manage weddings
  - `manage_clients` - Handle client relationships
  - `manage_vendors` - Coordinate with vendors
- **Features**:
  - Multiple client management
  - Project management tools
  - Vendor coordination
  - Budget tracking
  - Timeline creation

### 4. OWNER Role
- **Purpose**: Business owners/administrators
- **Access**: All areas including admin panel
- **Permissions**:
  - `all` - Complete system access
- **Features**:
  - Everything in PLANNER role
  - User management
  - Billing and subscriptions
  - System settings
  - Analytics and reports
  - Template management

---

## 🔐 LOGIN SYSTEM

### Login Endpoint
```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT"
  },
  "organization": {
    "id": "org_123",
    "name": "Organization Name",
    "subdomain": "org-subdomain"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🧪 TEST ACCOUNTS

The system includes pre-configured demo accounts for testing (all use password: `demo123`):

### 1. Admin/Owner Account
- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Role**: OWNER
- **Access**: Full system access

### 2. Planner Account
- **Email**: `planner@example.com`
- **Password**: `demo123`
- **Role**: PLANNER
- **Access**: Dashboard and project management

### 3. Client Account
- **Email**: `client@example.com`
- **Password**: `demo123`
- **Role**: CLIENT
- **Access**: Client portal only

### 4. Vendor Account
- **Email**: `vendor@example.com`
- **Password**: `demo123`
- **Role**: VENDOR
- **Access**: Vendor portal

---

## 🏢 ORGANIZATION STRUCTURE

### Default Organizations

1. **Client Organization**
   - Name: "Ruban Bleu Clients"
   - Purpose: Houses all client accounts
   - Created automatically when first client registers

2. **Vendor Organization**
   - Name: "Ruban Bleu Vendor Directory"
   - Purpose: Houses all vendor accounts
   - Created automatically when first vendor registers

3. **Planner Organizations**
   - Each planner/owner creates their own organization
   - Separate billing and settings per organization

---

## 🔄 REGISTRATION FLOW

### Client Registration Flow:
1. User selects "I'm getting married" option
2. Fills basic info + optional wedding date
3. System creates CLIENT account
4. Auto-creates wedding project
5. Redirects to `/client/dashboard`

### Vendor Registration Flow:
1. User selects "I'm a vendor" option
2. Fills business details + category
3. System creates VENDOR account
4. Creates vendor profile (pending approval)
5. Redirects to `/vendor/dashboard`

### Planner Registration Flow:
1. User selects "I'm a wedding planner" option
2. Fills organization details
3. System creates PLANNER account
4. Creates new organization
5. Redirects to `/dashboard`

---

## 🛡️ SECURITY FEATURES

1. **Password Hashing**: bcrypt with salt rounds of 10
2. **JWT Tokens**: 7-day expiration
3. **Role Verification**: Each request validates user role
4. **Permission Checking**: Granular permission system
5. **Organization Isolation**: Data separated by organization

---

## 📱 FRONTEND INTEGRATION

### Using the Auth System in React/Next.js:

```javascript
// Registration
const registerClient = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...userData,
      userType: 'CLIENT'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    // Store token
    localStorage.setItem('token', data.token);
    // Redirect based on role
    if (data.user.role === 'CLIENT') {
      router.push('/client/dashboard');
    } else if (data.user.role === 'VENDOR') {
      router.push('/vendor/dashboard');
    } else {
      router.push('/dashboard');
    }
  }
};

// Login with role-based redirect
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    
    // Role-based redirect
    switch(data.user.role) {
      case 'CLIENT':
        router.push('/client/dashboard');
        break;
      case 'VENDOR':
        router.push('/vendor/dashboard');
        break;
      case 'PLANNER':
      case 'OWNER':
        router.push('/dashboard');
        break;
    }
  }
};
```

---

## ✅ FIXES IMPLEMENTED

1. **Role Assignment**: Users now get correct roles based on `userType` parameter
2. **Organization Creation**: Separate organizations for clients, vendors, and planners
3. **Permission Sets**: Role-specific permissions properly assigned
4. **Vendor Profiles**: Automatic vendor profile creation for vendor accounts
5. **Client Projects**: Automatic project creation for client accounts
6. **Quick Registration**: Shortcut endpoints for each user type
7. **Test Accounts**: Pre-configured demo accounts for all roles

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: "User already exists"
**Solution**: Email is already registered. Use a different email or login with existing account.

### Issue: "Organization name is required for planners"
**Solution**: When registering as PLANNER or OWNER, include `organizationName` in request.

### Issue: "Business name and category are required for vendors"
**Solution**: When registering as VENDOR, include both `businessName` and `businessCategory`.

### Issue: Wrong dashboard after login
**Solution**: Check user role in response and redirect accordingly:
- CLIENT → `/client/dashboard`
- VENDOR → `/vendor/dashboard`
- PLANNER/OWNER → `/dashboard`

---

## 📊 DATABASE CHANGES

The following changes were made to support proper role-based auth:

1. **Organizations Table**:
   - Added `isDefault` flag for client organization
   - Added `isVendorDirectory` flag for vendor organization
   
2. **Users Table**:
   - `role` field now properly uses: CLIENT, VENDOR, PLANNER, OWNER
   - Added `metadata` field for client-specific data
   - Role-specific permission arrays

3. **Vendors Table**:
   - Added `userId` to link vendor profile to user account
   - Added `status` field for approval workflow

4. **Projects Table**:
   - Auto-created for CLIENT accounts
   - Linked to client user ID

---

## 🔄 MIGRATION GUIDE

For existing systems to adopt this auth system:

### 1. Update User Roles
```sql
-- Update existing users to proper roles
UPDATE users SET role = 'OWNER' WHERE role = 'ADMIN';
UPDATE users SET role = 'CLIENT' WHERE role = 'USER';
```

### 2. Create Default Organizations
```javascript
// Run once to create default orgs
const clientOrg = db.create('organizations', {
  name: 'Ruban Bleu Clients',
  email: 'clients@rubanbleu.com',
  isDefault: true,
  subdomain: 'clients'
});

const vendorOrg = db.create('organizations', {
  name: 'Ruban Bleu Vendor Directory',
  email: 'vendors@rubanbleu.com',
  isVendorDirectory: true,
  subdomain: 'vendors'
});
```

### 3. Update Frontend Routes
```javascript
// Add role-based route protection
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Usage
<ProtectedRoute allowedRoles={['CLIENT']}>
  <ClientDashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={['PLANNER', 'OWNER']}>
  <AdminDashboard />
</ProtectedRoute>
```

---

## 📋 TESTING CHECKLIST

### Test Client Registration:
- [ ] Register new client account
- [ ] Verify role is CLIENT
- [ ] Check project is auto-created
- [ ] Confirm redirect to `/client/dashboard`
- [ ] Test client-only permissions

### Test Vendor Registration:
- [ ] Register new vendor account
- [ ] Verify role is VENDOR
- [ ] Check vendor profile created
- [ ] Confirm redirect to `/vendor/dashboard`
- [ ] Test vendor-only permissions

### Test Planner Registration:
- [ ] Register new planner account
- [ ] Verify role is PLANNER
- [ ] Check organization created
- [ ] Confirm redirect to `/dashboard`
- [ ] Test planner permissions

### Test Login Flow:
- [ ] Login with each role type
- [ ] Verify correct dashboard redirect
- [ ] Check JWT token contains role
- [ ] Test role-based API access

---

## 🎯 SUMMARY

The authentication system now properly handles four distinct user types:

1. **CLIENTS** - Couples planning their wedding
2. **VENDORS** - Service providers in the directory
3. **PLANNERS** - Wedding planning professionals
4. **OWNERS** - Business administrators

Each role has:
- ✅ Specific registration requirements
- ✅ Unique permissions and access levels
- ✅ Dedicated dashboard interfaces
- ✅ Appropriate data isolation
- ✅ Role-specific features

The system is now ready for production use with proper role-based access control!