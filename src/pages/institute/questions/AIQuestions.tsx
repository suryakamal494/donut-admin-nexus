import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Sparkles,
  Wand2,
  BookOpen,
  Lightbulb,
  Target,
  RefreshCw,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/ui/page-header";
import { SubjectBadge } from "@/components/subject";
import { availableClasses, availableSubjects } from "@/data/instituteData";
import { questionTypeLabels, QuestionType } from "@/data/questionsData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const difficultyLevels = ["easy", "medium", "hard"];

const AIQuestions = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Form state
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(["mcq_single"]);
  const [difficultyMix, setDifficultyMix] = useState<string[]>(["medium"]);
  const [additionalContext, setAdditionalContext] = useState("");

  const handleTypeToggle = (type: QuestionType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleDifficultyToggle = (diff: string) => {
    setDifficultyMix((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  const handleGenerate = () => {
    if (!selectedClass || !selectedSubject) {
      toast.error("Please select class and subject");
      return;
    }
    if (selectedTypes.length === 0) {
      toast.error("Please select at least one question type");
      return;
    }
    if (difficultyMix.length === 0) {
      toast.error("Please select at least one difficulty level");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const mockGenerated = Array.from({ length: questionCount }, (_, i) => ({
        id: `gen-${i + 1}`,
        type: selectedTypes[i % selectedTypes.length],
        difficulty: difficultyMix[i % difficultyMix.length],
        questionText: `Generated question ${i + 1} about ${topic || chapter || "the selected topic"}...`,
        options: [
          { id: "a", text: "Option A", isCorrect: i % 4 === 0 },
          { id: "b", text: "Option B", isCorrect: i % 4 === 1 },
          { id: "c", text: "Option C", isCorrect: i % 4 === 2 },
          { id: "d", text: "Option D", isCorrect: i % 4 === 3 },
        ],
        selected: true,
      }));

      setGeneratedQuestions(mockGenerated);
      setIsGenerating(false);
      toast.success(`Generated ${questionCount} questions!`);
    }, 2000);
  };

  const toggleQuestionSelection = (id: string) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q))
    );
  };

  const handleAddToBank = () => {
    const selected = generatedQuestions.filter((q) => q.selected);
    if (selected.length === 0) {
      toast.error("Please select at least one question");
      return;
    }
    toast.success(`Added ${selected.length} questions to your Question Bank!`);
    navigate("/institute/questions");
  };

  const selectedCount = generatedQuestions.filter((q) => q.selected).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Question Generator"
        description="Generate questions instantly using AI. Specify the topic, difficulty, and question types to create custom questions for your tests."
        actions={
          <Button variant="outline" onClick={() => navigate("/institute/questions")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Question Bank
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Generation Settings
              </CardTitle>
              <CardDescription>
                Configure what kind of questions you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Class & Subject */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Class *</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Chapter & Topic */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Chapter</Label>
                  <Input
                    placeholder="e.g., Newton's Laws of Motion"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Topic (optional)</Label>
                  <Input
                    placeholder="e.g., Friction"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Number of Questions</Label>
                  <Badge variant="secondary">{questionCount}</Badge>
                </div>
                <Slider
                  value={[questionCount]}
                  onValueChange={([v]) => setQuestionCount(v)}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>

              {/* Question Types */}
              <div className="space-y-3">
                <Label>Question Types *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(questionTypeLabels) as [QuestionType, string][])
                    .slice(0, 6)
                    .map(([type, label]) => (
                      <div
                        key={type}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm",
                          selectedTypes.includes(type)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        )}
                        onClick={() => handleTypeToggle(type)}
                      >
                        <Checkbox checked={selectedTypes.includes(type)} />
                        <span className="truncate">{label}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <Label>Difficulty Mix *</Label>
                <div className="flex gap-2">
                  {difficultyLevels.map((diff) => (
                    <Badge
                      key={diff}
                      variant={difficultyMix.includes(diff) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer capitalize flex-1 justify-center py-2",
                        difficultyMix.includes(diff) && diff === "easy" && "bg-emerald-500",
                        difficultyMix.includes(diff) && diff === "medium" && "bg-amber-500",
                        difficultyMix.includes(diff) && diff === "hard" && "bg-red-500"
                      )}
                      onClick={() => handleDifficultyToggle(diff)}
                    >
                      {diff}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Context */}
              <div className="space-y-2">
                <Label>Additional Instructions (optional)</Label>
                <Textarea
                  placeholder="e.g., Focus on numerical problems, include diagrams..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-primary/80"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Questions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Questions Panel */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Generated Questions
                  </CardTitle>
                  <CardDescription>
                    Review and select questions to add to your bank
                  </CardDescription>
                </div>
                {generatedQuestions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedCount} / {generatedQuestions.length} selected
                    </Badge>
                    <Button onClick={handleAddToBank} disabled={selectedCount === 0}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Bank
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No questions generated yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your settings on the left and click "Generate Questions" to create AI-powered questions for your tests.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedQuestions.map((q, index) => (
                    <div
                      key={q.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all cursor-pointer",
                        q.selected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                      onClick={() => toggleQuestionSelection(q.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                            q.selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          )}
                        >
                          {q.selected && <Check className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Q{index + 1}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {questionTypeLabels[q.type as QuestionType]}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs capitalize",
                                q.difficulty === "easy" && "text-emerald-600 border-emerald-300",
                                q.difficulty === "medium" && "text-amber-600 border-amber-300",
                                q.difficulty === "hard" && "text-red-600 border-red-300"
                              )}
                            >
                              {q.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground">{q.questionText}</p>
                          {q.options && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              {q.options.map((opt: any, i: number) => (
                                <div
                                  key={opt.id}
                                  className={cn(
                                    "p-2 rounded text-xs border",
                                    opt.isCorrect
                                      ? "bg-success/10 border-success/30 text-success"
                                      : "bg-muted/30"
                                  )}
                                >
                                  {String.fromCharCode(65 + i)}. {opt.text}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIQuestions;
