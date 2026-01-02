import { Eye, Edit, MoreVertical, Download, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { ContentStatusBadge } from "@/components/content/ContentStatusBadge";
import { getContentTypeLabel } from "@/components/content/ContentTypeIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SubjectBadge } from "@/components/subject";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SourceBadge } from "./SourceBadge";
import { InstituteContentItem } from "@/data/instituteData";

interface InstituteContentCardProps {
  content: InstituteContentItem;
  onPreview: (content: InstituteContentItem) => void;
  onEdit?: (content: InstituteContentItem) => void;
  onDelete?: (content: InstituteContentItem) => void;
  className?: string;
}

export const InstituteContentCard = ({ 
  content, 
  onPreview, 
  onEdit, 
  onDelete, 
  className 
}: InstituteContentCardProps) => {
  const meta = content.duration 
    ? `${content.duration} min` 
    : content.size || getContentTypeLabel(content.type);
  
  const isGlobal = content.source === "global";
  const canEdit = !isGlobal && onEdit;
  const canDelete = !isGlobal && onDelete;

  return (
    <div className={cn(
      "bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden hover-lift transition-all duration-300 relative group",
      className
    )}>
      {/* Source Badge - Positioned in top right of thumbnail */}
      <div className="relative">
        <ContentThumbnail 
          type={content.type} 
          thumbnailUrl={content.thumbnailUrl}
          title={content.title}
        />
        <div className="absolute top-2 right-2">
          <SourceBadge source={content.source} />
        </div>
        
        {/* Lock overlay for global content on hover */}
        {isGlobal && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white/90 rounded-full p-3">
                  <Lock className="w-5 h-5 text-slate-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">This content is from the global library and cannot be edited</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{content.title}</h3>
          <ContentStatusBadge status={content.status} />
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">{content.description}</p>
        
        <div className="flex items-center gap-2 flex-wrap">
          <SubjectBadge subject={content.subject} size="xs" />
          <span className="text-xs text-muted-foreground">{content.className}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{meta}</span>
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
          
          {canEdit && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-xs"
              onClick={() => onEdit(content)}
            >
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          )}
          
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
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit(content)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(content)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
