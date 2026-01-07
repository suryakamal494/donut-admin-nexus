import { useState } from "react";
import { 
  Sparkles, 
  Loader2,
  FileQuestion,
  BarChart3,
  Clock,
  Target
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (assessment: any) => void;
}

export const CreateAssessmentDialog = ({
  open,
  onOpenChange,
  onCreated,
}: CreateAssessmentDialogProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("ai");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "quiz" as "quiz" | "test" | "poll",
    subject: "Physics",
    batchId: "batch-10a",
    topic: "",
    chapter: "",
    questionCount: 10,
    duration: 15,
    difficulty: "medium",
  });

  const [difficultyDistribution, setDifficultyDistribution] = useState({
    easy: 30,
    medium: 50,
    hard: 20,
  });

  const handleGenerateWithAI = async () => {
    if (!formData.topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate questions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("assessment-ai", {
        body: {
          action: "generate_quiz",
          topic: formData.topic,
          subject: formData.subject,
          chapter: formData.chapter,
          questionCount: formData.questionCount,
          difficulty: formData.difficulty,
          questionTypes: ["MCQ"],
        },
      });

      if (error) throw error;

      if (data?.data) {
        const assessment = {
          id: `assess-${Date.now()}`,
          title: formData.title || `${formData.topic} ${formData.type === "quiz" ? "Quiz" : "Test"}`,
          type: formData.type,
          subject: formData.subject,
          batchId: formData.batchId,
          batchName: formData.batchId === "batch-10a" ? "10A" : formData.batchId === "batch-10b" ? "10B" : "11A",
          className: formData.batchId.includes("10") ? "Class 10" : "Class 11",
          questionCount: data.data.questions?.length || formData.questionCount,
          duration: data.data.estimatedTime || formData.duration,
          status: "draft" as const,
          createdAt: new Date().toISOString(),
          questions: data.data.questions,
        };

        toast({
          title: "Assessment Created!",
          description: `Generated ${assessment.questionCount} questions.`,
        });

        onCreated?.(assessment);
        onOpenChange(false);
        resetForm();
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualCreate = () => {
    if (!formData.title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the assessment.",
        variant: "destructive",
      });
      return;
    }

    const assessment = {
      id: `assess-${Date.now()}`,
      title: formData.title,
      type: formData.type,
      subject: formData.subject,
      batchId: formData.batchId,
      batchName: formData.batchId === "batch-10a" ? "10A" : formData.batchId === "batch-10b" ? "10B" : "11A",
      className: formData.batchId.includes("10") ? "Class 10" : "Class 11",
      questionCount: 0,
      duration: formData.duration,
      status: "draft" as const,
      createdAt: new Date().toISOString(),
    };

    toast({
      title: "Assessment Created!",
      description: "You can now add questions manually.",
    });

    onCreated?.(assessment);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "quiz",
      subject: "Physics",
      batchId: "batch-10a",
      topic: "",
      chapter: "",
      questionCount: 10,
      duration: 15,
      difficulty: "medium",
    });
  };

  const applyPreset = (preset: "easy" | "balanced" | "hard") => {
    switch (preset) {
      case "easy":
        setDifficultyDistribution({ easy: 60, medium: 30, hard: 10 });
        setFormData(prev => ({ ...prev, difficulty: "easy" }));
        break;
      case "balanced":
        setDifficultyDistribution({ easy: 30, medium: 50, hard: 20 });
        setFormData(prev => ({ ...prev, difficulty: "medium" }));
        break;
      case "hard":
        setDifficultyDistribution({ easy: 10, medium: 30, hard: 60 });
        setFormData(prev => ({ ...prev, difficulty: "hard" }));
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Assessment</DialogTitle>
          <DialogDescription>
            Create a quiz or test for your students
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "ai")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <FileQuestion className="w-4 h-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 mt-4">
            {/* Type Selection */}
            <div className="grid grid-cols-3 gap-2">
              {(["quiz", "test", "poll"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={cn(
                    "p-3 rounded-lg border-2 text-center transition-all",
                    formData.type === type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {type === "quiz" && <FileQuestion className="w-5 h-5 mx-auto mb-1 text-purple-500" />}
                  {type === "test" && <FileQuestion className="w-5 h-5 mx-auto mb-1 text-amber-500" />}
                  {type === "poll" && <BarChart3 className="w-5 h-5 mx-auto mb-1 text-teal-500" />}
                  <span className="text-sm font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>

            {/* Topic & Subject */}
            <div className="space-y-3">
              <div>
                <Label>Topic *</Label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., Newton's Laws of Motion"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Subject</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Batch</Label>
                  <Select
                    value={formData.batchId}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, batchId: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="batch-10a">10A</SelectItem>
                      <SelectItem value="batch-10b">10B</SelectItem>
                      <SelectItem value="batch-11a">11A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Question Count & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Questions</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[formData.questionCount]}
                    onValueChange={([v]) => setFormData(prev => ({ ...prev, questionCount: v }))}
                    min={5}
                    max={30}
                    step={5}
                    className="flex-1"
                  />
                  <Badge variant="secondary" className="w-10 justify-center">
                    {formData.questionCount}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Duration (min)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[formData.duration]}
                    onValueChange={([v]) => setFormData(prev => ({ ...prev, duration: v }))}
                    min={5}
                    max={60}
                    step={5}
                    className="flex-1"
                  />
                  <Badge variant="secondary" className="w-10 justify-center">
                    {formData.duration}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Difficulty Presets */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                Difficulty
              </Label>
              <div className="flex gap-2">
                {(["easy", "balanced", "hard"] as const).map((preset) => (
                  <Button
                    key={preset}
                    variant={formData.difficulty === (preset === "balanced" ? "medium" : preset) ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex-1 capitalize",
                      formData.difficulty === (preset === "balanced" ? "medium" : preset) && "gradient-button"
                    )}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset === "easy" && "Easy Focus"}
                    {preset === "balanced" && "Balanced"}
                    {preset === "hard" && "Challenge"}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div>
              <Label>Assessment Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Chapter 5 Quiz"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["quiz", "test", "poll"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={cn(
                    "p-3 rounded-lg border-2 text-center transition-all",
                    formData.type === type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Batch</Label>
                <Select
                  value={formData.batchId}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, batchId: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batch-10a">10A</SelectItem>
                    <SelectItem value="batch-10b">10B</SelectItem>
                    <SelectItem value="batch-11a">11A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                min={5}
                max={120}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === "ai" ? (
            <Button
              className="gradient-button"
              onClick={handleGenerateWithAI}
              disabled={isGenerating || !formData.topic}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Questions
            </Button>
          ) : (
            <Button
              className="gradient-button"
              onClick={handleManualCreate}
              disabled={!formData.title}
            >
              Create Assessment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
