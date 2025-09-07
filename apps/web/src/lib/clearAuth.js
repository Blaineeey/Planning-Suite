// Clear authentication utility
// Run this to clear any invalid tokens

if (typeof window !== 'undefined') {
  // Clear all auth-related items from localStorage
  const authKeys = ['auth_token', 'user', 'organization'];
  
  authKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`Clearing ${key} from localStorage`);
      localStorage.removeItem(key);
    }
  });
  
  console.log('✅ Authentication data cleared successfully');
  console.log('You can now login with fresh credentials');
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
  }
}

export default clearAuth;
