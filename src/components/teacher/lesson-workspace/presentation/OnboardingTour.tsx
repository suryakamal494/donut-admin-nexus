/**
 * Onboarding Tour for Presentation Mode
 * Step-by-step guided tutorial for first-time users
 */

import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PresentationTheme } from "./types";
import { themeClasses } from "./types";

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="nav-prev"]',
    title: "Previous Slide",
    description: "Click here or press ← arrow key to go to the previous slide",
    position: 'top',
  },
  {
    target: '[data-tour="nav-next"]',
    title: "Next Slide",
    description: "Click here or press → arrow key to go to the next slide",
    position: 'top',
  },
  {
    target: '[data-tour="ai-assist"]',
    title: "AI Assistant",
    description: "Press 'H' or click to get AI help about the current content",
    position: 'top',
  },
  {
    target: '[data-tour="annotation"]',
    title: "Draw & Annotate",
    description: "Press 'A' or click to draw on the screen with pen, highlighter, shapes & text",
    position: 'top',
  },
  {
    target: '[data-tour="screenshot"]',
    title: "Take Screenshot",
    description: "Capture the current slide with your annotations to share with students",
    position: 'top',
  },
  {
    target: '[data-tour="theme"]',
    title: "Light/Dark Mode",
    description: "Switch between light and dark themes for better visibility",
    position: 'top',
  },
  {
    target: '[data-tour="fullscreen"]',
    title: "Fullscreen Mode",
    description: "Press 'F' or click to enter/exit fullscreen for the best viewing experience",
    position: 'top',
  },
  {
    target: '[data-tour="timeline"]',
    title: "Slide Timeline",
    description: "Press 'T' or click to view all slides in a sidebar for quick navigation",
    position: 'top',
  },
];

interface OnboardingTourProps {
  theme: PresentationTheme;
  onComplete: () => void;
}

const STORAGE_KEY = 'presentation-onboarding-count';
const MAX_SHOW_COUNT = 3;

export const useOnboardingTour = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    if (count < MAX_SHOW_COUNT) {
      setShowTour(true);
    }
  }, []);

  const completeTour = useCallback(() => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    localStorage.setItem(STORAGE_KEY, String(count + 1));
    setShowTour(false);
  }, []);

  const skipTour = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(MAX_SHOW_COUNT));
    setShowTour(false);
  }, []);

  return { showTour, completeTour, skipTour };
};

export const OnboardingTour = ({ theme, onComplete }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const tc = themeClasses[theme];
  const step = tourSteps[currentStep];

  // Find and highlight the current target element
  useEffect(() => {
    const findTarget = () => {
      const target = document.querySelector(step.target);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

    findTarget();
    // Re-find on resize
    window.addEventListener('resize', findTarget);
    return () => window.removeEventListener('resize', findTarget);
  }, [step.target]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, String(MAX_SHOW_COUNT));
    onComplete();
  };

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 160;

    switch (step.position) {
      case 'top':
        return {
          left: Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
          bottom: window.innerHeight - targetRect.top + padding,
        };
      case 'bottom':
        return {
          left: Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
          top: targetRect.bottom + padding,
        };
      case 'left':
        return {
          right: window.innerWidth - targetRect.left + padding,
          top: Math.max(padding, Math.min(targetRect.top + targetRect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - padding)),
        };
      case 'right':
        return {
          left: targetRect.right + padding,
          top: Math.max(padding, Math.min(targetRect.top + targetRect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - padding)),
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay with spotlight cutout */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Spotlight on target */}
      {targetRect && (
        <div
          className="absolute rounded-xl ring-4 ring-primary ring-offset-4 ring-offset-transparent"
          style={{
            left: targetRect.left - 4,
            top: targetRect.top - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={cn(
          "absolute w-80 p-5 rounded-2xl shadow-2xl",
          theme === 'dark' ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
        )}
        style={getTooltipStyle()}
      >
        {/* Progress indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === currentStep
                  ? "w-6 bg-primary"
                  : idx < currentStep
                  ? "w-1.5 bg-primary/50"
                  : "w-1.5 bg-slate-300"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className={cn("text-lg font-semibold mb-2", tc.text)}>
          {step.title}
        </h3>
        <p className={cn("text-sm mb-4", tc.textMuted)}>
          {step.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className={cn("text-sm", tc.textMuted)}
          >
            Skip Tour
          </Button>
          
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1"
            >
              {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
