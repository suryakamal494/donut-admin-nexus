import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PeriodType, defaultPeriodTypes } from "@/data/timetableData";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Library, 
  FlaskConical, 
  Dumbbell, 
  Palette, 
  Users, 
  Coffee, 
  FileEdit,
  GripVertical
} from "lucide-react";
import { toast } from "sonner";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Library,
  FlaskConical,
  Dumbbell,
  Palette,
  Users,
  Coffee,
  FileEdit,
};

interface PeriodTypeManagerProps {
  periodTypes: PeriodType[];
  onUpdate: (types: PeriodType[]) => void;
}

export const PeriodTypeManager = ({ periodTypes, onUpdate }: PeriodTypeManagerProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");

  const handleToggleRequiresTeacher = (typeId: string, value: boolean) => {
    onUpdate(
      periodTypes.map(t => 
        t.id === typeId ? { ...t, requiresTeacher: value } : t
      )
    );
  };

  const handleToggleIsDouble = (typeId: string, value: boolean) => {
    onUpdate(
      periodTypes.map(t => 
        t.id === typeId ? { ...t, isDouble: value } : t
      )
    );
  };

  const handleAddNew = () => {
    if (!newTypeName.trim()) return;
    
    const newType: PeriodType = {
      id: `custom-${Date.now()}`,
      name: newTypeName.trim(),
      icon: 'BookOpen',
      color: 'bg-gray-100 text-gray-700',
      requiresTeacher: true,
      isDouble: false,
      isDefault: false,
    };

    onUpdate([...periodTypes, newType]);
    setNewTypeName("");
    setIsAddingNew(false);
    toast.success("Period type added");
  };

  const handleDelete = (typeId: string) => {
    const type = periodTypes.find(t => t.id === typeId);
    if (type?.isDefault) {
      toast.error("Cannot delete default period types");
      return;
    }
    onUpdate(periodTypes.filter(t => t.id !== typeId));
    toast.success("Period type removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Period Types</h3>
          <p className="text-sm text-muted-foreground">Configure different types of periods for your timetable</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingNew(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Type
        </Button>
      </div>

      {/* Add New Form */}
      {isAddingNew && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Enter period type name..."
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={handleAddNew} disabled={!newTypeName.trim()}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setIsAddingNew(false); setNewTypeName(""); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {periodTypes.map((type) => {
          const IconComponent = iconMap[type.icon] || BookOpen;
          
          return (
            <Card 
              key={type.id} 
              className={cn(
                "relative",
                !type.isDefault && "border-dashed"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", type.color)}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{type.name}</h4>
                      {type.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>

                    {/* Settings */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Requires Teacher</Label>
                        <Switch
                          checked={type.requiresTeacher}
                          onCheckedChange={(v) => handleToggleRequiresTeacher(type.id, v)}
                          className="scale-75"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Double Period</Label>
                        <Switch
                          checked={type.isDouble}
                          onCheckedChange={(v) => handleToggleIsDouble(type.id, v)}
                          className="scale-75"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delete button for custom types */}
                  {!type.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(type.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};