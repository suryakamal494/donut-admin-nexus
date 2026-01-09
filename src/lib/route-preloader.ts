import { lazy, ComponentType } from "react";

// Store for lazy components that can be preloaded
type LazyComponent = () => Promise<{ default: ComponentType<unknown> }>;

// Map of routes to their lazy import functions
const routeImports: Record<string, LazyComponent> = {
  // Super Admin routes
  "/superadmin/dashboard": () => import("@/pages/Dashboard"),
  "/superadmin/institutes": () => import("@/pages/institutes/Institutes"),
  "/superadmin/institutes/create": () => import("@/pages/institutes/CreateInstitute"),
  "/superadmin/institutes/tiers": () => import("@/pages/institutes/InstituteTiers"),
  "/superadmin/users": () => import("@/pages/users/Users"),
  "/superadmin/parameters": () => import("@/pages/parameters/Parameters"),
  "/superadmin/parameters/courses": () => import("@/pages/parameters/Courses"),
  "/superadmin/parameters/course-builder": () => import("@/pages/parameters/CourseBuilder"),
  "/superadmin/roles": () => import("@/pages/roles/Roles"),
  "/superadmin/questions": () => import("@/pages/questions/Questions"),
  "/superadmin/exams": () => import("@/pages/exams/Exams"),
  "/superadmin/content": () => import("@/pages/content/Content"),

  // Institute routes
  "/institute/dashboard": () => import("@/pages/institute/Dashboard"),
  "/institute/batches": () => import("@/pages/institute/batches/Batches"),
  "/institute/batches/create": () => import("@/pages/institute/batches/CreateBatch"),
  "/institute/teachers": () => import("@/pages/institute/teachers/Teachers"),
  "/institute/teachers/create": () => import("@/pages/institute/teachers/CreateTeacher"),
  "/institute/students": () => import("@/pages/institute/students/Students"),
  "/institute/students/add": () => import("@/pages/institute/students/AddStudent"),
  "/institute/timetable": () => import("@/pages/institute/timetable/Timetable"),
  "/institute/timetable/setup": () => import("@/pages/institute/timetable/TimetableSetup"),
  "/institute/timetable/view": () => import("@/pages/institute/timetable/ViewTimetable"),
  "/institute/timetable/substitution": () => import("@/pages/institute/timetable/Substitution"),
  "/institute/timetable/exam-schedule": () => import("@/pages/institute/timetable/ExamSchedule"),
  "/institute/questions": () => import("@/pages/institute/questions/Questions"),
  "/institute/content": () => import("@/pages/institute/content/Content"),
  "/institute/exams": () => import("@/pages/institute/exams/Exams"),
  "/institute/master-data": () => import("@/pages/institute/masterdata/MasterData"),
  "/institute/roles": () => import("@/pages/institute/roles/Roles"),
  "/institute/academic-schedule/setup": () => import("@/pages/institute/academic-schedule/Setup"),
  "/institute/academic-schedule/plans": () => import("@/pages/institute/academic-schedule/WeeklyPlans"),
  "/institute/academic-schedule/views": () => import("@/pages/institute/academic-schedule/AcademicViews"),
  "/institute/academic-schedule/progress": () => import("@/pages/institute/academic-schedule/Progress"),
  "/institute/academic-schedule/pending": () => import("@/pages/institute/academic-schedule/PendingConfirmations"),

  // Teacher routes
  "/teacher/dashboard": () => import("@/pages/teacher/Dashboard"),
  "/teacher/schedule": () => import("@/pages/teacher/Schedule"),
  "/teacher/lesson-plans": () => import("@/pages/teacher/LessonPlans"),
  "/teacher/academic-progress": () => import("@/pages/teacher/AcademicProgress"),
  "/teacher/assessments": () => import("@/pages/teacher/Assessments"),
  "/teacher/homework": () => import("@/pages/teacher/Homework"),
  "/teacher/content": () => import("@/pages/teacher/Content"),
  "/teacher/reference": () => import("@/pages/teacher/Reference"),
  "/teacher/profile": () => import("@/pages/teacher/Profile"),
};

// Cache for already-preloaded routes
const preloadedRoutes = new Set<string>();

/**
 * Preloads a route's chunk before navigation
 * @param path - The route path to preload
 */
export function preloadRoute(path: string): void {
  // Normalize path (remove trailing slashes, query params)
  const normalizedPath = path.split("?")[0].replace(/\/$/, "") || path;
  
  // Don't preload if already done
  if (preloadedRoutes.has(normalizedPath)) {
    return;
  }

  const importFn = routeImports[normalizedPath];
  if (importFn) {
    preloadedRoutes.add(normalizedPath);
    // Trigger the import (this loads the chunk)
    importFn().catch(() => {
      // If preload fails, remove from cache so it can be retried
      preloadedRoutes.delete(normalizedPath);
    });
  }
}

/**
 * Preloads multiple routes at once
 * @param paths - Array of route paths to preload
 */
export function preloadRoutes(paths: string[]): void {
  paths.forEach(preloadRoute);
}
