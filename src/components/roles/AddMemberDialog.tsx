import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { SuperAdminTeamMember, SuperAdminRole } from "./types";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: SuperAdminTeamMember | null;
  roles: SuperAdminRole[];
  onSave: (member: Omit<SuperAdminTeamMember, "id" | "createdAt">) => void;
}

const AddMemberDialog = ({ open, onOpenChange, member, roles, onSave }: AddMemberDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [roleTypeId, setRoleTypeId] = useState("");

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setMobile(member.mobile || "");
      setRoleTypeId(member.roleTypeId);
    } else {
      setName("");
      setEmail("");
      setMobile("");
      setRoleTypeId("");
    }
  }, [member, open]);

  const handleSubmit = () => {
    onSave({
      name,
      email,
      mobile: mobile || undefined,
      roleTypeId,
      status: member?.status || "active",
    });
    onOpenChange(false);
  };

  const isEditing = !!member;
  const isValid = name.trim() && email.trim() && roleTypeId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="member-name">Full Name *</Label>
            <Input 
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dr. Rajesh Kumar"
              className="mt-1.5"
            />
          </div>
          
          <div>
            <Label htmlFor="member-email">Email *</Label>
            <Input 
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., rajesh@donut.ai"
              className="mt-1.5"
            />
          </div>
          
          <div>
            <Label htmlFor="member-mobile">Mobile</Label>
            <Input 
              id="member-mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g., 9876543210"
              className="mt-1.5"
            />
          </div>
          
          <div>
            <Label htmlFor="member-role">Role Type *</Label>
            <Select value={roleTypeId} onValueChange={setRoleTypeId}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select role type..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="w-4 h-4 text-primary" />
            <AlertDescription className="text-sm">
              This user will have access to the SuperAdmin portal with permissions defined in the selected role type.
            </AlertDescription>
          </Alert>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {isEditing ? "Save Changes" : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
