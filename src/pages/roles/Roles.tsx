import { Plus, Shield, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { roleTypes } from "@/data/mockData";

const permissions = [
  "View Dashboard", "Manage Institutes", "Manage Users", "Manage Content",
  "Create Questions", "Create Exams", "View Reports", "Manage Settings",
];

const Roles = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Roles & Access"
        description="Manage role types and permissions"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Roles" }]}
        actions={<Button className="gradient-button gap-2"><Plus className="w-4 h-4" />Create Role</Button>}
      />

      {/* Role Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roleTypes.map((role) => (
          <div key={role.id} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <h3 className="font-semibold text-lg">{role.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Level {role.level}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <h3 className="text-lg font-semibold mb-6">Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Permission</th>
                {roleTypes.map((role) => (
                  <th key={role.id} className="text-center py-3 px-4 font-medium">{role.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, index) => (
                <tr key={permission} className="border-b border-border/50">
                  <td className="py-3 px-4">{permission}</td>
                  {roleTypes.map((role, roleIndex) => (
                    <td key={role.id} className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        defaultChecked={roleIndex <= index % 3}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Roles;