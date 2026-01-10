/**
 * Presentation State Management Hook
 * Includes screenshot functionality for direct capture
 * Performance optimized with debouncing and proper cleanup
 */

import { useState, useCallback, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import type { LessonPlanBlock } from "../types";
import type { PresentationState, PresentationTheme } from "./types";
import type { AnnotationCanvasRef } from "../AnnotationCanvas";

export const usePresentationState = (
  open: boolean,
  blocks: LessonPlanBlock[],
  onClose: () => void
) => {
  const [state, setState] = useState<PresentationState>({
    currentIndex: 0,
    isTransitioning: false,
    showTimeline: false,
    isFullscreen: false,
    showAnnotation: false,
    showAIChat: false,
    theme: (localStorage.getItem('presentation-theme') as PresentationTheme) || 'light',
  });
  const [isSavingScreenshot, setIsSavingScreenshot] = useState(false);

  // Refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const annotationRef = useRef<AnnotationCanvasRef>(null);
  const lastScreenshotTimeRef = useRef<number>(0);

  const currentBlock = blocks[state.currentIndex];
  const progress = blocks.length > 0 ? ((state.currentIndex + 1) / blocks.length) * 100 : 0;
  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === blocks.length - 1;

  // Navigation
  const navigateTo = useCallback((index: number) => {
    if (index < 0 || index >= blocks.length || state.isTransitioning) return;
    setState(prev => ({ ...prev, isTransitioning: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, currentIndex: index, isTransitioning: false }));
    }, 200);
  }, [blocks.length, state.isTransitioning]);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setState(prev => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('presentation-theme', newTheme);
      return { ...prev, theme: newTheme };
    });
  }, []);

  // Toggle functions
  const toggleTimeline = useCallback(() => {
    setState(prev => ({ ...prev, showTimeline: !prev.showTimeline }));
  }, []);

  const toggleAnnotation = useCallback(() => {
    setState(prev => ({ ...prev, showAnnotation: !prev.showAnnotation }));
  }, []);

  const toggleAIChat = useCallback(() => {
    setState(prev => ({ ...prev, showAIChat: !prev.showAIChat }));
  }, []);

  const setFullscreen = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isFullscreen: value }));
  }, []);

  // Fullscreen handlers
  const enterFullscreen = useCallback(async () => {
    try {
      if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        await (document as any).webkitExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (state.isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [state.isFullscreen, enterFullscreen, exitFullscreen]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IFRAME' || target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    touchStartX.current = null;
    touchStartY.current = null;
    
    const minSwipeDistance = 50;
    if (Math.abs(deltaX) < minSwipeDistance || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }
    
    if (deltaX > 0 && !isFirst) {
      navigateTo(state.currentIndex - 1);
    } else if (deltaX < 0 && !isLast) {
      navigateTo(state.currentIndex + 1);
    }
  }, [state.currentIndex, isFirst, isLast, navigateTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (!isLast) navigateTo(state.currentIndex + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (!isFirst) navigateTo(state.currentIndex - 1);
          break;
        case 'Escape':
          e.preventDefault();
          if (state.isFullscreen) {
            exitFullscreen();
          } else {
            onClose();
          }
          break;
        case 't':
        case 'T':
          if (!state.showAnnotation) toggleTimeline();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'a':
        case 'A':
          toggleAnnotation();
          break;
        case 'h':
        case 'H':
          toggleAIChat();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, state.currentIndex, state.isFullscreen, state.showAnnotation, isFirst, isLast, onClose, navigateTo, exitFullscreen, toggleFullscreen, toggleTimeline, toggleAnnotation, toggleAIChat]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setState(prev => ({
        ...prev,
        currentIndex: 0,
        showTimeline: false,
        showAnnotation: false,
        showAIChat: false,
      }));
    }
  }, [open]);

  // Clear annotations when changing blocks
  useEffect(() => {
    if (annotationRef.current) {
      annotationRef.current.clear();
    }
  }, [state.currentIndex]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [setFullscreen]);

  // Exit fullscreen when closing
  useEffect(() => {
    if (!open && state.isFullscreen) {
      exitFullscreen();
    }
  }, [open, state.isFullscreen, exitFullscreen]);

  // Save screenshot directly (without entering annotation mode)
  // Debounced to prevent rapid clicks
  const handleSaveScreenshot = useCallback(async () => {
    if (isSavingScreenshot) return;
    
    // Debounce: ignore if clicked within 1 second of last capture
    const now = Date.now();
    if (now - lastScreenshotTimeRef.current < 1000) {
      toast.info('Please wait before taking another screenshot');
      return;
    }
    lastScreenshotTimeRef.current = now;
    
    setIsSavingScreenshot(true);

    try {
      const presentationContainer = contentContainerRef.current;
      
      if (presentationContainer) {
        const backgroundCanvas = await html2canvas(presentationContainer, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: state.theme === 'dark' ? '#1e293b' : '#f8fafc',
          scale: 1,
          logging: false,
        });

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const blockTitle = currentBlock?.title || 'slide';
        const filename = `screenshot-${blockTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}.png`;
        
        link.download = filename;
        link.href = backgroundCanvas.toDataURL('image/png');
        link.click();
        
        toast.success('Screenshot saved!', {
          description: `Saved as ${filename}`,
        });
      }
    } catch (error) {
      console.error('Failed to save screenshot:', error);
      toast.error('Failed to save screenshot');
    } finally {
      setIsSavingScreenshot(false);
    }
  }, [currentBlock, state.theme, isSavingScreenshot]);

  return {
    state,
    currentBlock,
    progress,
    isFirst,
    isLast,
    isSavingScreenshot,
    refs: {
      containerRef,
      contentContainerRef,
      annotationRef,
    },
    handlers: {
      navigateTo,
      toggleTheme,
      toggleTimeline,
      toggleAnnotation,
      toggleAIChat,
      toggleFullscreen,
      handleTouchStart,
      handleTouchEnd,
      handleSaveScreenshot,
    },
  };
};
