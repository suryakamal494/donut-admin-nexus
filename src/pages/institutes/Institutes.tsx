import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, CreditCard, Shield, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlanBadge } from "@/components/ui/plan-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockInstitutes } from "@/data/mockData";

const Institutes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInstitutes = mockInstitutes.filter((institute) => {
    const matchesSearch = institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institute.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "all" || institute.plan === planFilter;
    const matchesStatus = statusFilter === "all" || institute.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="All Institutes"
        description="Manage all registered institutes and their subscriptions"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Institutes" }]}
        actions={
          <Link to="/superadmin/institutes/create">
            <Button className="gradient-button gap-2">
              <Plus className="w-4 h-4" />
              Add Institute
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search institutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
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
              <SelectTrigger className="w-40">
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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Institute</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Students</TableHead>
              <TableHead className="text-center">Teachers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstitutes.map((institute) => (
              <TableRow key={institute.id} className="hover:bg-muted/20">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{institute.name}</p>
                    <p className="text-sm text-muted-foreground">{institute.code}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{institute.adminName}</p>
                    <p className="text-xs text-muted-foreground">{institute.adminEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <PlanBadge plan={institute.plan} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={institute.status} />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>{institute.students.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{institute.teachers}</span>
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
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem><Shield className="w-4 h-4 mr-2" />Permissions</DropdownMenuItem>
                      <DropdownMenuItem><CreditCard className="w-4 h-4 mr-2" />Billing</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Institutes;