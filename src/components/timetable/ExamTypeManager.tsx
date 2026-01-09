import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExamType } from "@/types/examBlock";
import { Plus, Edit2, Trash2, Check, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ExamTypeManagerProps {
  examTypes: ExamType[];
  onAddType: (type: ExamType) => void;
  onUpdateType: (type: ExamType) => void;
  onDeleteType: (typeId: string) => void;
  usedTypeIds?: string[]; // Types currently in use by exams
}

const PRESET_COLORS = [
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Amber', value: 'amber' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Purple', value: 'purple' },
  { name: 'Pink', value: 'pink' },
];

export const ExamTypeManager = ({
  examTypes,
  onAddType,
  onUpdateType,
  onDeleteType,
  usedTypeIds = [],
}: ExamTypeManagerProps) => {
  const [open, setOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeColor, setNewTypeColor] = useState("blue");
  const [editingType, setEditingType] = useState<ExamType | null>(null);

  const handleAddType = () => {
    if (!newTypeName.trim()) return;

    const newType: ExamType = {
      id: `custom-${Date.now()}`,
      name: newTypeName.trim(),
      color: newTypeColor,
      isDefault: false,
    };

    onAddType(newType);
    setNewTypeName("");
    setNewTypeColor("blue");
    toast.success("Exam type added");
  };

  const handleUpdateType = () => {
    if (!editingType || !editingType.name.trim()) return;
    onUpdateType(editingType);
    setEditingType(null);
    toast.success("Exam type updated");
  };

  const handleDeleteType = (type: ExamType) => {
    if (usedTypeIds.includes(type.id)) {
      toast.error("Cannot delete type in use by existing exams");
      return;
    }
    onDeleteType(type.id);
    toast.success("Exam type deleted");
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'green': return 'bg-green-100 text-green-700 border-green-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Exam Types</DialogTitle>
          <DialogDescription>
            Create and manage custom exam types for your institution
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Add New Type */}
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <Label className="text-sm font-medium">Add New Type</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Weekly Quiz"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
              />
              <Button size="sm" onClick={handleAddType} disabled={!newTypeName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setNewTypeColor(color.value)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    `bg-${color.value}-500`,
                    newTypeColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                  )}
                  style={{ backgroundColor: `var(--${color.value}-500, ${color.value})` }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Existing Types */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Existing Types</Label>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {examTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-2 rounded-lg border bg-background"
                >
                  {editingType?.id === type.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingType.name}
                        onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleUpdateType}>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingType(null)}>
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs", getColorClass(type.color))}>
                          {type.name}
                        </Badge>
                        {type.isDefault && (
                          <span className="text-[10px] text-muted-foreground">(default)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {!type.isDefault && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => setEditingType(type)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteType(type)}
                              disabled={usedTypeIds.includes(type.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
