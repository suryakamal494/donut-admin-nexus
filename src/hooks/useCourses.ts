import { useState, useMemo } from "react";
import { courses, getChapterCountForCourse } from "@/data/masterData";

export function useCourses() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [showManageDialog, setShowManageDialog] = useState(false);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedSubjectId(null);
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
  };

  const selectedCourse = useMemo(() => 
    selectedCourseId ? courses.find(c => c.id === selectedCourseId) : null,
    [selectedCourseId]
  );

  const stats = useMemo(() => ({
    totalCourses: courses.length,
    publishedCount: courses.filter(c => c.status === 'published').length,
    competitiveCount: courses.filter(c => c.courseType === 'competitive').length,
    selectedChapterCount: selectedCourse ? getChapterCountForCourse(selectedCourse.id) : null,
  }), [selectedCourse]);

  return {
    // State
    selectedCourseId,
    selectedSubjectId,
    selectedCourse,
    showManageDialog,
    setShowManageDialog,
    stats,
    
    // Handlers
    handleCourseSelect,
    handleSubjectSelect,
  };
}
