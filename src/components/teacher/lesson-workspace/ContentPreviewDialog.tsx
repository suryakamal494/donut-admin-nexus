import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { LessonPlanBlock } from "./types";
import { FileText, Video, Image, Presentation, FileQuestion } from "lucide-react";

interface ContentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block: LessonPlanBlock | null;
}

const getContentIcon = (sourceType?: string) => {
  switch (sourceType) {
    case 'presentation':
      return <Presentation className="w-12 h-12 text-muted-foreground" />;
    case 'video':
      return <Video className="w-12 h-12 text-muted-foreground" />;
    case 'document':
      return <FileText className="w-12 h-12 text-muted-foreground" />;
    case 'image':
      return <Image className="w-12 h-12 text-muted-foreground" />;
    default:
      return <FileQuestion className="w-12 h-12 text-muted-foreground" />;
  }
};

const getBlockTypeLabel = (type: string) => {
  switch (type) {
    case 'explain':
      return 'Explanation Content';
    case 'demonstrate':
      return 'Demonstration Content';
    case 'quiz':
      return 'Quiz Questions';
    case 'homework':
      return 'Homework Assignment';
    default:
      return 'Content';
  }
};

const PreviewContent = ({ block }: { block: LessonPlanBlock }) => {
  // For quiz type, show questions
  if (block.type === 'quiz' && block.questions && block.questions.length > 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          {block.questions.length} question{block.questions.length > 1 ? 's' : ''} in this quiz
        </p>
        <div className="space-y-3">
          {block.questions.map((question, index) => (
            <div 
              key={index}
              className="p-4 bg-muted/50 rounded-lg border"
            >
              <p className="text-sm font-medium">Q{index + 1}. {question}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // For content with attachment URL (video, document, etc.)
  if (block.attachmentUrl) {
    const url = block.attachmentUrl;
    
    // Video content
    if (block.sourceType === 'video' || url.includes('youtube') || url.includes('vimeo')) {
      return (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full"
            allowFullScreen
            title={block.title}
          />
        </div>
      );
    }

    // PDF/Document content
    if (block.sourceType === 'document' || url.endsWith('.pdf')) {
      return (
        <div className="w-full min-h-[60vh] bg-muted rounded-lg overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full min-h-[60vh]"
            title={block.title}
          />
        </div>
      );
    }

    // Image content
    if (block.sourceType === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return (
        <div className="w-full flex items-center justify-center p-4">
          <img
            src={url}
            alt={block.title}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      );
    }

    // Presentation content - show as PDF or slides
    if (block.sourceType === 'presentation') {
      return (
        <div className="w-full min-h-[60vh] bg-muted rounded-lg overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full min-h-[60vh]"
            title={block.title}
          />
        </div>
      );
    }
  }

  // Fallback - show content text or placeholder
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {getContentIcon(block.sourceType)}
      <p className="mt-4 text-muted-foreground">
        {block.content || 'No preview available for this content'}
      </p>
      {block.sourceType && (
        <p className="mt-2 text-xs text-muted-foreground capitalize">
          Content type: {block.sourceType}
        </p>
      )}
    </div>
  );
};

export const ContentPreviewDialog: React.FC<ContentPreviewDialogProps> = ({
  open,
  onOpenChange,
  block,
}) => {
  const isMobile = useIsMobile();

  if (!block) return null;

  const title = block.title || getBlockTypeLabel(block.type);

  // Use Sheet on mobile, Dialog on desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              {getContentIcon(block.sourceType)}
              <span className="truncate">{title}</span>
            </SheetTitle>
          </SheetHeader>
          <PreviewContent block={block} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getContentIcon(block.sourceType)}
            <span className="truncate">{title}</span>
          </DialogTitle>
        </DialogHeader>
        <PreviewContent block={block} />
      </DialogContent>
    </Dialog>
  );
};
