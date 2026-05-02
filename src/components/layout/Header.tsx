'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Menu, X, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        try {
          const res = await fetch(`/api/user?userId=${u.uid}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data?.name) {
              setUserName(data.data.name);
            }
          }
        } catch (e) {
          console.error('Header profile fetch failed:', e);
        }
      } else {
        setUserName(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setMenuOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <header
      id="main-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(7, 7, 14, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '12px 20px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div
            whileHover={{ rotate: 15 }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={20} color="white" />
          </motion.div>
          <div>
            <span style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              City<span className="gradient-text">Zen</span>AI
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
        }}
          className="hidden md:flex"
        >
          <Link href="/report" style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}>
            Report Issue
          </Link>
          <Link href="/dashboard" style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}>
            Dashboard
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/profile">
                <button className="btn-ghost" style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <User size={14} color="white" />
                  </div>
                  <span style={{ fontWeight: 600 }}>{userName || 'Citizen'}</span>
                </button>
              </Link>
              <button
                className="btn-ghost"
                onClick={handleSignOut}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--status-danger)',
                  borderColor: 'var(--status-danger)',
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
                Sign In
              </button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle - Removed in favor of BottomNav */}
      </div>
    </header>
  );
}
