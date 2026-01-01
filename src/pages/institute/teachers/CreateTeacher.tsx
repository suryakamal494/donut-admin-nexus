import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  BookOpen,
  Users,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { SubjectBadge } from "@/components/subject";
import { availableSubjects, batches } from "@/data/instituteData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Basic Info", description: "Teacher details" },
  { id: 2, name: "Subjects", description: "Assign subjects" },
  { id: 3, name: "Batches", description: "Map to batches" },
];

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const CreateTeacher = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedBatchMappings, setSelectedBatchMappings] = useState<
    { batchId: string; subjectId: string }[]
  >([]);

  // Get batches that have at least one of the selected subjects
  const relevantBatches = batches.filter((batch) =>
    batch.subjects.some((s) => selectedSubjects.includes(s))
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          name.trim() &&
          (email.trim() || mobile.trim()) &&
          username.trim() &&
          password.trim()
        );
      case 2:
        return selectedSubjects.length > 0;
      case 3:
        return selectedBatchMappings.length > 0;
      default:
        return false;
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      const newSubjects = prev.includes(subjectId)
        ? prev.filter((s) => s !== subjectId)
        : [...prev, subjectId];

      // Remove batch mappings for unselected subjects
      if (!newSubjects.includes(subjectId)) {
        setSelectedBatchMappings((mappings) =>
          mappings.filter((m) => m.subjectId !== subjectId)
        );
      }

      return newSubjects;
    });
  };

  const handleBatchMappingToggle = (batchId: string, subjectId: string) => {
    setSelectedBatchMappings((prev) => {
      const exists = prev.some(
        (m) => m.batchId === batchId && m.subjectId === subjectId
      );
      if (exists) {
        return prev.filter(
          (m) => !(m.batchId === batchId && m.subjectId === subjectId)
        );
      }
      return [...prev, { batchId, subjectId }];
    });
  };

  const isBatchSubjectSelected = (batchId: string, subjectId: string) => {
    return selectedBatchMappings.some(
      (m) => m.batchId === batchId && m.subjectId === subjectId
    );
  };

  const handleCreate = () => {
    toast.success(`Teacher "${name}" added successfully!`);
    navigate("/institute/teachers");
  };

  const getSubjectName = (subjectId: string) => {
    return availableSubjects.find((s) => s.id === subjectId)?.name || subjectId;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add New Teacher"
        description="Add a teacher to your institute. You can assign subjects and map them to specific batches."
        actions={
          <Button variant="outline" onClick={() => navigate("/institute/teachers")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Teachers
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
                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
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
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <p className="text-muted-foreground mt-1">
                  Enter the teacher's personal details
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Dr. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="teacher@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      placeholder="9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="e.g., rajesh.kumar"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The teacher will use this to log in
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPassword(generatePassword())}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Assign Subjects */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Assign Subjects</h2>
                <p className="text-muted-foreground mt-1">
                  Select the subjects this teacher will teach
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Click on subjects to select/deselect
                  </p>
                  <Badge variant="secondary">{selectedSubjects.length} selected</Badge>
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
                        <SubjectBadge subject={subject.name} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Map to Batches */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Assign to Batches</h2>
                <p className="text-muted-foreground mt-1">
                  Select which batches this teacher will teach each subject in
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                {selectedSubjects.map((subjectId) => {
                  const subjectBatches = relevantBatches.filter((b) =>
                    b.subjects.includes(subjectId)
                  );

                  return (
                    <div key={subjectId} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <SubjectBadge subject={getSubjectName(subjectId)} />
                        <span className="text-sm text-muted-foreground">
                          ({subjectBatches.length} batches available)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-4">
                        {subjectBatches.map((batch) => {
                          const isSelected = isBatchSubjectSelected(
                            batch.id,
                            subjectId
                          );
                          return (
                            <div
                              key={`${batch.id}-${subjectId}`}
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm",
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/30"
                              )}
                              onClick={() =>
                                handleBatchMappingToggle(batch.id, subjectId)
                              }
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleBatchMappingToggle(batch.id, subjectId)
                                }
                              />
                              <span>
                                {batch.className} - {batch.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {selectedSubjects.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No subjects selected. Go back and select subjects first.
                  </p>
                )}

                <div className="p-4 bg-muted/50 rounded-lg mt-6">
                  <p className="text-sm font-medium text-foreground mb-2">Summary</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Teacher:</span> {name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Subjects:</span>{" "}
                    {selectedSubjects.map((s) => getSubjectName(s)).join(", ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Total Batch Assignments:</span>{" "}
                    {selectedBatchMappings.length}
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
            Add Teacher
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateTeacher;
