'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface CameraState {
  stream: MediaStream | null;
  capturedImage: string | null;
  error: string | null;
  isActive: boolean;
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [state, setState] = useState<CameraState>({
    stream: null,
    capturedImage: null,
    error: null,
    isActive: false,
  });

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setState({
        stream,
        capturedImage: null,
        error: null,
        isActive: true,
      });
    } catch (error) {
      const err = error as Error;
      let errorMessage = 'Unable to access camera';

      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application.';
      }

      setState({
        stream: null,
        capturedImage: null,
        error: errorMessage,
        isActive: false,
      });
    }
  }, []);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.85);

    setState((prev) => ({
      ...prev,
      capturedImage: imageData,
    }));

    return imageData;
  }, []);

  const retake = useCallback(() => {
    setState((prev) => ({
      ...prev,
      capturedImage: null,
    }));
  }, []);

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
    }
    setState({
      stream: null,
      capturedImage: null,
      error: null,
      isActive: false,
    });
  }, [state.stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    videoRef,
    canvasRef,
    ...state,
    startCamera,
    captureImage,
    retake,
    stopCamera,
  };
}
