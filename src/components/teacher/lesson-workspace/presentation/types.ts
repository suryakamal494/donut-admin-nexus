/**
 * Presentation Mode Types and Utilities
 */

import type { LessonPlanBlock } from "../types";

export interface PresentationModeProps {
  open: boolean;
  onClose: () => void;
  blocks: LessonPlanBlock[];
  lessonTitle?: string;
}

export type PresentationTheme = 'light' | 'dark';

export interface PresentationState {
  currentIndex: number;
  isTransitioning: boolean;
  showTimeline: boolean;
  isFullscreen: boolean;
  showAnnotation: boolean;
  showAIChat: boolean;
  theme: PresentationTheme;
}

export const themeClasses = {
  light: {
    container: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
    text: "text-slate-900",
    textMuted: "text-slate-600",
    card: "bg-white",
    border: "border-slate-200",
    overlay: "bg-white/80",
    navBar: "bg-white/90 border-slate-200",
    sidebar: "bg-white/90 border-slate-200",
    button: "text-slate-700 hover:bg-slate-100",
    buttonActive: "bg-slate-200 text-slate-900",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    progressDot: "bg-slate-400",
    progressDotActive: "bg-primary",
    progressDotPast: "bg-slate-300",
  },
  dark: {
    container: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    text: "text-white",
    textMuted: "text-white/60",
    card: "bg-black/50",
    border: "border-white/10",
    overlay: "bg-black/60",
    navBar: "bg-black/60 border-white/10",
    sidebar: "bg-black/50 border-white/10",
    button: "text-white/70 hover:bg-white/10 hover:text-white",
    buttonActive: "bg-white/20 text-white",
    badge: "bg-white/10 text-white border-white/20",
    progressDot: "bg-white/20",
    progressDotActive: "bg-white",
    progressDotPast: "bg-white/50",
  }
};

// Convert YouTube URL to embed URL
export const getEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  return url;
};

// Wrap external PDF URLs with Google Docs Viewer for cross-origin support
export const getPdfViewerUrl = (url: string): string => {
  // Check if it's an external PDF that needs Google Docs Viewer
  if (url.endsWith('.pdf') && 
      (url.includes('ncert.nic.in') || 
       url.includes('http://') || 
       url.includes('https://'))) {
    // Use Google Docs Viewer for external PDFs
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }
  return url;
};

export const blockIcons = {
  explain: 'BookOpen',
  demonstrate: 'Play',
  quiz: 'HelpCircle',
  homework: 'ClipboardList',
} as const;
