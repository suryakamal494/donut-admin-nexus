import { Clock, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkspaceFooterProps {
  totalDuration: number;
  blockCount: number;
  isSaving: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const WorkspaceFooter = ({
  totalDuration,
  blockCount,
  isSaving,
  onSaveDraft,
  onPublish,
}: WorkspaceFooterProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 sm:relative sm:mt-6 bg-white/95 backdrop-blur-sm border-t sm:border sm:rounded-xl p-3 sm:p-4 z-20">
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
        {/* Stats */}
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{totalDuration}</span>
            <span className="text-muted-foreground">min</span>
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-2.5 py-1 hidden sm:flex">
            <span className="font-medium">{blockCount}</span>
            <span className="text-muted-foreground">block{blockCount !== 1 ? 's' : ''}</span>
          </Badge>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="h-10 px-4"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Save </span>Draft
          </Button>
          <Button
            size="sm"
            onClick={onPublish}
            className="gradient-button h-10 px-4 gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Publish</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
