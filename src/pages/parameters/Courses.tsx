import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { 
  CourseListPanel, 
  CourseSubjectPanel, 
  CourseContentPanel,
  CourseManageDialog
} from "@/components/parameters";
import { courses, getChapterCountForCourse } from "@/data/masterData";

const Courses = () => {
  const navigate = useNavigate();
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

  const selectedCourse = selectedCourseId 
    ? courses.find(c => c.id === selectedCourseId)
    : null;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <PageHeader
        title="Courses"
        description="Browse course structure, subjects, chapters and topics"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" }, 
          { label: "Master Data" },
          { label: "Courses" }
        ]}
        actions={
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => setShowManageDialog(true)}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Manage Courses</span>
              <span className="sm:hidden">Manage</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => navigate("/superadmin/parameters/course-builder")}
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Course Builder</span>
              <span className="sm:hidden">Builder</span>
            </Button>
          </div>
        }
      />

      {/* Course Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
          <p className="text-xl md:text-2xl font-bold text-primary">{courses.length}</p>
          <p className="text-xs md:text-sm text-muted-foreground">Total Courses</p>
        </div>
        <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
          <p className="text-xl md:text-2xl font-bold text-primary">
            {courses.filter(c => c.status === 'published').length}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">Published</p>
        </div>
        <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
          <p className="text-xl md:text-2xl font-bold text-primary">
            {courses.filter(c => c.courseType === 'competitive').length}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">Competitive</p>
        </div>
        <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
          <p className="text-xl md:text-2xl font-bold text-primary">
            {selectedCourse ? getChapterCountForCourse(selectedCourse.id) : "—"}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            {selectedCourse ? `${selectedCourse.name} Chapters` : "Select a Course"}
          </p>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-soft border border-border/50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_180px_1fr] xl:grid-cols-[220px_200px_1fr] h-auto lg:h-[calc(100vh-440px)] lg:min-h-[450px]">
          <CourseListPanel 
            selectedCourseId={selectedCourseId}
            onSelectCourse={handleCourseSelect}
          />
          <CourseSubjectPanel 
            selectedCourseId={selectedCourseId}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={handleSubjectSelect}
          />
          <CourseContentPanel 
            selectedCourseId={selectedCourseId}
            selectedSubjectId={selectedSubjectId}
          />
        </div>
      </div>

      {/* Course Management Dialog */}
      <CourseManageDialog 
        open={showManageDialog}
        onOpenChange={setShowManageDialog}
      />
    </div>
  );
};

export default Courses;