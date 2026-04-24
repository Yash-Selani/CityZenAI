// ============================================
// CityZenAI — TypeScript Type Definitions
// ============================================

export type ComplaintCategory =
  | 'pothole'
  | 'garbage_dump'
  | 'water_leak'
  | 'broken_streetlight'
  | 'damaged_road'
  | 'illegal_construction'
  | 'sewage_overflow'
  | 'fallen_tree'
  | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type ComplaintStatus = 'pending' | 'sent' | 'resolved';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Authority {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  department: string | null;
}

export interface AnalysisResult {
  category: ComplaintCategory;
  severity: SeverityLevel;
  description: string;
  suggestedDraft: string;
  authority: Authority | null;
}

export interface Complaint {
  id: string;
  userId: string;
  imageUrl: string;
  category: ComplaintCategory;
  severity: SeverityLevel;
  description: string;
  aiDraft: string | null;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  city: string;
  authority: Authority | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyzeRequest {
  image: string; // base64
  latitude: number;
  longitude: number;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

export interface FallbackContact {
  type: 'helpline' | 'portal';
  name: string;
  value: string; // phone number or URL
  description: string;
}

export interface ReportStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  severity: SeverityLevel;
  category: ComplaintCategory;
  id: string;
}
