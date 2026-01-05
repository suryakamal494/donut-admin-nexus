import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PermissionSectionProps {
  title: string;
  icon: React.ReactNode;
  permissions: {
    view: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  onChange: (key: string, value: boolean) => void;
  showCRUD?: boolean;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

const PermissionSection = ({
  title,
  icon,
  permissions,
  onChange,
  showCRUD = true,
  children,
  defaultOpen = false,
}: PermissionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasAnyPermission = permissions.view || permissions.create || permissions.edit || permissions.delete;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn(
        "border rounded-xl transition-colors",
        hasAnyPermission ? "border-primary/30 bg-primary/5" : "border-border"
      )}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                hasAnyPermission ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {icon}
              </div>
              <span className="font-medium">{title}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            {/* CRUD Permissions */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id={`${title}-view`}
                  checked={permissions.view}
                  onCheckedChange={(checked) => onChange("view", !!checked)}
                />
                <Label htmlFor={`${title}-view`} className="text-sm cursor-pointer">View</Label>
              </div>
              
              {showCRUD && (
                <>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`${title}-create`}
                      checked={permissions.create}
                      onCheckedChange={(checked) => onChange("create", !!checked)}
                      disabled={!permissions.view}
                    />
                    <Label htmlFor={`${title}-create`} className={cn("text-sm cursor-pointer", !permissions.view && "opacity-50")}>Create</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`${title}-edit`}
                      checked={permissions.edit}
                      onCheckedChange={(checked) => onChange("edit", !!checked)}
                      disabled={!permissions.view}
                    />
                    <Label htmlFor={`${title}-edit`} className={cn("text-sm cursor-pointer", !permissions.view && "opacity-50")}>Edit</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`${title}-delete`}
                      checked={permissions.delete}
                      onCheckedChange={(checked) => onChange("delete", !!checked)}
                      disabled={!permissions.view}
                    />
                    <Label htmlFor={`${title}-delete`} className={cn("text-sm cursor-pointer", !permissions.view && "opacity-50")}>Delete</Label>
                  </div>
                </>
              )}
            </div>
            
            {/* Additional Options (Scope, Capabilities, etc.) */}
            {children && permissions.view && (
              <div className="pt-3 border-t border-border/50">
                {children}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default PermissionSection;
