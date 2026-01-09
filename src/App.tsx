import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import AdminLayout from "./components/layout/AdminLayout";
import InstituteLayout from "./components/layout/InstituteLayout";
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
import CourseBuilder from "./pages/parameters/CourseBuilder";
import Courses from "./pages/parameters/Courses";
import Roles from "./pages/roles/Roles";
import Questions from "./pages/questions/Questions";
import CreateQuestion from "./pages/questions/CreateQuestion";
import AIQuestions from "./pages/questions/AIQuestions";
import UploadPDF from "./pages/questions/UploadPDF";
import ReviewQuestions from "./pages/questions/ReviewQuestions";
import Exams from "./pages/exams/Exams";
import CreatePreviousYearPaper from "./pages/exams/CreatePreviousYearPaper";
import CreateGrandTest from "./pages/exams/CreateGrandTest";
import ReviewExam from "./pages/exams/ReviewExam";
import Content from "./pages/content/Content";
import CreateContent from "./pages/content/CreateContent";
import AIContentGenerator from "./pages/content/AIContentGenerator";
import NotFound from "./pages/NotFound";

// Institute Panel Pages
import InstituteDashboard from "./pages/institute/Dashboard";
import InstituteBatches from "./pages/institute/batches/Batches";
import CreateBatch from "./pages/institute/batches/CreateBatch";
import BatchDashboard from "./pages/institute/batches/BatchDashboard";
import BatchTimetable from "./pages/institute/batches/BatchTimetable";
import InstituteTeachers from "./pages/institute/teachers/Teachers";
import CreateTeacher from "./pages/institute/teachers/CreateTeacher";
import BulkUploadTeachers from "./pages/institute/teachers/BulkUploadTeachers";
import InstituteStudents from "./pages/institute/students/Students";
import AddStudent from "./pages/institute/students/AddStudent";
import InstituteTimetable from "./pages/institute/timetable/Timetable";
import InstituteTimetableSetup from "./pages/institute/timetable/TimetableSetup";
import InstituteTimetableUpload from "./pages/institute/timetable/TimetableUpload";
import InstituteViewTimetable from "./pages/institute/timetable/ViewTimetable";
import InstituteSubstitution from "./pages/institute/timetable/Substitution";
import InstituteExamSchedule from "./pages/institute/timetable/ExamSchedule";
import InstituteQuestions from "./pages/institute/questions/Questions";
import InstituteAIQuestions from "./pages/institute/questions/AIQuestions";
import InstituteUploadPDF from "./pages/institute/questions/UploadPDF";
import InstituteCreateQuestion from "./pages/institute/questions/CreateQuestion";
import InstituteExams from "./pages/institute/exams/Exams";
import InstituteCreateExam from "./pages/institute/exams/CreateExam";
import InstituteUploadExam from "./pages/institute/exams/UploadExam";
import InstituteReviewExam from "./pages/institute/exams/ReviewExam";
import InstitutePreviousYearPapers from "./pages/institute/exams/PreviousYearPapers";
import InstitutePYPView from "./pages/institute/exams/PYPView";
import InstituteMasterData from "./pages/institute/masterdata/MasterData";
import InstituteContent from "./pages/institute/content/Content";
import InstituteCreateContent from "./pages/institute/content/CreateContent";
import InstituteAIContentGenerator from "./pages/institute/content/AIContentGenerator";
import InstituteRoles from "./pages/institute/roles/Roles";
import AcademicScheduleSetup from "./pages/institute/academic-schedule/Setup";
import AcademicScheduleWeeklyPlans from "./pages/institute/academic-schedule/WeeklyPlans";
import AcademicScheduleProgress from "./pages/institute/academic-schedule/Progress";
import AcademicScheduleBatchProgress from "./pages/institute/academic-schedule/BatchProgress";
import AcademicSchedulePending from "./pages/institute/academic-schedule/PendingConfirmations";
import TeacherAcademicProgress from "./pages/teacher/AcademicProgress";

// Teacher Panel Pages
import TeacherLayout from "./components/layout/TeacherLayout";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherSchedule from "./pages/teacher/Schedule";
import LessonPlans from "./pages/teacher/LessonPlans";
import LessonPlanCanvas from "./pages/teacher/LessonPlanCanvas";
import TeacherAssessments from "./pages/teacher/Assessments";
import TeacherHomework from "./pages/teacher/Homework";
import TeacherContent from "./pages/teacher/Content";
import TeacherReference from "./pages/teacher/Reference";
import TeacherProfile from "./pages/teacher/Profile";

const queryClient = new QueryClient();

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
            <Route path="parameters/course-builder" element={<CourseBuilder />} />
            <Route path="roles" element={<Roles />} />
            <Route path="questions" element={<Questions />} />
            <Route path="questions/create" element={<CreateQuestion />} />
            <Route path="questions/ai" element={<AIQuestions />} />
            <Route path="questions/upload-pdf" element={<UploadPDF />} />
            <Route path="questions/review" element={<ReviewQuestions />} />
            <Route path="exams" element={<Exams />} />
            <Route path="exams/previous-year/create" element={<CreatePreviousYearPaper />} />
            <Route path="exams/grand-test/create" element={<CreateGrandTest />} />
            <Route path="exams/review/:examId" element={<ReviewExam />} />
            <Route path="content" element={<Content />} />
            <Route path="content/upload" element={<CreateContent />} />
            <Route path="content/create" element={<CreateContent />} />
            <Route path="content/ai-generate" element={<AIContentGenerator />} />
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
            <Route path="teachers/bulk-upload" element={<BulkUploadTeachers />} />
            <Route path="students" element={<InstituteStudents />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="students/:studentId/edit" element={<AddStudent />} />
            <Route path="timetable" element={<InstituteTimetable />} />
            <Route path="timetable/setup" element={<InstituteTimetableSetup />} />
            <Route path="timetable/upload" element={<InstituteTimetableUpload />} />
            <Route path="timetable/view" element={<InstituteViewTimetable />} />
            <Route path="timetable/substitution" element={<InstituteSubstitution />} />
            <Route path="timetable/exam-schedule" element={<InstituteExamSchedule />} />
            <Route path="questions" element={<InstituteQuestions />} />
            <Route path="questions/ai" element={<InstituteAIQuestions />} />
            <Route path="questions/upload-pdf" element={<InstituteUploadPDF />} />
            <Route path="questions/create" element={<InstituteCreateQuestion />} />
            <Route path="questions/edit/:questionId" element={<InstituteCreateQuestion />} />
            <Route path="content" element={<InstituteContent />} />
            <Route path="content/create" element={<InstituteCreateContent />} />
            <Route path="content/edit/:contentId" element={<InstituteCreateContent />} />
            <Route path="content/ai-generate" element={<InstituteAIContentGenerator />} />
            <Route path="exams" element={<InstituteExams />} />
            <Route path="exams/create" element={<InstituteCreateExam />} />
            <Route path="exams/upload" element={<InstituteUploadExam />} />
              <Route path="exams/review/:examId" element={<InstituteReviewExam />} />
            <Route path="exams/previous-year-papers" element={<InstitutePreviousYearPapers />} />
            <Route path="exams/pyp-view/:paperId" element={<InstitutePYPView />} />
            <Route path="master-data" element={<InstituteMasterData />} />
            <Route path="roles" element={<InstituteRoles />} />
            <Route path="academic-schedule/setup" element={<AcademicScheduleSetup />} />
            <Route path="academic-schedule/plans" element={<AcademicScheduleWeeklyPlans />} />
            <Route path="academic-schedule/progress" element={<AcademicScheduleProgress />} />
            <Route path="academic-schedule/progress/:batchId" element={<AcademicScheduleBatchProgress />} />
            <Route path="academic-schedule/pending" element={<AcademicSchedulePending />} />
          </Route>

          {/* Teacher Panel Routes */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="lesson-plans" element={<LessonPlans />} />
            <Route path="lesson-plans/:planId" element={<LessonPlanCanvas />} />
            <Route path="academic-progress" element={<TeacherAcademicProgress />} />
            <Route path="assessments" element={<TeacherAssessments />} />
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
