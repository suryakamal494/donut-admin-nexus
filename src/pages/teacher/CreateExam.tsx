import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { useTeacherExamCreation } from "@/hooks/useTeacherExamCreation";
import {
  TeacherExamStepper,
  ExamDetailsStep,
  PatternStep,
  ConfigStep,
  CreationMethodStep,
  BatchScheduleStep,
  CompletionStep,
} from "@/components/teacher/exams";

const CreateExam = () => {
  const exam = useTeacherExamCreation();

  const getStepContent = () => {
    if (exam.processComplete) {
      return (
        <CompletionStep
          examName={exam.examName}
          onBackToExams={() => exam.navigate("/teacher/exams")}
          onReviewQuestions={() => exam.navigate("/teacher/exams")}
        />
      );
    }

    // Step 1: Exam Details
    if (exam.currentStep === 1) {
      return (
        <ExamDetailsStep
          examName={exam.examName}
          setExamName={exam.setExamName}
          selectedSubjects={exam.selectedSubjects}
          toggleSubject={exam.toggleSubject}
          teacherSubjects={exam.teacherSubjects}
          canProceed={exam.canProceedStep1}
          onNext={() => exam.goToStep(2)}
          onCancel={() => exam.navigate("/teacher/exams")}
        />
      );
    }

    // Step 2: Pattern & UI
    if (exam.currentStep === 2) {
      return (
        <PatternStep
          pattern={exam.pattern}
          setPattern={exam.setPattern}
          uiType={exam.uiType}
          setUIType={exam.setUIType}
          canProceed={exam.canProceedStep2}
          onNext={() => exam.goToStep(3)}
          onBack={() => exam.goToStep(1)}
        />
      );
    }

    // Step 3: Custom Configuration (only if pattern === "custom")
    if (exam.currentStep === 3 && exam.pattern === "custom") {
      return (
        <ConfigStep
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
          totalQuestions={exam.totalQuestions}
          clearUploadedFile={exam.clearUploadedFile}
          selectedSubjects={exam.selectedSubjects}
          selectedQuestionIds={exam.selectedQuestionIds}
          setSelectedQuestionIds={exam.setSelectedQuestionIds}
          canProceed={exam.canProceedCreation}
          onNext={() => exam.goToStep(exam.pattern === "custom" ? 5 : 4)}
          onBack={() => exam.goToStep(exam.pattern === "custom" ? 3 : 2)}
        />
      );
    }

    // Batch Assignment Step
    const batchStep = exam.pattern === "custom" ? 5 : 4;
    if (exam.currentStep === batchStep) {
      return (
        <BatchScheduleStep
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
    <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto animate-fade-in">
      <PageHeader
        title="Create Exam"
        description="Create a test for your students"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Exams", href: "/teacher/exams" },
          { label: "Create" },
        ]}
      />

      {/* Stepper */}
      {!exam.processComplete && (
        <TeacherExamStepper
          currentStep={exam.currentStep}
          totalSteps={exam.totalSteps}
          pattern={exam.pattern}
        />
      )}

      {/* Step Content */}
      <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
        {getStepContent()}
      </div>
    </div>
  );
};

export default CreateExam;
