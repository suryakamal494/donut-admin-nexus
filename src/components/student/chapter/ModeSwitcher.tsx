// Mode Switcher - Creative mode navigation component
// Mobile: Tappable badge that opens a bottom sheet
// Desktop: Traditional horizontal tabs

import { useState } from "react";
import { School, Target, Trophy, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeSelectionSheet, type LearningMode } from "./ModeSelectionSheet";

interface ModeConfig {
  id: LearningMode;
  icon: typeof School;
  label: string;
  color: string;
  activeGradient: string;
  activeBorder: string;
}

const modes: ModeConfig[] = [
  {
    id: "classroom",
    icon: School,
    label: "CLASSROOM",
    color: "text-cyan-600",
    activeGradient: "from-cyan-500/20 to-cyan-400/10",
    activeBorder: "border-cyan-500",
  },
  {
    id: "mypath",
    icon: Target,
    label: "MY PATH",
    color: "text-donut-coral",
    activeGradient: "from-donut-coral/20 to-donut-orange/10",
    activeBorder: "border-donut-coral",
  },
  {
    id: "compete",
    icon: Trophy,
    label: "COMPETE",
    color: "text-amber-600",
    activeGradient: "from-amber-500/20 to-amber-400/10",
    activeBorder: "border-amber-500",
  },
];

interface ModeSwitcherProps {
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  modeCounts?: { classroom: number; mypath: number; compete: number };
}

export function ModeSwitcher({
  currentMode,
  onModeChange,
  modeCounts = { classroom: 0, mypath: 0, compete: 0 },
}: ModeSwitcherProps) {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeMode = modes.find((m) => m.id === currentMode) || modes[0];
  const ActiveIcon = activeMode.icon;

  // Mobile: Tappable badge
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setSheetOpen(true)}
          className={cn(
            "flex items-center gap-2.5 px-4 py-3",
            "bg-white/80 backdrop-blur-xl",
            "border border-white/50 rounded-2xl",
            "shadow-sm active:scale-[0.98] transition-all duration-200"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br",
            activeMode.activeGradient
          )}>
            <ActiveIcon className={cn("w-4 h-4", activeMode.color)} />
          </div>
          <span className={cn("font-semibold text-sm", activeMode.color)}>
            {activeMode.label}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>

        <ModeSelectionSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          currentMode={currentMode}
          onModeSelect={onModeChange}
          modeCounts={modeCounts}
        />
      </>
    );
  }

  // Desktop: Horizontal tabs
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        const count = modeCounts[mode.id];

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200",
              isActive
                ? cn("bg-gradient-to-r", mode.activeGradient, "border", mode.activeBorder)
                : "hover:bg-white/50 border border-transparent"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? mode.color : "text-muted-foreground")} />
            <span className={cn(
              "font-semibold text-sm",
              isActive ? mode.color : "text-muted-foreground"
            )}>
              {mode.label}
            </span>
            {count > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isActive 
                  ? cn("bg-white/60", mode.color)
                  : "bg-muted/50 text-muted-foreground"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ModeSwitcher;
