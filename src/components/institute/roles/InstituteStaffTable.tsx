import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Edit, Trash2, UserX, UserCheck, Users } from "lucide-react";
import { InstituteStaffMember, InstituteRole } from "./types";

interface InstituteStaffTableProps {
  members: InstituteStaffMember[];
  roles: InstituteRole[];
  onEdit: (member: InstituteStaffMember) => void;
  onDelete: (member: InstituteStaffMember) => void;
  onToggleStatus: (member: InstituteStaffMember) => void;
}

const InstituteStaffTable = ({ members, roles, onEdit, onDelete, onToggleStatus }: InstituteStaffTableProps) => {
  const getRoleName = (roleTypeId: string) => {
    const role = roles.find((r) => r.id === roleTypeId);
    return role?.name || "Unknown Role";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
        <Users className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No staff members found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table className="min-w-[500px]">
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[200px]">Staff Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="w-[90px]">Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="group">
              <TableCell>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal text-xs whitespace-nowrap">
                  {getRoleName(member.roleTypeId)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-sm text-muted-foreground">
                  {member.mobile || "—"}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={member.status === "active" ? "default" : "outline"}
                  className={`text-xs ${
                    member.status === "active"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "text-muted-foreground"
                  }`}
                >
                  {member.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit(member)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(member)}>
                      {member.status === "active" ? (
                        <>
                          <UserX className="w-4 h-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(member)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstituteStaffTable;
