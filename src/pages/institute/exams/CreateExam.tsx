import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { useExamCreation } from "@/hooks/useExamCreation";
import {
  ExamStepper,
  ExamDetailsStep,
  PatternUIStep,
  CustomConfigStep,
  CreationMethodStep,
  BatchAssignmentStep,
  CompletionStep,
} from "@/components/institute/exams/create";

const CreateExam = () => {
  const exam = useExamCreation();

  const getStepContent = () => {
    if (exam.processComplete) {
      return (
        <CompletionStep
          examName={exam.examName}
          onBackToExams={() => exam.navigate("/institute/exams")}
          onReviewQuestions={() => exam.navigate("/institute/exams/review/new")}
        />
      );
    }

    // Step 1: Exam Details
    if (exam.currentStep === 1) {
      return (
        <ExamDetailsStep
          examName={exam.examName}
          setExamName={exam.setExamName}
          selectedCourse={exam.selectedCourse}
          selectedClassId={exam.selectedClassId}
          selectedSubjects={exam.selectedSubjects}
          isCBSE={exam.isCBSE}
          availableSubjects={exam.availableSubjects}
          handleCourseChange={exam.handleCourseChange}
          handleClassChange={exam.handleClassChange}
          toggleSubject={exam.toggleSubject}
          canProceed={!!exam.canProceedStep1}
          classSelectRef={exam.classSelectRef}
          subjectSelectRef={exam.subjectSelectRef}
          onNext={() => exam.goToStep(2)}
          onCancel={() => exam.navigate("/institute/exams")}
        />
      );
    }

    // Step 2: Pattern & UI
    if (exam.currentStep === 2) {
      return (
        <PatternUIStep
          pattern={exam.pattern}
          setPattern={exam.setPattern}
          uiType={exam.uiType}
          setUIType={exam.setUIType}
          canProceed={!!exam.canProceedStep2}
          onNext={() => exam.goToStep(3)}
          onBack={() => exam.goToStep(1)}
        />
      );
    }

    // Step 3: Custom Configuration (only if pattern === "custom")
    if (exam.currentStep === 3 && exam.pattern === "custom") {
      return (
        <CustomConfigStep
          totalQuestions={exam.totalQuestions}
          setTotalQuestions={exam.setTotalQuestions}
          duration={exam.duration}
          setDuration={exam.setDuration}
          marksPerQuestion={exam.marksPerQuestion}
          setMarksPerQuestion={exam.setMarksPerQuestion}
          negativeMarking={exam.negativeMarking}
          setNegativeMarking={exam.setNegativeMarking}
          negativeMarks={exam.negativeMarks}
          setNegativeMarks={exam.setNegativeMarks}
          canProceed={exam.canProceedStep3Custom}
          onNext={() => exam.goToStep(4)}
          onBack={() => exam.goToStep(2)}
        />
      );
    }

    // Creation Method Step
    const creationStep = exam.pattern === "custom" ? 4 : 3;
    if (exam.currentStep === creationStep) {
      return (
        <CreationMethodStep
          creationMethod={exam.creationMethod}
          setCreationMethod={exam.setCreationMethod}
          easyPercent={exam.easyPercent}
          mediumPercent={exam.mediumPercent}
          hardPercent={exam.hardPercent}
          adjustDifficulty={exam.adjustDifficulty}
          applyDifficultyPreset={exam.applyDifficultyPreset}
          selectedCognitiveTypes={exam.selectedCognitiveTypes}
          toggleCognitiveType={exam.toggleCognitiveType}
          uploadedFile={exam.uploadedFile}
          handleFileChange={exam.handleFileChange}
          selectedCourse={exam.selectedCourse}
          selectedClassId={exam.selectedClassId}
          selectedSubjects={exam.selectedSubjects}
          isCBSE={exam.isCBSE}
          selectedQuestionIds={exam.selectedQuestionIds}
          setSelectedQuestionIds={exam.setSelectedQuestionIds}
          canProceed={!!exam.canProceedCreation}
          onNext={() => exam.goToStep(exam.pattern === "custom" ? 5 : 4)}
          onBack={() => exam.goToStep(exam.pattern === "custom" ? 3 : 2)}
        />
      );
    }

    // Batch Assignment Step
    const batchStep = exam.pattern === "custom" ? 5 : 4;
    if (exam.currentStep === batchStep) {
      return (
        <BatchAssignmentStep
          batchesByClass={exam.batchesByClass}
          selectedBatches={exam.selectedBatches}
          toggleBatch={exam.toggleBatch}
          scheduleDate={exam.scheduleDate}
          setScheduleDate={exam.setScheduleDate}
          scheduleTime={exam.scheduleTime}
          setScheduleTime={exam.setScheduleTime}
          isProcessing={exam.isProcessing}
          onBack={() => exam.goToStep(exam.pattern === "custom" ? 4 : 3)}
          onCreate={exam.handleCreate}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Exam"
        description="Create a new test for your students"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams", href: "/institute/exams" },
          { label: "Create Exam" },
        ]}
      />

      {/* Stepper */}
      {!exam.processComplete && (
        <ExamStepper
          currentStep={exam.currentStep}
          totalSteps={exam.totalSteps}
          pattern={exam.pattern}
        />
      )}

      {/* Step Content */}
      <div className={cn(
        "bg-card rounded-2xl p-4 sm:p-8 shadow-soft border border-border/50 mx-auto transition-all",
        exam.creationMethod === "questionBank" && (exam.currentStep === (exam.pattern === "custom" ? 4 : 3)) 
          ? "max-w-5xl" 
          : "max-w-2xl"
      )}>
        {getStepContent()}
      </div>
    </div>
  );
};

export default CreateExam;
