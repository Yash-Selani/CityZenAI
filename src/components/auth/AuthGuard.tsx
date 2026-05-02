'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // If no user and not on login page, redirect to login
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        // If logged in and on login page, redirect to home
        router.push('/');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading && pathname !== '/login') {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        gap: '20px'
      }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent-start)' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          VERIFYING ACCESS...
        </p>
        <style jsx>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
