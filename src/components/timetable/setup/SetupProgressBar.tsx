import { Card, CardContent } from "@/components/ui/card";
import { TabConfig } from "@/hooks/useTimetableSetup";
import { cn } from "@/lib/utils";
import { Check, Zap } from "lucide-react";

interface SetupProgressBarProps {
  tabs: TabConfig[];
  activeTab: string;
  getProgress: (tabId: string) => 'complete' | 'partial' | 'empty';
  advancedTabIds: string[];
  onTabChange: (tabId: string) => void;
}

export const SetupProgressBar = ({
  tabs,
  activeTab,
  getProgress,
  advancedTabIds,
  onTabChange,
}: SetupProgressBarProps) => {
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map((tab, index) => {
            const progress = getProgress(tab.id);
            const Icon = tab.icon;
            const isAdvancedTab = advancedTabIds.includes(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap shrink-0",
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "hover:bg-muted/50",
                  isAdvancedTab && "ring-1 ring-amber-200 dark:ring-amber-800"
                )}
              >
                <div className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                  progress === 'complete' && activeTab !== tab.id && "bg-green-100 text-green-700",
                  progress === 'partial' && activeTab !== tab.id && "bg-amber-100 text-amber-700",
                  progress === 'empty' && activeTab !== tab.id && "bg-muted text-muted-foreground",
                  activeTab === tab.id && "bg-white/20 text-white"
                )}>
                  {progress === 'complete' ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : index + 1}
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">{tab.label}</span>
                <span className="text-xs font-medium sm:hidden">{tab.label.split(' ')[0]}</span>
                {isAdvancedTab && activeTab !== tab.id && (
                  <Zap className="w-3 h-3 text-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
