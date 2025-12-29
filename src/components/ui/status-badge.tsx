import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "draft" | "scheduled" | "live" | "completed";
  className?: string;
}

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-warning/10 text-warning border-warning/20",
  draft: "bg-muted text-muted-foreground border-muted",
  scheduled: "bg-donut-purple/10 text-donut-purple border-donut-purple/20",
  live: "bg-success/10 text-success border-success/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
};

export { StatusBadge };