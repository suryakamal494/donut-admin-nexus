import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ContentStatus = "published" | "draft" | "archived";
type ContentVisibility = "public" | "private" | "restricted";

interface ContentStatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

interface ContentVisibilityBadgeProps {
  visibility: ContentVisibility;
  className?: string;
}

const statusConfig: Record<ContentStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  published: { label: "Published", variant: "default" },
  draft: { label: "Draft", variant: "secondary" },
  archived: { label: "Archived", variant: "outline" },
};

const visibilityConfig: Record<ContentVisibility, { label: string; variant: "default" | "secondary" | "outline" }> = {
  public: { label: "Public", variant: "default" },
  private: { label: "Private", variant: "secondary" },
  restricted: { label: "Restricted", variant: "outline" },
};

export const ContentStatusBadge = ({ status, className }: ContentStatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={cn("text-xs", className)}>
      {config.label}
    </Badge>
  );
};

export const ContentVisibilityBadge = ({ visibility, className }: ContentVisibilityBadgeProps) => {
  const config = visibilityConfig[visibility];
  return (
    <Badge variant={config.variant} className={cn("text-xs", className)}>
      {config.label}
    </Badge>
  );
};
