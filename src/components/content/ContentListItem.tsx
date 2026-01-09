import { memo } from "react";
import { Eye, Edit, Download, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentTypeIcon, getContentTypeLabel } from "./ContentTypeIcon";
import { ContentStatusBadge } from "./ContentStatusBadge";
import { ContentItem } from "./ContentCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SubjectBadge } from "@/components/subject";
import { cn } from "@/lib/utils";

interface ContentListItemProps {
  content: ContentItem;
  onPreview: (content: ContentItem) => void;
  onEdit: (content: ContentItem) => void;
  onDelete: (content: ContentItem) => void;
  className?: string;
}

export const ContentListItem = memo(function ContentListItem({ content, onPreview, onEdit, onDelete, className }: ContentListItemProps) {
  const meta = content.duration 
    ? `${content.duration} min` 
    : content.size || "-";

  return (
    <div className={cn(
      "p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors",
      className
    )}>
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
        <ContentTypeIcon type={content.type} size="md" />
      </div>
      
      {/* Title & Description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm truncate">{content.title}</h3>
          <ContentStatusBadge status={content.status} />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <SubjectBadge subject={content.subject} size="xs" />
          <span className="text-xs text-muted-foreground">• {content.chapter} • {content.className}</span>
        </div>
      </div>
      
      {/* Type */}
      <div className="hidden md:block w-24 text-sm text-muted-foreground">
        {getContentTypeLabel(content.type)}
      </div>
      
      {/* Duration/Size */}
      <div className="hidden md:block w-20 text-sm text-muted-foreground text-right">
        {meta}
      </div>
      
      {/* Views */}
      <div className="hidden lg:flex items-center gap-1 w-20 text-sm text-muted-foreground">
        <Eye className="w-3.5 h-3.5" />
        {content.viewCount.toLocaleString()}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPreview(content)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(content)}>
          <Edit className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => onPreview(content)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(content)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(content)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});
