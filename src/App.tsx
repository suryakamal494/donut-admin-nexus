import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import LazyErrorBoundary from "@/components/ui/lazy-error-boundary";

// ============================================
// LAYOUTS - Regular imports (small, always needed)
// ============================================
import AdminLayout from "./components/layout/AdminLayout";
import InstituteLayout from "./components/layout/InstituteLayout";
import TeacherLayout from "./components/layout/TeacherLayout";

// ============================================
// LANDING & ERROR - Regular imports (entry points)
// ============================================
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// ============================================
// SUPER ADMIN PAGES - EAGER LOADED (Core pages for instant navigation)
// ============================================
import Dashboard from "./pages/Dashboard";
import Institutes from "./pages/institutes/Institutes";
import CreateInstitute from "./pages/institutes/CreateInstitute";
import InstituteDetails from "./pages/institutes/InstituteDetails";
import InstituteCustomCourse from "./pages/institutes/InstituteCustomCourse";
import EditInstitute from "./pages/institutes/EditInstitute";
import InstituteTiers from "./pages/institutes/InstituteTiers";
import EditTier from "./pages/institutes/EditTier";
import Users from "./pages/users/Users";
import Parameters from "./pages/parameters/Parameters";
import Courses from "./pages/parameters/Courses";
import Roles from "./pages/roles/Roles";
import Questions from "./pages/questions/Questions";
import CreateQuestion from "./pages/questions/CreateQuestion";
import Exams from "./pages/exams/Exams";
import CreatePreviousYearPaper from "./pages/exams/CreatePreviousYearPaper";
import CreateGrandTest from "./pages/exams/CreateGrandTest";
import ReviewExam from "./pages/exams/ReviewExam";
import Content from "./pages/content/Content";
import CreateContent from "./pages/content/CreateContent";

// Super Admin - LAZY (Heavy/rarely used)
const CourseBuilder = lazy(() => import("./pages/parameters/CourseBuilder"));
const AIQuestions = lazy(() => import("./pages/questions/AIQuestions"));
const UploadPDF = lazy(() => import("./pages/questions/UploadPDF"));
const ReviewQuestions = lazy(() => import("./pages/questions/ReviewQuestions"));
const AIContentGenerator = lazy(() => import("./pages/content/AIContentGenerator"));

// ============================================
// INSTITUTE PANEL - EAGER LOADED (Core pages for instant navigation)
// ============================================
import InstituteDashboard from "./pages/institute/Dashboard";
import InstituteBatches from "./pages/institute/batches/Batches";
import CreateBatch from "./pages/institute/batches/CreateBatch";
import BatchDashboard from "./pages/institute/batches/BatchDashboard";
import BatchTimetable from "./pages/institute/batches/BatchTimetable";
import InstituteTeachers from "./pages/institute/teachers/Teachers";
import CreateTeacher from "./pages/institute/teachers/CreateTeacher";
import InstituteStudents from "./pages/institute/students/Students";
import AddStudent from "./pages/institute/students/AddStudent";
import InstituteTimetable from "./pages/institute/timetable/Timetable";
import InstituteTimetableSetup from "./pages/institute/timetable/TimetableSetup";
import InstituteViewTimetable from "./pages/institute/timetable/ViewTimetable";
import InstituteSubstitution from "./pages/institute/timetable/Substitution";
import InstituteQuestions from "./pages/institute/questions/Questions";
import InstituteCreateQuestion from "./pages/institute/questions/CreateQuestion";
import InstituteExams from "./pages/institute/exams/Exams";
import InstituteCreateExam from "./pages/institute/exams/CreateExam";
import InstituteReviewExam from "./pages/institute/exams/ReviewExam";
import InstitutePreviousYearPapers from "./pages/institute/exams/PreviousYearPapers";
import InstitutePYPView from "./pages/institute/exams/PYPView";
import InstituteMasterData from "./pages/institute/masterdata/MasterData";
import InstituteContent from "./pages/institute/content/Content";
import InstituteCreateContent from "./pages/institute/content/CreateContent";
import InstituteRoles from "./pages/institute/roles/Roles";

// Institute - LAZY (Heavy/rarely used)
const BulkUploadTeachers = lazy(() => import("./pages/institute/teachers/BulkUploadTeachers"));
const InstituteTimetableUpload = lazy(() => import("./pages/institute/timetable/TimetableUpload"));
const InstituteExamSchedule = lazy(() => import("./pages/institute/timetable/ExamSchedule"));
const InstituteAIQuestions = lazy(() => import("./pages/institute/questions/AIQuestions"));
const InstituteUploadPDF = lazy(() => import("./pages/institute/questions/UploadPDF"));
const InstituteUploadExam = lazy(() => import("./pages/institute/exams/UploadExam"));
const InstituteAIContentGenerator = lazy(() => import("./pages/institute/content/AIContentGenerator"));
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
// TEACHER PANEL - EAGER LOADED (Core pages for instant navigation)
// ============================================
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherSchedule from "./pages/teacher/Schedule";
import LessonPlans from "./pages/teacher/LessonPlans";
import TeacherAcademicProgress from "./pages/teacher/AcademicProgress";
import TeacherExams from "./pages/teacher/Exams";
import TeacherHomework from "./pages/teacher/Homework";
import TeacherContent from "./pages/teacher/Content";
import TeacherReference from "./pages/teacher/Reference";
import TeacherProfile from "./pages/teacher/Profile";

// Teacher - LAZY (Heavy pages)
const LessonPlanCanvas = lazy(() => import("./pages/teacher/LessonPlanCanvas"));
const CreateTeacherExam = lazy(() => import("./pages/teacher/CreateExam"));
const EditTeacherExam = lazy(() => import("./pages/teacher/EditExam"));

const queryClient = new QueryClient();

// Suspense wrapper for remaining lazy-loaded pages
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <LazyErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="institutes" element={<Institutes />} />
            <Route path="institutes/create" element={<CreateInstitute />} />
            <Route path="institutes/:id" element={<InstituteDetails />} />
            <Route path="institutes/:id/custom-course" element={<InstituteCustomCourse />} />
            <Route path="institutes/:id/edit" element={<EditInstitute />} />
            <Route path="institutes/tiers" element={<InstituteTiers />} />
            <Route path="institutes/tiers/edit/:tierId" element={<EditTier />} />
            <Route path="users" element={<Users />} />
            <Route path="parameters" element={<Parameters />} />
            <Route path="parameters/courses" element={<Courses />} />
            <Route path="parameters/course-builder" element={<LazyPage><CourseBuilder /></LazyPage>} />
            <Route path="roles" element={<Roles />} />
            <Route path="questions" element={<Questions />} />
            <Route path="questions/create" element={<CreateQuestion />} />
            <Route path="questions/ai" element={<LazyPage><AIQuestions /></LazyPage>} />
            <Route path="questions/upload-pdf" element={<LazyPage><UploadPDF /></LazyPage>} />
            <Route path="questions/review" element={<LazyPage><ReviewQuestions /></LazyPage>} />
            <Route path="exams" element={<Exams />} />
            <Route path="exams/previous-year/create" element={<CreatePreviousYearPaper />} />
            <Route path="exams/grand-test/create" element={<CreateGrandTest />} />
            <Route path="exams/review/:examId" element={<ReviewExam />} />
            <Route path="content" element={<Content />} />
            <Route path="content/upload" element={<CreateContent />} />
            <Route path="content/create" element={<CreateContent />} />
            <Route path="content/ai-generate" element={<LazyPage><AIContentGenerator /></LazyPage>} />
          </Route>
          
          {/* Institute Panel Routes */}
          <Route path="/institute" element={<InstituteLayout />}>
            <Route index element={<Navigate to="/institute/dashboard" replace />} />
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

          {/* Teacher Panel Routes */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="lesson-plans" element={<LessonPlans />} />
            <Route path="lesson-plans/new" element={<LazyPage><LessonPlanCanvas /></LazyPage>} />
            <Route path="lesson-plans/:planId" element={<LazyPage><LessonPlanCanvas /></LazyPage>} />
            <Route path="academic-progress" element={<TeacherAcademicProgress />} />
            <Route path="exams" element={<TeacherExams />} />
            <Route path="exams/create" element={<LazyPage><CreateTeacherExam /></LazyPage>} />
            <Route path="exams/:examId/edit" element={<LazyPage><EditTeacherExam /></LazyPage>} />
            <Route path="homework" element={<TeacherHomework />} />
            <Route path="content" element={<TeacherContent />} />
            <Route path="reference" element={<TeacherReference />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;