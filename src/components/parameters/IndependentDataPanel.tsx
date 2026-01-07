import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  courses, 
  curriculums, 
  getChapterCountForCourse,
  getCurriculumName,
  getClassName 
} from "@/data/masterData";

interface IndependentDataPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "courses" | "curriculum";
}

export const IndependentDataPanel = ({ open, onOpenChange, type }: IndependentDataPanelProps) => {
  const navigate = useNavigate();
  const [addingItem, setAddingItem] = useState(false);
  
  const title = type === "courses" ? "Courses" : "Curriculum";

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

  const handleOpenCourseBuilder = (courseId: string) => {
    navigate(`/superadmin/parameters/course-builder?course=${courseId}`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            {title}
            <Button 
              size="sm" 
              className="gradient-button gap-1"
              onClick={() => type === "courses" 
                ? navigate("/superadmin/parameters/course-builder")
                : setAddingItem(true)
              }
            >
              <Plus className="w-4 h-4" />
              {type === "courses" ? "New Course" : "Add"}
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
          <div className="space-y-3">
            {/* Add form for Curriculum only */}
            {addingItem && type === "curriculum" && (
              <div className="p-4 rounded-lg border-2 border-dashed border-primary bg-primary/5 space-y-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="Enter curriculum name" />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input placeholder="Enter code" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Enter description" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setAddingItem(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="gradient-button">
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* Courses List */}
            {type === "courses" && courses.map((course) => {
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

            {/* Curriculum List */}
            {type === "curriculum" && curriculums.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors group"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.name}</p>
                    <Badge variant="outline" className="text-xs font-mono">
                      {item.code}
                    </Badge>
                    {item.isActive ? (
                      <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
