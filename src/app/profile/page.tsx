'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Save, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
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
      
      // Pre-fill phone if available from Firebase
      if (user.phoneNumber) {
        setFormData(prev => ({ ...prev, phone: user.phoneNumber || '' }));
      }

      // Fetch from DB
      try {
        const res = await fetch(`/api/user?userId=${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setFormData(prev => ({
              name: data.data.name || prev.name,
              email: data.data.email || prev.email,
              phone: data.data.phone || prev.phone,
              address: data.data.address || prev.address,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setSaving(true);
    setSuccess(false);
    
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: auth.currentUser.uid,
          ...formData
        }),
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-start)' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px', minHeight: 'calc(100vh - 136px)' }}>
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}>
            <User size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            Your <span className="gradient-text">Profile</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Save your details to automatically include them in your complaints.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="input-field"
                style={{ paddingLeft: '42px', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91..."
                className="input-field"
                style={{ paddingLeft: '42px', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Email Address (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="input-field"
                style={{ paddingLeft: '42px', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Address
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your full address (optional, but helpful for authorities)"
                className="input-field"
                style={{ paddingLeft: '42px', width: '100%', minHeight: '80px', resize: 'vertical', paddingTop: '12px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {saving ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : success ? (
              <>
                <CheckCircle2 size={20} /> Saved Successfully
              </>
            ) : (
              <>
                <Save size={20} /> Save Profile
              </>
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => router.push('/report')}
            className="btn-ghost" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Continue to Report <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
      <style jsx global>{`@keyframes spin { from {transform:rotate(0deg)} to {transform:rotate(360deg)} }`}</style>
    </div>
  );
}
