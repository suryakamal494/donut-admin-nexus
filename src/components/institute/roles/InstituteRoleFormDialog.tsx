import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  FileQuestion,
  Library,
  ClipboardList,
  Database,
  Settings,
  Shield,
} from "lucide-react";
import { InstituteRole, InstituteRolePermissions, defaultInstitutePermissions } from "./types";
import InstitutePermissionSection from "./InstitutePermissionSection";

interface InstituteRoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: InstituteRole | null;
  onSave: (role: Omit<InstituteRole, "id" | "memberCount" | "createdAt">) => void;
}

const InstituteRoleFormDialog = ({ open, onOpenChange, role, onSave }: InstituteRoleFormDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<InstituteRolePermissions>(defaultInstitutePermissions);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setPermissions(role.permissions);
    } else {
      setName("");
      setDescription("");
      setPermissions(defaultInstitutePermissions);
    }
  }, [role, open]);

  const handlePermissionChange = (module: keyof InstituteRolePermissions, key: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [key]: value,
        // Reset CRUD if view is disabled
        ...(key === "view" && !value
          ? { create: false, edit: false, delete: false }
          : {}),
      },
    }));
  };

  const handleTimetableCapabilityChange = (key: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        capabilities: {
          ...prev.timetable.capabilities,
          [key]: value,
        },
      },
    }));
  };

  const handleExamsCapabilityChange = (key: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      exams: {
        ...prev.exams,
        capabilities: {
          ...prev.exams.capabilities,
          [key]: value,
        },
      },
    }));
  };

  const handleSubmit = () => {
    onSave({
      name,
      description,
      isSystem: false,
      permissions,
    });
    onOpenChange(false);
  };

  const isEditing = !!role;
  const isValid = name.trim() && description.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle>{isEditing ? "Edit Role" : "Create New Role"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-name">Role Name *</Label>
                <Input
                  id="role-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Academic Head"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="role-description">Description *</Label>
                <Textarea
                  id="role-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this role can do..."
                  className="mt-1.5"
                  rows={2}
                />
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Permissions
              </h4>

              {/* Dashboard - View only */}
              <InstitutePermissionSection
                title="Dashboard"
                icon={LayoutDashboard}
                permissions={permissions.dashboard}
                onChange={(key, value) => handlePermissionChange("dashboard", key, value)}
                showCRUD={false}
              />

              {/* Batches */}
              <InstitutePermissionSection
                title="Batches"
                icon={BookOpen}
                permissions={permissions.batches}
                onChange={(key, value) => handlePermissionChange("batches", key, value)}
              />

              {/* Teachers */}
              <InstitutePermissionSection
                title="Teachers"
                icon={Users}
                permissions={permissions.teachers}
                onChange={(key, value) => handlePermissionChange("teachers", key, value)}
              />

              {/* Students */}
              <InstitutePermissionSection
                title="Students"
                icon={GraduationCap}
                permissions={permissions.students}
                onChange={(key, value) => handlePermissionChange("students", key, value)}
              />

              {/* Timetable with capabilities */}
              <InstitutePermissionSection
                title="Timetable"
                icon={Calendar}
                permissions={permissions.timetable}
                onChange={(key, value) => handlePermissionChange("timetable", key, value)}
                capabilities={[
                  { key: "setup", label: "Setup & Config", enabled: permissions.timetable.capabilities.setup },
                  { key: "workspace", label: "Workspace", enabled: permissions.timetable.capabilities.workspace },
                  { key: "substitution", label: "Substitution", enabled: permissions.timetable.capabilities.substitution },
                ]}
                onCapabilityChange={handleTimetableCapabilityChange}
              />

              {/* Question Bank */}
              <InstitutePermissionSection
                title="Question Bank"
                icon={FileQuestion}
                permissions={permissions.questionBank}
                onChange={(key, value) => handlePermissionChange("questionBank", key, value)}
              />

              {/* Content Library */}
              <InstitutePermissionSection
                title="Content Library"
                icon={Library}
                permissions={permissions.contentLibrary}
                onChange={(key, value) => handlePermissionChange("contentLibrary", key, value)}
              />

              {/* Exams with capabilities */}
              <InstitutePermissionSection
                title="Exams"
                icon={ClipboardList}
                permissions={permissions.exams}
                onChange={(key, value) => handlePermissionChange("exams", key, value)}
                capabilities={[
                  { key: "createManual", label: "Create Manual", enabled: permissions.exams.capabilities.createManual },
                  { key: "uploadPDF", label: "Upload PDF", enabled: permissions.exams.capabilities.uploadPDF },
                  { key: "assignBatches", label: "Assign Batches", enabled: permissions.exams.capabilities.assignBatches },
                  { key: "scheduleExams", label: "Schedule Exams", enabled: permissions.exams.capabilities.scheduleExams },
                ]}
                onCapabilityChange={handleExamsCapabilityChange}
              />

              {/* Master Data - View only */}
              <InstitutePermissionSection
                title="Master Data"
                icon={Database}
                permissions={permissions.masterData}
                onChange={(key, value) => handlePermissionChange("masterData", key, value)}
                showCRUD={false}
              />

              {/* Settings */}
              <InstitutePermissionSection
                title="Settings"
                icon={Settings}
                permissions={permissions.settings}
                onChange={(key, value) => handlePermissionChange("settings", key, value)}
                showCRUD={false}
              />

              {/* Roles Access */}
              <InstitutePermissionSection
                title="Roles & Access"
                icon={Shield}
                permissions={permissions.rolesAccess}
                onChange={(key, value) => handlePermissionChange("rolesAccess", key, value)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 sm:p-6 pt-4 border-t flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid} className="w-full sm:w-auto">
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstituteRoleFormDialog;
