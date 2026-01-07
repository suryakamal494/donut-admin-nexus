import { useState, useEffect } from "react";
import { BookOpen, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { curriculums, courses } from "@/data/masterData";
import { cn } from "@/lib/utils";

interface AssignCurriculumCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instituteId: string;
  currentCurriculums: string[];
  currentCourses: string[];
}

export const AssignCurriculumCourseDialog = ({ 
  open, 
  onOpenChange, 
  instituteId,
  currentCurriculums,
  currentCourses 
}: AssignCurriculumCourseDialogProps) => {
  const [selectedCurriculums, setSelectedCurriculums] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [curriculumSearch, setCurriculumSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  useEffect(() => {
    setSelectedCurriculums(currentCurriculums);
    setSelectedCourses(currentCourses);
  }, [currentCurriculums, currentCourses, open]);

  const toggleCurriculum = (curriculumId: string) => {
    setSelectedCurriculums(prev => 
      prev.includes(curriculumId) 
        ? prev.filter(c => c !== curriculumId)
        : [...prev, curriculumId]
    );
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(c => c !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = () => {
    const addedCurriculums = selectedCurriculums.filter(c => !currentCurriculums.includes(c));
    const removedCurriculums = currentCurriculums.filter(c => !selectedCurriculums.includes(c));
    const addedCourses = selectedCourses.filter(c => !currentCourses.includes(c));
    const removedCourses = currentCourses.filter(c => !selectedCourses.includes(c));

    const changes = [];
    if (addedCurriculums.length) changes.push(`Added ${addedCurriculums.length} curriculum(s)`);
    if (removedCurriculums.length) changes.push(`Removed ${removedCurriculums.length} curriculum(s)`);
    if (addedCourses.length) changes.push(`Added ${addedCourses.length} course(s)`);
    if (removedCourses.length) changes.push(`Removed ${removedCourses.length} course(s)`);

    if (changes.length) {
      toast.success(changes.join(", "));
    } else {
      toast.info("No changes made");
    }
    
    onOpenChange(false);
  };

  const filteredCurriculums = curriculums.filter(c => 
    c.isActive && c.name.toLowerCase().includes(curriculumSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(c => 
    c.isActive && c.status === "published" && c.name.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Assign Curriculums & Courses</DialogTitle>
          <DialogDescription>
            Select the curriculums and courses this institute should have access to.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Curriculums Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h4 className="font-medium">Curriculums</h4>
              <Badge variant="outline" className="ml-auto">{selectedCurriculums.length}</Badge>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search curriculums..." 
                value={curriculumSearch}
                onChange={(e) => setCurriculumSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <ScrollArea className="h-[280px] pr-2">
              <div className="space-y-2">
                {filteredCurriculums.map((curriculum) => (
                  <div
                    key={curriculum.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      selectedCurriculums.includes(curriculum.id) 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => toggleCurriculum(curriculum.id)}
                  >
                    <Checkbox 
                      checked={selectedCurriculums.includes(curriculum.id)}
                      onCheckedChange={() => toggleCurriculum(curriculum.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{curriculum.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{curriculum.description}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">{curriculum.code}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Courses Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h4 className="font-medium">Courses</h4>
              <Badge variant="outline" className="ml-auto">{selectedCourses.length}</Badge>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses..." 
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <ScrollArea className="h-[280px] pr-2">
              <div className="space-y-2">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      selectedCourses.includes(course.id) 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => toggleCourse(course.id)}
                  >
                    <Checkbox 
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => toggleCourse(course.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{course.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{course.description}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 capitalize">{course.courseType}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
