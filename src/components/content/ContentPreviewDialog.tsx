import { X, Download, Edit, Share2, ExternalLink, Eye, Clock, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentItem } from "./ContentCard";
import { ContentTypeIcon, getContentTypeLabel } from "./ContentTypeIcon";
import { ContentStatusBadge, ContentVisibilityBadge } from "./ContentStatusBadge";
import { format } from "date-fns";

interface ContentPreviewDialogProps {
  content: ContentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (content: ContentItem) => void;
  mode?: "superadmin" | "institute";
}

export const ContentPreviewDialog = ({ content, open, onOpenChange, onEdit, mode = "superadmin" }: ContentPreviewDialogProps) => {
  if (!content) return null;

  const renderPreview = () => {
    switch (content.type) {
      case "video":
        return (
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            {content.embedUrl ? (
              <iframe
                src={content.embedUrl}
                title={content.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>Video preview not available</p>
              </div>
            )}
          </div>
        );
      
      case "pdf":
        return (
          <div className="w-full min-h-[50vh] max-h-[70vh] bg-muted rounded-lg overflow-hidden">
            <iframe
              src={`${content.url}#toolbar=0`}
              title={content.title}
              className="w-full h-full min-h-[50vh]"
            />
          </div>
        );
      
      case "ppt":
        return (
          <div className="w-full min-h-[45vh] max-h-[70vh] bg-muted rounded-lg overflow-hidden">
            {content.embedUrl ? (
              <iframe
                src={content.embedUrl}
                title={content.title}
                className="w-full h-full min-h-[45vh]"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 p-8">
                <ContentTypeIcon type="ppt" size="lg" />
                <p className="text-sm text-muted-foreground">PowerPoint preview</p>
                <Button variant="outline" size="sm" asChild>
                  <a href={content.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in new tab
                  </a>
                </Button>
              </div>
            )}
          </div>
        );
      
      case "iframe":
      case "animation":
        return (
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
            <iframe
              src={content.embedUrl || content.url}
              title={content.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        );
      
      case "image":
        return (
          <div className="w-full max-h-[60vh] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src={content.url} 
              alt={content.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      
      case "audio":
        return (
          <div className="w-full p-8 bg-muted rounded-lg flex flex-col items-center gap-4">
            <ContentTypeIcon type="audio" size="lg" />
            <audio controls className="w-full max-w-md">
              <source src={content.url} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      
      case "scorm":
        return (
          <div className="aspect-video w-full bg-muted rounded-lg flex flex-col items-center justify-center gap-3 p-8">
            <ContentTypeIcon type="scorm" size="lg" />
            <p className="text-sm text-muted-foreground">SCORM Package</p>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Launch SCORM Player
            </Button>
          </div>
        );
      
      default:
        return (
          <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Preview not available</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <ContentTypeIcon type={content.type} size="md" />
              </div>
              <div>
                <DialogTitle className="text-lg">{content.title}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {getContentTypeLabel(content.type)} • {content.subject} • {content.className}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        {/* Preview Area */}
        <div className="mt-4">
          {renderPreview()}
        </div>
        
        {/* Content Details - Only show for superadmin mode */}
        {mode !== "institute" && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <ContentStatusBadge status={content.status} />
              <ContentVisibilityBadge visibility={content.visibility} />
            </div>
            
            <p className="text-sm text-muted-foreground">{content.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-sm font-medium">{content.viewCount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Downloads</p>
                  <p className="text-sm font-medium">{content.downloadCount.toLocaleString()}</p>
                </div>
              </div>
              {content.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium">{content.duration} min</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{format(new Date(content.createdAt), "MMM d, yyyy")}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(content)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={content.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Original
                </a>
              </Button>
            </div>
          </div>
        )}
        
        {/* Minimal description for institute mode */}
        {mode === "institute" && content.description && (
          <p className="mt-3 text-sm text-muted-foreground">{content.description}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
