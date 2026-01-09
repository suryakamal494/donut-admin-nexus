import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface AdvancedModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const AdvancedModeToggle = ({ enabled, onToggle }: AdvancedModeToggleProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
              enabled ? "bg-amber-100 dark:bg-amber-900" : "bg-muted"
            )}>
              <Zap className={cn(
                "w-4 h-4 sm:w-5 sm:h-5",
                enabled ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
              )} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm sm:text-base">Advanced Setup</p>
                {enabled && (
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
                {enabled 
                  ? "Configure teacher constraints and facility management" 
                  : "Enable for teacher constraints, facility scheduling, and more"}
              </p>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </CardContent>
    </Card>
  );
};
