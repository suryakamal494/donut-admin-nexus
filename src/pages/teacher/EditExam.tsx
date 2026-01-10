import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, FileQuestion, Clock, Award, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { teacherExams } from "@/data/teacher/exams";
import { cn } from "@/lib/utils";
import type { TeacherExam } from "@/data/teacher/types";

const EditExam = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [examName, setExamName] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [duration, setDuration] = useState(30);
  const [marksPerQuestion, setMarksPerQuestion] = useState(4);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [negativeMarks, setNegativeMarks] = useState(1);
  const [exam, setExam] = useState<TeacherExam | null>(null);

  useEffect(() => {
    // Simulate loading exam data
    const foundExam = teacherExams.find(e => e.id === examId);
    if (foundExam) {
      setExam(foundExam);
      setExamName(foundExam.name);
      setTotalQuestions(foundExam.totalQuestions);
      setDuration(foundExam.duration);
      setMarksPerQuestion(Math.round(foundExam.totalMarks / foundExam.totalQuestions));
      setNegativeMarking(foundExam.negativeMarking);
      setNegativeMarks(foundExam.negativeMarks);
    }
    setIsLoading(false);
  }, [examId]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Exam updated successfully");
      navigate("/teacher/exams");
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <PageHeader
          title="Exam Not Found"
          breadcrumbs={[
            { label: "Teacher", href: "/teacher" },
            { label: "Exams", href: "/teacher/exams" },
            { label: "Edit" },
          ]}
        />
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">The exam you're looking for doesn't exist.</p>
            <Button className="mt-4" onClick={() => navigate("/teacher/exams")}>
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalMarks = totalQuestions * marksPerQuestion;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto animate-fade-in">
      <PageHeader
        title="Edit Exam"
        description="Update exam settings"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Exams", href: "/teacher/exams" },
          { label: "Edit" },
        ]}
      />

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn(
          exam.status === "draft" && "bg-muted",
          exam.status === "scheduled" && "bg-blue-100 text-blue-700",
          exam.status === "live" && "bg-green-100 text-green-700",
          exam.status === "completed" && "bg-primary/10 text-primary"
        )}>
          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {exam.subjects.join(", ")}
        </span>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Exam Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exam Name */}
          <div className="space-y-2">
            <Label htmlFor="examName">Exam Name</Label>
            <Input
              id="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Enter exam name"
              className="h-12"
            />
          </div>

          {/* Quick summary card */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 flex items-center justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-2xl font-bold text-primary">{duration}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-2xl font-bold text-primary">{totalMarks}</p>
              <p className="text-xs text-muted-foreground">Total Marks</p>
            </div>
          </div>

          {/* Questions Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-muted-foreground" />
                Number of Questions
              </Label>
              <span className="text-lg font-semibold text-primary">{totalQuestions}</span>
            </div>
            <Slider
              value={[totalQuestions]}
              onValueChange={([v]) => setTotalQuestions(v)}
              min={5}
              max={50}
              step={5}
              className="py-2"
            />
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Duration (minutes)
              </Label>
              <span className="text-lg font-semibold text-primary">{duration}</span>
            </div>
            <Slider
              value={[duration]}
              onValueChange={([v]) => setDuration(v)}
              min={10}
              max={180}
              step={5}
              className="py-2"
            />
          </div>

          {/* Marks per Question */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                Marks per Question
              </Label>
              <span className="text-lg font-semibold text-primary">{marksPerQuestion}</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 4, 5].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMarksPerQuestion(m)}
                  className={cn(
                    "flex-1 py-3 rounded-lg border-2 font-medium transition-all min-h-[48px]",
                    "active:scale-[0.98]",
                    marksPerQuestion === m
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Negative Marking */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <span className="text-destructive font-bold">-</span>
                </div>
                <div>
                  <p className="font-medium">Negative Marking</p>
                  <p className="text-xs text-muted-foreground">Deduct marks for wrong answers</p>
                </div>
              </div>
              <Switch
                checked={negativeMarking}
                onCheckedChange={setNegativeMarking}
              />
            </div>
            
            {negativeMarking && (
              <div className="flex items-center gap-3 pl-4">
                <Label className="text-sm">Deduct</Label>
                <Input
                  type="number"
                  value={negativeMarks}
                  onChange={(e) => setNegativeMarks(Number(e.target.value))}
                  className="w-20 h-10 text-center"
                  min={0.25}
                  max={marksPerQuestion}
                  step={0.25}
                />
                <span className="text-sm text-muted-foreground">marks</span>
              </div>
            )}
          </div>

          {/* Batches Info */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Assigned to {exam.batchIds.length} {exam.batchIds.length === 1 ? "batch" : "batches"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-4">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={() => navigate("/teacher/exams")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          className="flex-1 h-12 gradient-button"
          onClick={handleSave}
          disabled={isSaving || !examName.trim()}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditExam;
