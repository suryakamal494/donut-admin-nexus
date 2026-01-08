import { useState } from "react";
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

  // Role Handlers
  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleDialogOpen(true);
  };

  const handleEditRole = (role: InstituteRole) => {
    setEditingRole(role);
    setRoleDialogOpen(true);
  };

  const handleDeleteRole = (role: InstituteRole) => {
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
  };

  const handleSaveRole = (roleData: Omit<InstituteRole, "id" | "memberCount" | "createdAt">) => {
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
  };

  // Staff Handlers
  const handleAddStaff = () => {
    setEditingStaff(null);
    setStaffDialogOpen(true);
  };

  const handleEditStaff = (member: InstituteStaffMember) => {
    setEditingStaff(member);
    setStaffDialogOpen(true);
  };

  const handleDeleteStaff = (member: InstituteStaffMember) => {
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    // Update role member count
    setRoles((prev) =>
      prev.map((r) =>
        r.id === member.roleTypeId ? { ...r, memberCount: r.memberCount - 1 } : r
      )
    );
    toast({ title: "Staff removed", description: `${member.name} has been removed.` });
  };

  const handleToggleStaffStatus = (member: InstituteStaffMember) => {
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
  };

  const handleSaveStaff = (staffData: Omit<InstituteStaffMember, "id" | "createdAt">) => {
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
  };

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
    <div className="space-y-6">
      <PageHeader
        title="Roles & Access"
        description="Manage role types and assign staff members"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="w-4 h-4" />
              Role Types
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <Users className="w-4 h-4" />
              Staff Members
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {activeTab === "roles" ? (
              <Button onClick={handleCreateRole} className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Role</span>
              </Button>
            ) : (
              <Button onClick={handleAddStaff} className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Staff</span>
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="roles" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <InstituteRoleCard
                key={role.id}
                role={role}
                onEdit={handleEditRole}
                onDelete={handleDeleteRole}
              />
            ))}
          </div>
          {filteredRoles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No roles found matching your search.
            </div>
          )}
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
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
