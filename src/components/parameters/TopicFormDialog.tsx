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
import { type CBSETopic } from "@/data/cbseMasterData";

interface TopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTopic?: CBSETopic | null;
  onSave?: (data: { name: string; nameHindi?: string }) => void;
}

export const TopicFormDialog = ({ open, onOpenChange, editingTopic, onSave }: TopicFormDialogProps) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [nameHindi, setNameHindi] = useState("");

  const isEditing = !!editingTopic;
  const title = isEditing ? "Edit Topic" : "Add New Topic";

  useEffect(() => {
    if (editingTopic) {
      setName(editingTopic.name);
      setNameHindi(editingTopic.nameHindi || "");
    } else {
      setName("");
      setNameHindi("");
    }
  }, [editingTopic, open]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        name,
        nameHindi: nameHindi || undefined,
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
        <Label htmlFor="topicName">Topic Name (English)</Label>
        <Input
          id="topicName"
          placeholder="e.g., Newton's First Law"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="topicNameHindi">Name in Hindi (optional)</Label>
        <Input
          id="topicNameHindi"
          placeholder="e.g., न्यूटन का प्रथम नियम"
          value={nameHindi}
          onChange={(e) => setNameHindi(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="gradient-button" onClick={handleSave} disabled={!name.trim()}>
          {isEditing ? "Update Topic" : "Add Topic"}
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
