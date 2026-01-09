import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import LazyErrorBoundary from "@/components/ui/lazy-error-boundary";
import { DelayedFallback } from "@/components/ui/delayed-fallback";

// Layouts - Keep these as regular imports (small, always needed)
import AdminLayout from "./components/layout/AdminLayout";
import InstituteLayout from "./components/layout/InstituteLayout";
import TeacherLayout from "./components/layout/TeacherLayout";

// Landing - Regular import (entry point)
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// ============================================
// SUPER ADMIN PAGES - Lazy Loaded
// ============================================
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Institutes = lazy(() => import("./pages/institutes/Institutes"));
const CreateInstitute = lazy(() => import("./pages/institutes/CreateInstitute"));
const InstituteDetails = lazy(() => import("./pages/institutes/InstituteDetails"));
const InstituteCustomCourse = lazy(() => import("./pages/institutes/InstituteCustomCourse"));
const EditInstitute = lazy(() => import("./pages/institutes/EditInstitute"));
const InstituteTiers = lazy(() => import("./pages/institutes/InstituteTiers"));
const EditTier = lazy(() => import("./pages/institutes/EditTier"));
const Users = lazy(() => import("./pages/users/Users"));
const Parameters = lazy(() => import("./pages/parameters/Parameters"));
const CourseBuilder = lazy(() => import("./pages/parameters/CourseBuilder"));
const Courses = lazy(() => import("./pages/parameters/Courses"));
const Roles = lazy(() => import("./pages/roles/Roles"));
const Questions = lazy(() => import("./pages/questions/Questions"));
const CreateQuestion = lazy(() => import("./pages/questions/CreateQuestion"));
const AIQuestions = lazy(() => import("./pages/questions/AIQuestions"));
const UploadPDF = lazy(() => import("./pages/questions/UploadPDF"));
const ReviewQuestions = lazy(() => import("./pages/questions/ReviewQuestions"));
const Exams = lazy(() => import("./pages/exams/Exams"));
const CreatePreviousYearPaper = lazy(() => import("./pages/exams/CreatePreviousYearPaper"));
const CreateGrandTest = lazy(() => import("./pages/exams/CreateGrandTest"));
const ReviewExam = lazy(() => import("./pages/exams/ReviewExam"));
const Content = lazy(() => import("./pages/content/Content"));
const CreateContent = lazy(() => import("./pages/content/CreateContent"));
const AIContentGenerator = lazy(() => import("./pages/content/AIContentGenerator"));

// ============================================
// INSTITUTE PANEL PAGES - Lazy Loaded
// ============================================
const InstituteDashboard = lazy(() => import("./pages/institute/Dashboard"));
const InstituteBatches = lazy(() => import("./pages/institute/batches/Batches"));
const CreateBatch = lazy(() => import("./pages/institute/batches/CreateBatch"));
const BatchDashboard = lazy(() => import("./pages/institute/batches/BatchDashboard"));
const BatchTimetable = lazy(() => import("./pages/institute/batches/BatchTimetable"));
const InstituteTeachers = lazy(() => import("./pages/institute/teachers/Teachers"));
const CreateTeacher = lazy(() => import("./pages/institute/teachers/CreateTeacher"));
const BulkUploadTeachers = lazy(() => import("./pages/institute/teachers/BulkUploadTeachers"));
const InstituteStudents = lazy(() => import("./pages/institute/students/Students"));
const AddStudent = lazy(() => import("./pages/institute/students/AddStudent"));
const InstituteTimetable = lazy(() => import("./pages/institute/timetable/Timetable"));
const InstituteTimetableSetup = lazy(() => import("./pages/institute/timetable/TimetableSetup"));
const InstituteTimetableUpload = lazy(() => import("./pages/institute/timetable/TimetableUpload"));
const InstituteViewTimetable = lazy(() => import("./pages/institute/timetable/ViewTimetable"));
const InstituteSubstitution = lazy(() => import("./pages/institute/timetable/Substitution"));
const InstituteExamSchedule = lazy(() => import("./pages/institute/timetable/ExamSchedule"));
const InstituteQuestions = lazy(() => import("./pages/institute/questions/Questions"));
const InstituteAIQuestions = lazy(() => import("./pages/institute/questions/AIQuestions"));
const InstituteUploadPDF = lazy(() => import("./pages/institute/questions/UploadPDF"));
const InstituteCreateQuestion = lazy(() => import("./pages/institute/questions/CreateQuestion"));
const InstituteExams = lazy(() => import("./pages/institute/exams/Exams"));
const InstituteCreateExam = lazy(() => import("./pages/institute/exams/CreateExam"));
const InstituteUploadExam = lazy(() => import("./pages/institute/exams/UploadExam"));
const InstituteReviewExam = lazy(() => import("./pages/institute/exams/ReviewExam"));
const InstitutePreviousYearPapers = lazy(() => import("./pages/institute/exams/PreviousYearPapers"));
const InstitutePYPView = lazy(() => import("./pages/institute/exams/PYPView"));
const InstituteMasterData = lazy(() => import("./pages/institute/masterdata/MasterData"));
const InstituteContent = lazy(() => import("./pages/institute/content/Content"));
const InstituteCreateContent = lazy(() => import("./pages/institute/content/CreateContent"));
const InstituteAIContentGenerator = lazy(() => import("./pages/institute/content/AIContentGenerator"));
const InstituteRoles = lazy(() => import("./pages/institute/roles/Roles"));
const AcademicScheduleSetup = lazy(() => import("./pages/institute/academic-schedule/Setup"));
const AcademicScheduleWeeklyPlans = lazy(() => import("./pages/institute/academic-schedule/WeeklyPlans"));
const AcademicScheduleProgress = lazy(() => import("./pages/institute/academic-schedule/Progress"));
const AcademicScheduleBatchProgress = lazy(() => import("./pages/institute/academic-schedule/BatchProgress"));
const AcademicSchedulePending = lazy(() => import("./pages/institute/academic-schedule/PendingConfirmations"));
const AcademicScheduleTeachingView = lazy(() => import("./pages/institute/academic-schedule/TeachingView"));
const AcademicScheduleYearOverview = lazy(() => import("./pages/institute/academic-schedule/YearOverview"));
const AcademicScheduleSectionAlignment = lazy(() => import("./pages/institute/academic-schedule/SectionAlignment"));
const AcademicScheduleChapterDetail = lazy(() => import("./pages/institute/academic-schedule/ChapterDetail"));
const AcademicViews = lazy(() => import("./pages/institute/academic-schedule/AcademicViews"));

// ============================================
// TEACHER PANEL PAGES - Lazy Loaded
// ============================================
const TeacherDashboard = lazy(() => import("./pages/teacher/Dashboard"));
const TeacherSchedule = lazy(() => import("./pages/teacher/Schedule"));
const LessonPlans = lazy(() => import("./pages/teacher/LessonPlans"));
const LessonPlanCanvas = lazy(() => import("./pages/teacher/LessonPlanCanvas"));
const TeacherAcademicProgress = lazy(() => import("./pages/teacher/AcademicProgress"));
const TeacherAssessments = lazy(() => import("./pages/teacher/Assessments"));
const TeacherHomework = lazy(() => import("./pages/teacher/Homework"));
const TeacherContent = lazy(() => import("./pages/teacher/Content"));
const TeacherReference = lazy(() => import("./pages/teacher/Reference"));
const TeacherProfile = lazy(() => import("./pages/teacher/Profile"));

const queryClient = new QueryClient();

// Suspense wrapper component with error boundary and delayed fallback
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <LazyErrorBoundary>
      <Suspense
        fallback={
          <DelayedFallback delay={150}>
            <PageSkeleton />
          </DelayedFallback>
        }
      >
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page - Portal Selection */}
          <Route path="/" element={<Landing />} />
          
          {/* Super Admin Routes */}
          <Route path="/superadmin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
            <Route path="dashboard" element={<LazyPage><Dashboard /></LazyPage>} />
            <Route path="institutes" element={<LazyPage><Institutes /></LazyPage>} />
            <Route path="institutes/create" element={<LazyPage><CreateInstitute /></LazyPage>} />
            <Route path="institutes/:id" element={<LazyPage><InstituteDetails /></LazyPage>} />
            <Route path="institutes/:id/custom-course" element={<LazyPage><InstituteCustomCourse /></LazyPage>} />
            <Route path="institutes/:id/edit" element={<LazyPage><EditInstitute /></LazyPage>} />
            <Route path="institutes/tiers" element={<LazyPage><InstituteTiers /></LazyPage>} />
            <Route path="institutes/tiers/edit/:tierId" element={<LazyPage><EditTier /></LazyPage>} />
            <Route path="users" element={<LazyPage><Users /></LazyPage>} />
            <Route path="parameters" element={<LazyPage><Parameters /></LazyPage>} />
            <Route path="parameters/courses" element={<LazyPage><Courses /></LazyPage>} />
            <Route path="parameters/course-builder" element={<LazyPage><CourseBuilder /></LazyPage>} />
            <Route path="roles" element={<LazyPage><Roles /></LazyPage>} />
            <Route path="questions" element={<LazyPage><Questions /></LazyPage>} />
            <Route path="questions/create" element={<LazyPage><CreateQuestion /></LazyPage>} />
            <Route path="questions/ai" element={<LazyPage><AIQuestions /></LazyPage>} />
            <Route path="questions/upload-pdf" element={<LazyPage><UploadPDF /></LazyPage>} />
            <Route path="questions/review" element={<LazyPage><ReviewQuestions /></LazyPage>} />
            <Route path="exams" element={<LazyPage><Exams /></LazyPage>} />
            <Route path="exams/previous-year/create" element={<LazyPage><CreatePreviousYearPaper /></LazyPage>} />
            <Route path="exams/grand-test/create" element={<LazyPage><CreateGrandTest /></LazyPage>} />
            <Route path="exams/review/:examId" element={<LazyPage><ReviewExam /></LazyPage>} />
            <Route path="content" element={<LazyPage><Content /></LazyPage>} />
            <Route path="content/upload" element={<LazyPage><CreateContent /></LazyPage>} />
            <Route path="content/create" element={<LazyPage><CreateContent /></LazyPage>} />
            <Route path="content/ai-generate" element={<LazyPage><AIContentGenerator /></LazyPage>} />
          </Route>
          
          {/* Institute Panel Routes */}
          <Route path="/institute" element={<InstituteLayout />}>
            <Route index element={<Navigate to="/institute/dashboard" replace />} />
            <Route path="dashboard" element={<LazyPage><InstituteDashboard /></LazyPage>} />
            <Route path="batches" element={<LazyPage><InstituteBatches /></LazyPage>} />
            <Route path="batches/create" element={<LazyPage><CreateBatch /></LazyPage>} />
            <Route path="batches/:batchId" element={<LazyPage><BatchDashboard /></LazyPage>} />
            <Route path="batches/:batchId/timetable" element={<LazyPage><BatchTimetable /></LazyPage>} />
            <Route path="teachers" element={<LazyPage><InstituteTeachers /></LazyPage>} />
            <Route path="teachers/create" element={<LazyPage><CreateTeacher /></LazyPage>} />
            <Route path="teachers/:teacherId/edit" element={<LazyPage><CreateTeacher /></LazyPage>} />
            <Route path="teachers/bulk-upload" element={<LazyPage><BulkUploadTeachers /></LazyPage>} />
            <Route path="students" element={<LazyPage><InstituteStudents /></LazyPage>} />
            <Route path="students/add" element={<LazyPage><AddStudent /></LazyPage>} />
            <Route path="students/:studentId/edit" element={<LazyPage><AddStudent /></LazyPage>} />
            <Route path="timetable" element={<LazyPage><InstituteTimetable /></LazyPage>} />
            <Route path="timetable/setup" element={<LazyPage><InstituteTimetableSetup /></LazyPage>} />
            <Route path="timetable/upload" element={<LazyPage><InstituteTimetableUpload /></LazyPage>} />
            <Route path="timetable/view" element={<LazyPage><InstituteViewTimetable /></LazyPage>} />
            <Route path="timetable/substitution" element={<LazyPage><InstituteSubstitution /></LazyPage>} />
            <Route path="timetable/exam-schedule" element={<LazyPage><InstituteExamSchedule /></LazyPage>} />
            <Route path="questions" element={<LazyPage><InstituteQuestions /></LazyPage>} />
            <Route path="questions/ai" element={<LazyPage><InstituteAIQuestions /></LazyPage>} />
            <Route path="questions/upload-pdf" element={<LazyPage><InstituteUploadPDF /></LazyPage>} />
            <Route path="questions/create" element={<LazyPage><InstituteCreateQuestion /></LazyPage>} />
            <Route path="questions/edit/:questionId" element={<LazyPage><InstituteCreateQuestion /></LazyPage>} />
            <Route path="content" element={<LazyPage><InstituteContent /></LazyPage>} />
            <Route path="content/create" element={<LazyPage><InstituteCreateContent /></LazyPage>} />
            <Route path="content/edit/:contentId" element={<LazyPage><InstituteCreateContent /></LazyPage>} />
            <Route path="content/ai-generate" element={<LazyPage><InstituteAIContentGenerator /></LazyPage>} />
            <Route path="exams" element={<LazyPage><InstituteExams /></LazyPage>} />
            <Route path="exams/create" element={<LazyPage><InstituteCreateExam /></LazyPage>} />
            <Route path="exams/upload" element={<LazyPage><InstituteUploadExam /></LazyPage>} />
            <Route path="exams/review/:examId" element={<LazyPage><InstituteReviewExam /></LazyPage>} />
            <Route path="exams/previous-year-papers" element={<LazyPage><InstitutePreviousYearPapers /></LazyPage>} />
            <Route path="exams/pyp-view/:paperId" element={<LazyPage><InstitutePYPView /></LazyPage>} />
            <Route path="master-data" element={<LazyPage><InstituteMasterData /></LazyPage>} />
            <Route path="roles" element={<LazyPage><InstituteRoles /></LazyPage>} />
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

          {/* Teacher Panel Routes */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<LazyPage><TeacherDashboard /></LazyPage>} />
            <Route path="schedule" element={<LazyPage><TeacherSchedule /></LazyPage>} />
            <Route path="lesson-plans" element={<LazyPage><LessonPlans /></LazyPage>} />
            <Route path="lesson-plans/:planId" element={<LazyPage><LessonPlanCanvas /></LazyPage>} />
            <Route path="academic-progress" element={<LazyPage><TeacherAcademicProgress /></LazyPage>} />
            <Route path="assessments" element={<LazyPage><TeacherAssessments /></LazyPage>} />
            <Route path="homework" element={<LazyPage><TeacherHomework /></LazyPage>} />
            <Route path="content" element={<LazyPage><TeacherContent /></LazyPage>} />
            <Route path="reference" element={<LazyPage><TeacherReference /></LazyPage>} />
            <Route path="profile" element={<LazyPage><TeacherProfile /></LazyPage>} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
