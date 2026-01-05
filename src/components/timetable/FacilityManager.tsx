import { useState } from "react";
import { Facility } from "@/data/timetableData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoTooltip } from "./InfoTooltip";
import { cn } from "@/lib/utils";
import { 
  FlaskConical, 
  Dumbbell, 
  Library, 
  Building2, 
  Plus, 
  Pencil, 
  Trash2, 
  Users,
  Clock,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

const FACILITY_ICONS = {
  lab: FlaskConical,
  sports: Dumbbell,
  special: Library,
  classroom: Building2,
};

const FACILITY_COLORS = {
  lab: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
  sports: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
  special: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  classroom: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
};

const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

interface FacilityManagerProps {
  facilities: Facility[];
  onUpdate: (facilities: Facility[]) => void;
}

export const FacilityManager = ({
  facilities,
  onUpdate,
}: FacilityManagerProps) => {
  const [activeTab, setActiveTab] = useState<Facility['type']>('lab');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Facility>>({
    name: '',
    type: 'lab',
    capacity: 30,
    duration: 1,
    allowedClasses: [],
  });

  const openAddDialog = (type: Facility['type']) => {
    setEditingFacility(null);
    setFormData({
      name: '',
      type,
      capacity: 30,
      duration: type === 'lab' ? 2 : 1,
      allowedClasses: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({ ...facility });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast.error("Please enter a facility name");
      return;
    }

    if (editingFacility) {
      // Update existing
      onUpdate(facilities.map(f => 
        f.id === editingFacility.id 
          ? { ...f, ...formData } as Facility
          : f
      ));
      toast.success("Facility updated");
    } else {
      // Add new
      const newFacility: Facility = {
        id: `facility-${Date.now()}`,
        name: formData.name!,
        type: formData.type as Facility['type'],
        capacity: formData.capacity,
        duration: formData.duration || 1,
        allowedClasses: formData.allowedClasses || [],
        linkedPeriodType: formData.linkedPeriodType,
      };
      onUpdate([...facilities, newFacility]);
      toast.success("Facility added");
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (facilityId: string) => {
    onUpdate(facilities.filter(f => f.id !== facilityId));
    toast.success("Facility removed");
  };

  const toggleClass = (className: string) => {
    const current = formData.allowedClasses || [];
    if (current.includes(className)) {
      setFormData({ ...formData, allowedClasses: current.filter(c => c !== className) });
    } else {
      setFormData({ ...formData, allowedClasses: [...current, className] });
    }
  };

  const getFacilitiesByType = (type: Facility['type']) => {
    return facilities.filter(f => f.type === type);
  };

  const renderFacilityCard = (facility: Facility) => {
    const Icon = FACILITY_ICONS[facility.type];
    
    return (
      <div
        key={facility.id}
        className={cn(
          "p-4 rounded-xl border transition-all hover:shadow-sm",
          FACILITY_COLORS[facility.type]
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">{facility.name}</p>
              <div className="flex items-center gap-3 text-sm opacity-80 mt-0.5">
                {facility.capacity && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {facility.capacity}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {facility.duration} period{facility.duration > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/50 dark:hover:bg-black/20"
              onClick={() => openEditDialog(facility)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDelete(facility.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Allowed Classes */}
        {facility.allowedClasses.length > 0 && (
          <div className="mt-3 pt-3 border-t border-current/10">
            <p className="text-xs opacity-70 mb-1.5">Allowed Classes:</p>
            <div className="flex flex-wrap gap-1">
              {facility.allowedClasses.map(cls => (
                <Badge key={cls} variant="secondary" className="text-xs bg-white/50 dark:bg-black/20">
                  {cls}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {facility.allowedClasses.length === 0 && (
          <p className="mt-2 text-xs opacity-60">Available for all classes</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Facility['type'])}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList>
            <TabsTrigger value="lab" className="gap-2">
              <FlaskConical className="w-4 h-4" />
              Labs
              <Badge variant="secondary" className="ml-1">{getFacilitiesByType('lab').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="sports" className="gap-2">
              <Dumbbell className="w-4 h-4" />
              Sports
              <Badge variant="secondary" className="ml-1">{getFacilitiesByType('sports').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="special" className="gap-2">
              <Library className="w-4 h-4" />
              Special
              <Badge variant="secondary" className="ml-1">{getFacilitiesByType('special').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="classroom" className="gap-2">
              <Building2 className="w-4 h-4" />
              Classrooms
              <Badge variant="secondary" className="ml-1">{getFacilitiesByType('classroom').length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={() => openAddDialog(activeTab)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add {activeTab === 'lab' ? 'Lab' : activeTab === 'sports' ? 'Sports Facility' : activeTab === 'special' ? 'Special Room' : 'Classroom'}
          </Button>
        </div>

        {['lab', 'sports', 'special', 'classroom'].map(type => (
          <TabsContent key={type} value={type} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFacilitiesByType(type as Facility['type']).map(renderFacilityCard)}
              
              {getFacilitiesByType(type as Facility['type']).length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                  <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No {type === 'lab' ? 'labs' : type === 'sports' ? 'sports facilities' : type === 'special' ? 'special rooms' : 'classrooms'} configured</p>
                  <Button variant="link" onClick={() => openAddDialog(type as Facility['type'])} className="mt-1">
                    Add your first one
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFacility ? 'Edit Facility' : 'Add New Facility'}
            </DialogTitle>
            <DialogDescription>
              Configure the facility details and restrictions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label>Facility Name</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Physics Lab"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData({ ...formData, type: v as Facility['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="sports">Sports Facility</SelectItem>
                  <SelectItem value="special">Special Room</SelectItem>
                  <SelectItem value="classroom">Classroom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Capacity (students)
                <InfoTooltip content="Maximum number of students this facility can accommodate" />
              </Label>
              <Input
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || undefined })}
                placeholder="30"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Duration (periods)
                <InfoTooltip content="How many periods are typically needed when using this facility" />
              </Label>
              <Select 
                value={(formData.duration || 1).toString()} 
                onValueChange={(v) => setFormData({ ...formData, duration: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 period</SelectItem>
                  <SelectItem value="2">2 periods (double)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Allowed Classes */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Allowed Classes (optional)
                <InfoTooltip content="Restrict this facility to specific classes. Leave empty for all classes." />
              </Label>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border bg-muted/30">
                {CLASSES.map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleClass(cls)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                      formData.allowedClasses?.includes(cls)
                        ? "bg-primary text-white border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    )}
                  >
                    {cls}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.allowedClasses?.length === 0 
                  ? 'All classes can use this facility' 
                  : `Only ${formData.allowedClasses?.join(', ')} can use this facility`}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingFacility ? 'Update' : 'Add'} Facility
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};