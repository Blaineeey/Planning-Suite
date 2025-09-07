'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, init, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await init();
      } catch (error) {
        console.log('Auth initialization completed');
      } finally {
        setIsInitialized(true);
      }
    };
    
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, init]);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4">
          <span className="text-white font-bold text-2xl">RB</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ruban Bleu Planning Suite</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mt-4"></div>
      </div>
    </div>
  );
}
