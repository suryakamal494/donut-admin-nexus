import { useState, useMemo } from "react";
import { ArrowLeft, CheckCircle, Plus, AlertCircle, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { QuestionCard } from "@/components/questions";
import { mockQuestions, Question } from "@/data/questionsData";

const ReviewQuestions = () => {
  const navigate = useNavigate();
  
  // Get questions pending review (status = "review")
  const reviewQuestions = useMemo(() => {
    return mockQuestions.filter((q) => q.status === "review").slice(0, 12);
  }, []);

  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCount = reviewQuestions.length - excludedIds.size;

  const toggleExclude = (questionId: string) => {
    setExcludedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAddToBank = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${selectedCount} questions added to Question Bank successfully!`);
      navigate("/superadmin/questions");
    }, 1500);
  };

  const handleEditQuestion = (question: Question) => {
    console.log("Edit question:", question.id);
  };

  if (reviewQuestions.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Review Questions"
          breadcrumbs={[
            { label: "Dashboard", href: "/superadmin/dashboard" },
            { label: "Question Bank", href: "/superadmin/questions" },
            { label: "Review" },
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

        <div className="bg-card rounded-2xl p-12 text-center shadow-soft border border-border/50 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
          <p className="text-muted-foreground mb-6">
            No questions pending review at the moment.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/superadmin/questions/ai">
              <Button variant="outline" className="gap-2">
                Generate with AI
              </Button>
            </Link>
            <Link to="/superadmin/questions/upload-pdf">
              <Button className="gradient-button gap-2">
                <Plus className="w-4 h-4" />
                Upload PDF
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Review Questions"
        description="Review and edit questions before adding them to the Question Bank."
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Question Bank", href: "/superadmin/questions" },
          { label: "Review" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/superadmin/questions">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="gradient-button gap-2"
                  disabled={selectedCount === 0 || isSubmitting}
                >
                  <CheckCircle className="w-4 h-4" />
                  Add to Question Bank ({selectedCount})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add to Question Bank?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <span className="font-semibold text-foreground">{selectedCount}</span> selected questions will be added to the master Question Bank.
                    {excludedIds.size > 0 && (
                      <span className="block mt-2 text-muted-foreground">
                        ({excludedIds.size} questions will be excluded)
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddToBank}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      {/* Info Banner */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Questions generated successfully.</span>{" "}
            Please review and edit them before adding to the Question Bank.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <Badge variant="outline" className="text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2 bg-card">
          <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          {reviewQuestions.length} <span className="hidden xs:inline">Questions to</span> Review
        </Badge>
        <Badge variant="outline" className="text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2 bg-success/10 text-success border-success/20">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          {selectedCount} Selected
        </Badge>
        {excludedIds.size > 0 && (
          <Badge variant="outline" className="text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2 bg-muted">
            {excludedIds.size} Excluded
          </Badge>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {reviewQuestions.map((question, index) => (
          <div key={question.id} className="relative">
            {/* Exclude Checkbox */}
            <div className="absolute left-0 sm:-left-3 top-3 sm:top-5 z-10 bg-card rounded-lg shadow-md p-1.5 sm:p-2 border border-border/50">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Checkbox
                  id={`exclude-${question.id}`}
                  checked={!excludedIds.has(question.id)}
                  onCheckedChange={() => toggleExclude(question.id)}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                />
                <label 
                  htmlFor={`exclude-${question.id}`}
                  className="text-[10px] sm:text-xs font-medium text-muted-foreground cursor-pointer hidden sm:inline"
                >
                  {excludedIds.has(question.id) ? "Excluded" : "Include"}
                </label>
              </div>
            </div>

            <div className={excludedIds.has(question.id) ? "opacity-50" : ""}>
              <QuestionCard
                question={question}
                onEdit={handleEditQuestion}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewQuestions;