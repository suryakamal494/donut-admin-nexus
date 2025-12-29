import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  plan: "basic" | "pro" | "enterprise";
  className?: string;
}

const planStyles = {
  basic: "bg-donut-teal/10 text-donut-teal border-donut-teal/20",
  pro: "bg-donut-orange/10 text-donut-orange border-donut-orange/20",
  enterprise: "bg-donut-coral/10 text-donut-coral border-donut-coral/20",
};

const PlanBadge = ({ plan, className }: PlanBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        planStyles[plan],
        className
      )}
    >
      {plan}
    </span>
  );
};

export { PlanBadge };