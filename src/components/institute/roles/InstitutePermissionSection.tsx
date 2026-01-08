import { ReactNode, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PermissionSectionProps {
  title: string;
  icon: React.ElementType;
  permissions: {
    view: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  onChange: (key: string, value: boolean) => void;
  showCRUD?: boolean;
  defaultOpen?: boolean;
  children?: ReactNode;
  capabilities?: {
    key: string;
    label: string;
    enabled: boolean;
  }[];
  onCapabilityChange?: (key: string, value: boolean) => void;
}

const InstitutePermissionSection = ({
  title,
  icon: Icon,
  permissions,
  onChange,
  showCRUD = true,
  defaultOpen = false,
  children,
  capabilities,
  onCapabilityChange,
}: PermissionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{title}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2">
          {/* Base Permissions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={permissions.view}
                onCheckedChange={(checked) => onChange("view", !!checked)}
              />
              <span className="text-sm">View</span>
            </label>
            {showCRUD && (
              <>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={permissions.create}
                    onCheckedChange={(checked) => onChange("create", !!checked)}
                    disabled={!permissions.view}
                  />
                  <span className={cn("text-sm", !permissions.view && "text-muted-foreground")}>
                    Create
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={permissions.edit}
                    onCheckedChange={(checked) => onChange("edit", !!checked)}
                    disabled={!permissions.view}
                  />
                  <span className={cn("text-sm", !permissions.view && "text-muted-foreground")}>
                    Edit
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={permissions.delete}
                    onCheckedChange={(checked) => onChange("delete", !!checked)}
                    disabled={!permissions.view}
                  />
                  <span className={cn("text-sm", !permissions.view && "text-muted-foreground")}>
                    Delete
                  </span>
                </label>
              </>
            )}
          </div>

          {/* Capabilities */}
          {capabilities && capabilities.length > 0 && permissions.view && (
            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-2">Capabilities:</p>
              <div className="grid grid-cols-2 gap-2">
                {capabilities.map((cap) => (
                  <label key={cap.key} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={cap.enabled}
                      onCheckedChange={(checked) => onCapabilityChange?.(cap.key, !!checked)}
                    />
                    <span className="text-sm">{cap.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Additional Children */}
          {children && permissions.view && (
            <div className="pt-3 border-t">{children}</div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default InstitutePermissionSection;
