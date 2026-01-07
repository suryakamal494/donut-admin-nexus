import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { curriculums } from "@/data/masterData";

interface CurriculumManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CurriculumManageDialog = ({ open, onOpenChange }: CurriculumManageDialogProps) => {
  const isMobile = useIsMobile();
  const [addingItem, setAddingItem] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage curriculum boards and their settings
        </p>
        <Button 
          size="sm" 
          className="gradient-button gap-1"
          onClick={() => setAddingItem(true)}
        >
          <Plus className="w-4 h-4" />
          Add Curriculum
        </Button>
      </div>

      <ScrollArea className={isMobile ? "h-[60vh]" : "h-[400px]"}>
        <div className="space-y-3 pr-4">
          {/* Add form */}
          {addingItem && (
            <div className="p-4 rounded-lg border-2 border-dashed border-primary bg-primary/5 space-y-3">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Enter curriculum name" />
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input placeholder="Enter code (e.g., CBSE)" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Enter description" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setAddingItem(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="gradient-button">
                  Save Curriculum
                </Button>
              </div>
            </div>
          )}

          {/* Curriculum List */}
          {curriculums.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors group"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{item.name}</p>
                  <Badge variant="outline" className="text-xs font-mono">
                    {item.code}
                  </Badge>
                  {item.isActive ? (
                    <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                      Inactive
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {item.description}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Manage Curriculums</DrawerTitle>
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Curriculums</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};