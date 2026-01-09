import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { SubjectBadge } from "@/components/subject";
import { availableSubjects, batches, assignedTracks, teachers } from "@/data/instituteData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Basic Info", description: "Teacher details" },
  { id: 2, name: "Subjects", description: "Assign subjects" },
  { id: 3, name: "Courses & Batches", description: "Assign to courses and batches" },
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
  const { teacherId } = useParams();
  const isEditMode = !!teacherId;
  const existingTeacher = isEditMode ? teachers.find((t) => t.id === teacherId) : null;
  
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedBatchMappings, setSelectedBatchMappings] = useState<
    { batchId: string; subjectId: string }[]
  >([]);

  // Pre-populate form fields when in edit mode
  useEffect(() => {
    if (existingTeacher) {
      setName(existingTeacher.name);
      setEmail(existingTeacher.email);
      setMobile(existingTeacher.mobile);
      setUsername(existingTeacher.username);
      setPassword(""); // Don't show existing password
      setSelectedSubjects(existingTeacher.subjects);
      setSelectedCourses(existingTeacher.assignedCourses);
      // Map batches to batch mappings format
      const mappings = existingTeacher.batches.map((b) => {
        const subjectId = availableSubjects.find((s) => s.name === b.subject)?.id || "";
        return { batchId: b.batchId, subjectId };
      });
      setSelectedBatchMappings(mappings);
    }
  }, [existingTeacher]);

  // Get batches that:
  // 1. Have at least one of the selected subjects
  // 2. AND are assigned to at least one of the selected courses
  const relevantBatches = batches.filter(
    (batch) =>
      batch.subjects.some((s) => selectedSubjects.includes(s)) &&
      batch.assignedCourses.some((c) => selectedCourses.includes(c))
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
        return selectedCourses.length > 0 && selectedBatchMappings.length > 0;
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

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) => {
      const newCourses = prev.includes(courseId)
        ? prev.filter((c) => c !== courseId)
        : [...prev, courseId];

      // Remove batch mappings for batches no longer in selected courses
      if (!newCourses.includes(courseId)) {
        setSelectedBatchMappings((mappings) =>
          mappings.filter((m) => {
            const batch = batches.find((b) => b.id === m.batchId);
            return batch?.assignedCourses.some((c) => newCourses.includes(c));
          })
        );
      }

      return newCourses;
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
    if (isEditMode) {
      toast.success(`Teacher "${name}" updated successfully!`);
    } else {
      toast.success(`Teacher "${name}" added successfully!`);
    }
    navigate("/institute/teachers");
  };

  const getSubjectName = (subjectId: string) => {
    return availableSubjects.find((s) => s.id === subjectId)?.name || subjectId;
  };

  const getCourseName = (courseId: string) => {
    return assignedTracks.find((t) => t.id === courseId)?.name || courseId;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={isEditMode ? "Edit Teacher" : "Add New Teacher"}
        description={isEditMode 
          ? "Update the teacher's information, subjects, and batch assignments."
          : "Add a teacher to your institute. You can assign subjects and map them to specific batches."
        }
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
                  "h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-medium text-sm md:text-base transition-all duration-300",
                  currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : step.id}
              </div>
              <div className="mt-2 md:mt-3 text-center">
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
        <CardContent className="p-4 sm:p-6 md:p-8">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label htmlFor="password">{isEditMode ? "New Password (leave blank to keep current)" : "Password *"}</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isEditMode ? "Enter new password" : ""}
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
                      className="shrink-0"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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

          {/* Step 3: Courses & Batches */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Courses & Batches</h2>
                <p className="text-muted-foreground mt-1">
                  Select courses this teacher teaches, then assign to batches
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-8">
                {/* Step 1: Select Courses */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Step 1</Badge>
                    <h3 className="font-medium">Select Courses</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {assignedTracks.map((track) => {
                      const isSelected = selectedCourses.includes(track.id);
                      return (
                        <div
                          key={track.id}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          )}
                          onClick={() => handleCourseToggle(track.id)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleCourseToggle(track.id)}
                          />
                          <div>
                            <p className="font-medium">{track.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {track.type === "curriculum"
                                ? "Standard curriculum"
                                : "Competitive exam preparation"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Assign Batches (only if courses selected) */}
                {selectedCourses.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Step 2</Badge>
                      <h3 className="font-medium">Assign Batches</h3>
                      <span className="text-xs text-muted-foreground">
                        (Filtered by selected courses)
                      </span>
                    </div>

                    {selectedSubjects.map((subjectId) => {
                      const subjectBatches = relevantBatches.filter((b) =>
                        b.subjects.includes(subjectId)
                      );

                      if (subjectBatches.length === 0) return null;

                      return (
                        <div key={subjectId} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <SubjectBadge subject={getSubjectName(subjectId)} />
                            <span className="text-sm text-muted-foreground">
                              ({subjectBatches.length} batches available)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-4">
                            {subjectBatches.map((batch) => {
                              const isSelected = isBatchSubjectSelected(
                                batch.id,
                                subjectId
                              );
                              return (
                                <div
                                  key={`${batch.id}-${subjectId}`}
                                  className={cn(
                                    "flex flex-col gap-1 p-3 rounded-lg border cursor-pointer transition-all text-sm",
                                    isSelected
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/30"
                                  )}
                                  onClick={() =>
                                    handleBatchMappingToggle(batch.id, subjectId)
                                  }
                                >
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() =>
                                        handleBatchMappingToggle(batch.id, subjectId)
                                      }
                                    />
                                    <span className="font-medium">
                                      {batch.className} - {batch.name}
                                    </span>
                                  </div>
                                  <div className="flex gap-1 pl-6">
                                    {batch.assignedCourses.map((courseId) => (
                                      <Badge
                                        key={courseId}
                                        variant="secondary"
                                        className="text-[10px] px-1.5 py-0"
                                      >
                                        {getCourseName(courseId)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {relevantBatches.length === 0 && (
                      <p className="text-center text-muted-foreground py-4 bg-muted/30 rounded-lg">
                        No batches found matching selected subjects and courses.
                      </p>
                    )}
                  </div>
                )}

                {selectedCourses.length === 0 && (
                  <p className="text-center text-muted-foreground py-8 bg-muted/30 rounded-lg">
                    Select at least one course above to see available batches.
                  </p>
                )}

                {/* Summary */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">Summary</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Teacher:</span> {name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Courses:</span>{" "}
                    {selectedCourses.length > 0
                      ? selectedCourses.map((c) => getCourseName(c)).join(", ")
                      : "None selected"}
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
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={!canProceed()}
            className="w-full sm:w-auto"
          >
            Next Step
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={!canProceed() || (!isEditMode && !password.trim())}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80"
          >
            <Check className="h-4 w-4 mr-2" />
            {isEditMode ? "Save Changes" : "Add Teacher"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateTeacher;
