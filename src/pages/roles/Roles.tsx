import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  RoleCard, 
  RoleFormDialog, 
  TeamMemberTable, 
  AddMemberDialog,
  SuperAdminRole,
  SuperAdminTeamMember,
} from "@/components/roles";
import { superAdminRoles, superAdminTeamMembers } from "@/data/rolesData";

const Roles = () => {
  const [roles, setRoles] = useState<SuperAdminRole[]>(superAdminRoles);
  const [members, setMembers] = useState<SuperAdminTeamMember[]>(superAdminTeamMembers);
  const [activeTab, setActiveTab] = useState("roles");
  
  // Role dialogs
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<SuperAdminRole | null>(null);
  
  // Member dialogs
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<SuperAdminTeamMember | null>(null);

  // Role handlers
  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleDialogOpen(true);
  };

  const handleEditRole = (role: SuperAdminRole) => {
    setEditingRole(role);
    setRoleDialogOpen(true);
  };

  const handleDeleteRole = (role: SuperAdminRole) => {
    if (role.isSystem) {
      toast.error("System roles cannot be deleted");
      return;
    }
    setRoles(prev => prev.filter(r => r.id !== role.id));
    toast.success(`Role "${role.name}" deleted`);
  };

  const handleSaveRole = (roleData: Omit<SuperAdminRole, "id" | "memberCount" | "createdAt">) => {
    if (editingRole) {
      setRoles(prev => prev.map(r => 
        r.id === editingRole.id 
          ? { ...r, ...roleData }
          : r
      ));
      toast.success(`Role "${roleData.name}" updated`);
    } else {
      const newRole: SuperAdminRole = {
        ...roleData,
        id: Date.now().toString(),
        memberCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRoles(prev => [...prev, newRole]);
      toast.success(`Role "${roleData.name}" created`);
    }
  };

  // Member handlers
  const handleAddMember = () => {
    setEditingMember(null);
    setMemberDialogOpen(true);
  };

  const handleEditMember = (member: SuperAdminTeamMember) => {
    setEditingMember(member);
    setMemberDialogOpen(true);
  };

  const handleDeleteMember = (member: SuperAdminTeamMember) => {
    setMembers(prev => prev.filter(m => m.id !== member.id));
    toast.success(`Member "${member.name}" removed`);
  };

  const handleSaveMember = (memberData: Omit<SuperAdminTeamMember, "id" | "createdAt">) => {
    if (editingMember) {
      setMembers(prev => prev.map(m => 
        m.id === editingMember.id 
          ? { ...m, ...memberData }
          : m
      ));
      toast.success(`Member "${memberData.name}" updated`);
    } else {
      const newMember: SuperAdminTeamMember = {
        ...memberData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setMembers(prev => [...prev, newMember]);
      
      // Update role member count
      setRoles(prev => prev.map(r => 
        r.id === memberData.roleTypeId 
          ? { ...r, memberCount: r.memberCount + 1 }
          : r
      ));
      toast.success(`Member "${memberData.name}" added`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Roles & Access"
        description="Manage role types and team members for the SuperAdmin portal"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" }, 
          { label: "Roles & Access" }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 h-9 sm:h-10">
            <TabsTrigger value="roles" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              Role Types
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              Team Members
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "roles" ? (
            <Button className="gradient-button gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm" onClick={handleCreateRole}>
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Create Role
            </Button>
          ) : (
            <Button className="gradient-button gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm" onClick={handleAddMember}>
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add Member
            </Button>
          )}
        </div>

        {/* Role Types Tab */}
        <TabsContent value="roles" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {roles.map((role) => (
              <RoleCard 
                key={role.id} 
                role={role} 
                onEdit={handleEditRole}
                onDelete={handleDeleteRole}
              />
            ))}
          </div>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="members" className="mt-0">
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
            <TeamMemberTable 
              members={members}
              roles={roles}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Form Dialog */}
      <RoleFormDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        role={editingRole}
        onSave={handleSaveRole}
      />

      {/* Add Member Dialog */}
      <AddMemberDialog
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
        member={editingMember}
        roles={roles}
        onSave={handleSaveMember}
      />
    </div>
  );
};

export default Roles;
