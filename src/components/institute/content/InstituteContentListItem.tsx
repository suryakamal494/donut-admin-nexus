import { Eye, Edit, MoreVertical, Download, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/components/content/ContentStatusBadge";
import { ContentTypeIcon, getContentTypeLabel } from "@/components/content/ContentTypeIcon";
import { ContentItem } from "@/components/content/ContentCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SubjectBadge } from "@/components/subject";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SourceBadge } from "./SourceBadge";

interface InstituteContentListItemProps {
  content: ContentItem;
  onPreview: (content: ContentItem) => void;
  onEdit?: (content: ContentItem) => void;
  onDelete?: (content: ContentItem) => void;
}

export const InstituteContentListItem = ({ 
  content, 
  onPreview, 
  onEdit, 
  onDelete 
}: InstituteContentListItemProps) => {
  const meta = content.duration 
    ? `${content.duration} min` 
    : content.size || getContentTypeLabel(content.type);
  
  const isGlobal = content.source === "global";
  const canEdit = !isGlobal && onEdit;
  const canDelete = !isGlobal && onDelete;

  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors">
      {/* Type Icon */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
        <ContentTypeIcon type={content.type} className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
      </div>
      
      {/* Content Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-semibold text-sm truncate max-w-[150px] sm:max-w-none">{content.title}</h3>
          <SourceBadge source={content.source} />
          <ContentStatusBadge status={content.status} />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2 hidden sm:block">{content.description}</p>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
          <SubjectBadge subject={content.subject} size="xs" />
          <span className="text-muted-foreground hidden md:inline">{content.className}</span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground">{meta}</span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground hidden sm:flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {content.viewCount.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Actions - responsive */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Preview button - icon only on mobile */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onPreview(content)}
          className="h-8 px-2 sm:px-3"
        >
          <Eye className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Preview</span>
        </Button>
        
        {canEdit ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(content)}
            className="h-8 px-2 sm:px-3"
          >
            <Edit className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        ) : isGlobal && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-2 sm:px-3 py-1.5 rounded-md bg-muted/50 text-muted-foreground flex items-center gap-1 sm:gap-1.5">
                <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="text-xs hidden sm:inline">View Only</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">This content is from the global library</p>
            </TooltipContent>
          </Tooltip>
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
  );
};
