import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  courses, 
  getChapterCountForCourse,
  getCurriculumName,
  getClassName 
} from "@/data/masterData";

interface CourseManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CourseManageDialog = ({ open, onOpenChange }: CourseManageDialogProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const getCourseTypeBadgeColor = (courseType: string) => {
    switch (courseType) {
      case "competitive": return "bg-coral/10 text-coral border-coral/30";
      case "foundation": return "bg-teal/10 text-teal border-teal/30";
      case "olympiad": return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "published": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
      case "draft": return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleOpenCourseBuilder = (courseId?: string) => {
    const url = courseId 
      ? `/superadmin/parameters/course-builder?course=${courseId}`
      : "/superadmin/parameters/course-builder";
    navigate(url);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage course metadata and settings
        </p>
        <Button 
          size="sm" 
          className="gradient-button gap-1"
          onClick={() => handleOpenCourseBuilder()}
        >
          <Plus className="w-4 h-4" />
          New Course
        </Button>
      </div>

      <ScrollArea className={isMobile ? "h-[60vh]" : "h-[450px]"}>
        <div className="space-y-3 pr-4">
          {courses.map((course) => {
            const chapterCount = getChapterCountForCourse(course.id);
            const allowedCurriculumNames = course.allowedCurriculums
              .map(id => getCurriculumName(id))
              .join(", ");
            const allowedClassNames = course.allowedClasses
              .map(id => getClassName(id))
              .join(", ");
            
            return (
              <div 
                key={course.id} 
                className="p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors group space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-foreground">{course.name}</h4>
                      <Badge variant="outline" className="text-xs font-mono">
                        {course.code}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge 
                      variant="outline" 
                      className={`text-xs capitalize ${getCourseTypeBadgeColor(course.courseType)}`}
                    >
                      {course.courseType}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs capitalize ${getStatusBadgeColor(course.status)}`}
                    >
                      {course.status}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">Curriculums:</span> {allowedCurriculumNames || "All"}
                  </span>
                  <span>
                    <span className="font-medium text-foreground">Classes:</span> {allowedClassNames || "All"}
                  </span>
                  <span>
                    <span className="font-medium text-foreground">{chapterCount}</span> Chapters
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5 text-xs"
                    onClick={() => handleOpenCourseBuilder(course.id)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in Course Builder
                  </Button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8"
                      onClick={() => handleOpenCourseBuilder(course.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Manage Courses</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Courses</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};