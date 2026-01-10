import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Loader2, 
  Check, 
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AIGenerationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (questions: GeneratedQuestion[]) => void;
  subjects: string[];
  totalQuestions: number;
}

interface GeneratedQuestion {
  id: string;
  text: string;
  type: "mcq";
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  options: string[];
  correctAnswer: number;
}

// Sample generated questions
const sampleQuestions: GeneratedQuestion[] = [
  {
    id: "gen-1",
    text: "A ball is thrown vertically upward with initial velocity 20 m/s. What is the maximum height reached?",
    type: "mcq",
    difficulty: "easy",
    subject: "Physics",
    options: ["10 m", "20 m", "30 m", "40 m"],
    correctAnswer: 1,
  },
  {
    id: "gen-2",
    text: "The pH of a neutral solution at 25°C is:",
    type: "mcq",
    difficulty: "easy",
    subject: "Chemistry",
    options: ["0", "7", "14", "1"],
    correctAnswer: 1,
  },
  {
    id: "gen-3",
    text: "Find the derivative of f(x) = x³ + 2x² - 5x + 3",
    type: "mcq",
    difficulty: "medium",
    subject: "Mathematics",
    options: ["3x² + 4x - 5", "3x² + 2x - 5", "x² + 4x - 5", "3x² - 4x + 5"],
    correctAnswer: 0,
  },
  {
    id: "gen-4",
    text: "Which law states that electric current in a conductor is directly proportional to voltage?",
    type: "mcq",
    difficulty: "easy",
    subject: "Physics",
    options: ["Faraday's Law", "Ohm's Law", "Kirchhoff's Law", "Coulomb's Law"],
    correctAnswer: 1,
  },
  {
    id: "gen-5",
    text: "The molecular geometry of SF₆ is:",
    type: "mcq",
    difficulty: "hard",
    subject: "Chemistry",
    options: ["Tetrahedral", "Trigonal bipyramidal", "Octahedral", "Square planar"],
    correctAnswer: 2,
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "hard": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    default: return "bg-muted text-muted-foreground";
  }
};

export const AIGenerationSheet = ({
  open,
  onOpenChange,
  onAccept,
  subjects,
  totalQuestions,
}: AIGenerationSheetProps) => {
  const isMobile = useIsMobile();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedQuestions(sampleQuestions.slice(0, Math.min(5, totalQuestions)));
    setHasGenerated(true);
    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Shuffle and return different subset
    setGeneratedQuestions([...sampleQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(5, totalQuestions)));
    setIsGenerating(false);
  };

  const handleAccept = () => {
    onAccept(generatedQuestions);
    onOpenChange(false);
    // Reset state
    setPrompt("");
    setGeneratedQuestions([]);
    setHasGenerated(false);
  };

  const content = (
    <div className="space-y-4 flex flex-col h-full">
      {!hasGenerated ? (
        <>
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label className="text-sm">Describe what you want</Label>
            <Textarea
              placeholder="E.g., Generate questions on Newton's Laws of Motion focusing on numerical problems..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Selected Config */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-muted-foreground">Subjects:</span>
              {subjects.map((sub) => (
                <Badge key={sub} variant="secondary" className="text-[10px]">
                  {sub}
                </Badge>
              ))}
              <span className="text-muted-foreground ml-2">•</span>
              <span className="text-muted-foreground">{totalQuestions} questions</span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-12 gradient-button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Questions
              </>
            )}
          </Button>
        </>
      ) : (
        <>
          {/* Generated Questions Preview */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Generated Questions</span>
            <Badge variant="secondary">{generatedQuestions.length} questions</Badge>
          </div>

          <ScrollArea className="flex-1 -mx-1 px-1">
            <div className="space-y-2">
              {generatedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3 bg-card border rounded-lg space-y-2"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge className={cn("text-[9px] px-1.5", getDifficultyColor(q.difficulty))}>
                          {q.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] px-1.5">
                          {q.subject}
                        </Badge>
                      </div>
                      <p className="text-xs leading-relaxed">{q.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex-1 h-11"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isGenerating}
              className="flex-1 h-11 gradient-button"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Question Generator
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 flex-1 overflow-hidden flex flex-col">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Question Generator
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};
