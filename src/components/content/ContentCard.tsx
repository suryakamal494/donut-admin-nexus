import { Eye, Edit, MoreVertical, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentThumbnail } from "./ContentThumbnail";
import { ContentStatusBadge } from "./ContentStatusBadge";
import { getContentTypeLabel, ContentType } from "./ContentTypeIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  subject: string;
  subjectId: string;
  chapter: string;
  chapterId: string;
  topic: string;
  topicId?: string;
  classId: string;
  className: string;
  description: string;
  duration?: number;
  size?: string;
  url: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  visibility: "public" | "private" | "restricted";
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  viewCount: number;
  downloadCount: number;
}

interface ContentCardProps {
  content: ContentItem;
  onPreview: (content: ContentItem) => void;
  onEdit: (content: ContentItem) => void;
  onDelete: (content: ContentItem) => void;
  className?: string;
}

export const ContentCard = ({ content, onPreview, onEdit, onDelete, className }: ContentCardProps) => {
  const meta = content.duration 
    ? `${content.duration} min` 
    : content.size || getContentTypeLabel(content.type);

  return (
    <div className={cn(
      "bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden hover-lift transition-all duration-300",
      className
    )}>
      <ContentThumbnail 
        type={content.type} 
        thumbnailUrl={content.thumbnailUrl}
        title={content.title}
      />
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{content.title}</h3>
          <ContentStatusBadge status={content.status} />
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">{content.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{content.subject}</span>
          <span>•</span>
          <span>{content.className}</span>
          <span>•</span>
          <span>{meta}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Eye className="w-3 h-3" />
          <span>{content.viewCount.toLocaleString()}</span>
          {content.downloadCount > 0 && (
            <>
              <span>•</span>
              <Download className="w-3 h-3" />
              <span>{content.downloadCount.toLocaleString()}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={() => onPreview(content)}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 text-xs"
            onClick={() => onEdit(content)}
          >
            <Edit className="w-3.5 h-3.5 mr-1.5" />
            Edit
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
    </div>
  );
};
