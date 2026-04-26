import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ANALYSIS_PROMPT = `You are an expert civic infrastructure analyst working for an Indian municipal corporation. Analyze this image of a reported urban/civic issue.

You MUST return ONLY valid JSON (no markdown, no backticks, no explanation) with exactly these fields:

{
  "category": "<one of: pothole, garbage_dump, water_leak, broken_streetlight, damaged_road, illegal_construction, sewage_overflow, fallen_tree, other>",
  "severity": "<one of: low, medium, high, critical>",
  "description": "<2-3 sentence factual description of the visible issue>",
  "suggestedDraft": "<A formal complaint letter of 3-4 paragraphs addressed to 'The Municipal Commissioner'. Include: greeting, issue description with location reference, impact on citizens, and a request for urgent action. Sign off as 'A Concerned Citizen'.>"
}

Severity guidelines:
- low: Minor cosmetic issues, no safety risk
- medium: Noticeable damage, potential inconvenience
- high: Significant damage, safety concern for pedestrians/vehicles
- critical: Immediate danger to life/property, requires emergency response

If the image does not show a civic issue, set category to "other" and describe what you see.`;

export async function analyzeImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent([
    ANALYSIS_PROMPT,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  const response = result.response;
  const text = response.text();

  // Clean any potential markdown wrapping
  const cleanJson = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  try {
    const parsed = JSON.parse(cleanJson);
    return {
      category: parsed.category || 'other',
      severity: parsed.severity || 'medium',
      description: parsed.description || 'Unable to analyze the image.',
      suggestedDraft: parsed.suggestedDraft || '',
      authority: null, // Will be filled by authority lookup
    };
  } catch {
    return {
      category: 'other',
      severity: 'medium',
      description: 'The AI was unable to fully analyze this image. Please provide additional details manually.',
      suggestedDraft: '',
      authority: null,
    };
  }
}
