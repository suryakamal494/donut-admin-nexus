import { useState } from "react";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface AIAssistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
  chapter: string;
  subject: string;
  onTopicChange: (topic: string) => void;
  onChapterChange: (chapter: string) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
}

export const AIAssistDialog = ({
  open,
  onOpenChange,
  topic,
  chapter,
  subject,
  onTopicChange,
  onChapterChange,
  onGenerate,
  isGenerating,
}: AIAssistDialogProps) => {
  const handleGenerate = async () => {
    await onGenerate();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-button flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            AI Lesson Generator
          </DialogTitle>
          <DialogDescription>
            Let AI create a complete lesson plan with teaching blocks based on your topic.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Subject Badge */}
          {subject && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Subject:</span>
              <Badge variant="secondary" className="text-xs">
                {subject}
              </Badge>
            </div>
          )}
          
          {/* Chapter */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Chapter
            </label>
            <Input
              value={chapter}
              onChange={(e) => onChapterChange(e.target.value)}
              placeholder="e.g., Laws of Motion"
              className="h-10"
            />
          </div>
          
          {/* Topic */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Topic / Focus Area <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              placeholder="e.g., Newton's First and Second Law with real-world examples and problem-solving practice"
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Be specific for better results. Include what you want students to learn.
            </p>
          </div>
          
          {/* What AI will generate */}
          <div className="bg-primary/5 rounded-lg p-3">
            <h4 className="text-xs font-medium text-primary mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI will generate:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 4-6 teaching blocks (Explain, Demonstrate, Quiz, Homework)</li>
              <li>• Content and notes for each block</li>
              <li>• Time allocation for each section</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="gradient-button gap-2"
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Lesson
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
