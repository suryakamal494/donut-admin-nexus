import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

const StatsCard = ({ title, value, change, icon: Icon, iconColor = "text-primary", className }: StatsCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={cn("bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover-lift border border-border/50 stats-glow", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 sm:space-y-2 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs sm:text-sm font-medium flex-wrap",
              isPositive && "text-success",
              isNegative && "text-destructive",
              !isPositive && !isNegative && "text-muted-foreground"
            )}>
              {isPositive && <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              {isNegative && <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span>{isPositive ? "+" : ""}{change}%</span>
              <span className="text-muted-foreground font-normal hidden xs:inline">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0",
          "bg-gradient-to-br from-primary/10 to-accent/10"
        )}>
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", iconColor)} />
        </div>
      </div>
    </div>
  );
};

export { StatsCard };