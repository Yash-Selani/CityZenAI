'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setLoading(false);
        // If logged in and on login page, go to home
        if (pathname === '/login') {
          router.push('/');
        }
      } else {
        setIsAuthenticated(false);
        setLoading(false);
        // If not logged in and not on login page, force redirect to login
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // If on login page, always allow rendering (the login page itself handles its redirect)
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // While checking auth OR if not authenticated, show loader and don't render children
  if (loading || !isAuthenticated) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#07070E',
        gap: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)'
        }}>
          <Loader2 size={32} className="animate-spin" color="white" />
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Initializing CityZenAI...
        </p>
        <style jsx>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Only render children if authenticated
  return <>{children}</>;
}
