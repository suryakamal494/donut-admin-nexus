import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, GraduationCap, BookOpen, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { batches, availableClasses } from "@/data/instituteData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Batches = () => {
  const navigate = useNavigate();

  // Group batches by class
  const batchesByClass = availableClasses.reduce((acc, cls) => {
    const classBatches = batches.filter((b) => b.classId === cls.id);
    if (classBatches.length > 0) {
      acc[cls.id] = {
        className: cls.name,
        batches: classBatches,
      };
    }
    return acc;
  }, {} as Record<string, { className: string; batches: typeof batches }>);

  const totalBatches = batches.length;
  const totalStudents = batches.reduce((sum, b) => sum + b.studentCount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Batches"
        description="Organize your classes into batches. Each batch is a group of students with assigned teachers and timetable."
        action={
          <Button
            onClick={() => navigate("/institute/batches/create")}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Batch
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalBatches}</p>
              <p className="text-sm text-muted-foreground">Total Batches</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{Object.keys(batchesByClass).length}</p>
              <p className="text-sm text-muted-foreground">Active Classes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batches Grouped by Class */}
      <div className="space-y-6">
        {Object.entries(batchesByClass).map(([classId, { className, batches: classBatches }]) => (
          <div key={classId} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-primary/50" />
              <h2 className="text-lg font-semibold text-foreground">{className}</h2>
              <Badge variant="secondary" className="ml-2">
                {classBatches.length} {classBatches.length === 1 ? "Batch" : "Batches"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classBatches.map((batch) => (
                <Card
                  key={batch.id}
                  className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  onClick={() => navigate(`/institute/batches/${batch.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {batch.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {batch.academicYear}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">{batch.studentCount}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Students in this batch</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <GraduationCap className="h-4 w-4" />
                            <span className="font-medium">{batch.teacherCount}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Teachers assigned</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium">{batch.subjects.length}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Subjects</TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50">
                      <div className="flex flex-wrap gap-1.5">
                        {batch.subjects.slice(0, 4).map((subjectId) => (
                          <Badge
                            key={subjectId}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {subjectId.toUpperCase()}
                          </Badge>
                        ))}
                        {batch.subjects.length > 4 && (
                          <Badge variant="outline" className="text-xs font-normal">
                            +{batch.subjects.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(batchesByClass).length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-16 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No batches created yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Create your first batch to start organizing students and assigning teachers.
              </p>
              <Button onClick={() => navigate("/institute/batches/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Batch
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Batches;
