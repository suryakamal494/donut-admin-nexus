import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Clock,
  Save,
  GripVertical,
  Check,
  AlertCircle,
} from "lucide-react";
import { academicScheduleSetups } from "@/data/academicScheduleData";
import { ChapterHourAllocation } from "@/types/academicSchedule";
import { toast } from "sonner";

// Mock data for courses and subjects
const courses = [
  { id: "cbse", name: "CBSE" },
  { id: "jee-mains", name: "JEE Mains" },
];

const classes = [
  { id: "class-6", name: "Class 6" },
  { id: "class-7", name: "Class 7" },
  { id: "class-8", name: "Class 8" },
  { id: "class-9", name: "Class 9" },
  { id: "class-10", name: "Class 10" },
  { id: "class-11", name: "Class 11" },
  { id: "class-12", name: "Class 12" },
];

const subjectsByCourse: Record<string, { id: string; name: string }[]> = {
  cbse: [
    { id: "phy", name: "Physics" },
    { id: "che", name: "Chemistry" },
    { id: "mat", name: "Mathematics" },
    { id: "bio", name: "Biology" },
    { id: "eng", name: "English" },
  ],
  "jee-mains": [
    { id: "phy", name: "Physics" },
    { id: "che", name: "Chemistry" },
    { id: "mat", name: "Mathematics" },
  ],
};

// Mock chapters (would come from master data)
const chaptersBySubject: Record<string, ChapterHourAllocation[]> = {
  phy: [
    { chapterId: "phy-10-1", chapterName: "Light - Reflection and Refraction", plannedHours: 12, order: 1 },
    { chapterId: "phy-10-2", chapterName: "Human Eye and Colourful World", plannedHours: 8, order: 2 },
    { chapterId: "phy-10-3", chapterName: "Electricity", plannedHours: 14, order: 3 },
    { chapterId: "phy-10-4", chapterName: "Magnetic Effects of Electric Current", plannedHours: 10, order: 4 },
    { chapterId: "phy-10-5", chapterName: "Sources of Energy", plannedHours: 6, order: 5 },
  ],
  mat: [
    { chapterId: "mat-10-1", chapterName: "Real Numbers", plannedHours: 8, order: 1 },
    { chapterId: "mat-10-2", chapterName: "Polynomials", plannedHours: 6, order: 2 },
    { chapterId: "mat-10-3", chapterName: "Pair of Linear Equations", plannedHours: 10, order: 3 },
    { chapterId: "mat-10-4", chapterName: "Quadratic Equations", plannedHours: 10, order: 4 },
    { chapterId: "mat-10-5", chapterName: "Arithmetic Progressions", plannedHours: 8, order: 5 },
    { chapterId: "mat-10-6", chapterName: "Triangles", plannedHours: 12, order: 6 },
    { chapterId: "mat-10-7", chapterName: "Coordinate Geometry", plannedHours: 8, order: 7 },
    { chapterId: "mat-10-8", chapterName: "Introduction to Trigonometry", plannedHours: 10, order: 8 },
  ],
  che: [
    { chapterId: "che-10-1", chapterName: "Chemical Reactions and Equations", plannedHours: 10, order: 1 },
    { chapterId: "che-10-2", chapterName: "Acids, Bases and Salts", plannedHours: 12, order: 2 },
    { chapterId: "che-10-3", chapterName: "Metals and Non-metals", plannedHours: 10, order: 3 },
    { chapterId: "che-10-4", chapterName: "Carbon and its Compounds", plannedHours: 14, order: 4 },
    { chapterId: "che-10-5", chapterName: "Periodic Classification of Elements", plannedHours: 8, order: 5 },
  ],
};

export default function AcademicScheduleSetup() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [chapters, setChapters] = useState<ChapterHourAllocation[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if setup exists for selected combination
  const existingSetup = academicScheduleSetups.find(
    s => s.courseId === selectedCourse && 
         s.classId === selectedClass && 
         s.subjectId === selectedSubject
  );

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedClass("");
    setSelectedSubject("");
    setChapters([]);
    setHasChanges(false);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedSubject("");
    setChapters([]);
    setHasChanges(false);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    
    // Load existing setup or default chapters
    const existing = academicScheduleSetups.find(
      s => s.courseId === selectedCourse && 
           s.classId === selectedClass && 
           s.subjectId === value
    );
    
    if (existing) {
      setChapters(existing.chapters);
    } else {
      // Load from master data with default hours
      const defaultChapters = chaptersBySubject[value] || [];
      setChapters(defaultChapters);
    }
    setHasChanges(false);
  };

  const handleHoursChange = (index: number, hours: number) => {
    const updated = [...chapters];
    updated[index] = { ...updated[index], plannedHours: hours };
    setChapters(updated);
    setHasChanges(true);
  };

  const totalHours = chapters.reduce((sum, ch) => sum + ch.plannedHours, 0);

  const handleSave = () => {
    toast.success("Academic schedule setup saved successfully!");
    setHasChanges(false);
  };

  const requiresClass = selectedCourse === "cbse";
  const subjects = selectedCourse ? subjectsByCourse[selectedCourse] || [] : [];
  const canSelectSubject = selectedCourse && (!requiresClass || selectedClass);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Schedule Setup"
        description="Define planned hours per chapter for the academic year"
      />

      {/* Selection Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Course / Board</Label>
              <Select value={selectedCourse} onValueChange={handleCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {requiresClass && (
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={selectedClass} onValueChange={handleClassChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={handleSubjectChange}
                disabled={!canSelectSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter Hour Allocation */}
      {selectedSubject && chapters.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Chapter Hour Allocation</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {subjects.find(s => s.id === selectedSubject)?.name} • {chapters.length} chapters
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {existingSetup && (
                  <Badge variant="outline" className="gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
                    <Check className="w-3.5 h-3.5" />
                    Setup Complete
                  </Badge>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">{totalHours} hours</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-3">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.chapterId}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="w-4 h-4" />
                      <span className="text-sm font-medium w-6">{index + 1}.</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{chapter.chapterName}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        value={chapter.plannedHours}
                        onChange={(e) => handleHoursChange(index, parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">hrs</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Save Button */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {hasChanges ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>You have unsaved changes</span>
                  </>
                ) : (
                  <span>All changes saved</span>
                )}
              </div>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="gradient-button gap-2"
              >
                <Save className="w-4 h-4" />
                Save Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedSubject && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select Course & Subject</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose a course, class (if applicable), and subject to configure the academic schedule with planned hours per chapter.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
