import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { assignedTracks } from "@/data/instituteData";
import { getChaptersByClassAndSubject } from "@/data/cbseMasterData";
import { getSubjectsForCourse, getChaptersForCourseBySubject, subjects as masterSubjects } from "@/data/masterData";
import { classes } from "@/data/mockData";

const questionTypes = [
  { id: "mcq", label: "MCQ (Single Correct)" },
  { id: "multiple", label: "Multiple Correct" },
  { id: "numerical", label: "Numerical" },
  { id: "assertion", label: "Assertion-Reasoning" },
  { id: "fill", label: "Fill in Blanks" },
  { id: "short", label: "Short Answer" },
  { id: "long", label: "Long Answer" },
];

const cognitiveTypes = [
  { id: "logical", label: "Logical" },
  { id: "analytical", label: "Analytical" },
  { id: "conceptual", label: "Conceptual" },
  { id: "numerical", label: "Numerical" },
  { id: "application", label: "Application" },
  { id: "memory", label: "Memory" },
];

const CreateQuestion = () => {
  const [questionType, setQuestionType] = useState("mcq");
  const [options, setOptions] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  // Course selection
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCognitiveType, setSelectedCognitiveType] = useState("");

  // Get the selected track details
  const selectedTrack = assignedTracks.find(t => t.id === selectedCourse);
  const isCBSE = selectedTrack?.hasClasses;

  // Get available subjects based on course type
  const availableSubjects = useMemo(() => {
    if (!selectedCourse) return [];
    if (isCBSE) {
      return masterSubjects;
    } else {
      return getSubjectsForCourse(selectedCourse);
    }
  }, [selectedCourse, isCBSE]);

  // Get chapters based on course type
  const availableChapters = useMemo(() => {
    if (!selectedSubjectId) return [];
    if (isCBSE && selectedClassId) {
      return getChaptersByClassAndSubject(selectedClassId, selectedSubjectId);
    } else if (!isCBSE && selectedCourse) {
      return getChaptersForCourseBySubject(selectedCourse, selectedSubjectId);
    }
    return [];
  }, [selectedCourse, selectedClassId, selectedSubjectId, isCBSE]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedClassId("");
    setSelectedSubjectId("");
    setSelectedChapterId("");
  };

  const handleSubmit = () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }
    if (isCBSE && !selectedClassId) {
      toast.error("Please select a class");
      return;
    }
    if (!selectedSubjectId) {
      toast.error("Please select a subject");
      return;
    }
    if (!selectedChapterId) {
      toast.error("Please select a chapter");
      return;
    }
    
    toast.success("Question Created! Question has been added to the bank.");
    navigate("/institute/questions");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Question"
        description="Add a new question to your institute's question bank"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Questions", href: "/institute/questions" },
          { label: "Create" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Question Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {questionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setQuestionType(type.id)}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium transition-all",
                        questionType === type.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Question Text *</Label>
                <Textarea placeholder="Enter your question..." className="min-h-32" />
              </div>
              {(questionType === "mcq" || questionType === "multiple") && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {options.map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <Input placeholder={`Option ${index + 1}`} className="flex-1" />
                      <input type={questionType === "multiple" ? "checkbox" : "radio"} name="correct" className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              )}
              {questionType === "numerical" && (
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <Input type="number" placeholder="Enter numerical answer" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Solution (Optional)</Label>
                <Textarea placeholder="Explain the solution..." className="min-h-24" />
              </div>
              <div className="space-y-2">
                <Label>Hint (Optional)</Label>
                <Input placeholder="Provide a hint for students" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Classification */}
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Classification</h3>
            <div className="space-y-4">
              {/* Course Selection */}
              <div className="space-y-3">
                <Label>Select Course *</Label>
                <div className="space-y-2">
                  {assignedTracks.map((track) => (
                    <div
                      key={track.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                        selectedCourse === track.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                      onClick={() => handleCourseChange(track.id)}
                    >
                      <Checkbox checked={selectedCourse === track.id} />
                      <span className="font-medium">{track.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCourse && (
                <>
                  {/* Class - Only for CBSE */}
                  {isCBSE && (
                    <div className="space-y-2">
                      <Label>Class *</Label>
                      <Select value={selectedClassId} onValueChange={(v) => { setSelectedClassId(v); setSelectedSubjectId(""); setSelectedChapterId(""); }}>
                        <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Select 
                      value={selectedSubjectId} 
                      onValueChange={(v) => { setSelectedSubjectId(v); setSelectedChapterId(""); }}
                      disabled={isCBSE && !selectedClassId}
                    >
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {availableSubjects.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Chapter */}
                  {selectedSubjectId && (isCBSE ? selectedClassId : true) && (
                    <div className="space-y-2">
                      <Label>Chapter *</Label>
                      <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                        <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                        <SelectContent>
                          {availableChapters.map((ch) => (
                            <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cognitive Type</Label>
                <Select value={selectedCognitiveType} onValueChange={setSelectedCognitiveType}>
                  <SelectTrigger><SelectValue placeholder="Select cognitive type" /></SelectTrigger>
                  <SelectContent>
                    {cognitiveTypes.map((cog) => (
                      <SelectItem key={cog.id} value={cog.id}>{cog.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Marking */}
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Marking</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Marks</Label>
                <Input type="number" defaultValue="4" />
              </div>
              <div className="space-y-2">
                <Label>Negative Marks</Label>
                <Input type="number" defaultValue="1" />
              </div>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-primary to-primary/80" onClick={handleSubmit}>
            Save Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
