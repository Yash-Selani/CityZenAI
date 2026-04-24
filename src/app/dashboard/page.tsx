'use client';

import { useState, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { categoryLabel, categoryEmoji, formatDate, severityColor } from '@/lib/utils';
import type { ComplaintStatus, SeverityLevel } from '@/types';

// --- Sample Data ---
const SAMPLE_COMPLAINTS = [
  { id: '1', category: 'pothole', severity: 'high' as SeverityLevel, description: 'Large pothole on main road near Mahakal Temple causing traffic issues.', status: 'pending' as ComplaintStatus, latitude: 23.1828, longitude: 75.7682, city: 'Ujjain', createdAt: '2026-04-20T10:30:00Z' },
  { id: '2', category: 'garbage_dump', severity: 'critical' as SeverityLevel, description: 'Overflowing garbage dump near residential area. Health hazard.', status: 'sent' as ComplaintStatus, latitude: 23.1765, longitude: 75.7885, city: 'Ujjain', createdAt: '2026-04-19T15:20:00Z' },
  { id: '3', category: 'broken_streetlight', severity: 'medium' as SeverityLevel, description: 'Three consecutive streetlights not working on Dewas Road.', status: 'resolved' as ComplaintStatus, latitude: 23.1690, longitude: 75.7750, city: 'Ujjain', createdAt: '2026-04-18T08:45:00Z' },
  { id: '4', category: 'water_leak', severity: 'high' as SeverityLevel, description: 'Water pipeline burst causing waterlogging on Indore Road.', status: 'pending' as ComplaintStatus, latitude: 23.1900, longitude: 75.8000, city: 'Ujjain', createdAt: '2026-04-21T14:00:00Z' },
  { id: '5', category: 'damaged_road', severity: 'critical' as SeverityLevel, description: 'Severely damaged road surface after monsoon near Bus Stand.', status: 'sent' as ComplaintStatus, latitude: 23.1750, longitude: 75.7600, city: 'Ujjain', createdAt: '2026-04-22T09:15:00Z' },
  { id: '6', category: 'sewage_overflow', severity: 'critical' as SeverityLevel, description: 'Sewage overflow in residential colony causing health concerns.', status: 'pending' as ComplaintStatus, latitude: 23.1650, longitude: 75.7900, city: 'Ujjain', createdAt: '2026-04-23T11:30:00Z' },
];

const statusConfig: Record<ComplaintStatus, { color: string; icon: typeof Clock; label: string }> = {
  pending: { color: 'var(--status-warning)', icon: Clock, label: 'Pending' },
  sent: { color: 'var(--status-info)', icon: AlertTriangle, label: 'Sent' },
  resolved: { color: 'var(--status-success)', icon: CheckCircle2, label: 'Resolved' },
};

// --- Map Marker ---
function IssueMarker({ complaint }: { complaint: typeof SAMPLE_COMPLAINTS[0] }) {
  const color = severityColor(complaint.severity);
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
    }}>
      <div style={{
        width: complaint.severity === 'critical' ? '36px' : '28px',
        height: complaint.severity === 'critical' ? '36px' : '28px',
        borderRadius: '50%',
        background: color,
        border: '3px solid white',
        boxShadow: `0 2px 8px ${color}80`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: complaint.severity === 'critical' ? '16px' : '12px',
      }}>
        {categoryEmoji(complaint.category)}
      </div>
    </div>
  );
}

// --- Complaint Card ---
function ComplaintCard({ complaint }: { complaint: typeof SAMPLE_COMPLAINTS[0] }) {
  const status = statusConfig[complaint.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card"
      style={{ padding: '16px', display: 'flex', gap: '14px', cursor: 'pointer' }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: 'rgba(99, 102, 241, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', flexShrink: 0,
      }}>
        {categoryEmoji(complaint.category)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{categoryLabel(complaint.category)}</span>
          <span className={`badge badge-${complaint.severity}`} style={{ fontSize: '0.65rem' }}>{complaint.severity}</span>
        </div>
        <p style={{
          fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px',
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {complaint.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: status.color }}>
            <StatusIcon size={12} />{status.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
            <MapPin size={12} />{complaint.city} · {formatDate(complaint.createdAt)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Dashboard ---
export default function DashboardPage() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const hasApiKey = apiKey && apiKey !== 'your_google_maps_api_key_here';

  const filteredComplaints = useMemo(() => {
    return SAMPLE_COMPLAINTS.filter((c) => {
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      return true;
    });
  }, [filterStatus]);

  return (
    <div style={{ height: 'calc(100vh - 136px)', position: 'relative', overflow: 'hidden' }}>
      {/* Map */}
      <div id="map-container" style={{ position: 'absolute', inset: 0 }}>
        {hasApiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              defaultZoom={13}
              defaultCenter={{ lat: 23.1765, lng: 75.7885 }}
              mapId="cityzenai-dark"
              gestureHandling="greedy"
              disableDefaultUI={false}
              colorScheme="DARK"
              style={{ width: '100%', height: '100%' }}
            >
              {filteredComplaints.map((c) => (
                <AdvancedMarker key={c.id} position={{ lat: c.latitude, lng: c.longitude }}>
                  <IssueMarker complaint={c} />
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        ) : (
          /* Placeholder when no API key */
          <div style={{
            width: '100%', height: '100%', background: 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {SAMPLE_COMPLAINTS.map((c, i) => {
              const color = severityColor(c.severity);
              const x = 20 + (i * 15) % 70;
              const y = 15 + (i * 20) % 60;
              return (
                <motion.div key={c.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.3, type: 'spring' }}
                  style={{
                    position: 'absolute', left: `${x}%`, top: `${y}%`,
                    width: c.severity === 'critical' ? '60px' : '40px',
                    height: c.severity === 'critical' ? '60px' : '40px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}66, transparent)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: color, boxShadow: `0 0 10px ${color}80`,
                  }} />
                </motion.div>
              );
            })}
            <div className="glass-card" style={{
              position: 'absolute', bottom: panelOpen ? 'calc(50% + 20px)' : '80px',
              left: '50%', transform: 'translateX(-50%)',
              padding: '10px 20px', fontSize: '0.75rem', color: 'var(--text-muted)',
              whiteSpace: 'nowrap', transition: 'bottom 0.3s ease',
            }}>
              🗺️ Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local for live map
            </div>
          </div>
        )}
      </div>

      {/* Slide-up Panel */}
      <motion.div
        initial={false}
        animate={{ height: panelOpen ? '50%' : '60px' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(7, 7, 14, 0.95)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        <button onClick={() => setPanelOpen(!panelOpen)} style={{
          width: '100%', padding: '12px', background: 'none', border: 'none',
          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            {panelOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            {filteredComplaints.length} Reports
          </div>
        </button>

        {panelOpen && (
          <div style={{ padding: '0 16px 12px', display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
            <Filter size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '4px' }} />
            {['all', 'pending', 'sent', 'resolved'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                border: '1px solid', borderColor: filterStatus === s ? 'var(--accent-start)' : 'var(--glass-border)',
                background: filterStatus === s ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: filterStatus === s ? 'var(--accent-start)' : 'var(--text-secondary)',
                fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize',
              }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {panelOpen && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AnimatePresence>
              {filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </AnimatePresence>
            {filteredComplaints.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No complaints match your filters
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
