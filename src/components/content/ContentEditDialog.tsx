import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ContentItem } from "./ContentCard";
import { ContentTypeIcon, getContentTypeLabel, ContentType } from "./ContentTypeIcon";
import { classes, subjects, chapters } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface ContentEditDialogProps {
  content: ContentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (content: ContentItem) => void;
}

export const ContentEditDialog = ({ content, open, onOpenChange, onSave }: ContentEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<ContentItem>>({});
  const [filteredChapters, setFilteredChapters] = useState<typeof chapters>([]);

  useEffect(() => {
    if (content) {
      setFormData({ ...content });
    }
  }, [content]);

  useEffect(() => {
    if (formData.classId && formData.subjectId) {
      const filtered = chapters.filter(
        ch => ch.classId === formData.classId && ch.subjectId === formData.subjectId
      );
      setFilteredChapters(filtered);
    } else {
      setFilteredChapters([]);
    }
  }, [formData.classId, formData.subjectId]);

  if (!content) return null;

  const handleSave = () => {
    if (!formData.title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...content,
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
    } as ContentItem);

    toast({
      title: "Content Updated",
      description: "Your changes have been saved successfully.",
    });

    onOpenChange(false);
  };

  const handleChange = (field: keyof ContentItem, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <ContentTypeIcon type={content.type} size="md" />
            </div>
            <div>
              <DialogTitle>Edit Content</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {getContentTypeLabel(content.type)}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter content title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter content description"
                rows={3}
              />
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Classification
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select 
                  value={formData.classId} 
                  onValueChange={(v) => {
                    handleChange("classId", v);
                    const cls = classes.find(c => c.id === v);
                    if (cls) handleChange("className", cls.name);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select 
                  value={formData.subjectId} 
                  onValueChange={(v) => {
                    handleChange("subjectId", v);
                    const subj = subjects.find(s => s.id === v);
                    if (subj) handleChange("subject", subj.name);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {subjects.map(subj => (
                      <SelectItem key={subj.id} value={subj.id}>{subj.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chapter</Label>
                <Select 
                  value={formData.chapterId} 
                  onValueChange={(v) => {
                    handleChange("chapterId", v);
                    const ch = filteredChapters.find(c => c.id === v);
                    if (ch) handleChange("chapter", ch.name);
                  }}
                  disabled={filteredChapters.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={filteredChapters.length === 0 ? "Select class & subject first" : "Select chapter"} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {filteredChapters.map(ch => (
                      <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={formData.topic || ""}
                  onChange={(e) => handleChange("topic", e.target.value)}
                  placeholder="Enter topic"
                />
              </div>
            </div>
          </div>

          {/* Content Source */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Content Source
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="url">Content URL *</Label>
              <Input
                id="url"
                value={formData.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            {(content.type === "video" || content.type === "ppt" || content.type === "iframe" || content.type === "animation") && (
              <div className="space-y-2">
                <Label htmlFor="embedUrl">Embed URL</Label>
                <Input
                  id="embedUrl"
                  value={formData.embedUrl || ""}
                  onChange={(e) => handleChange("embedUrl", e.target.value)}
                  placeholder="https://... (for embedding)"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {(content.type === "video" || content.type === "audio" || content.type === "animation") && (
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || undefined }))}
                    placeholder="e.g., 15"
                  />
                </div>
              )}

              {(content.type === "pdf" || content.type === "ppt" || content.type === "scorm") && (
                <div className="space-y-2">
                  <Label htmlFor="size">File Size</Label>
                  <Input
                    id="size"
                    value={formData.size || ""}
                    onChange={(e) => handleChange("size", e.target.value)}
                    placeholder="e.g., 2.5 MB"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Settings
            </h3>
            
            <div className="space-y-3">
              <Label>Visibility</Label>
              <RadioGroup
                value={formData.visibility}
                onValueChange={(v) => handleChange("visibility", v)}
                className="flex flex-wrap gap-3 sm:gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="font-normal cursor-pointer">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="font-normal cursor-pointer">Private</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="restricted" id="restricted" />
                  <Label htmlFor="restricted" className="font-normal cursor-pointer">Restricted</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gradient-button">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
