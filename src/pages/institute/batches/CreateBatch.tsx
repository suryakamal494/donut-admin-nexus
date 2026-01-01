import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { availableClasses, availableSubjects } from "@/data/instituteData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Select Class", description: "Choose the class for this batch" },
  { id: 2, name: "Batch Details", description: "Name your batch" },
  { id: 3, name: "Assign Subjects", description: "Select subjects for this batch" },
];

const CreateBatch = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [selectedClass, setSelectedClass] = useState("");
  const [batchName, setBatchName] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear - 1}-${String(currentYear).slice(2)}`,
    `${currentYear}-${String(currentYear + 1).slice(2)}`,
    `${currentYear + 1}-${String(currentYear + 2).slice(2)}`,
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedClass;
      case 2:
        return !!batchName.trim() && !!academicYear;
      case 3:
        return selectedSubjects.length > 0;
      default:
        return false;
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((s) => s !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSelectAllSubjects = () => {
    if (selectedSubjects.length === availableSubjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(availableSubjects.map((s) => s.id));
    }
  };

  const handleCreate = () => {
    const selectedClassName = availableClasses.find((c) => c.id === selectedClass)?.name;
    toast.success(`Batch "${batchName}" created successfully for ${selectedClassName}!`);
    navigate("/institute/batches");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Create New Batch"
        description="Set up a new batch by following these simple steps. A batch groups students who study together."
        actions={
          <Button variant="outline" onClick={() => navigate("/institute/batches")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
        }
      />

      {/* Stepper */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center font-medium transition-all duration-300",
                  currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-2">
        <CardContent className="p-8">
          {/* Step 1: Select Class */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Select a Class</h2>
                <p className="text-muted-foreground mt-1">
                  Choose the class for which you want to create a new batch
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {availableClasses.map((cls) => (
                  <Card
                    key={cls.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:border-primary/50",
                      selectedClass === cls.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedClass(cls.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <p className={cn(
                        "font-medium",
                        selectedClass === cls.id ? "text-primary" : "text-foreground"
                      )}>
                        {cls.name}
                      </p>
                      {selectedClass === cls.id && (
                        <CheckCircle2 className="h-4 w-4 text-primary mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Batch Details */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Batch Details</h2>
                <p className="text-muted-foreground mt-1">
                  Give your batch a name that's easy to identify
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="batchName">Batch Name</Label>
                  <Input
                    id="batchName"
                    placeholder="e.g., Section A, Blue Group, Morning Batch"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Use names like "Section A", "Section B" or custom names like "Science Toppers"
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Creating batch for: </span>
                    {availableClasses.find((c) => c.id === selectedClass)?.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Assign Subjects */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Assign Subjects</h2>
                <p className="text-muted-foreground mt-1">
                  Select all subjects that will be taught in this batch
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="selectAll"
                      checked={selectedSubjects.length === availableSubjects.length}
                      onCheckedChange={handleSelectAllSubjects}
                    />
                    <Label htmlFor="selectAll" className="cursor-pointer">
                      Select All Subjects
                    </Label>
                  </div>
                  <Badge variant="secondary">
                    {selectedSubjects.length} selected
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSubjects.map((subject) => {
                    const isSelected = selectedSubjects.includes(subject.id);
                    return (
                      <div
                        key={subject.id}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30 hover:bg-muted/50"
                        )}
                        onClick={() => handleSubjectToggle(subject.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSubjectToggle(subject.id)}
                        />
                        <span className={cn(
                          "font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>
                          {subject.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-muted/50 rounded-lg mt-6">
                  <p className="text-sm font-medium text-foreground mb-2">Summary</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Batch:</span> {batchName} ({availableClasses.find((c) => c.id === selectedClass)?.name})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Academic Year:</span> {academicYear}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Subjects:</span> {selectedSubjects.length} selected
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={!canProceed()}
          >
            Next Step
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Check className="h-4 w-4 mr-2" />
            Create Batch
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateBatch;
