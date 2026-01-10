/**
 * Timeline Sidebar for Presentation Mode
 */

import { ScrollArea } from "@/components/ui/scroll-area";
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

interface TimelineSidebarProps {
  blocks: LessonPlanBlock[];
  currentIndex: number;
  lessonTitle?: string;
  theme: PresentationTheme;
  onNavigate: (index: number) => void;
}

export const TimelineSidebar = ({
  blocks,
  currentIndex,
  lessonTitle,
  theme,
  onNavigate,
}: TimelineSidebarProps) => {
  const tc = themeClasses[theme];

  return (
    <div className={cn(
      "absolute right-0 top-0 bottom-20 w-80 backdrop-blur-xl border-l",
      tc.sidebar
    )}>
      <div className={cn("p-4 border-b", tc.border)}>
        <h3 className={cn("font-semibold", tc.text)}>Lesson Timeline</h3>
        <p className={cn("text-sm", tc.textMuted)}>{lessonTitle}</p>
      </div>
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-2">
          {blocks.map((block, idx) => {
            const Icon = blockIcons[block.type];
            const cfg = blockTypeConfig[block.type];
            return (
              <button
                key={block.id}
                onClick={() => onNavigate(idx)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  idx === currentIndex 
                    ? tc.buttonActive
                    : cn(tc.button)
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-medium truncate", tc.text)}>{block.title || "Untitled"}</p>
                  <p className={cn("text-xs", tc.textMuted)}>{cfg.label}</p>
                </div>
                {block.duration && (
                  <span className={cn("text-xs", tc.textMuted)}>{block.duration}m</span>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
