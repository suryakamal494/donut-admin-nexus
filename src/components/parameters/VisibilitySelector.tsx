import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getPublishedCourses } from "@/data/masterData";

interface VisibilitySelectorProps {
  visibleInCurriculum: boolean;
  visibleInCourses: string[];
  onCurriculumChange: (visible: boolean) => void;
  onCoursesChange: (courseIds: string[]) => void;
  className?: string;
}

const VisibilitySelector = ({ 
  visibleInCurriculum,
  visibleInCourses,
  onCurriculumChange,
  onCoursesChange,
  className 
}: VisibilitySelectorProps) => {
  const publishedCourses = getPublishedCourses();

  const handleCourseToggle = (courseId: string) => {
    if (visibleInCourses.includes(courseId)) {
      onCoursesChange(visibleInCourses.filter(id => id !== courseId));
    } else {
      onCoursesChange([...visibleInCourses, courseId]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label>Visibility</Label>
      <p className="text-xs text-muted-foreground -mt-1">
        Where should this content be accessible?
      </p>
      
      <div className="space-y-2">
        {/* Curriculum checkbox */}
        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 bg-background cursor-pointer hover:bg-accent/30 transition-colors">
          <Checkbox 
            checked={visibleInCurriculum}
            onCheckedChange={(checked) => onCurriculumChange(checked === true)}
          />
          <span className="text-sm font-medium">Regular Curriculum</span>
        </label>
        
        {/* Course checkboxes */}
        {publishedCourses.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground px-1">Courses:</span>
            {publishedCourses.map((course) => (
              <label 
                key={course.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 bg-background cursor-pointer hover:bg-accent/30 transition-colors"
              >
                <Checkbox 
                  checked={visibleInCourses.includes(course.id)}
                  onCheckedChange={() => handleCourseToggle(course.id)}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{course.name}</span>
                  <span className="text-xs text-muted-foreground ml-2 capitalize">
                    ({course.courseType})
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisibilitySelector;
