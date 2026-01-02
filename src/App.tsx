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
import InstituteTiers from "./pages/institutes/InstituteTiers";
import EditTier from "./pages/institutes/EditTier";
import Users from "./pages/users/Users";
import Parameters from "./pages/parameters/Parameters";
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
import UploadContent from "./pages/content/UploadContent";
import NotFound from "./pages/NotFound";

// Institute Panel Pages
import InstituteDashboard from "./pages/institute/Dashboard";
import InstituteBatches from "./pages/institute/batches/Batches";
import CreateBatch from "./pages/institute/batches/CreateBatch";
import BatchDashboard from "./pages/institute/batches/BatchDashboard";
import InstituteTeachers from "./pages/institute/teachers/Teachers";
import CreateTeacher from "./pages/institute/teachers/CreateTeacher";
import BulkUploadTeachers from "./pages/institute/teachers/BulkUploadTeachers";
import InstituteStudents from "./pages/institute/students/Students";
import AddStudent from "./pages/institute/students/AddStudent";
import InstituteTimetable from "./pages/institute/timetable/Timetable";
import InstituteTimetableSetup from "./pages/institute/timetable/TimetableSetup";
import InstituteTimetableUpload from "./pages/institute/timetable/TimetableUpload";
import InstituteViewTimetable from "./pages/institute/timetable/ViewTimetable";
import InstituteQuestions from "./pages/institute/questions/Questions";
import InstituteAIQuestions from "./pages/institute/questions/AIQuestions";
import InstituteExams from "./pages/institute/exams/Exams";
import InstituteCreateExam from "./pages/institute/exams/CreateExam";
import InstituteReviewExam from "./pages/institute/exams/ReviewExam";
import InstituteMasterData from "./pages/institute/masterdata/MasterData";

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
            <Route path="institutes/tiers" element={<InstituteTiers />} />
            <Route path="institutes/tiers/edit/:tierId" element={<EditTier />} />
            <Route path="users" element={<Users />} />
            <Route path="parameters" element={<Parameters />} />
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
            <Route path="content/upload" element={<UploadContent />} />
          </Route>
          
          {/* Institute Panel Routes */}
          <Route path="/institute" element={<InstituteLayout />}>
            <Route index element={<Navigate to="/institute/dashboard" replace />} />
            <Route path="dashboard" element={<InstituteDashboard />} />
            <Route path="batches" element={<InstituteBatches />} />
            <Route path="batches/create" element={<CreateBatch />} />
            <Route path="batches/:batchId" element={<BatchDashboard />} />
            <Route path="teachers" element={<InstituteTeachers />} />
            <Route path="teachers/create" element={<CreateTeacher />} />
            <Route path="teachers/bulk-upload" element={<BulkUploadTeachers />} />
            <Route path="students" element={<InstituteStudents />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="timetable" element={<InstituteTimetable />} />
            <Route path="timetable/setup" element={<InstituteTimetableSetup />} />
            <Route path="timetable/upload" element={<InstituteTimetableUpload />} />
            <Route path="timetable/view" element={<InstituteViewTimetable />} />
            <Route path="questions" element={<InstituteQuestions />} />
            <Route path="questions/ai" element={<InstituteAIQuestions />} />
            <Route path="exams" element={<InstituteExams />} />
            <Route path="exams/create" element={<InstituteCreateExam />} />
            <Route path="exams/review/:examId" element={<InstituteReviewExam />} />
            <Route path="master-data" element={<InstituteMasterData />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;