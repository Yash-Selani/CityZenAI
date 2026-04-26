'use client';

import { useState, useCallback } from 'react';
import type { AnalyzeResponse } from '@/types';

interface AnalysisState {
  result: AnalyzeResponse | null;
  loading: boolean;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    result: null,
    loading: false,
    error: null,
  });

  const analyze = useCallback(
    async (imageBase64: string, latitude: number, longitude: number) => {
      setState({ result: null, loading: true, error: null });

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
            latitude,
            longitude,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error || `Analysis failed (${response.status})`);
        }

        const data: AnalyzeResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Analysis failed');
        }

        setState({ result: data, loading: false, error: null });
        return data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An unexpected error occurred';
        setState({ result: null, loading: false, error: message });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ result: null, loading: false, error: null });
  }, []);

  return { ...state, analyze, reset };
}
