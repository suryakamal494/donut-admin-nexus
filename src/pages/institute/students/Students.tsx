import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  MoreVertical,
  Users,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Key,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PageHeader } from "@/components/ui/page-header";
import { students, batches } from "@/data/instituteData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Students = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchIdFilter = searchParams.get("batchId");

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBatches, setExpandedBatches] = useState<string[]>(
    batchIdFilter ? [batchIdFilter] : batches.slice(0, 2).map((b) => b.id)
  );

  // Group students by batch
  const studentsByBatch = batches.reduce((acc, batch) => {
    const batchStudents = students.filter((s) => s.batchId === batch.id);
    if (batchStudents.length > 0 || !batchIdFilter) {
      acc[batch.id] = {
        batch,
        students: batchStudents,
      };
    }
    return acc;
  }, {} as Record<string, { batch: typeof batches[0]; students: typeof students }>);

  const toggleBatch = (batchId: string) => {
    setExpandedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const filteredStudentsByBatch = Object.entries(studentsByBatch).reduce(
    (acc, [batchId, data]) => {
      if (batchIdFilter && batchId !== batchIdFilter) return acc;

      const filteredStudents = data.students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNumber.includes(searchQuery)
      );

      if (filteredStudents.length > 0 || !searchQuery) {
        acc[batchId] = { ...data, students: filteredStudents };
      }
      return acc;
    },
    {} as typeof studentsByBatch
  );

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;

  const handleResetPassword = (studentName: string) => {
    toast.success(`Password reset for ${studentName}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Students"
        description="Manage students organized by batches."
        actions={
          <Button
            onClick={() => navigate("/institute/students/add")}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Students</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold text-foreground">{totalStudents}</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold text-foreground">{activeStudents}</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold text-foreground">{batches.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Batches</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, username, or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/institute/students/bulk-upload")}
          className="shrink-0"
        >
          Bulk Upload
        </Button>
      </div>

      {/* Students grouped by Batch */}
      <div className="space-y-4">
        {Object.entries(filteredStudentsByBatch).map(([batchId, { batch, students: batchStudents }]) => (
          <Card key={batchId}>
            <Collapsible
              open={expandedBatches.includes(batchId)}
              onOpenChange={() => toggleBatch(batchId)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3 md:py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-6 w-6 md:h-8 md:w-8 rounded-lg flex items-center justify-center transition-transform shrink-0",
                          expandedBatches.includes(batchId) && "rotate-90"
                        )}
                      >
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm md:text-base truncate">
                          {batch.className} - {batch.name}
                        </CardTitle>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {batchStudents.length} students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
                        {batch.academicYear}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/institute/students/add?batchId=${batchId}`);
                        }}
                        className="h-7 md:h-8 px-2 md:px-3"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {batchStudents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table className="min-w-[500px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[150px]">Student</TableHead>
                            <TableHead className="min-w-[80px]">Roll No.</TableHead>
                            <TableHead className="min-w-[100px] hidden sm:table-cell">Username</TableHead>
                            <TableHead className="min-w-[70px]">Status</TableHead>
                            <TableHead className="text-right w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batchStudents.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="flex items-center gap-2 md:gap-3">
                                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm font-medium text-primary shrink-0">
                                    {student.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-medium text-sm truncate block">{student.name}</span>
                                    <span className="text-xs text-muted-foreground sm:hidden">@{student.username}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{student.rollNumber}</TableCell>
                              <TableCell className="text-muted-foreground hidden sm:table-cell text-sm">
                                @{student.username}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={student.status === "active" ? "default" : "secondary"}
                                  className={student.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs" : "text-xs"}
                                >
                                  {student.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleResetPassword(student.name)}>
                                      <Key className="h-4 w-4 mr-2" />Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" />Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">
                        No students in this batch yet
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/institute/students/add?batchId=${batchId}`)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Students
                      </Button>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}

        {Object.keys(filteredStudentsByBatch).length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-16 flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Add students to your batches to get started"}
              </p>
              <Button onClick={() => navigate("/institute/students/add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Students
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Students;
