import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courses } from "@/data/masterData";
import { Course } from "@/types/masterData";

interface CourseSelectorProps {
  selectedCourseId: string;
  selectedCourse: Course | undefined;
  currentChapterCount: number;
  isDirty: boolean;
  onCourseChange: (courseId: string) => void;
  onCreateCourse: () => void;
}

export const CourseSelector = ({
  selectedCourseId,
  selectedCourse,
  currentChapterCount,
  isDirty,
  onCourseChange,
  onCreateCourse,
}: CourseSelectorProps) => {
  return (
    <div className="bg-card rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-border/50 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
        <Label className="text-xs sm:text-sm font-medium shrink-0">Course:</Label>
        <Select value={selectedCourseId} onValueChange={onCourseChange}>
          <SelectTrigger className="w-full sm:w-[220px] md:w-[280px] h-8 sm:h-9 text-xs sm:text-sm">
            <SelectValue placeholder="Select or create a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.filter(c => c.isActive).map((course) => (
              <SelectItem key={course.id} value={course.id}>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm">{course.name}</span>
                  <Badge variant={course.status === "published" ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                    {course.status}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm"
          onClick={onCreateCourse}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">New Course</span>
          <span className="sm:hidden">New</span>
        </Button>
        
        {selectedCourse && (
          <div className="w-full sm:w-auto sm:ml-auto flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>Type: <strong className="text-foreground capitalize">{selectedCourse.courseType}</strong></span>
            <span>Chapters: <strong className="text-foreground">{currentChapterCount}</strong></span>
            {isDirty && <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px] sm:text-xs">Unsaved</Badge>}
          </div>
        )}
      </div>
    </div>
  );
};
