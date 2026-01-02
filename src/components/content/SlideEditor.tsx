import { useState } from "react";
import { Trash2, Copy, Plus, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Slide {
  id: string;
  title: string;
  content: string;
}

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddSlideBelow: () => void;
}

export const SlideEditor = ({
  slide,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddSlideBelow,
}: SlideEditorProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [tempTitle, setTempTitle] = useState(slide.title);
  const [tempContent, setTempContent] = useState(slide.content);

  const handleTitleSave = () => {
    onUpdate({ ...slide, title: tempTitle });
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(slide.title);
    setIsEditingTitle(false);
  };

  const handleContentSave = () => {
    onUpdate({ ...slide, content: tempContent });
    setIsEditingContent(false);
  };

  const handleContentCancel = () => {
    setTempContent(slide.content);
    setIsEditingContent(false);
  };

  // Reset temp values when slide changes
  if (tempTitle !== slide.title && !isEditingTitle) {
    setTempTitle(slide.title);
  }
  if (tempContent !== slide.content && !isEditingContent) {
    setTempContent(slide.content);
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
      {/* Slide preview area */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Slide Title
          </label>
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="text-xl font-semibold"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={handleTitleSave}>
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleTitleCancel}>
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="w-full text-left p-3 rounded-lg border border-dashed border-transparent hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{slide.title}</h3>
                <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to edit title
              </p>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Slide Content
          </label>
          {isEditingContent ? (
            <div className="space-y-2">
              <Textarea
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="min-h-48 font-mono text-sm"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={handleContentCancel}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleContentSave}>
                  <Check className="w-4 h-4 mr-1" /> Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingContent(true)}
              className="w-full text-left p-4 rounded-lg border border-dashed border-transparent hover:border-primary/50 hover:bg-primary/5 transition-all group min-h-48"
            >
              <div className="space-y-2">
                {slide.content.split('\n').map((line, i) => (
                  <p key={i} className={cn(
                    "text-sm",
                    line.startsWith('•') || line.startsWith('-') ? "pl-4" : ""
                  )}>
                    {line || <span className="text-muted-foreground">&nbsp;</span>}
                  </p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                Click anywhere to edit this content
              </p>
            </button>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-border bg-muted/30 p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Slide
          </Button>
          <Button variant="outline" size="sm" onClick={onDuplicate}>
            <Copy className="w-4 h-4 mr-2" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={onAddSlideBelow}>
            <Plus className="w-4 h-4 mr-2" /> Add Slide Below
          </Button>
        </div>
      </div>
    </div>
  );
};
