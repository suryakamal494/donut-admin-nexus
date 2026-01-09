import { useState } from "react";
import { ChevronDown, AlertTriangle, Clock, AlertCircle, User, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format, parseISO } from "date-fns";
import { PendingConfirmation } from "@/types/academicSchedule";

interface UrgencySectionProps {
  level: "critical" | "overdue" | "today";
  items: PendingConfirmation[];
  selectedIds: string[];
  onSelectItem: (id: string, selected: boolean) => void;
  onConfirm: (id: string) => void;
}

const urgencyConfig = {
  critical: {
    label: "Critical (3+ Days Overdue)",
    icon: AlertTriangle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    badgeColor: "bg-red-100 text-red-700",
    iconColor: "text-red-500",
  },
  overdue: {
    label: "Overdue (1-2 Days)",
    icon: Clock,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    badgeColor: "bg-amber-100 text-amber-700",
    iconColor: "text-amber-500",
  },
  today: {
    label: "Due Today",
    icon: AlertCircle,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    badgeColor: "bg-yellow-100 text-yellow-700",
    iconColor: "text-yellow-500",
  },
};

export function UrgencySection({
  level,
  items,
  selectedIds,
  onSelectItem,
  onConfirm,
}: UrgencySectionProps) {
  const [open, setOpen] = useState(true);
  const config = urgencyConfig[level];
  const Icon = config.icon;

  if (items.length === 0) return null;

  const allSelected = items.every(item => selectedIds.includes(item.id));
  const someSelected = items.some(item => selectedIds.includes(item.id)) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    items.forEach(item => onSelectItem(item.id, checked));
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      {/* Section Header */}
      <CollapsibleTrigger asChild>
        <button 
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
            config.bgColor,
            "hover:opacity-90"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className={cn("w-5 h-5", config.iconColor)} />
            <span className={cn("font-semibold text-sm", config.textColor)}>
              {config.label}
            </span>
            <Badge className={config.badgeColor}>
              {items.length}
            </Badge>
          </div>
          <ChevronDown 
            className={cn(
              "w-5 h-5 transition-transform",
              config.iconColor,
              open && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>

      {/* Items */}
      <CollapsibleContent>
        <div className={cn("mt-2 rounded-lg border divide-y", config.borderColor)}>
          {/* Select All Header */}
          <div className="flex items-center gap-3 p-3 bg-muted/30">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-sm text-muted-foreground">
              {someSelected 
                ? `${selectedIds.filter(id => items.some(i => i.id === id)).length} selected`
                : "Select all"
              }
            </span>
          </div>

          {/* Item Rows */}
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 gap-3 hover:bg-muted/30 transition-colors",
                  isSelected && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
                    className="data-[state=checked]:bg-primary shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {/* Teacher & Subject */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm truncate">
                          {item.teacherName}
                        </span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground truncate">
                          {item.subjectName}
                        </span>
                      </div>
                    </div>
                    
                    {/* Batch & Date */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{item.batchName}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(parseISO(item.date), "EEE, d MMM")}
                      </div>
                      <span>•</span>
                      <span>{item.expectedPeriods} period{item.expectedPeriods > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Days Overdue & Confirm */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.daysOverdue > 0 && (
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", config.badgeColor)}
                    >
                      {item.daysOverdue}d overdue
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => onConfirm(item.id)}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
