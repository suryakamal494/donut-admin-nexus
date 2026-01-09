import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Plus, Search, Shield, Users } from "lucide-react";
import {
  InstituteRoleCard,
  InstituteRoleFormDialog,
  InstituteStaffTable,
  AddStaffDialog,
  InstituteRole,
  InstituteStaffMember,
} from "@/components/institute/roles";
import { instituteRoles, instituteStaffMembers } from "@/data/instituteRolesData";
import { toast } from "@/hooks/use-toast";

const InstituteRoles = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState<InstituteRole[]>(instituteRoles);
  const [members, setMembers] = useState<InstituteStaffMember[]>(instituteStaffMembers);
  const [searchQuery, setSearchQuery] = useState("");

  // Role Dialog State
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<InstituteRole | null>(null);

  // Staff Dialog State
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<InstituteStaffMember | null>(null);

  const handleCreateRole = useCallback(() => {
    setEditingRole(null);
    setRoleDialogOpen(true);
  }, []);

  const handleEditRole = useCallback((role: InstituteRole) => {
    setEditingRole(role);
    setRoleDialogOpen(true);
  }, []);

  const handleDeleteRole = useCallback((role: InstituteRole) => {
    if (role.memberCount > 0) {
      toast({
        title: "Cannot delete role",
        description: `This role has ${role.memberCount} members. Reassign them first.`,
        variant: "destructive",
      });
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    toast({ title: "Role deleted", description: `${role.name} has been removed.` });
  }, [toast]);

  const handleSaveRole = useCallback((roleData: Omit<InstituteRole, "id" | "memberCount" | "createdAt">) => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id ? { ...r, ...roleData } : r
        )
      );
      toast({ title: "Role updated", description: `${roleData.name} has been updated.` });
    } else {
      const newRole: InstituteRole = {
        ...roleData,
        id: `inst-role-${Date.now()}`,
        memberCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRoles((prev) => [...prev, newRole]);
      toast({ title: "Role created", description: `${roleData.name} has been created.` });
    }
  }, [editingRole, toast]);

  const handleAddStaff = useCallback(() => {
    setEditingStaff(null);
    setStaffDialogOpen(true);
  }, []);

  const handleEditStaff = useCallback((member: InstituteStaffMember) => {
    setEditingStaff(member);
    setStaffDialogOpen(true);
  }, []);

  const handleDeleteStaff = useCallback((member: InstituteStaffMember) => {
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    // Update role member count
    setRoles((prev) =>
      prev.map((r) =>
        r.id === member.roleTypeId ? { ...r, memberCount: r.memberCount - 1 } : r
      )
    );
    toast({ title: "Staff removed", description: `${member.name} has been removed.` });
  }, [toast]);

  const handleToggleStaffStatus = useCallback((member: InstituteStaffMember) => {
    const newStatus = member.status === "active" ? "inactive" : "active";
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id ? { ...m, status: newStatus } : m
      )
    );
    toast({
      title: `Staff ${newStatus === "active" ? "activated" : "deactivated"}`,
      description: `${member.name} is now ${newStatus}.`,
    });
  }, [toast]);

  const handleSaveStaff = useCallback((staffData: Omit<InstituteStaffMember, "id" | "createdAt">) => {
    if (editingStaff) {
      const oldRoleId = editingStaff.roleTypeId;
      const newRoleId = staffData.roleTypeId;

      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingStaff.id ? { ...m, ...staffData } : m
        )
      );

      // Update role member counts if role changed
      if (oldRoleId !== newRoleId) {
        setRoles((prev) =>
          prev.map((r) => {
            if (r.id === oldRoleId) return { ...r, memberCount: r.memberCount - 1 };
            if (r.id === newRoleId) return { ...r, memberCount: r.memberCount + 1 };
            return r;
          })
        );
      }
      toast({ title: "Staff updated", description: `${staffData.name} has been updated.` });
    } else {
      const newMember: InstituteStaffMember = {
        ...staffData,
        id: `staff-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setMembers((prev) => [...prev, newMember]);
      // Update role member count
      setRoles((prev) =>
        prev.map((r) =>
          r.id === staffData.roleTypeId ? { ...r, memberCount: r.memberCount + 1 } : r
        )
      );
      toast({ title: "Staff added", description: `${staffData.name} has been added.` });
    }
  }, [editingStaff, toast]);

  // Filtering
  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Roles & Access"
        description="Manage role types and assign staff members"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Roles & Access" },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Controls Row - Stack on mobile */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Tabs - full width on mobile */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="h-10 p-1 w-full sm:w-auto inline-flex">
              <TabsTrigger value="roles" className="gap-1.5 sm:gap-2 flex-1 sm:flex-none px-3 sm:px-4">
                <Shield className="w-4 h-4" />
                <span className="hidden xs:inline">Role Types</span>
                <span className="xs:hidden">Roles</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="gap-1.5 sm:gap-2 flex-1 sm:flex-none px-3 sm:px-4">
                <Users className="w-4 h-4" />
                <span className="hidden xs:inline">Staff Members</span>
                <span className="xs:hidden">Staff</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search + Button - stack on mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === "roles" ? "Search roles..." : "Search staff..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            {activeTab === "roles" ? (
              <Button onClick={handleCreateRole} className="gap-2 h-9 w-full sm:w-auto shrink-0">
                <Plus className="w-4 h-4" />
                <span>New Role</span>
              </Button>
            ) : (
              <Button onClick={handleAddStaff} className="gap-2 h-9 w-full sm:w-auto shrink-0">
                <Plus className="w-4 h-4" />
                <span>Add Staff</span>
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="roles" className="mt-4 sm:mt-6">
          {filteredRoles.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
              <Shield className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? "No roles match your search" : "No roles found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredRoles.map((role) => (
                <InstituteRoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="staff" className="mt-4 sm:mt-6">
          <InstituteStaffTable
            members={filteredMembers}
            roles={roles}
            onEdit={handleEditStaff}
            onDelete={handleDeleteStaff}
            onToggleStatus={handleToggleStaffStatus}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <InstituteRoleFormDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        role={editingRole}
        onSave={handleSaveRole}
      />

      <AddStaffDialog
        open={staffDialogOpen}
        onOpenChange={setStaffDialogOpen}
        member={editingStaff}
        roles={roles}
        onSave={handleSaveStaff}
      />
    </div>
  );
};

export default InstituteRoles;
