import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, Users, MoreVertical, Edit, Trash2, Lock } from "lucide-react";
import { InstituteRole } from "./types";

interface InstituteRoleCardProps {
  role: InstituteRole;
  onEdit: (role: InstituteRole) => void;
  onDelete: (role: InstituteRole) => void;
}

const InstituteRoleCard = memo(function InstituteRoleCard({ role, onEdit, onDelete }: InstituteRoleCardProps) {
  const getActiveModules = () => {
    const modules: string[] = [];
    const p = role.permissions;
    
    if (p.batches.view) modules.push("Batches");
    if (p.teachers.view) modules.push("Teachers");
    if (p.students.view) modules.push("Students");
    if (p.timetable.view) modules.push("Timetable");
    if (p.questionBank.view) modules.push("Questions");
    if (p.contentLibrary.view) modules.push("Content");
    if (p.exams.view) modules.push("Exams");
    if (p.settings.view) modules.push("Settings");
    if (p.rolesAccess.view) modules.push("Roles");
    
    return modules;
  };

  const activeModules = getActiveModules();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-semibold truncate">{role.name}</CardTitle>
                {role.isSystem && (
                  <Badge variant="secondary" className="text-[10px] gap-1 shrink-0">
                    <Lock className="w-3 h-3" />
                    System
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{role.description}</p>
            </div>
          </div>
          {!role.isSystem && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(role)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Role
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(role)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Member Count */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {role.memberCount} {role.memberCount === 1 ? "member" : "members"}
          </span>
        </div>

        {/* Active Modules */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Access to:</p>
          <div className="flex flex-wrap gap-1.5">
            {activeModules.slice(0, 4).map((module) => (
              <Badge key={module} variant="outline" className="text-[10px] font-normal h-5 px-1.5">
                {module}
              </Badge>
            ))}
            {activeModules.length > 4 && (
              <Badge variant="outline" className="text-[10px] font-normal h-5 px-1.5">
                +{activeModules.length - 4}
              </Badge>
            )}
            {activeModules.length === 0 && (
              <span className="text-xs text-muted-foreground">No modules assigned</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default InstituteRoleCard;
