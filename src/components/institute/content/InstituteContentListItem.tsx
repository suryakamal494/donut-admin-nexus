import { Eye, Edit, MoreVertical, Download, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/components/content/ContentStatusBadge";
import { ContentTypeIcon, getContentTypeLabel } from "@/components/content/ContentTypeIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SubjectBadge } from "@/components/subject";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SourceBadge } from "./SourceBadge";
import { InstituteContentItem } from "@/data/instituteData";

interface InstituteContentListItemProps {
  content: InstituteContentItem;
  onPreview: (content: InstituteContentItem) => void;
  onEdit?: (content: InstituteContentItem) => void;
  onDelete?: (content: InstituteContentItem) => void;
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
    <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
      {/* Type Icon */}
      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
        <ContentTypeIcon type={content.type} className="w-6 h-6 text-muted-foreground" />
      </div>
      
      {/* Content Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate">{content.title}</h3>
          <SourceBadge source={content.source} />
          <ContentStatusBadge status={content.status} />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{content.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <SubjectBadge subject={content.subject} size="xs" />
          <span className="text-xs text-muted-foreground">{content.className}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{meta}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {content.viewCount.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onPreview(content)}
        >
          <Eye className="w-4 h-4 mr-1.5" />
          Preview
        </Button>
        
        {canEdit ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(content)}
          >
            <Edit className="w-4 h-4 mr-1.5" />
            Edit
          </Button>
        ) : isGlobal && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-3 py-1.5 rounded-md bg-muted/50 text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs">View Only</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">This content is from the global library</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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
