import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Building2, Users, Database, Shield, BookOpen, FileText, FolderOpen } from "lucide-react";
import { SuperAdminRole, SuperAdminRolePermissions, defaultPermissions } from "./types";
import PermissionSection from "./PermissionSection";
import ScopeSelector from "./ScopeSelector";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: SuperAdminRole | null;
  onSave: (role: Omit<SuperAdminRole, "id" | "memberCount" | "createdAt">) => void;
}

const RoleFormDialog = ({ open, onOpenChange, role, onSave }: RoleFormDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<SuperAdminRolePermissions>(defaultPermissions);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setPermissions(role.permissions);
    } else {
      setName("");
      setDescription("");
      setPermissions(defaultPermissions);
    }
  }, [role, open]);

  const handlePermissionChange = (module: keyof SuperAdminRolePermissions, key: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [key]: value,
      },
    }));
  };

  const handleSubmit = () => {
    onSave({
      name,
      description,
      isSystem: role?.isSystem || false,
      permissions,
    });
    onOpenChange(false);
  };

  const isEditing = !!role;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{isEditing ? "Edit Role" : "Create New Role"}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-4 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-name">Role Name *</Label>
                <Input 
                  id="role-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Content Manager - Physics"
                  className="mt-1.5"
                  disabled={role?.isSystem}
                />
              </div>
              
              <div>
                <Label htmlFor="role-desc">Description</Label>
                <Textarea 
                  id="role-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this role's responsibilities"
                  className="mt-1.5 resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* Module Permissions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Module Permissions</h4>
              
              {/* Dashboard */}
              <PermissionSection
                title="Dashboard"
                icon={<LayoutDashboard className="w-4 h-4" />}
                permissions={{ view: permissions.dashboard.view }}
                onChange={(key, value) => handlePermissionChange("dashboard", key, value)}
                showCRUD={false}
                defaultOpen
              />
              
              {/* Institutes */}
              <PermissionSection
                title="Institutes"
                icon={<Building2 className="w-4 h-4" />}
                permissions={permissions.institutes}
                onChange={(key, value) => handlePermissionChange("institutes", key, value)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="tier-mgmt"
                    checked={permissions.institutes.tierManagement}
                    onCheckedChange={(checked) => handlePermissionChange("institutes", "tierManagement", !!checked)}
                  />
                  <Label htmlFor="tier-mgmt" className="text-sm cursor-pointer">Tier Management</Label>
                </div>
              </PermissionSection>
              
              {/* Question Bank */}
              <PermissionSection
                title="Question Bank"
                icon={<BookOpen className="w-4 h-4" />}
                permissions={permissions.questionBank}
                onChange={(key, value) => handlePermissionChange("questionBank", key, value)}
              >
                <div className="space-y-4">
                  <ScopeSelector
                    scope={permissions.questionBank.scope}
                    onChange={(scope) => setPermissions(prev => ({
                      ...prev,
                      questionBank: { ...prev.questionBank, scope },
                    }))}
                  />
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Capabilities</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="qb-manual"
                          checked={permissions.questionBank.capabilities.manual}
                          onCheckedChange={(checked) => setPermissions(prev => ({
                            ...prev,
                            questionBank: { 
                              ...prev.questionBank, 
                              capabilities: { ...prev.questionBank.capabilities, manual: !!checked }
                            },
                          }))}
                        />
                        <Label htmlFor="qb-manual" className="text-sm cursor-pointer">Manual Creation</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="qb-ai"
                          checked={permissions.questionBank.capabilities.aiGeneration}
                          onCheckedChange={(checked) => setPermissions(prev => ({
                            ...prev,
                            questionBank: { 
                              ...prev.questionBank, 
                              capabilities: { ...prev.questionBank.capabilities, aiGeneration: !!checked }
                            },
                          }))}
                        />
                        <Label htmlFor="qb-ai" className="text-sm cursor-pointer">AI Generation</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="qb-pdf"
                          checked={permissions.questionBank.capabilities.pdfUpload}
                          onCheckedChange={(checked) => setPermissions(prev => ({
                            ...prev,
                            questionBank: { 
                              ...prev.questionBank, 
                              capabilities: { ...prev.questionBank.capabilities, pdfUpload: !!checked }
                            },
                          }))}
                        />
                        <Label htmlFor="qb-pdf" className="text-sm cursor-pointer">PDF Upload</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </PermissionSection>
              
              {/* Exams */}
              <PermissionSection
                title="Exams"
                icon={<FileText className="w-4 h-4" />}
                permissions={permissions.exams}
                onChange={(key, value) => handlePermissionChange("exams", key, value)}
              >
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Exam Types</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="exams-grand"
                          checked={permissions.exams.types.grandTests}
                          onCheckedChange={(checked) => setPermissions(prev => ({
                            ...prev,
                            exams: { 
                              ...prev.exams, 
                              types: { ...prev.exams.types, grandTests: !!checked }
                            },
                          }))}
                        />
                        <Label htmlFor="exams-grand" className="text-sm cursor-pointer">Grand Tests</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="exams-pyp"
                          checked={permissions.exams.types.previousYearPapers}
                          onCheckedChange={(checked) => setPermissions(prev => ({
                            ...prev,
                            exams: { 
                              ...prev.exams, 
                              types: { ...prev.exams.types, previousYearPapers: !!checked }
                            },
                          }))}
                        />
                        <Label htmlFor="exams-pyp" className="text-sm cursor-pointer">Previous Year Papers</Label>
                      </div>
                    </div>
                  </div>
                  
                  <ScopeSelector
                    scope={permissions.exams.scope || permissions.questionBank.scope}
                    onChange={(scope) => setPermissions(prev => ({
                      ...prev,
                      exams: { ...prev.exams, scope, scopeInheritFromQuestionBank: false },
                    }))}
                    showInheritOption
                    isInheriting={permissions.exams.scopeInheritFromQuestionBank}
                    onInheritChange={(inherit) => setPermissions(prev => ({
                      ...prev,
                      exams: { ...prev.exams, scopeInheritFromQuestionBank: inherit },
                    }))}
                  />
                </div>
              </PermissionSection>
              
              {/* Content Library */}
              <PermissionSection
                title="Content Library"
                icon={<FolderOpen className="w-4 h-4" />}
                permissions={permissions.contentLibrary}
                onChange={(key, value) => handlePermissionChange("contentLibrary", key, value)}
              >
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Capabilities</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="cl-manual"
                          checked={permissions.contentLibrary.capabilities.manualUpload}
                          onCheckedChange={(checked) => setPermissions(prev => ({
                            ...prev,
                            contentLibrary: { 
                              ...prev.contentLibrary, 
                              capabilities: { ...prev.contentLibrary.capabilities, manualUpload: !!checked }
                            },
                          }))}
                        />
                        <Label htmlFor="cl-manual" className="text-sm cursor-pointer">Manual Upload</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="cl-ai"
                          checked={permissions.contentLibrary.capabilities.aiGeneration}
                          onCheckedChange={(checked) => setPermissions(prev => ({
                            ...prev,
                            contentLibrary: { 
                              ...prev.contentLibrary, 
                              capabilities: { ...prev.contentLibrary.capabilities, aiGeneration: !!checked }
                            },
                          }))}
                        />
                        <Label htmlFor="cl-ai" className="text-sm cursor-pointer">AI Generation</Label>
                      </div>
                    </div>
                  </div>
                  
                  <ScopeSelector
                    scope={permissions.contentLibrary.scope || permissions.questionBank.scope}
                    onChange={(scope) => setPermissions(prev => ({
                      ...prev,
                      contentLibrary: { ...prev.contentLibrary, scope, scopeInheritFromQuestionBank: false },
                    }))}
                    showInheritOption
                    isInheriting={permissions.contentLibrary.scopeInheritFromQuestionBank}
                    onInheritChange={(inherit) => setPermissions(prev => ({
                      ...prev,
                      contentLibrary: { ...prev.contentLibrary, scopeInheritFromQuestionBank: inherit },
                    }))}
                  />
                </div>
              </PermissionSection>
              
              {/* Master Data */}
              <PermissionSection
                title="Master Data"
                icon={<Database className="w-4 h-4" />}
                permissions={permissions.masterData}
                onChange={(key, value) => handlePermissionChange("masterData", key, value)}
              />
              
              {/* Users */}
              <PermissionSection
                title="Users (Direct Users)"
                icon={<Users className="w-4 h-4" />}
                permissions={permissions.users}
                onChange={(key, value) => handlePermissionChange("users", key, value)}
              />
              
              {/* Roles & Access */}
              <PermissionSection
                title="Roles & Access"
                icon={<Shield className="w-4 h-4" />}
                permissions={permissions.rolesAccess}
                onChange={(key, value) => handlePermissionChange("rolesAccess", key, value)}
              />
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormDialog;
