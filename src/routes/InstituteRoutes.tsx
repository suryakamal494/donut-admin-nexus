// ============================================
// INSTITUTE MODULE ROUTES
// Core pages eager loaded, heavy pages lazy loaded
// ============================================

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import LazyErrorBoundary from "@/components/ui/lazy-error-boundary";
import InstituteLayout from "@/components/layout/InstituteLayout";

// Core pages - EAGER LOADED for instant navigation
import InstituteDashboard from "@/pages/institute/Dashboard";
import InstituteBatches from "@/pages/institute/batches/Batches";
import CreateBatch from "@/pages/institute/batches/CreateBatch";
import BatchDashboard from "@/pages/institute/batches/BatchDashboard";
import BatchTimetable from "@/pages/institute/batches/BatchTimetable";
import InstituteTeachers from "@/pages/institute/teachers/Teachers";
import CreateTeacher from "@/pages/institute/teachers/CreateTeacher";
import InstituteStudents from "@/pages/institute/students/Students";
import AddStudent from "@/pages/institute/students/AddStudent";
import InstituteTimetable from "@/pages/institute/timetable/Timetable";
import InstituteTimetableSetup from "@/pages/institute/timetable/TimetableSetup";
import InstituteViewTimetable from "@/pages/institute/timetable/ViewTimetable";
import InstituteSubstitution from "@/pages/institute/timetable/Substitution";
import InstituteQuestions from "@/pages/institute/questions/Questions";
import InstituteCreateQuestion from "@/pages/institute/questions/CreateQuestion";
import InstituteExams from "@/pages/institute/exams/Exams";
import InstituteCreateExam from "@/pages/institute/exams/CreateExam";
import InstituteReviewExam from "@/pages/institute/exams/ReviewExam";
import InstitutePreviousYearPapers from "@/pages/institute/exams/PreviousYearPapers";
import InstitutePYPView from "@/pages/institute/exams/PYPView";
import InstituteMasterData from "@/pages/institute/masterdata/MasterData";
import InstituteContent from "@/pages/institute/content/Content";
import InstituteCreateContent from "@/pages/institute/content/CreateContent";
import InstituteRoles from "@/pages/institute/roles/Roles";

// Heavy pages - LAZY LOADED
const BulkUploadTeachers = lazy(() => import("@/pages/institute/teachers/BulkUploadTeachers"));
const InstituteTimetableUpload = lazy(() => import("@/pages/institute/timetable/TimetableUpload"));
const InstituteExamSchedule = lazy(() => import("@/pages/institute/timetable/ExamSchedule"));
const InstituteAIQuestions = lazy(() => import("@/pages/institute/questions/AIQuestions"));
const InstituteUploadPDF = lazy(() => import("@/pages/institute/questions/UploadPDF"));
const InstituteUploadExam = lazy(() => import("@/pages/institute/exams/UploadExam"));
const InstituteAIContentGenerator = lazy(() => import("@/pages/institute/content/AIContentGenerator"));
const AcademicScheduleSetup = lazy(() => import("@/pages/institute/academic-schedule/Setup"));
const AcademicScheduleWeeklyPlans = lazy(() => import("@/pages/institute/academic-schedule/WeeklyPlans"));
const AcademicScheduleProgress = lazy(() => import("@/pages/institute/academic-schedule/Progress"));
const AcademicScheduleBatchProgress = lazy(() => import("@/pages/institute/academic-schedule/BatchProgress"));
const AcademicSchedulePending = lazy(() => import("@/pages/institute/academic-schedule/PendingConfirmations"));
const AcademicScheduleTeachingView = lazy(() => import("@/pages/institute/academic-schedule/TeachingView"));
const AcademicScheduleYearOverview = lazy(() => import("@/pages/institute/academic-schedule/YearOverview"));
const AcademicScheduleSectionAlignment = lazy(() => import("@/pages/institute/academic-schedule/SectionAlignment"));
const AcademicScheduleChapterDetail = lazy(() => import("@/pages/institute/academic-schedule/ChapterDetail"));
const AcademicViews = lazy(() => import("@/pages/institute/academic-schedule/AcademicViews"));

// Suspense wrapper for lazy-loaded pages
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <LazyErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
}

export default function InstituteRoutes() {
  return (
    <Routes>
      <Route element={<InstituteLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InstituteDashboard />} />
        <Route path="batches" element={<InstituteBatches />} />
        <Route path="batches/create" element={<CreateBatch />} />
        <Route path="batches/:batchId" element={<BatchDashboard />} />
        <Route path="batches/:batchId/timetable" element={<BatchTimetable />} />
        <Route path="teachers" element={<InstituteTeachers />} />
        <Route path="teachers/create" element={<CreateTeacher />} />
        <Route path="teachers/:teacherId/edit" element={<CreateTeacher />} />
        <Route path="teachers/bulk-upload" element={<LazyPage><BulkUploadTeachers /></LazyPage>} />
        <Route path="students" element={<InstituteStudents />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/:studentId/edit" element={<AddStudent />} />
        <Route path="timetable" element={<InstituteTimetable />} />
        <Route path="timetable/setup" element={<InstituteTimetableSetup />} />
        <Route path="timetable/upload" element={<LazyPage><InstituteTimetableUpload /></LazyPage>} />
        <Route path="timetable/view" element={<InstituteViewTimetable />} />
        <Route path="timetable/substitution" element={<InstituteSubstitution />} />
        <Route path="timetable/exam-schedule" element={<LazyPage><InstituteExamSchedule /></LazyPage>} />
        <Route path="questions" element={<InstituteQuestions />} />
        <Route path="questions/ai" element={<LazyPage><InstituteAIQuestions /></LazyPage>} />
        <Route path="questions/upload-pdf" element={<LazyPage><InstituteUploadPDF /></LazyPage>} />
        <Route path="questions/create" element={<InstituteCreateQuestion />} />
        <Route path="questions/edit/:questionId" element={<InstituteCreateQuestion />} />
        <Route path="content" element={<InstituteContent />} />
        <Route path="content/create" element={<InstituteCreateContent />} />
        <Route path="content/edit/:contentId" element={<InstituteCreateContent />} />
        <Route path="content/ai-generate" element={<LazyPage><InstituteAIContentGenerator /></LazyPage>} />
        <Route path="exams" element={<InstituteExams />} />
        <Route path="exams/create" element={<InstituteCreateExam />} />
        <Route path="exams/upload" element={<LazyPage><InstituteUploadExam /></LazyPage>} />
        <Route path="exams/review/:examId" element={<InstituteReviewExam />} />
        <Route path="exams/previous-year-papers" element={<InstitutePreviousYearPapers />} />
        <Route path="exams/pyp-view/:paperId" element={<InstitutePYPView />} />
        <Route path="master-data" element={<InstituteMasterData />} />
        <Route path="roles" element={<InstituteRoles />} />
        <Route path="academic-schedule/setup" element={<LazyPage><AcademicScheduleSetup /></LazyPage>} />
        <Route path="academic-schedule/plans" element={<LazyPage><AcademicScheduleWeeklyPlans /></LazyPage>} />
        <Route path="academic-schedule/views" element={<LazyPage><AcademicViews /></LazyPage>} />
        <Route path="academic-schedule/year-view" element={<LazyPage><AcademicScheduleYearOverview /></LazyPage>} />
        <Route path="academic-schedule/teaching-view" element={<LazyPage><AcademicScheduleTeachingView /></LazyPage>} />
        <Route path="academic-schedule/alignment" element={<LazyPage><AcademicScheduleSectionAlignment /></LazyPage>} />
        <Route path="academic-schedule/chapter-detail" element={<LazyPage><AcademicScheduleChapterDetail /></LazyPage>} />
        <Route path="academic-schedule/progress" element={<LazyPage><AcademicScheduleProgress /></LazyPage>} />
        <Route path="academic-schedule/progress/:batchId" element={<LazyPage><AcademicScheduleBatchProgress /></LazyPage>} />
        <Route path="academic-schedule/pending" element={<LazyPage><AcademicSchedulePending /></LazyPage>} />
      </Route>
    </Routes>
  );
}
