import { Beaker, Calculator, BookText, Heart, ScrollText, Languages, FolderOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getSubjectsForCourse, CourseSubject } from "@/data/masterData";

interface CourseSubjectPanelProps {
  selectedCourseId: string | null;
  selectedSubjectId: string | null;
  onSelectSubject: (subjectId: string) => void;
}

const subjectIcons: Record<string, React.ReactNode> = {
  "1": <Beaker className="w-4 h-4" />,      // Physics
  "2": <Beaker className="w-4 h-4" />,      // Chemistry
  "3": <Calculator className="w-4 h-4" />,  // Mathematics
  "4": <Heart className="w-4 h-4" />,       // Biology
  "5": <ScrollText className="w-4 h-4" />,  // History
  "6": <Languages className="w-4 h-4" />,   // Hindi
};

const subjectColors: Record<string, string> = {
  "1": "text-blue-500",      // Physics
  "2": "text-emerald-500",   // Chemistry
  "3": "text-purple-500",    // Mathematics
  "4": "text-rose-500",      // Biology
  "5": "text-amber-500",     // History
  "6": "text-orange-500",    // Hindi
};

export const CourseSubjectPanel = ({ 
  selectedCourseId, 
  selectedSubjectId,
  onSelectSubject 
}: CourseSubjectPanelProps) => {
  const subjects = selectedCourseId ? getSubjectsForCourse(selectedCourseId) : [];

  if (!selectedCourseId) {
    return (
      <div className="flex flex-col h-full border-r border-border/50">
        <div className="p-3 border-b border-border/50 bg-muted/30">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
            Subjects
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            Select a course to view subjects
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-border/50">
      <div className="p-3 border-b border-border/50 bg-muted/30">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" />
          Subjects
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subjects.length} subjects</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {subjects.map((subject) => {
            const isSelected = selectedSubjectId === subject.id;
            const icon = subjectIcons[subject.id] || <BookText className="w-4 h-4" />;
            const colorClass = subjectColors[subject.id] || "text-primary";
            
            return (
              <button
                key={subject.id}
                onClick={() => onSelectSubject(subject.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all",
                  isSelected
                    ? "gradient-button text-white shadow-md"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    isSelected ? "text-white" : colorClass
                  )}>
                    {icon}
                  </span>
                  <span className={cn(
                    "font-medium text-sm",
                    isSelected ? "text-white" : "text-foreground"
                  )}>
                    {subject.name}
                  </span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full min-w-[28px] text-center",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}>
                  {subject.chapterCount}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
