import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";
import { questionTypeLabels, type QuestionType, cognitiveTypeLabels, type CognitiveType, type QuestionDifficulty } from "@/data/questionsData";
import { getPublishedCourses, getSubjectsForCourse, getChaptersForCourseBySubject, courseOwnedChapterTopics } from "@/data/masterData";
import { getTopicsByChapter } from "@/data/cbseMasterData";
import { cn } from "@/lib/utils";

const CreateCourseQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Classification state - Course → Subject → Chapter → Topic
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Question state
  const [questionType, setQuestionType] = useState<QuestionType>("mcq_single");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [solution, setSolution] = useState("");
  const [solutionOpen, setSolutionOpen] = useState(false);

  // Meta state
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("medium");
  const [cognitiveType, setCognitiveType] = useState<CognitiveType>("conceptual");
  const [marks, setMarks] = useState("4");
  const [negativeMarks, setNegativeMarks] = useState("1");

  const publishedCourses = getPublishedCourses();

  // Cascading data: Course → Subject → Chapter → Topic
  const availableSubjects = useMemo(() => {
    if (!selectedCourse) return [];
    return getSubjectsForCourse(selectedCourse);
  }, [selectedCourse]);

  const availableChapters = useMemo(() => {
    if (!selectedCourse || !selectedSubject) return [];
    return getChaptersForCourseBySubject(selectedCourse, selectedSubject);
  }, [selectedCourse, selectedSubject]);

  const availableTopics = useMemo(() => {
    if (!selectedChapter) return [];
    // Check if it's a course-owned chapter
    const courseTopics = courseOwnedChapterTopics.filter(t => t.chapterId === selectedChapter);
    if (courseTopics.length > 0) return courseTopics;
    // Otherwise get from CBSE topics
    return getTopicsByChapter(selectedChapter);
  }, [selectedChapter]);

  // Reset dependent fields when parent changes
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedSubject("");
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
    setSelectedTopic("");
  };

  const isMCQ = questionType === "mcq_single" || questionType === "mcq_multiple" || questionType === "assertion_reasoning";

  const handleSubmit = () => {
    if (!selectedCourse || !selectedSubject || !selectedChapter) {
      toast({ title: "Missing classification", description: "Please select course, subject, and chapter", variant: "destructive" });
      return;
    }
    if (!questionText.trim()) {
      toast({ title: "Missing question", description: "Please enter the question text", variant: "destructive" });
      return;
    }
    toast({ title: "Question saved", description: "Course question has been created successfully" });
    navigate("/superadmin/questions/course");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Course Question"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Course Questions", href: "/superadmin/questions/course" },
          { label: "Create Question" },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      {/* Classification - Horizontal Bar: Course → Subject → Chapter → Topic */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-sm font-medium text-muted-foreground mb-3 block">Classification</Label>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCourse} onValueChange={handleCourseChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                {publishedCourses.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={handleSubjectChange} disabled={!selectedCourse}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.chapterCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedChapter} onValueChange={handleChapterChange} disabled={!selectedSubject}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent>
                {availableChapters.map(ch => (
                  <SelectItem key={ch.id} value={ch.id}>
                    <span className="flex items-center gap-2">
                      {ch.isCourseOwned ? (
                        <Star className="h-3 w-3 text-amber-500" />
                      ) : (
                        <BookOpen className="h-3 w-3 text-blue-500" />
                      )}
                      {ch.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={!selectedChapter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Topic (optional)" />
              </SelectTrigger>
              <SelectContent>
                {availableTopics.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Question Type - Horizontal */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-sm font-medium text-muted-foreground mb-3 block">Question Type</Label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(questionTypeLabels) as [QuestionType, string][]).map(([key, label]) => (
              <Button
                key={key}
                type="button"
                variant={questionType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setQuestionType(key)}
                className={cn(questionType === key && "gradient-button")}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Question Text *</Label>
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the question..."
                  className="min-h-[120px]"
                />
              </div>

              {isMCQ && (
                <div className="space-y-3">
                  <Label>Options</Label>
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={correctOption === idx ? "default" : "outline"}
                        size="sm"
                        className={cn("w-8 h-8 p-0", correctOption === idx && "bg-green-600 hover:bg-green-700")}
                        onClick={() => setCorrectOption(idx)}
                      >
                        {String.fromCharCode(65 + idx)}
                      </Button>
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[idx] = e.target.value;
                          setOptions(newOptions);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">Click the letter button to mark as correct answer</p>
                </div>
              )}

              <Collapsible open={solutionOpen} onOpenChange={setSolutionOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 w-full justify-start text-muted-foreground">
                    <ChevronDown className={cn("h-4 w-4 transition-transform", solutionOpen && "rotate-180")} />
                    Solution / Explanation
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Enter the solution or explanation..."
                    className="min-h-[100px]"
                  />
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Properties */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <div className="flex gap-2">
                  {(["easy", "medium", "hard"] as QuestionDifficulty[]).map((d) => (
                    <Button
                      key={d}
                      type="button"
                      variant={difficulty === d ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(d)}
                      className={cn("flex-1 capitalize", difficulty === d && "gradient-button")}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cognitive Type</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marks</Label>
                  <Input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} min="1" />
                </div>
                <div className="space-y-2">
                  <Label>Negative Marks</Label>
                  <Input type="number" value={negativeMarks} onChange={(e) => setNegativeMarks(e.target.value)} min="0" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSubmit} className="gradient-button">Save Question</Button>
      </div>
    </div>
  );
};

export default CreateCourseQuestion;
