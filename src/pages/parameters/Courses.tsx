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
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Courses"
        description="Browse course structure, subjects, chapters and topics"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" }, 
          { label: "Master Data" },
          { label: "Courses" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowManageDialog(true)}
            >
              <Settings className="w-4 h-4" />
              Manage Courses
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate("/superadmin/parameters/course-builder")}
            >
              <Layers className="w-4 h-4" />
              Course Builder
            </Button>
          </div>
        }
      />

      {/* Course Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
          <p className="text-2xl font-bold text-primary">{courses.length}</p>
          <p className="text-sm text-muted-foreground">Total Courses</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
          <p className="text-2xl font-bold text-primary">
            {courses.filter(c => c.status === 'published').length}
          </p>
          <p className="text-sm text-muted-foreground">Published</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
          <p className="text-2xl font-bold text-primary">
            {courses.filter(c => c.courseType === 'competitive').length}
          </p>
          <p className="text-sm text-muted-foreground">Competitive</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
          <p className="text-2xl font-bold text-primary">
            {selectedCourse ? getChapterCountForCourse(selectedCourse.id) : "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {selectedCourse ? `${selectedCourse.name} Chapters` : "Select a Course"}
          </p>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[220px_200px_1fr] h-auto md:h-[calc(100vh-380px)] md:min-h-[450px]">
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