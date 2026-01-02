import { Globe, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: "global" | "institute";
  className?: string;
}

export const SourceBadge = ({ source, className }: SourceBadgeProps) => {
  const isGlobal = source === "global";
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        isGlobal
          ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        className
      )}
    >
      {isGlobal ? (
        <>
          <Globe className="w-3 h-3" />
          <span>Global</span>
        </>
      ) : (
        <>
          <Building2 className="w-3 h-3" />
          <span>Your Content</span>
        </>
      )}
    </div>
  );
};
