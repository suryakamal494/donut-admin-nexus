import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, ChevronLeft, Loader2, Info, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AIContentPreviewEditor, Slide } from "@/components/content/AIContentPreviewEditor";
import { availableClasses, availableSubjects, assignedTracks } from "@/data/instituteData";
import { getSubjectsForCourse, getChaptersForCourseBySubject, subjects as masterSubjects } from "@/data/masterData";
import { getChaptersByClassAndSubject, getTopicsByChapter } from "@/data/cbseMasterData";

const stylePresets = [
  { id: "detailed", label: "Detailed", description: "Comprehensive with examples" },
  { id: "concise", label: "Concise", description: "Brief and to the point" },
];

const InstituteAIContentGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Classification with course selection
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  
  // Step 2: Prompt
  const [prompt, setPrompt] = useState("");
  const [stylePreset, setStylePreset] = useState("detailed");
  const [slideCount, setSlideCount] = useState([10]);
  
  // Step 3: Generated content
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [presentationTitle, setPresentationTitle] = useState("");

  // Determine if selected course has classes
  const selectedTrack = assignedTracks.find(t => t.id === selectedCourse);
  const isCBSE = selectedTrack?.hasClasses ?? false;

  // Get available subjects based on course
  const availableSubjectsForCourse = useMemo(() => {
    if (!selectedCourse) return [];
    if (isCBSE) {
      return availableSubjects;
    } else {
      const courseSubjects = getSubjectsForCourse(selectedCourse);
      return courseSubjects.map(cs => ({ id: cs.id, name: cs.name }));
    }
  }, [selectedCourse, isCBSE]);

  // Get available chapters based on course/class/subject
  const availableChapters = useMemo(() => {
    if (!selectedSubject) return [];
    if (isCBSE && selectedClass) {
      return getChaptersByClassAndSubject(selectedClass, selectedSubject);
    } else if (!isCBSE) {
      return getChaptersForCourseBySubject(selectedCourse, selectedSubject);
    }
    return [];
  }, [selectedCourse, selectedClass, selectedSubject, isCBSE]);

  // Get available topics based on chapter
  const availableTopics = useMemo(() => {
    if (!selectedChapter) return [];
    return getTopicsByChapter(selectedChapter);
  }, [selectedChapter]);

  // Reset handlers
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedClass("");
    setSelectedSubject("");
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    setSelectedSubject("");
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setSelectedTopic("");
  };

  // Validation
  const canProceedStep1 = selectedCourse && selectedSubject && selectedChapter && (isCBSE ? selectedClass : true);
  const canProceedStep2 = prompt.trim().length >= 20;

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with mock data
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const chapterName = availableChapters.find(c => c.id === selectedChapter)?.name || selectedChapter;
    const topicName = availableTopics.find(t => t.id === selectedTopic)?.name || chapterName;
    
    const mockSlides: Slide[] = Array.from({ length: slideCount[0] }, (_, i) => ({
      id: `slide-${i + 1}`,
      title: i === 0 
        ? `Introduction to ${topicName}`
        : i === slideCount[0] - 1 
          ? "Summary & Key Takeaways"
          : `${topicName} - Part ${i}`,
      content: i === 0
        ? `Welcome to this presentation on ${topicName}. In this lesson, we will explore the fundamental concepts and their real-world applications.\n\n• Understanding the basics\n• Key principles and theories\n• Practical examples`
        : i === slideCount[0] - 1
          ? `Let's recap what we learned:\n\n• Core concepts of ${topicName}\n• Important formulas and relationships\n• Real-world applications\n\nRemember to practice with the exercises provided!`
          : `This section covers important aspects of ${topicName}.\n\n• Key point ${i}.1: Explanation of the concept\n• Key point ${i}.2: Supporting details\n• Key point ${i}.3: Examples and applications\n\nNote: Understanding this will help in grasping advanced topics.`,
    }));
    
    setGeneratedSlides(mockSlides);
    setPresentationTitle(`${topicName} - Complete Guide`);
    setIsGenerating(false);
    setCurrentStep(3);
  };

  const handleSaveToLibrary = () => {
    toast({
      title: "Content Saved!",
      description: `"${presentationTitle}" has been added to your Content Library.`,
    });
    navigate("/institute/content");
  };

  const handleSlidesUpdate = (slides: Slide[]) => {
    setGeneratedSlides(slides);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
              currentStep >= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={cn(
                "w-16 md:w-24 h-1 mx-2",
                currentStep > step ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">Tell us what topic to create content for</p>
          <p className="text-sm text-muted-foreground mt-1">
            Select the course, {isCBSE ? "class, " : ""}subject, and chapter. This helps the AI create accurate, curriculum-aligned content.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 space-y-5">
        {/* Course Selection */}
        <div className="space-y-3">
          <Label>Select Course *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assignedTracks.map((track) => (
              <label
                key={track.id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                  selectedCourse === track.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={selectedCourse === track.id}
                  onCheckedChange={() => handleCourseChange(track.id)}
                />
                <div>
                  <p className="font-medium">{track.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {track.hasClasses ? "Curriculum-based" : "Competitive exam"}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Class - Only for CBSE */}
        {selectedCourse && isCBSE && (
          <div className="space-y-2">
            <Label>Class *</Label>
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Which class is this content for?</p>
          </div>
        )}

        {/* Subject */}
        {selectedCourse && (!isCBSE || selectedClass) && (
          <div className="space-y-2">
            <Label>Subject *</Label>
            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjectsForCourse.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Choose the subject area</p>
          </div>
        )}

        {/* Chapter */}
        {selectedSubject && (
          <div className="space-y-2">
            <Label>Chapter *</Label>
            <Select value={selectedChapter} onValueChange={handleChapterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {availableChapters.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Select the chapter this content belongs to</p>
          </div>
        )}

        {/* Topic */}
        {selectedChapter && availableTopics.length > 0 && (
          <div className="space-y-2">
            <Label>Topic (Optional)</Label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select topic for more specific content" />
              </SelectTrigger>
              <SelectContent>
                {availableTopics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Narrow down to a specific topic if needed</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setCurrentStep(2)}
          disabled={!canProceedStep1}
          className="gradient-button gap-2"
        >
          Continue <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">Describe what you want to create</p>
          <p className="text-sm text-muted-foreground mt-1">
            Write a brief description of the presentation. The more specific you are, the better the result!
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 space-y-5">
        <div className="space-y-2">
          <Label>Your Prompt *</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a presentation explaining Newton's three laws of motion with real-world examples. Include diagrams for each law and end with practice problems."
            className="min-h-32"
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimum 20 characters</span>
            <span>{prompt.length}/500</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Presentation Style</Label>
          <div className="grid grid-cols-2 gap-3">
            {stylePresets.map((style) => (
              <button
                key={style.id}
                onClick={() => setStylePreset(style.id)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  stylePreset === style.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <p className="font-medium">{style.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{style.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Number of Slides</Label>
            <span className="text-sm font-medium text-primary">{slideCount[0]} slides</span>
          </div>
          <Slider
            value={slideCount}
            onValueChange={setSlideCount}
            min={5}
            max={20}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 slides (brief)</span>
            <span>20 slides (comprehensive)</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={!canProceedStep2 || isGenerating}
          className="gradient-button gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Presentation
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <AIContentPreviewEditor
        slides={generatedSlides}
        onSlidesChange={handleSlidesUpdate}
        presentationTitle={presentationTitle}
        onTitleChange={setPresentationTitle}
        onSave={handleSaveToLibrary}
        onBack={() => setCurrentStep(2)}
        classification={{
          class: selectedClass,
          subject: selectedSubject,
          chapter: selectedChapter,
          topic: selectedTopic,
        }}
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Content Generator"
        description="Create engaging presentations with AI assistance"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Content", href: "/institute/content" },
          { label: "AI Generator" },
        ]}
      />

      {currentStep < 3 && (
        <>
          {renderStepIndicator()}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">
              {currentStep === 1 && "Step 1: Choose Topic"}
              {currentStep === 2 && "Step 2: Describe Your Content"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {currentStep === 1 && "Select the classification for your content"}
              {currentStep === 2 && "Tell the AI what kind of presentation you need"}
            </p>
          </div>
        </>
      )}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
};

export default InstituteAIContentGenerator;