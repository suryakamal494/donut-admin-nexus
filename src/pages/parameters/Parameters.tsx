import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, FileText, FolderTree, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { 
  ClassPanel, 
  SubjectPanel, 
  ContentPanel, 
  QuickAddMenu,
  IndependentDataPanel,
  CurriculumTabs 
} from "@/components/parameters";
import { cbseDataStats } from "@/data/cbseMasterData";
import { masterDataStats } from "@/data/masterData";

const Parameters = () => {
  const navigate = useNavigate();
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>("cbse");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [showCoursesPanel, setShowCoursesPanel] = useState(false);
  const [showCurriculumPanel, setShowCurriculumPanel] = useState(false);

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjectId(null); // Reset subject when class changes
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
  };

  const handleCurriculumChange = (curriculumId: string) => {
    setSelectedCurriculumId(curriculumId);
    setSelectedClassId(null);
    setSelectedSubjectId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Master Data"
        description="Manage curriculum structure and competitive courses"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" }, 
          { label: "Master Data" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate("/superadmin/parameters/course-builder")}
            >
              <Layers className="w-4 h-4" />
              Course Builder
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate("/superadmin/parameters/courses")}
            >
              <FileText className="w-4 h-4" />
              View Courses
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowCoursesPanel(true)}
            >
              <Settings className="w-4 h-4" />
              Manage Courses
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowCurriculumPanel(true)}
            >
              <FolderTree className="w-4 h-4" />
              Curriculum
            </Button>
            <QuickAddMenu 
              onAddChapter={() => {}}
              onAddTopic={() => {}}
            />
          </div>
        }
      />

      {/* Curriculum Tabs */}
      <div className="bg-card rounded-xl p-3 border border-border/50 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Curriculum:</span>
            <CurriculumTabs 
              selectedCurriculumId={selectedCurriculumId}
              onSelectCurriculum={handleCurriculumChange}
              onAddCurriculum={() => setShowCurriculumPanel(true)}
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span><strong className="text-foreground">{masterDataStats.totalCurriculums}</strong> Curriculums</span>
            <span><strong className="text-foreground">{masterDataStats.publishedCourses}</strong> Courses</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
          <p className="text-2xl font-bold text-primary">{cbseDataStats.totalChapters}</p>
          <p className="text-sm text-muted-foreground">Total Chapters</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
          <p className="text-2xl font-bold text-primary">{cbseDataStats.totalTopics}</p>
          <p className="text-sm text-muted-foreground">Total Topics</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
          <p className="text-2xl font-bold text-primary">7</p>
          <p className="text-sm text-muted-foreground">Classes</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
          <p className="text-2xl font-bold text-primary">5</p>
          <p className="text-sm text-muted-foreground">Core Subjects</p>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[160px_200px_1fr] h-auto md:h-[calc(100vh-420px)] md:min-h-[400px]">
          {/* Panel 1: Classes */}
          <ClassPanel 
            selectedClassId={selectedClassId}
            onSelectClass={handleClassSelect}
          />

          {/* Panel 2: Subjects */}
          <SubjectPanel 
            selectedClassId={selectedClassId}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={handleSubjectSelect}
          />

          {/* Panel 3: Chapters & Topics */}
          <ContentPanel 
            selectedClassId={selectedClassId}
            selectedSubjectId={selectedSubjectId}
          />
        </div>
      </div>

      {/* Side Panels for Independent Data */}
      <IndependentDataPanel 
        open={showCoursesPanel}
        onOpenChange={setShowCoursesPanel}
        type="courses"
      />
      <IndependentDataPanel 
        open={showCurriculumPanel}
        onOpenChange={setShowCurriculumPanel}
        type="curriculum"
      />
    </div>
  );
};

export default Parameters;
