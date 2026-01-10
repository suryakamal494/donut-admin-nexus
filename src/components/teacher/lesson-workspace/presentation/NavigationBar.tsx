/**
 * Bottom Navigation Bar for Presentation Mode
 * Includes all controls with data-tour attributes for onboarding
 */

import { 
  ChevronLeft, ChevronRight, Clock, X, Pencil, Camera,
  Maximize, Shrink, Maximize2, Minimize2, Sun, Moon, Sparkles, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LessonPlanBlock } from "../types";
import { blockTypeConfig } from "../types";
import { themeClasses } from "./types";
import type { PresentationTheme } from "./types";
import { BookOpen, Play, HelpCircle, ClipboardList } from "lucide-react";

const blockIcons = {
  explain: BookOpen,
  demonstrate: Play,
  quiz: HelpCircle,
  homework: ClipboardList,
};

interface NavigationBarProps {
  currentBlock: LessonPlanBlock;
  blocks: LessonPlanBlock[];
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;
  isFullscreen: boolean;
  showAnnotation: boolean;
  showTimeline: boolean;
  showAIChat: boolean;
  theme: PresentationTheme;
  isSavingScreenshot?: boolean;
  onNavigate: (index: number) => void;
  onToggleAnnotation: () => void;
  onToggleFullscreen: () => void;
  onToggleTimeline: () => void;
  onToggleTheme: () => void;
  onToggleAIChat: () => void;
  onSaveScreenshot?: () => void;
  onClose: () => void;
}

export const NavigationBar = ({
  currentBlock,
  blocks,
  currentIndex,
  isFirst,
  isLast,
  isFullscreen,
  showAnnotation,
  showTimeline,
  showAIChat,
  theme,
  isSavingScreenshot = false,
  onNavigate,
  onToggleAnnotation,
  onToggleFullscreen,
  onToggleTimeline,
  onToggleTheme,
  onToggleAIChat,
  onSaveScreenshot,
  onClose,
}: NavigationBarProps) => {
  const tc = themeClasses[theme];
  const BlockIcon = blockIcons[currentBlock.type];
  const config = blockTypeConfig[currentBlock.type];

  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-0 h-20 backdrop-blur-xl border-t",
      tc.navBar
    )}>
      <div className="h-full max-w-5xl mx-auto px-4 flex items-center justify-between gap-4">
        {/* Left - Previous Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={isFirst}
          className={cn("h-12 px-6 gap-2 disabled:opacity-30", tc.button)}
          data-tour="nav-prev"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Center - Progress & Block Info */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 min-w-0">
          {/* Block Type Badge & Title */}
          <div className="flex items-center gap-2">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", config.color)}>
              <BlockIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={cn("text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]", tc.text)}>
              {currentBlock.title || "Untitled"}
            </span>
            {currentBlock.duration && (
              <Badge variant="outline" className={cn("text-xs gap-1", tc.badge)}>
                <Clock className="w-3 h-3" />
                {currentBlock.duration}m
              </Badge>
            )}
          </div>
          
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {blocks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === currentIndex 
                    ? cn("w-6", tc.progressDotActive)
                    : idx < currentIndex
                    ? cn("w-1.5", tc.progressDotPast)
                    : cn("w-1.5 hover:opacity-70", tc.progressDot)
                )}
              />
            ))}
          </div>
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={isLast}
            className={cn("h-12 px-6 gap-2 disabled:opacity-30", tc.button)}
            data-tour="nav-next"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
          
          {/* AI Assist */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleAIChat}
            className={cn(
              "h-10 w-10 hidden sm:flex",
              showAIChat 
                ? "text-primary bg-primary/10" 
                : tc.button
            )}
            title="AI Assist (H)"
            data-tour="ai-assist"
          >
            <Sparkles className="w-5 h-5" />
          </Button>
          
          {/* Annotation Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleAnnotation}
            className={cn(
              "h-10 w-10",
              showAnnotation 
                ? "text-primary bg-primary/10" 
                : tc.button
            )}
            title="Annotate (A)"
            data-tour="annotation"
          >
            <Pencil className="w-5 h-5" />
          </Button>
          
          {/* Screenshot Button - Direct access */}
          {onSaveScreenshot && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSaveScreenshot}
              disabled={isSavingScreenshot}
              className={cn("h-10 w-10", tc.button)}
              title="Take Screenshot"
              data-tour="screenshot"
            >
              {isSavingScreenshot ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </Button>
          )}
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className={cn("h-10 w-10 hidden md:flex", tc.button)}
            title={theme === 'light' ? "Dark Mode" : "Light Mode"}
            data-tour="theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          
          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className={cn("h-10 w-10", tc.button)}
            title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            data-tour="fullscreen"
          >
            {isFullscreen ? <Shrink className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>
          
          {/* Timeline Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTimeline}
            className={cn("h-10 w-10 hidden md:flex", tc.button)}
            title="Toggle Timeline (T)"
            data-tour="timeline"
          >
            {showTimeline ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>

          {/* Exit Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 text-red-500 hover:bg-red-500/10 hover:text-red-600"
            title="Exit (Esc)"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
