import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  BookOpen,
  Users,
  Edit,
  Trash2,
  Key,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PageHeader } from "@/components/ui/page-header";
import { SubjectBadge } from "@/components/subject";
import { teachers, availableSubjects } from "@/data/instituteData";
import { toast } from "sonner";

const Teachers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const getSubjectName = useCallback((subjectId: string) => {
    return availableSubjects.find((s) => s.id === subjectId)?.name || subjectId;
  }, []);

  const filteredTeachers = useMemo(() => 
    teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subjects.some((s) =>
          getSubjectName(s).toLowerCase().includes(searchQuery.toLowerCase())
        )
    ), [searchQuery, getSubjectName]);

  // Computed stats
  const stats = useMemo(() => ({
    totalTeachers: teachers.length,
    uniqueSubjects: new Set(teachers.flatMap((t) => t.subjects)).size,
    activeTeachers: teachers.filter((t) => t.status === "active").length,
  }), []);

  const handleResetPassword = useCallback((teacherName: string) => {
    toast.success(`Password reset email sent to ${teacherName}`);
  }, []);

  const handleDeactivate = useCallback((teacherName: string) => {
    toast.success(`${teacherName} has been deactivated`);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Teachers"
        description="Manage teachers and their batch assignments."
        actions={
          <Button
            onClick={() => navigate("/institute/teachers/create")}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Teacher</span>
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
              <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalTeachers}</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {stats.uniqueSubjects}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Subjects</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {stats.activeTeachers}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/institute/teachers/bulk-upload")}
          className="shrink-0"
        >
          Bulk Upload
        </Button>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Teacher</TableHead>
                  <TableHead className="min-w-[160px] hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="min-w-[120px]">Subjects</TableHead>
                  <TableHead className="min-w-[80px]">Batches</TableHead>
                  <TableHead className="min-w-[70px]">Status</TableHead>
                  <TableHead className="text-right w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm font-semibold text-primary shrink-0">
                          {teacher.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground truncate lg:hidden">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{teacher.mobile}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {teacher.subjects.slice(0, 2).map((subjectId) => (
                          <SubjectBadge key={subjectId} subject={getSubjectName(subjectId)} size="sm" />
                        ))}
                        {teacher.subjects.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{teacher.subjects.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-sm">
                            <span className="font-medium">{teacher.batches.length}</span>
                            <ChevronDown className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                          <p className="text-sm font-medium mb-2">Assigned Batches</p>
                          <div className="space-y-2 max-h-[180px] overflow-y-auto">
                            {teacher.batches.map((batch, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                <span className="text-sm truncate">{batch.batchName}</span>
                                <Badge variant="outline" className="text-xs shrink-0 ml-2">{batch.subject}</Badge>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={teacher.status === "active" ? "default" : "secondary"}
                        className={teacher.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/institute/teachers/${teacher.id}/edit`)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(teacher.name)}>
                            <Key className="h-4 w-4 mr-2" />Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivate(teacher.name)}>
                            <Trash2 className="h-4 w-4 mr-2" />Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTeachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No teachers found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Teachers;
