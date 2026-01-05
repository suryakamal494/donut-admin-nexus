import { Edit, Trash2, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SuperAdminTeamMember, SuperAdminRole } from "./types";
import { useState } from "react";

interface TeamMemberTableProps {
  members: SuperAdminTeamMember[];
  roles: SuperAdminRole[];
  onEdit: (member: SuperAdminTeamMember) => void;
  onDelete: (member: SuperAdminTeamMember) => void;
}

const TeamMemberTable = ({ members, roles, onEdit, onDelete }: TeamMemberTableProps) => {
  const [search, setSearch] = useState("");

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || "Unknown";
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                <th className="text-left py-3 px-4 font-medium text-sm hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Role Type</th>
                <th className="text-left py-3 px-4 font-medium text-sm hidden md:table-cell">Status</th>
                <th className="text-right py-3 px-4 font-medium text-sm w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    No team members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground sm:hidden">{member.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{member.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{getRoleName(member.roleTypeId)}</Badge>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge variant={member.status === "active" ? "default" : "outline"}>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(member)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(member)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberTable;
