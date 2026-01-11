// Mode Selection Sheet - Bottom sheet for mobile mode switching

import { School, Target, Trophy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export type LearningMode = "classroom" | "mypath" | "compete";

interface ModeOption {
  id: LearningMode;
  icon: typeof School;
  label: string;
  description: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

const modeOptions: ModeOption[] = [
  {
    id: "classroom",
    icon: School,
    label: "CLASSROOM",
    description: "Follow your teacher's path",
    color: "text-cyan-600",
    bgGradient: "from-cyan-500/15 to-cyan-400/5",
    borderColor: "border-cyan-500/30",
  },
  {
    id: "mypath",
    icon: Target,
    label: "MY PATH",
    description: "AI-personalized learning",
    color: "text-donut-coral",
    bgGradient: "from-donut-coral/15 to-donut-orange/5",
    borderColor: "border-donut-coral/30",
  },
  {
    id: "compete",
    icon: Trophy,
    label: "COMPETE",
    description: "Challenge yourself",
    color: "text-amber-600",
    bgGradient: "from-amber-500/15 to-amber-400/5",
    borderColor: "border-amber-500/30",
  },
];

interface ModeSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMode: LearningMode;
  onModeSelect: (mode: LearningMode) => void;
  modeCounts?: { classroom: number; mypath: number; compete: number };
}

export function ModeSelectionSheet({
  open,
  onOpenChange,
  currentMode,
  onModeSelect,
  modeCounts = { classroom: 0, mypath: 0, compete: 0 },
}: ModeSelectionSheetProps) {
  const handleSelect = (mode: LearningMode) => {
    onModeSelect(mode);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="text-lg font-bold text-foreground">
            Choose Your Learning Lens
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-3">
          {modeOptions.map((mode) => {
            const isActive = currentMode === mode.id;
            const count = modeCounts[mode.id];
            const Icon = mode.icon;

            return (
              <button
                key={mode.id}
                onClick={() => handleSelect(mode.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                  "bg-gradient-to-r",
                  mode.bgGradient,
                  "border-2",
                  isActive ? mode.borderColor.replace("/30", "") : mode.borderColor,
                  isActive && "shadow-md",
                  "active:scale-[0.98]"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  "bg-white/80 shadow-sm",
                  mode.color
                )}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-bold text-base", mode.color)}>
                      {mode.label}
                    </span>
                    {isActive && (
                      <Check className={cn("w-4 h-4", mode.color)} />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {mode.description}
                  </p>
                  {count > 0 && (
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      {count} {count === 1 ? "item" : "items"} available
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ModeSelectionSheet;
