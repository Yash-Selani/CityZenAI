'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link href="/login">
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
              Sign In
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
          }}
          id="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Link
            href="/report"
            onClick={() => setMenuOpen(false)}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '12px 0',
              fontSize: '0.95rem',
            }}
          >
            Report Issue
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '12px 0',
              fontSize: '0.95rem',
            }}
          >
            Dashboard
          </Link>
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            <button className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Sign In
            </button>
          </Link>
        </motion.div>
      )}
    </header>
  );
}
