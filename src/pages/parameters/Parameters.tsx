import { useState } from "react";
import { Settings, FileText, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { 
  ClassPanel, 
  SubjectPanel, 
  ContentPanel, 
  QuickAddMenu,
  IndependentDataPanel 
} from "@/components/parameters";
import { cbseDataStats } from "@/data/cbseMasterData";

const Parameters = () => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Master Data"
        description="Manage academic structure - classes, subjects, chapters, and topics"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" }, 
          { label: "Master Data" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowCoursesPanel(true)}
            >
              <FileText className="w-4 h-4" />
              Courses
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

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
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
        <div className="grid grid-cols-[160px_200px_1fr] h-[calc(100vh-320px)] min-h-[500px]">
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
