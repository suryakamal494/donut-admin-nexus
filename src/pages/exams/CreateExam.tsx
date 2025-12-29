import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, FileQuestion, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Exam Details", icon: ClipboardList },
  { id: 2, title: "Question Selection", icon: FileQuestion },
  { id: 3, title: "Assign Batches", icon: Users },
];

const CreateExam = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({ title: "Exam Created!", description: "The exam has been scheduled successfully." });
    navigate("/superadmin/exams");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Exam"
        description="Set up a new examination"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Exams", href: "/superadmin/exams" },
          { label: "Create" },
        ]}
      />

      {/* Stepper */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  currentStep >= step.id ? "gradient-button" : "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <div className="hidden md:block">
                  <p className={cn("text-sm font-medium", currentStep >= step.id ? "text-foreground" : "text-muted-foreground")}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-4", currentStep > step.id ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Exam Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label>Exam Name *</Label>
                <Input placeholder="e.g., JEE Physics Chapter Test - Mechanics" />
              </div>
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chapter">Chapter Test</SelectItem>
                    <SelectItem value="topic">Topic Test</SelectItem>
                    <SelectItem value="subject">Subject Test</SelectItem>
                    <SelectItem value="grand">Grand Test</SelectItem>
                    <SelectItem value="live">Live Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="maths">Mathematics</SelectItem>
                    <SelectItem value="all">All Subjects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" defaultValue="60" />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input type="number" defaultValue="100" />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="datetime-local" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Question Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                <h4 className="font-semibold">Manual Selection</h4>
                <p className="text-sm text-muted-foreground mt-1">Pick questions from bank</p>
              </div>
              <div className="p-6 rounded-xl border-2 border-border cursor-pointer hover:border-primary/50">
                <h4 className="font-semibold">AI Generated</h4>
                <p className="text-sm text-muted-foreground mt-1">Auto-generate based on criteria</p>
              </div>
              <div className="p-6 rounded-xl border-2 border-border cursor-pointer hover:border-primary/50">
                <h4 className="font-semibold">Random Selection</h4>
                <p className="text-sm text-muted-foreground mt-1">Random from chapter/topic</p>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl">
              <p className="text-sm text-muted-foreground">Question selection interface will appear here based on your choice.</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Assign Batches</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["JEE 2025 - Batch A", "JEE 2025 - Batch B", "NEET 2025", "CBSE Class 12"].map((batch) => (
                <label key={batch} className="p-4 rounded-xl border border-border cursor-pointer hover:border-primary/50 flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm font-medium">{batch}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} disabled={currentStep === 1}>
            Previous
          </Button>
          {currentStep < 3 ? (
            <Button className="gradient-button" onClick={() => setCurrentStep((s) => s + 1)}>
              Next
            </Button>
          ) : (
            <Button className="gradient-button" onClick={handleSubmit}>
              Create Exam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateExam;