/**
 * Presentation Mode - Main Component
 * Full-screen presentation view for lesson plans with annotation, AI assist, and theme support
 */

import { cn } from "@/lib/utils";
import { usePresentationState } from "./usePresentationState";
import { ContentRenderer } from "./ContentRenderer";
import { NavigationBar } from "./NavigationBar";
import { TimelineSidebar } from "./TimelineSidebar";
import { AIAssistChat } from "./AIAssistChat";
import { themeClasses } from "./types";
import type { PresentationModeProps } from "./types";
import { AnnotationCanvas } from "../AnnotationCanvas";

export const PresentationMode = ({ 
  open, 
  onClose, 
  blocks,
  lessonTitle 
}: PresentationModeProps) => {
  const {
    state,
    currentBlock,
    isFirst,
    isLast,
    refs,
    handlers,
  } = usePresentationState(open, blocks, onClose);

  if (!open || blocks.length === 0) return null;

  const tc = themeClasses[state.theme];

  return (
    <div 
      ref={refs.containerRef}
      className={cn(
        "fixed inset-0 z-[100] touch-pan-y",
        tc.container
      )}
      onTouchStart={handlers.handleTouchStart}
      onTouchEnd={handlers.handleTouchEnd}
    >
      {/* Main Content Area */}
      <div 
        ref={refs.contentContainerRef}
        className={cn(
          "absolute inset-0 bottom-20 transition-opacity duration-200",
          state.isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <ContentRenderer block={currentBlock} theme={state.theme} />
      </div>

      {/* Annotation Canvas Overlay */}
      <AnnotationCanvas 
        ref={refs.annotationRef}
        isActive={state.showAnnotation} 
        onClose={handlers.toggleAnnotation}
        blockTitle={currentBlock.title}
        presentationContainerRef={refs.contentContainerRef}
      />

      {/* Timeline Sidebar */}
      {state.showTimeline && (
        <TimelineSidebar
          blocks={blocks}
          currentIndex={state.currentIndex}
          lessonTitle={lessonTitle}
          theme={state.theme}
          onNavigate={handlers.navigateTo}
        />
      )}

      {/* AI Assist Chat */}
      {state.showAIChat && (
        <AIAssistChat
          block={currentBlock}
          lessonTitle={lessonTitle}
          theme={state.theme}
          onClose={handlers.toggleAIChat}
        />
      )}

      {/* Bottom Navigation Bar */}
      <NavigationBar
        currentBlock={currentBlock}
        blocks={blocks}
        currentIndex={state.currentIndex}
        isFirst={isFirst}
        isLast={isLast}
        isFullscreen={state.isFullscreen}
        showAnnotation={state.showAnnotation}
        showTimeline={state.showTimeline}
        showAIChat={state.showAIChat}
        theme={state.theme}
        onNavigate={handlers.navigateTo}
        onToggleAnnotation={handlers.toggleAnnotation}
        onToggleFullscreen={handlers.toggleFullscreen}
        onToggleTimeline={handlers.toggleTimeline}
        onToggleTheme={handlers.toggleTheme}
        onToggleAIChat={handlers.toggleAIChat}
        onClose={onClose}
      />

      {/* Keyboard Hints (hidden on mobile, hidden when annotating) */}
      {!state.showAnnotation && (
        <div className={cn(
          "absolute top-4 right-4 hidden lg:flex items-center gap-3 text-xs",
          tc.textMuted
        )}>
          <span>← → Navigate</span>
          <span>A Annotate</span>
          <span>H AI Help</span>
          <span>F Fullscreen</span>
          <span>T Timeline</span>
          <span>Esc Exit</span>
        </div>
      )}
    </div>
  );
};
