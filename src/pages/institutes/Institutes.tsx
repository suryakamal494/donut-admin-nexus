import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, CreditCard, Shield, Users, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlanBadge } from "@/components/ui/plan-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockInstitutes, Institute } from "@/data/mockData";
import { InstituteEditDialog } from "@/components/institutes/InstituteEditDialog";
import { AssignCurriculumCourseDialog } from "@/components/institutes/AssignCurriculumCourseDialog";
import { toast } from "sonner";

const Institutes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);

  const filteredInstitutes = mockInstitutes.filter((institute) => {
    const matchesSearch = institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institute.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "all" || institute.plan === planFilter;
    const matchesStatus = statusFilter === "all" || institute.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleViewDetails = (institute: Institute) => {
    navigate(`/superadmin/institutes/${institute.id}`);
  };

  const handleEdit = (institute: Institute) => {
    navigate(`/superadmin/institutes/${institute.id}/edit`);
  };

  const handleAssign = (institute: Institute) => {
    setSelectedInstitute(institute);
    setAssignDialogOpen(true);
  };

  const handleBilling = (institute: Institute) => {
    toast.info(`Billing management for ${institute.name} coming soon`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="All Institutes"
        description="Manage all registered institutes and their subscriptions"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Institutes" }]}
        actions={
          <Link to="/superadmin/institutes/create">
            <Button size="sm" className="gradient-button gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add Institute</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-card rounded-2xl p-3 sm:p-4 shadow-soft border border-border/50">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search institutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 sm:h-10 text-sm"
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="flex-1 sm:w-32 md:w-40 h-9 text-xs sm:text-sm">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 sm:w-32 md:w-40 h-9 text-xs sm:text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs sm:text-sm">Institute</TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Admin</TableHead>
                <TableHead className="text-xs sm:text-sm">Plan</TableHead>
                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                <TableHead className="text-center hidden md:table-cell text-xs sm:text-sm">Students</TableHead>
                <TableHead className="text-center hidden md:table-cell text-xs sm:text-sm">Teachers</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutes.map((institute) => (
                <TableRow key={institute.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground text-xs sm:text-sm">{institute.name}</p>
                      <p className="text-[10px] sm:text-sm text-muted-foreground">{institute.code}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div>
                      <p className="text-xs sm:text-sm font-medium">{institute.adminName}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{institute.adminEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PlanBadge plan={institute.plan} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={institute.status} />
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm">{institute.students.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm">{institute.teachers}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(institute)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(institute)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAssign(institute)}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Assign Curriculum/Courses
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBilling(institute)}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Billing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      {selectedInstitute && (
        <>
          <InstituteEditDialog 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
            institute={selectedInstitute}
          />
          <AssignCurriculumCourseDialog
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            instituteId={selectedInstitute.id}
            currentCurriculums={[]} // Would come from DB in real app
            currentCourses={[]}
          />
        </>
      )}
    </div>
  );
};

export default Institutes;
