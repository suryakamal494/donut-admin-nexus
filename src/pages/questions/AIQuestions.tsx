import { useState } from "react";
import { Sparkles, Wand2, ArrowLeft, AlertCircle, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { subjectMasterList } from "@/components/subject/SubjectBadge";
import { questionTypeLabels, QuestionType } from "@/data/questionsData";
import { toast } from "sonner";

const AIQuestions = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(["mcq_single"]);
  const [difficulty, setDifficulty] = useState("mixed");
  const [questionCount, setQuestionCount] = useState("10");
  const [instructions, setInstructions] = useState("");

  // Mock chapters (would come from API based on subject)
  const chapters = [
    { id: "mechanics", name: "Mechanics" },
    { id: "thermodynamics", name: "Thermodynamics" },
    { id: "electrostatics", name: "Electrostatics" },
    { id: "optics", name: "Optics" },
    { id: "waves", name: "Waves" },
    { id: "modern-physics", name: "Modern Physics" },
  ];

  // Mock topics
  const topics = [
    { id: "newtons-laws", name: "Newton's Laws of Motion" },
    { id: "work-energy", name: "Work, Energy & Power" },
    { id: "rotational-motion", name: "Rotational Motion" },
    { id: "gravitation", name: "Gravitation" },
  ];

  const toggleQuestionType = (type: QuestionType) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleGenerate = () => {
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }
    if (selectedTypes.length === 0) {
      toast.error("Please select at least one question type");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Questions generated successfully!");
      navigate("/superadmin/questions/review");
    }, 2500);
  };

  const allQuestionTypes: QuestionType[] = [
    "mcq_single",
    "mcq_multiple",
    "numerical",
    "assertion_reasoning",
    "paragraph",
    "matrix_match",
    "fill_blanks",
    "true_false",
    "short_answer",
    "long_answer",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Generate Questions with AI"
        description="Automatically generate questions with answers and detailed solutions."
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Question Bank", href: "/superadmin/questions" },
          { label: "AI Generator" },
        ]}
        actions={
          <Link to="/superadmin/questions">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-button flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Question Generator</h2>
              <p className="text-muted-foreground">
                Configure parameters and let AI create questions for you
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Subject & Chapter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject <span className="text-destructive">*</span></Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectMasterList.slice(0, 15).map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chapter</Label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <Label>Topic (Optional)</Label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic for focused generation" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question Types */}
            <div className="space-y-3">
              <Label>Question Types <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allQuestionTypes.map((type) => (
                  <div
                    key={type}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTypes.includes(type)
                        ? "bg-primary/5 border-primary/30"
                        : "bg-muted/30 border-border/50 hover:border-primary/20"
                    }`}
                    onClick={() => toggleQuestionType(type)}
                  >
                    <Checkbox
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => toggleQuestionType(type)}
                    />
                    <span className="text-sm font-medium">
                      {questionTypeLabels[type]}
                    </span>
                  </div>
                ))}
              </div>
              {selectedTypes.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedTypes.length} type(s) selected
                </p>
              )}
            </div>

            {/* Difficulty & Count Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Mostly Easy</SelectItem>
                    <SelectItem value="mixed">Mixed (Recommended)</SelectItem>
                    <SelectItem value="hard">Mostly Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                />
              </div>
            </div>

            {/* Additional Instructions */}
            <div className="space-y-2">
              <Label>Additional Instructions (Optional)</Label>
              <Textarea
                placeholder="e.g., Focus on numerical problems, include diagram-based questions, avoid repeated concepts..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">How this works</p>
                  <p className="text-sm text-muted-foreground">
                    Questions will be automatically generated with answers and detailed solutions.
                    You can review and edit them before adding to the Question Bank.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Link to="/superadmin/questions">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="gradient-button gap-2 min-w-[180px]"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuestions;