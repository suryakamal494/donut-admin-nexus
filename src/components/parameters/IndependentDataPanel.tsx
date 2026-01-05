import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { courses } from "@/data/mockData";

const curriculums = [
  { id: "1", name: "CBSE", code: "CBSE", description: "Central Board of Secondary Education" },
  { id: "2", name: "ICSE", code: "ICSE", description: "Indian Certificate of Secondary Education" },
  { id: "3", name: "State Board", code: "STATE", description: "Various State Board Examinations" },
];

interface IndependentDataPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "courses" | "curriculum";
}

export const IndependentDataPanel = ({ open, onOpenChange, type }: IndependentDataPanelProps) => {
  const [addingItem, setAddingItem] = useState(false);
  
  const data = type === "courses" ? courses : curriculums;
  const title = type === "courses" ? "Courses" : "Curriculum";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            {title}
            <Button 
              size="sm" 
              className="gradient-button gap-1"
              onClick={() => setAddingItem(true)}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
          <div className="space-y-2">
            {/* Add form */}
            {addingItem && (
              <div className="p-4 rounded-lg border-2 border-dashed border-primary bg-primary/5 space-y-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder={`Enter ${type === "courses" ? "course" : "curriculum"} name`} />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input placeholder="Enter code" />
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
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* List */}
            {data.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors group"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.code} • {item.description}
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
      </SheetContent>
    </Sheet>
  );
};
