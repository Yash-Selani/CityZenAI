'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  Camera,
  Brain,
  Mail,
  MapPin,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeInOut' as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// --- Stats Counter Component ---
function AnimatedCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center' }}
    >
      <div style={{
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
      }}>
        <span className="gradient-text">
          {isInView ? value.toLocaleString() : '0'}{suffix}
        </span>
      </div>
      <div style={{
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginTop: '4px',
        fontWeight: 500,
      }}>
        {label}
      </div>
    </motion.div>
  );
}

// --- Feature Card ---
function FeatureCard({
  icon: Icon,
  title,
  description,
  step,
}: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  title: string;
  description: string;
  step: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={step * 0.1}
      className="glass-card"
      style={{
        padding: '32px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Step number */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '20px',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        Step {step}
      </div>

      {/* Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'var(--accent-gradient)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
      }}>
        <Icon size={26} style={{ color: 'white' }} />
      </div>

      <h3 style={{
        fontSize: '1.15rem',
        fontWeight: 700,
        marginBottom: '8px',
        color: 'var(--text-primary)',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '0.88rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
      }}>
        {description}
      </p>
    </motion.div>
  );
}

// --- Why CityZenAI Card ---
function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        background: 'rgba(99, 102, 241, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} style={{ color: 'var(--accent-start)' }} />
      </div>
      <div>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '4px',
          color: 'var(--text-primary)',
        }}>
          {title}
        </h4>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// --- Main Landing Page ---
export default function LandingPage() {
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const benefitsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: '-80px' });

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ===== HERO SECTION ===== */}
      <section
        id="hero-section"
        style={{
          minHeight: 'calc(100vh - 136px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px 20px 60px',
          position: 'relative',
        }}
      >
        {/* Floating accent orb */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            marginBottom: '24px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
          }}
        >
          <Zap size={14} style={{ color: 'var(--accent-mid)' }} />
          AI-Powered Civic Reporting
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '800px',
            marginBottom: '20px',
          }}
        >
          Fix Your City.{' '}
          <span className="gradient-text">One Snap</span>{' '}
          at a Time.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          Photograph any civic issue — potholes, garbage, broken lights. Our AI identifies it,
          finds the right authority, and drafts a complaint for you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link href="/report">
            <button className="btn-primary pulse-glow" id="cta-report-issue" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1rem',
              padding: '16px 36px',
            }}>
              <Camera size={20} />
              Report an Issue
              <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="btn-ghost" id="cta-view-map" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              padding: '14px 28px',
            }}>
              <MapPin size={18} />
              View Heatmap
            </button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: '24px',
              height: '36px',
              borderRadius: '12px',
              border: '2px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '8px',
            }}
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '3px',
                height: '8px',
                borderRadius: '2px',
                background: 'var(--accent-start)',
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        id="how-it-works"
        ref={featuresRef}
        style={{
          padding: '80px 20px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <motion.div
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={stagger}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--accent-mid)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '12px',
            }}
          >
            How It Works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={0.1}
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Three Steps to a{' '}
            <span className="gradient-text">Better City</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={stagger}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          <FeatureCard
            icon={Camera}
            title="Snap a Photo"
            description="Open your camera, capture the civic issue. GPS coordinates are auto-detected."
            step={1}
          />
          <FeatureCard
            icon={Brain}
            title="AI Analyzes"
            description="Gemini AI identifies the issue type, severity, and the responsible municipal authority."
            step={2}
          />
          <FeatureCard
            icon={Mail}
            title="Send Complaint"
            description="A formal complaint letter is auto-drafted. One tap sends it to the right authority."
            step={3}
          />
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section
        id="stats-section"
        ref={statsRef}
        style={{
          padding: '60px 20px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={statsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="glass-card"
          style={{
            padding: '48px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px',
          }}
        >
          <AnimatedCounter value={12847} label="Issues Reported" suffix="+" />
          <AnimatedCounter value={8432} label="Issues Resolved" suffix="" />
          <AnimatedCounter value={156} label="Cities Covered" suffix="" />
          <AnimatedCounter value={98} label="AI Accuracy" suffix="%" />
        </motion.div>
      </section>

      {/* ===== WHY CITYZENAI ===== */}
      <section
        id="benefits-section"
        ref={benefitsRef}
        style={{
          padding: '80px 20px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <motion.div
          initial="hidden"
          animate={benefitsInView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--accent-mid)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '12px',
            }}>
              Why CityZenAI
            </p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}>
              Built for <span className="gradient-text">Citizens</span>
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            <BenefitCard
              icon={Zap}
              title="Instant AI Analysis"
              description="Get issue category, severity, and authority contact in under 5 seconds."
            />
            <BenefitCard
              icon={Shield}
              title="Verified Authorities"
              description="We map your GPS to the correct Nagar Nigam, Nagar Palika, or Gram Panchayat."
            />
            <BenefitCard
              icon={Clock}
              title="Track Your Complaint"
              description="Monitor the status of your reported issues in real-time on the heatmap."
            />
            <BenefitCard
              icon={TrendingUp}
              title="Community Impact"
              description="See how many issues your city has reported and resolved collectively."
            />
          </div>
        </motion.div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={{
        padding: '80px 20px 120px',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}>
            Ready to make a{' '}
            <span className="gradient-text">difference</span>?
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px',
          }}>
            Your city needs you. Start reporting today.
          </p>
          <Link href="/report">
            <button className="btn-primary pulse-glow" id="cta-bottom-report" style={{
              fontSize: '1.05rem',
              padding: '18px 48px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Camera size={22} />
              Report Your First Issue
              <ArrowRight size={20} />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
