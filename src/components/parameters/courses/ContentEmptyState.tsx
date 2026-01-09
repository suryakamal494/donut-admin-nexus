import { BookOpen, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentEmptyStateProps {
  type: 'course' | 'subject';
}

export const ContentEmptyState = ({ type }: ContentEmptyStateProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/50 bg-muted/30">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Chapters & Topics
        </h3>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {type === 'course' 
              ? 'Select a course to view its content'
              : 'Select a subject to view chapters'}
          </p>
        </div>
      </div>
    </div>
  );
};
