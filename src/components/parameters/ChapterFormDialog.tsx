import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { type CBSEChapter } from "@/data/cbseMasterData";

interface ChapterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingChapter?: CBSEChapter | null;
  onSave?: (data: { name: string; nameHindi?: string; nameTransliterated?: string }) => void;
}

export const ChapterFormDialog = ({ open, onOpenChange, editingChapter, onSave }: ChapterFormDialogProps) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [nameHindi, setNameHindi] = useState("");
  const [nameTransliterated, setNameTransliterated] = useState("");

  const isEditing = !!editingChapter;
  const title = isEditing ? "Edit Chapter" : "Add New Chapter";

  useEffect(() => {
    if (editingChapter) {
      setName(editingChapter.name);
      setNameHindi(editingChapter.nameHindi || "");
      setNameTransliterated(editingChapter.nameTransliterated || "");
    } else {
      setName("");
      setNameHindi("");
      setNameTransliterated("");
    }
  }, [editingChapter, open]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        name,
        nameHindi: nameHindi || undefined,
        nameTransliterated: nameTransliterated || undefined,
      });
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="chapterName">Chapter Name (English)</Label>
        <Input
          id="chapterName"
          placeholder="e.g., Laws of Motion"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="chapterNameHindi">Name in Hindi (optional)</Label>
        <Input
          id="chapterNameHindi"
          placeholder="e.g., गति के नियम"
          value={nameHindi}
          onChange={(e) => setNameHindi(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="chapterNameTransliterated">Transliterated Name (optional)</Label>
        <Input
          id="chapterNameTransliterated"
          placeholder="e.g., Gati ke Niyam"
          value={nameTransliterated}
          onChange={(e) => setNameTransliterated(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Hindi pronunciation in English letters
        </p>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="gradient-button" onClick={handleSave} disabled={!name.trim()}>
          {isEditing ? "Update Chapter" : "Add Chapter"}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
