'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Pencil,
  X,
  Shield,
  Sparkles,
  ArrowLeft,
  Settings,
  ChevronRight
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

// --- Sub-components for Layouts ---

/**
 * Setup Wizard Layout (First-time user)
 */
function SetupWizard({
  data,
  onSave,
  saving,
  error,
}: {
  data: ProfileData;
  onSave: (data: ProfileData) => void;
  saving: boolean;
  error: string | null;
}) {
  const [formData, setFormData] = useState<ProfileData>({ ...data });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '24px',
          background: 'var(--accent-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 12px 40px rgba(99,102,241,0.4)',
          transform: 'rotate(-5deg)'
        }}>
          <Sparkles size={36} color="white" />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.03em' }}>
          Welcome to <span className="gradient-text">CityZenAI</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '340px', margin: '0 auto' }}>
          Let&apos;s set up your profile so authorities can reach you regarding your reports.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Name Input */}
            <div className="form-group">
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Full Name <span style={{ color: 'var(--accent-start)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Rahul Sharma"
                  className="input-field"
                  style={{ paddingLeft: '44px', width: '100%', fontSize: '1rem' }}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  className="input-field"
                  style={{ paddingLeft: '44px', width: '100%', fontSize: '1rem' }}
                />
              </div>
            </div>

            {/* Address Input */}
            <div className="form-group">
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Default Area / Address
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Piplia Bazar, Ujjain"
                  className="input-field"
                  style={{ paddingLeft: '44px', width: '100%', minHeight: '100px', paddingTop: '12px', fontSize: '1rem' }}
                />
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--status-danger)', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '12px',
                borderRadius: '16px'
              }}
            >
              {saving ? <Loader2 size={24} className="animate-spin" /> : (
                <>
                  Start Reporting
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <a href="/report" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'underline' }}>
          Skip setup for now
        </a>
      </div>
    </motion.div>
  );
}

/**
 * Profile Dashboard Layout (View-only)
 */
function ProfileDashboard({
  data,
  onEdit,
  onSignOut,
}: {
  data: ProfileData;
  onEdit: () => void;
  onSignOut: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: '100%' }}
    >
      {/* Profile ID Card */}
      <div className="glass-card" style={{ padding: '32px', borderRadius: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative Background */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '120px', height: '120px',
          background: 'var(--accent-gradient)',
          opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
            position: 'relative',
          }}>
            <User size={40} color="white" />
            <div style={{
              position: 'absolute', bottom: '2px', right: '2px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--status-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '3px solid #0a0a0f',
            }}>
              <Shield size={12} color="white" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>{data.name || 'Anonymous User'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-success)' }} />
              Active Citizen Account
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={18} style={{ color: 'var(--accent-start)' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Phone Number</p>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{data.phone}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={18} style={{ color: 'var(--accent-start)' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Email Address</p>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{data.email || 'Not provided'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={18} style={{ color: 'var(--accent-start)' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Registered Area</p>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>{data.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={onEdit}
          className="glass-card"
          style={{
            width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid var(--glass-border)', cursor: 'pointer', textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pencil size={16} style={{ color: 'var(--accent-start)' }} />
            </div>
            <span style={{ fontWeight: 600 }}>Edit Personal Details</span>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
        </button>

        <button
          onClick={() => {}}
          className="glass-card"
          style={{
            width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid var(--glass-border)', cursor: 'pointer', textAlign: 'left', opacity: 0.7
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <span style={{ fontWeight: 600 }}>Notification Preferences</span>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
        </button>

        <div style={{ height: '12px' }} />

        <button
          onClick={onSignOut}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px', background: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--status-danger)',
            fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
        >
          <LogOut size={18} />
          Sign Out Account
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Edit Mode Layout
 */
function ProfileEditor({
  data,
  onSave,
  onCancel,
  saving,
  error,
}: {
  data: ProfileData;
  onSave: (data: ProfileData) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [formData, setFormData] = useState<ProfileData>({ ...data });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onCancel} className="btn-ghost" style={{ padding: '8px', borderRadius: '12px' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Edit Profile</h1>
      </div>

      <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>FULL NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>EMAIL</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>ADDRESS / AREA</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
                style={{ width: '100%', minHeight: '80px' }}
              />
            </div>

            {error && <p style={{ color: 'var(--status-danger)', fontSize: '0.85rem' }}>{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// --- Main Page Component ---

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit' | 'setup'>('view');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const phoneFromAuth = user.phoneNumber || '';

      try {
        const res = await fetch(`/api/user?userId=${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const profile = data.data;
            const hasProfileData = profile.name && profile.name.trim() !== '';

            if (!hasProfileData) {
              setIsNewUser(true);
              setMode('setup');
            } else {
              setMode('view');
            }

            setProfileData({
              name: profile.name || '',
              email: profile.email || '',
              phone: profile.phone || phoneFromAuth,
              address: profile.address || '',
            });
          } else {
            setIsNewUser(true);
            setMode('setup');
            setProfileData(prev => ({ ...prev, phone: phoneFromAuth }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setProfileData(prev => ({ ...prev, phone: phoneFromAuth }));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async (data: ProfileData) => {
    if (!auth.currentUser) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: auth.currentUser.uid,
          ...data,
        }),
      });

      if (res.ok) {
        setProfileData(data);
        setSuccess(true);
        setIsNewUser(false);
        setMode('view');
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to save profile');
      }
    } catch (err) {
      console.error('Failed to save profile', err);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ height: 'calc(100vh - 136px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-start)' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px 20px 80px', minHeight: 'calc(100vh - 136px)', display: 'flex', alignItems: 'center' }}>
      <AnimatePresence mode="wait">
        {mode === 'setup' && (
          <SetupWizard key="setup" data={profileData} onSave={handleSave} saving={saving} error={error} />
        )}
        {mode === 'view' && (
          <ProfileDashboard key="view" data={profileData} onEdit={() => setMode('edit')} onSignOut={handleSignOut} />
        )}
        {mode === 'edit' && (
          <ProfileEditor key="edit" data={profileData} onSave={handleSave} onCancel={() => setMode('view')} saving={saving} error={error} />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from {transform:rotate(0deg)} to {transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
