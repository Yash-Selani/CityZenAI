'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Phone, ArrowRight, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    grecaptcha: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone'|'otp'|'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already logged in, redirect to profile
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/profile');
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Initialize RecaptchaVerifier only when not checking auth and on phone step
    if (typeof window !== 'undefined' && !window.recaptchaVerifier && !checkingAuth) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
      });
    }
  }, [checkingAuth]);

  const handleSendOTP = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    setError(null);
    try {
      const phoneNumber = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      // Reset recaptcha if it fails
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          window.grecaptcha.reset(widgetId);
        });
      }
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.some((d) => !d) || !confirmationResult) return;
    setLoading(true);
    setError(null);
    try {
      const otpCode = otp.join('');
      const userCredential = await confirmationResult.confirm(otpCode);
      const user = userCredential.user;

      // Create/update user record in database immediately after login
      try {
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.uid,
            phone: user.phoneNumber || `+91${phone}`,
          }),
        });
      } catch (dbErr) {
        // Don't block login if DB save fails - profile can be completed later
        console.error('Failed to save user to database:', dbErr);
      }

      setStep('success');

      // Auto-redirect to profile page after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP code. Please try again.');
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index+1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index-1}`)?.focus();
    }
  };

  // Show loading while checking auth state
  if (checkingAuth) {
    return (
      <div style={{ height: 'calc(100vh - 136px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-start)' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth:'420px', margin:'0 auto', padding:'60px 20px 40px', minHeight:'calc(100vh - 136px)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
      
      {/* Permanent container for visible reCAPTCHA to prevent DOM removal errors */}
      <div 
        id="recaptcha-container" 
        style={{ 
          display: step === 'phone' ? 'flex' : 'none', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      ></div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{textAlign:'center',marginBottom:'40px'}}>
        <div style={{ width:'64px',height:'64px',borderRadius:'18px',background:'var(--accent-gradient)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 8px 30px rgba(99,102,241,0.3)' }}>
          <Shield size={32} color="white" />
        </div>
        <h1 style={{fontSize:'1.8rem',fontWeight:800,marginBottom:'8px'}}>
          Welcome to <span className="gradient-text">CityZenAI</span>
        </h1>
        <p style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>Sign in to track your reported issues</p>
      </motion.div>

      {error && (
        <div className="glass-card" style={{ padding: '12px', border: '1px solid var(--status-danger)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} style={{ color: 'var(--status-danger)' }} />
          <p style={{ color: 'var(--status-danger)', fontSize: '0.85rem' }}>{error}</p>
        </div>
      )}

      {step === 'phone' && (
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
          <div className="glass-card" style={{padding:'28px 24px'}}>
            <label style={{fontSize:'0.85rem',fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:'10px'}}>Phone Number</label>
            <div style={{display:'flex',gap:'10px',marginBottom:'20px'}}>
              <div className="input-field" style={{width:'72px',textAlign:'center',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-secondary)'}}>🇮🇳 +91</div>
              <input type="tel" className="input-field" placeholder="Enter mobile number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} id="phone-input" style={{flex:1}} />
            </div>
            
            <button className="btn-primary" onClick={handleSendOTP} disabled={phone.length<10||loading} id="btn-send-otp" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',opacity:phone.length<10?0.5:1}}>
              {loading ? <Loader2 size={20} style={{animation:'spin 1s linear infinite'}} /> : <><Phone size={18}/>Send OTP<ArrowRight size={18}/></>}
            </button>
          </div>
          <p style={{textAlign:'center',fontSize:'0.75rem',color:'var(--text-muted)',marginTop:'16px'}}>We will send a 6-digit code via SMS.</p>
        </motion.div>
      )}

      {step === 'otp' && (
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <div className="glass-card" style={{padding:'28px 24px'}}>
            <div style={{textAlign:'center',marginBottom:'24px'}}>
              <p style={{fontSize:'0.9rem',color:'var(--text-secondary)'}}>Enter the code sent to</p>
              <p style={{fontWeight:700,fontSize:'1.1rem',marginTop:'4px'}}>+91 {phone}</p>
            </div>
            <div style={{display:'flex',gap:'10px',justifyContent:'center',marginBottom:'24px'}}>
              {otp.map((digit,i) => (
                <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i,e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i,e)} className="input-field" style={{width:'48px',height:'56px',textAlign:'center',fontSize:'1.3rem',fontWeight:700,padding:'0'}} />
              ))}
            </div>
            <button className="btn-primary" onClick={handleVerifyOTP} disabled={otp.some((d) => !d)||loading} id="btn-verify-otp" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',opacity:otp.some((d)=>!d)?0.5:1}}>
              {loading ? <Loader2 size={20} style={{animation:'spin 1s linear infinite'}} /> : <>Verify & Sign In<ArrowRight size={18}/></>}
            </button>
            <button onClick={() => { setStep('phone'); setError(null); setOtp(['','','','','','']); }} style={{width:'100%',background:'none',border:'none',color:'var(--accent-start)',fontSize:'0.85rem',cursor:'pointer',marginTop:'16px',padding:'8px'}}>Change phone number</button>
          </div>
        </motion.div>
      )}

      {step === 'success' && (
        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} style={{textAlign:'center'}}>
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.1,type:'spring',stiffness:200}} style={{width:'72px',height:'72px',borderRadius:'50%',background:'var(--accent-gradient)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 8px 40px rgba(99,102,241,0.4)'}}>
            <CheckCircle2 size={36} color="white" />
          </motion.div>
          <h2 style={{fontSize:'1.4rem',fontWeight:700,marginBottom:'8px'}}>Welcome, <span className="gradient-text">Citizen!</span></h2>
          <p style={{color:'var(--text-secondary)',marginBottom:'24px',fontSize:'0.9rem'}}>You are now signed in. Redirecting to your profile...</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <a href="/profile"><button className="btn-primary" style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>Complete Profile<ArrowRight size={18}/></button></a>
            <a href="/report" style={{color:'var(--text-muted)', fontSize:'0.85rem', textDecoration:'underline'}}>Skip for now</a>
          </div>
        </motion.div>
      )}

      <style jsx global>{`@keyframes spin { from {transform:rotate(0deg)} to {transform:rotate(360deg)} }`}</style>
    </div>
  );
}
