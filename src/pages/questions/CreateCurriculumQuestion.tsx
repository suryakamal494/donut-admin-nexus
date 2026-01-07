import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";
import { questionTypeLabels, type QuestionType, cognitiveTypeLabels, type CognitiveType, type QuestionDifficulty } from "@/data/questionsData";
import { classes as cbseClasses } from "@/data/masterData";
import { cn } from "@/lib/utils";

const CreateCurriculumQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Classification
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  
  // Question details
  const [questionType, setQuestionType] = useState<QuestionType>("mcq_single");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { id: "a", text: "", isCorrect: false },
    { id: "b", text: "", isCorrect: false },
    { id: "c", text: "", isCorrect: false },
    { id: "d", text: "", isCorrect: false },
  ]);
  const [solution, setSolution] = useState("");
  const [solutionOpen, setSolutionOpen] = useState(false);
  
  // Meta
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("medium");
  const [cognitiveType, setCognitiveType] = useState<CognitiveType>("conceptual");
  const [marks, setMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(1);

  // Data cascades
  const classes = cbseClasses;
  const subjects: any[] = [];
  const chapters: any[] = [];
  const topics: any[] = [];

  const handleSubmit = () => {
    if (!selectedClass || !selectedSubject || !selectedChapter) {
      toast({ title: "Please select class, subject, and chapter", variant: "destructive" });
      return;
    }
    if (!questionText.trim()) {
      toast({ title: "Please enter question text", variant: "destructive" });
      return;
    }
    toast({ title: "Question saved successfully!" });
    navigate("/superadmin/questions/curriculum");
  };

  const isMCQ = questionType === "mcq_single" || questionType === "mcq_multiple";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Curriculum Question"
        description="Add a new question to the curriculum tree"
        breadcrumbs={[
          { label: "Question Bank" },
          { label: "Curriculum Questions", href: "/superadmin/questions/curriculum" },
          { label: "Create" },
        ]}
      />

      {/* Classification Row - Compact horizontal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setSelectedSubject(""); setSelectedChapter(""); setSelectedTopic(""); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v); setSelectedChapter(""); setSelectedTopic(""); }} disabled={!selectedClass}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedChapter} onValueChange={(v) => { setSelectedChapter(v); setSelectedTopic(""); }} disabled={!selectedSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={!selectedChapter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Topic (optional)" />
              </SelectTrigger>
              <SelectContent>
                {topics.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Question Type - Toggle chips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Question Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(questionTypeLabels) as [QuestionType, string][]).map(([key, label]) => (
              <Button
                key={key}
                variant={questionType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setQuestionType(key)}
                className={cn(
                  questionType === key && "gradient-button"
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Details - Left 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Question Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Text</Label>
                <Textarea
                  placeholder="Enter your question..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="min-h-[100px] mt-1.5"
                />
              </div>

              {isMCQ && (
                <div className="space-y-3">
                  <Label>Options</Label>
                  {options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-3">
                      <span className="font-medium text-sm w-6">{opt.id.toUpperCase()}.</span>
                      <Input
                        placeholder={`Option ${opt.id.toUpperCase()}`}
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...options];
                          newOpts[idx].text = e.target.value;
                          setOptions(newOpts);
                        }}
                        className="flex-1"
                      />
                      <input
                        type={questionType === "mcq_single" ? "radio" : "checkbox"}
                        name="correctAnswer"
                        checked={opt.isCorrect}
                        onChange={() => {
                          if (questionType === "mcq_single") {
                            setOptions(options.map((o, i) => ({ ...o, isCorrect: i === idx })));
                          } else {
                            const newOpts = [...options];
                            newOpts[idx].isCorrect = !newOpts[idx].isCorrect;
                            setOptions(newOpts);
                          }
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Collapsible Solution */}
              <Collapsible open={solutionOpen} onOpenChange={setSolutionOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    Solution & Explanation
                    {solutionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Textarea
                    placeholder="Enter solution/explanation..."
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="min-h-[80px]"
                  />
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Meta - Right sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Difficulty - Toggle buttons */}
              <div>
                <Label className="mb-2 block">Difficulty</Label>
                <div className="flex gap-2">
                  {(["easy", "medium", "hard"] as QuestionDifficulty[]).map((d) => (
                    <Button
                      key={d}
                      variant={difficulty === d ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 capitalize",
                        difficulty === d && (
                          d === "easy" ? "bg-green-600 hover:bg-green-700" :
                          d === "medium" ? "bg-amber-500 hover:bg-amber-600" :
                          "bg-red-600 hover:bg-red-700"
                        )
                      )}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cognitive Type */}
              <div>
                <Label className="mb-2 block">Cognitive Type</Label>
                <Select value={cognitiveType} onValueChange={(v) => setCognitiveType(v as CognitiveType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(cognitiveTypeLabels) as [CognitiveType, string][]).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Marks</Label>
                  <Input type="number" value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="mt-1.5" />
                </div>
                <div>
                  <Label>Negative</Label>
                  <Input type="number" value={negativeMarks} onChange={(e) => setNegativeMarks(Number(e.target.value))} className="mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/superadmin/questions/curriculum")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="gradient-button">
          Save Question
        </Button>
      </div>
    </div>
  );
};

export default CreateCurriculumQuestion;
