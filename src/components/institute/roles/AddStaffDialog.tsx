import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { InstituteStaffMember, InstituteRole } from "./types";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: InstituteStaffMember | null;
  roles: InstituteRole[];
  onSave: (member: Omit<InstituteStaffMember, "id" | "createdAt">) => void;
}

const AddStaffDialog = ({ open, onOpenChange, member, roles, onSave }: AddStaffDialogProps) => {
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

  const selectedRole = roles.find((r) => r.id === roleTypeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="staff-name">Full Name *</Label>
            <Input
              id="staff-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mrs. Sunita Sharma"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="staff-email">Email *</Label>
            <Input
              id="staff-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., sunita@school.edu"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="staff-mobile">Mobile</Label>
            <Input
              id="staff-mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g., 9876543210"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="staff-role">Role Type *</Label>
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

          {selectedRole && (
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="w-4 h-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>{selectedRole.name}:</strong> {selectedRole.description}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid} className="w-full sm:w-auto">
            {isEditing ? "Save Changes" : "Add Staff"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
