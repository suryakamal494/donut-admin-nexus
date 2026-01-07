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

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSubject?: { id: string; name: string; code?: string; color?: string } | null;
}

const colorOptions = [
  { value: "#4f46e5", label: "Indigo" },
  { value: "#0d9488", label: "Teal" },
  { value: "#2563eb", label: "Blue" },
  { value: "#ea580c", label: "Orange" },
  { value: "#b45309", label: "Amber" },
  { value: "#7c3aed", label: "Purple" },
  { value: "#059669", label: "Emerald" },
  { value: "#dc2626", label: "Red" },
];

export const SubjectFormDialog = ({ open, onOpenChange, editingSubject }: SubjectFormDialogProps) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState(editingSubject?.name || "");
  const [code, setCode] = useState(editingSubject?.code || "");
  const [color, setColor] = useState(editingSubject?.color || colorOptions[0].value);

  const isEditing = !!editingSubject;
  const title = isEditing ? "Edit Subject" : "Add New Subject";

  const handleSave = () => {
    // TODO: Implement save logic
    onOpenChange(false);
    setName("");
    setCode("");
    setColor(colorOptions[0].value);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setName("");
    setCode("");
    setColor(colorOptions[0].value);
  };

  const content = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subjectName">Subject Name</Label>
        <Input
          id="subjectName"
          placeholder="e.g., Physics"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subjectCode">Code (optional)</Label>
        <Input
          id="subjectCode"
          placeholder="e.g., PHY"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono"
        />
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setColor(option.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === option.value
                  ? "border-foreground scale-110 shadow-md"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: option.value }}
              title={option.label}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="gradient-button" onClick={handleSave} disabled={!name.trim()}>
          {isEditing ? "Update Subject" : "Add Subject"}
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
