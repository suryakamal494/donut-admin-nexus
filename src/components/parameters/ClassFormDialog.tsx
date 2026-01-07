import { useState } from "react";
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

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClass?: { id: string; name: string; code?: string } | null;
}

export const ClassFormDialog = ({ open, onOpenChange, editingClass }: ClassFormDialogProps) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState(editingClass?.name || "");
  const [code, setCode] = useState(editingClass?.code || "");

  const isEditing = !!editingClass;
  const title = isEditing ? "Edit Class" : "Add New Class";

  const handleSave = () => {
    // TODO: Implement save logic
    onOpenChange(false);
    setName("");
    setCode("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setName("");
    setCode("");
  };

  const content = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="className">Class Name</Label>
        <Input
          id="className"
          placeholder="e.g., Class 11"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="classCode">Code (optional)</Label>
        <Input
          id="classCode"
          placeholder="e.g., 11"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          A short identifier for internal use
        </p>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="gradient-button" onClick={handleSave} disabled={!name.trim()}>
          {isEditing ? "Update Class" : "Add Class"}
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
