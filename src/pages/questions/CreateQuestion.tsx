import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const questionTypes = [
  { id: "mcq", label: "MCQ (Single Correct)" },
  { id: "multiple", label: "Multiple Correct" },
  { id: "numerical", label: "Numerical" },
  { id: "assertion", label: "Assertion-Reasoning" },
  { id: "fill", label: "Fill in Blanks" },
  { id: "short", label: "Short Answer" },
  { id: "long", label: "Long Answer" },
];

const CreateQuestion = () => {
  const [questionType, setQuestionType] = useState("mcq");
  const [options, setOptions] = useState(["", "", "", ""]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({ title: "Question Created!", description: "Question has been added to the bank." });
    navigate("/superadmin/questions");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Question"
        description="Add a new question to the question bank"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Questions", href: "/superadmin/questions" },
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
                <Label>Question Text</Label>
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
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Classification</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="maths">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chapter</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanics">Mechanics</SelectItem>
                    <SelectItem value="thermo">Thermodynamics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newton">Newton's Laws</SelectItem>
                    <SelectItem value="energy">Work & Energy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

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

          <Button className="w-full gradient-button" onClick={handleSubmit}>Save Question</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;