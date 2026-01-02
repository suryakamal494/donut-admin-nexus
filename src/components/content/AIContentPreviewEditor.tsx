import { useState } from "react";
import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Trash2, 
  Copy, 
  GripVertical,
  Pencil,
  Check,
  X,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SlideCard } from "./SlideCard";
import { SlideEditor } from "./SlideEditor";

export interface Slide {
  id: string;
  title: string;
  content: string;
}

interface AIContentPreviewEditorProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
  presentationTitle: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onBack: () => void;
  classification: {
    class: string;
    subject: string;
    chapter: string;
    topic?: string;
  };
}

export const AIContentPreviewEditor = ({
  slides,
  onSlidesChange,
  presentationTitle,
  onTitleChange,
  onSave,
  onBack,
  classification,
}: AIContentPreviewEditorProps) => {
  const [selectedSlideId, setSelectedSlideId] = useState<string>(slides[0]?.id || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(presentationTitle);
  const [deleteSlideId, setDeleteSlideId] = useState<string | null>(null);
  const [showAddSlideDialog, setShowAddSlideDialog] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState("");
  const [newSlideContent, setNewSlideContent] = useState("");
  const [addSlidePosition, setAddSlidePosition] = useState<"end" | "after">("end");

  const selectedSlide = slides.find(s => s.id === selectedSlideId);

  const handleTitleSave = () => {
    onTitleChange(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(presentationTitle);
    setIsEditingTitle(false);
  };

  const handleSlideUpdate = (updatedSlide: Slide) => {
    onSlidesChange(slides.map(s => s.id === updatedSlide.id ? updatedSlide : s));
  };

  const handleDeleteSlide = () => {
    if (!deleteSlideId) return;
    const newSlides = slides.filter(s => s.id !== deleteSlideId);
    onSlidesChange(newSlides);
    if (selectedSlideId === deleteSlideId && newSlides.length > 0) {
      setSelectedSlideId(newSlides[0].id);
    }
    setDeleteSlideId(null);
  };

  const handleDuplicateSlide = (slideId: string) => {
    const slideIndex = slides.findIndex(s => s.id === slideId);
    const slideToDuplicate = slides[slideIndex];
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `${slideToDuplicate.title} (Copy)`,
      content: slideToDuplicate.content,
    };
    const newSlides = [
      ...slides.slice(0, slideIndex + 1),
      newSlide,
      ...slides.slice(slideIndex + 1),
    ];
    onSlidesChange(newSlides);
    setSelectedSlideId(newSlide.id);
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: newSlideTitle || "New Slide",
      content: newSlideContent || "Add your content here...",
    };
    
    if (addSlidePosition === "after" && selectedSlideId) {
      const currentIndex = slides.findIndex(s => s.id === selectedSlideId);
      const newSlides = [
        ...slides.slice(0, currentIndex + 1),
        newSlide,
        ...slides.slice(currentIndex + 1),
      ];
      onSlidesChange(newSlides);
    } else {
      onSlidesChange([...slides, newSlide]);
    }
    
    setSelectedSlideId(newSlide.id);
    setShowAddSlideDialog(false);
    setNewSlideTitle("");
    setNewSlideContent("");
  };

  const openAddSlideDialog = (position: "end" | "after") => {
    setAddSlidePosition(position);
    setShowAddSlideDialog(true);
  };

  return (
    <div className="space-y-4">
      {/* Header with title and actions */}
      <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="text-lg font-semibold w-64"
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
                className="flex items-center gap-2 group"
              >
                <h2 className="text-lg font-semibold">{presentationTitle}</h2>
                <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{classification.class}</Badge>
            <Badge variant="secondary">{classification.subject}</Badge>
            <Badge variant="secondary">{classification.chapter}</Badge>
            {classification.topic && <Badge variant="secondary">{classification.topic}</Badge>}
          </div>
          
          <Button onClick={onSave} className="gradient-button gap-2">
            <Save className="w-4 h-4" /> Save to Library
          </Button>
        </div>
      </div>

      {/* Guidance banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> Click on any slide thumbnail to select it, then edit the content on the right. 
          You can rename slides, delete unwanted ones, or add new slides using the buttons below.
        </p>
      </div>

      {/* Main editor layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Slide thumbnails */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">
              SLIDES ({slides.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAddSlideDialog("end")}
              className="gap-1"
            >
              <Plus className="w-3 h-3" /> Add Slide
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {slides.map((slide, index) => (
              <SlideCard
                key={slide.id}
                slide={slide}
                index={index}
                isSelected={selectedSlideId === slide.id}
                onSelect={() => setSelectedSlideId(slide.id)}
                onDelete={() => setDeleteSlideId(slide.id)}
                onDuplicate={() => handleDuplicateSlide(slide.id)}
              />
            ))}
          </div>
        </div>

        {/* Right panel - Slide editor */}
        <div className="lg:col-span-2">
          {selectedSlide ? (
            <SlideEditor
              slide={selectedSlide}
              onUpdate={handleSlideUpdate}
              onDelete={() => setDeleteSlideId(selectedSlide.id)}
              onDuplicate={() => handleDuplicateSlide(selectedSlide.id)}
              onAddSlideBelow={() => openAddSlideDialog("after")}
            />
          ) : (
            <div className="bg-card rounded-2xl p-12 text-center shadow-soft border border-border/50">
              <p className="text-muted-foreground">Select a slide to edit</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteSlideId} onOpenChange={(open) => !open && setDeleteSlideId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The slide will be permanently removed from your presentation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSlide} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add slide dialog */}
      <Dialog open={showAddSlideDialog} onOpenChange={setShowAddSlideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Slide</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slide Title</label>
              <Input
                value={newSlideTitle}
                onChange={(e) => setNewSlideTitle(e.target.value)}
                placeholder="Enter slide title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slide Content</label>
              <Textarea
                value={newSlideContent}
                onChange={(e) => setNewSlideContent(e.target.value)}
                placeholder="Enter slide content (use bullet points with • or -)"
                className="min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSlideDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSlide} className="gradient-button">
              Add Slide
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
