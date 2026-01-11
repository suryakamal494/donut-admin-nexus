import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import LazyErrorBoundary from "@/components/ui/lazy-error-boundary";

// ============================================
// LANDING & ERROR - Always eager (tiny, entry points)
// ============================================
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// ============================================
// MODULE ROUTES - LAZY LOADED
// Only the active module loads, others stay inactive
// ============================================
const SuperAdminRoutes = lazy(() => import("./routes/SuperAdminRoutes"));
const InstituteRoutes = lazy(() => import("./routes/InstituteRoutes"));
const TeacherRoutes = lazy(() => import("./routes/TeacherRoutes"));
const StudentRoutes = lazy(() => import("./routes/StudentRoutes"));

const queryClient = new QueryClient();

// Module boundary wrapper with error handling and loading state
function ModuleBoundary({ children }: { children: React.ReactNode }) {
  return (
    <LazyErrorBoundary>
      <Suspense fallback={<PageSkeleton variant="dashboard" />}>
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
          
          {/* Module Boundaries - Only one loads at a time */}
          <Route path="/superadmin/*" element={
            <ModuleBoundary><SuperAdminRoutes /></ModuleBoundary>
          } />
          <Route path="/institute/*" element={
            <ModuleBoundary><InstituteRoutes /></ModuleBoundary>
          } />
          <Route path="/teacher/*" element={
            <ModuleBoundary><TeacherRoutes /></ModuleBoundary>
          } />
          <Route path="/student/*" element={
            <ModuleBoundary><StudentRoutes /></ModuleBoundary>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
