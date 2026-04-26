'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Send,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Mail,
  Phone,
  ExternalLink,
  ImageOff,
} from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAnalysis } from '@/hooks/useAnalysis';
import { categoryLabel, categoryEmoji, generateMailtoLink } from '@/lib/utils';
import type { AnalysisResult, FallbackContact } from '@/types';

// --- Step Indicator ---
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginBottom: '32px',
    }}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          style={{
            height: '4px',
            borderRadius: '2px',
            flex: 1,
            maxWidth: '60px',
            background: i < currentStep
              ? 'var(--accent-gradient)'
              : i === currentStep
                ? 'var(--accent-start)'
                : 'rgba(255,255,255,0.1)',
            transition: 'all 0.4s ease',
          }}
        />
      ))}
    </div>
  );
}

// --- Shimmer Loader ---
function AnalysisShimmer() {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[100, 80, 60, 90].map((width, i) => (
          <div
            key={i}
            className="shimmer"
            style={{
              height: '20px',
              width: `${width}%`,
              borderRadius: '8px',
            }}
          />
        ))}
        <div className="shimmer" style={{ height: '120px', borderRadius: '12px', marginTop: '8px' }} />
      </div>
    </div>
  );
}

// --- Step Components ---
function CaptureStep({
  onCapture,
}: {
  onCapture: (image: string) => void;
}) {
  const { videoRef, canvasRef, isActive, capturedImage, error, startCamera, captureImage, retake } = useCamera();
  const { coordinates, error: gpsError, loading: gpsLoading } = useGeolocation();
  const [fileImage, setFileImage] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const img = captureImage();
    if (img) onCapture(img);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setFileImage(result);
      onCapture(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        📸 Capture the Issue
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '24px',
        fontSize: '0.9rem',
      }}>
        Take a photo or upload an image of the civic issue
      </p>

      {/* GPS Status */}
      <div className="glass-card" style={{
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.85rem',
      }}>
        <MapPin size={16} style={{
          color: coordinates ? 'var(--status-success)' : gpsLoading ? 'var(--status-warning)' : 'var(--status-danger)',
        }} />
        {gpsLoading ? (
          <span style={{ color: 'var(--text-secondary)' }}>Detecting location...</span>
        ) : coordinates ? (
          <span style={{ color: 'var(--status-success)' }}>
            📍 {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
          </span>
        ) : (
          <span style={{ color: 'var(--status-danger)' }}>{gpsError}</span>
        )}
      </div>

      {/* Camera / Preview */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: '#000',
        aspectRatio: '4/3',
        marginBottom: '20px',
      }}>
        {capturedImage || fileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage || fileImage || ''}
            alt="Captured issue"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : error ? (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '24px',
          }}>
            <ImageOff size={48} style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
              {error}
            </p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Camera overlay grid */}
            {isActive && (
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 'var(--radius-lg)',
                pointerEvents: 'none',
              }}>
                {/* Crosshair */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  border: '2px solid rgba(99, 102, 241, 0.5)',
                  borderRadius: '50%',
                }} />
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {capturedImage || fileImage ? (
          <>
            <button
              className="btn-ghost"
              onClick={() => {
                retake();
                setFileImage(null);
              }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <RotateCcw size={18} />
              Retake
            </button>
            <button
              className="btn-primary"
              onClick={() => onCapture(capturedImage || fileImage || '')}
              style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Analyze with AI
              <Sparkles size={18} />
            </button>
          </>
        ) : (
          <>
            {isActive && (
              <button
                className="btn-primary"
                onClick={handleCapture}
                id="btn-capture"
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Camera size={20} />
                Capture Photo
              </button>
            )}
            <label
              className="btn-ghost"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
}

function AnalysisStep({
  result,
  onContinue,
}: {
  result: AnalysisResult;
  onContinue: () => void;
}) {
  return (
    <div>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        🤖 AI Analysis Complete
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '24px',
        fontSize: '0.9rem',
      }}>
        Here&apos;s what our AI detected
      </p>

      {/* Category & Severity */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }}>{categoryEmoji(result.category)}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {categoryLabel(result.category)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issue Category</div>
            </div>
          </div>
          <span className={`badge badge-${result.severity}`}>
            {result.severity}
          </span>
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          padding: '16px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3px solid var(--accent-start)',
        }}>
          {result.description}
        </p>
      </div>

      {/* Authority Info */}
      {result.authority && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent-mid)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '12px',
          }}>
            Responsible Authority
          </div>
          <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>
            {result.authority.name}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ✉️ {result.authority.email}
          </div>
          {result.authority.phone && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              📞 {result.authority.phone}
            </div>
          )}
        </div>
      )}

      <button
        className="btn-primary"
        onClick={onContinue}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        Review & Send Complaint
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function ReviewStep({
  result,
  onSend,
  onEdit,
}: {
  result: AnalysisResult;
  onSend: (mailtoLink?: string) => void;
  onEdit: (draft: string) => void;
}) {
  const [draft, setDraft] = useState(result.suggestedDraft);

  useEffect(() => {
    onEdit(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const mailtoLink = result.authority
    ? generateMailtoLink(
        result.authority.email,
        `Civic Complaint: ${categoryLabel(result.category)} — Immediate Attention Required`,
        draft
      )
    : '';

  return (
    <div>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        ✍️ Review Your Complaint
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '24px',
        fontSize: '0.9rem',
      }}>
        Edit the AI-drafted complaint before sending
      </p>

      {/* Complaint Editor */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent-mid)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Complaint Draft
          </span>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <Sparkles size={12} /> AI Generated
          </span>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="input-field"
          style={{
            minHeight: '250px',
            resize: 'vertical',
            lineHeight: 1.7,
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* Send Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {result.authority ? (
          <button className="btn-primary" id="btn-send-email" onClick={() => onSend(mailtoLink)} style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '1rem',
            padding: '16px',
          }}>
            <Mail size={20} />
            Send to {result.authority.name}
            <Send size={18} />
          </button>
        ) : (
          <FallbackSection />
        )}
      </div>
    </div>
  );
}

function FallbackSection() {
  const fallbacks: FallbackContact[] = [
    {
      type: 'helpline',
      name: 'National Municipal Helpline',
      value: '1800-111-555',
      description: 'Toll-free for civic complaints',
    },
    {
      type: 'helpline',
      name: 'Swachh Bharat',
      value: '1969',
      description: 'Cleanliness complaints',
    },
    {
      type: 'portal',
      name: 'CPGRAMS Portal',
      value: 'https://pgportal.gov.in/',
      description: 'Government grievance system',
    },
  ];

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
      }}>
        <AlertTriangle size={18} style={{ color: 'var(--status-warning)' }} />
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
          Authority Not Found
        </span>
      </div>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
        marginBottom: '16px',
      }}>
        We couldn&apos;t identify the exact authority. Use these alternatives:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {fallbacks.map((contact, i) => (
          <a
            key={i}
            href={contact.type === 'helpline' ? `tel:${contact.value}` : contact.value}
            target={contact.type === 'portal' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="glass-card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {contact.type === 'helpline' ? (
                <Phone size={16} style={{ color: 'var(--accent-start)' }} />
              ) : (
                <ExternalLink size={16} style={{ color: 'var(--accent-start)' }} />
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{contact.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{contact.description}</div>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </a>
        ))}
      </div>
    </div>
  );
}

function SuccessStep({
  result,
  draft,
}: {
  result: AnalysisResult | null;
  draft: string;
}) {
  const mailtoLink = result?.authority
    ? generateMailtoLink(
        result.authority.email,
        `Civic Complaint: ${categoryLabel(result.category)} — Immediate Attention Required`,
        draft || result?.suggestedDraft || ''
      )
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ textAlign: 'center', padding: '40px 0' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 40px rgba(99, 102, 241, 0.4)',
        }}
      >
        <CheckCircle2 size={40} color="white" />
      </motion.div>

      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: 800,
        marginBottom: '12px',
      }}>
        Complaint <span className="gradient-text">Sent!</span>
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        maxWidth: '400px',
        margin: '0 auto 24px',
        lineHeight: 1.6,
      }}>
        Your complaint has been drafted and the email client was opened. 
        Make sure to hit send in your email app!
      </p>

      {/* Manual Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto 32px' }}>
        {mailtoLink && (
          <a href={mailtoLink} style={{ textDecoration: 'none' }}>
            <button className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Mail size={18} />
              Open Email App Manually
            </button>
          </a>
        )}
        {result?.authority?.phone && (
          <a href={`tel:${result.authority.phone}`} style={{ textDecoration: 'none' }}>
            <button className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Phone size={18} />
              Call Authority ({result.authority.phone})
            </button>
          </a>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/report">
          <button className="btn-primary" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Camera size={18} />
            Report Another
          </button>
        </a>
        <a href="/dashboard">
          <button className="btn-ghost" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <MapPin size={18} />
            View Map
          </button>
        </a>
      </div>
    </motion.div>
  );
}

// --- Main Report Page ---
export default function ReportPage() {
  const [step, setStep] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [finalDraft, setFinalDraft] = useState('');
  const { coordinates } = useGeolocation();
  const { analyze, loading: analyzing, error } = useAnalysis();

  const handleCapture = useCallback(async (image: string) => {
    setCapturedImage(image);

    // Auto-analyze
    const lat = coordinates?.latitude || 23.1765;  // Default to Ujjain
    const lng = coordinates?.longitude || 75.7885;

    setStep(1);
    const result = await analyze(image, lat, lng);
    if (result?.data) {
      setAnalysisResult(result.data);
      setStep(2);
    }
  }, [coordinates, analyze]);

  const handleSend = (mailtoLink?: string) => {
    if (mailtoLink) {
      window.location.href = mailtoLink;
    }
    // Add a short delay before changing state to ensure the mailto protocol has time to trigger the OS dialog
    setTimeout(() => {
      setStep(4);
    }, 500);
  };

  const stepTitles = ['Capture', 'Analyzing', 'Results', 'Review', 'Done'];

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '24px 20px 40px',
    }}>
      <StepIndicator currentStep={step} totalSteps={stepTitles.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && <CaptureStep onCapture={handleCapture} />}

          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
                {error ? '❌ Analysis Failed' : '🤖 Analyzing...'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                {error ? 'Something went wrong' : 'Our AI is inspecting your image'}
              </p>

              {/* Error Message */}
              {error ? (
                <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--status-danger)' }}>
                  <AlertTriangle size={32} style={{ color: 'var(--status-danger)', margin: '0 auto 16px' }} />
                  <p style={{ color: 'var(--status-danger)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
                    {error}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="btn-ghost"
                      onClick={() => {
                        setStep(0);
                        setCapturedImage(null);
                      }}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <RotateCcw size={18} />
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Preview */}
                  {capturedImage && (
                    <div style={{
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      marginBottom: '24px',
                      position: 'relative',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={capturedImage}
                        alt="Analyzing"
                        style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', opacity: 0.7 }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.4)',
                      }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 size={48} style={{ color: 'var(--accent-start)' }} />
                        </motion.div>
                      </div>
                    </div>
                  )}
                  {analyzing && <AnalysisShimmer />}
                </>
              )}
            </div>
          )}

          {step === 2 && analysisResult && (
            <AnalysisStep result={analysisResult} onContinue={() => setStep(3)} />
          )}

          {step === 3 && analysisResult && (
            <ReviewStep
              result={analysisResult}
              onSend={handleSend}
              onEdit={setFinalDraft}
            />
          )}

          {step === 4 && <SuccessStep result={analysisResult} draft={finalDraft} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
