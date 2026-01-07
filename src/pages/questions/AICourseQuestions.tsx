import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";
import { questionTypeLabels, type QuestionType, cognitiveTypeLabels, type CognitiveType } from "@/data/questionsData";
import { courses, getAllCourseChapters } from "@/data/masterData";
import { cn } from "@/lib/utils";

const AICourseQuestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Classification
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  
  // Question settings
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(["mcq_single", "numerical"]);
  const [selectedCognitiveTypes, setSelectedCognitiveTypes] = useState<CognitiveType[]>(["analytical", "application"]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "mixed" | "hard">("mixed");
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Data
  const publishedCourses = courses.filter(c => c.status === 'published');
  const chapters = selectedCourse ? getAllCourseChapters(selectedCourse) : [];

  const toggleType = (type: QuestionType) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleCognitive = (type: CognitiveType) => {
    setSelectedCognitiveTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleGenerate = () => {
    if (!selectedCourse || !selectedChapter) {
      toast({ title: "Please select course and chapter", variant: "destructive" });
      return;
    }
    if (selectedTypes.length === 0) {
      toast({ title: "Please select at least one question type", variant: "destructive" });
      return;
    }
    
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({ title: `Generated ${questionCount} questions!` });
      navigate("/superadmin/questions/review");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generate Course Questions with AI"
        description="Use AI to generate questions for competitive courses"
        breadcrumbs={[
          { label: "Question Bank" },
          { label: "Course Questions", href: "/superadmin/questions/course" },
          { label: "AI Generator" },
        ]}
      />

      {/* Target Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Target Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCourse} onValueChange={(v) => { setSelectedCourse(v); setSelectedChapter(""); }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {publishedCourses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedChapter} onValueChange={setSelectedChapter} disabled={!selectedCourse}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.isCourseOwned ? "★ " : "📘 "}{c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Question Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Question Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.entries(questionTypeLabels) as [QuestionType, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={selectedTypes.includes(key)}
                  onCheckedChange={() => toggleType(key)}
                />
                <label htmlFor={key} className="text-sm font-medium cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Generation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Number of Questions</Label>
                <span className="text-sm font-medium">{questionCount}</span>
              </div>
              <Slider
                value={[questionCount]}
                onValueChange={([v]) => setQuestionCount(v)}
                min={5}
                max={50}
                step={5}
              />
            </div>

            <div>
              <Label className="mb-2 block">Difficulty</Label>
              <div className="flex gap-2">
                {(["easy", "mixed", "hard"] as const).map((d) => (
                  <Button
                    key={d}
                    variant={difficulty === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      "flex-1 capitalize",
                      difficulty === d && (
                        d === "easy" ? "bg-green-600 hover:bg-green-700" :
                        d === "mixed" ? "bg-amber-500 hover:bg-amber-600" :
                        "bg-red-600 hover:bg-red-700"
                      )
                    )}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Additional Instructions (optional)</Label>
              <Textarea
                placeholder="E.g., Focus on JEE Advanced level, include derivations..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="mt-1.5 min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cognitive Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(cognitiveTypeLabels) as [CognitiveType, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cognitive-${key}`}
                    checked={selectedCognitiveTypes.includes(key)}
                    onCheckedChange={() => toggleCognitive(key)}
                  />
                  <label htmlFor={`cognitive-${key}`} className="text-sm font-medium cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/superadmin/questions/course")}>
          Cancel
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating} className="gradient-button gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Questions
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AICourseQuestions;
