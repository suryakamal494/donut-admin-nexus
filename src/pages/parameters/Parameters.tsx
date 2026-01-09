import { useState } from "react";
import { FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { 
  ClassPanel, 
  SubjectPanel, 
  ContentPanel, 
  QuickAddMenu,
  CurriculumTabs,
  CurriculumManageDialog,
  ClassFormDialog,
  SubjectFormDialog
} from "@/components/parameters";
import { cbseDataStats } from "@/data/cbseMasterData";
import { masterDataStats } from "@/data/masterData";
import { toast } from "sonner";

const Parameters = () => {
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>("cbse");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [showCurriculumDialog, setShowCurriculumDialog] = useState(false);
  const [showAddClassDialog, setShowAddClassDialog] = useState(false);
  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false);

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjectId(null);
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
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <PageHeader
        title="Curriculum"
        description="Manage curriculum structure, classes, subjects and chapters"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" }, 
          { label: "Master Data" },
          { label: "Curriculum" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowCurriculumDialog(true)}
            >
              <FolderTree className="w-4 h-4" />
              Manage Curriculums
            </Button>
            <QuickAddMenu 
              onAddClass={() => setShowAddClassDialog(true)}
              onAddSubject={() => setShowAddSubjectDialog(true)}
              onAddCurriculum={() => setShowCurriculumDialog(true)}
              onAddChapter={() => {
                if (!selectedClassId || !selectedSubjectId) {
                  toast.info("Please select a class and subject first");
                  return;
                }
                // Scroll to add chapter button - will be handled by ContentPanel
                toast.info("Use the 'Add Chapter' button in the content panel");
              }}
              onAddTopic={() => {
                if (!selectedClassId || !selectedSubjectId) {
                  toast.info("Please select a class and subject first");
                  return;
                }
                toast.info("Expand a chapter and click 'Add Topic'");
              }}
            />
          </div>
        }
      />

      {/* Curriculum Tabs */}
      <div className="bg-card rounded-xl p-3 border border-border/50 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sm font-medium text-muted-foreground shrink-0">Curriculum:</span>
            <CurriculumTabs 
              selectedCurriculumId={selectedCurriculumId}
              onSelectCurriculum={handleCurriculumChange}
              onAddCurriculum={() => setShowCurriculumDialog(true)}
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
            <span><strong className="text-foreground">{masterDataStats.totalCurriculums}</strong> Curriculums</span>
            <span><strong className="text-foreground">{masterDataStats.publishedCourses}</strong> Courses</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
          <p className="text-xl md:text-2xl font-bold text-primary">{cbseDataStats.totalChapters}</p>
          <p className="text-xs md:text-sm text-muted-foreground">Total Chapters</p>
        </div>
        <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
          <p className="text-xl md:text-2xl font-bold text-primary">{cbseDataStats.totalTopics}</p>
          <p className="text-xs md:text-sm text-muted-foreground">Total Topics</p>
        </div>
        <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
          <p className="text-xl md:text-2xl font-bold text-primary">7</p>
          <p className="text-xs md:text-sm text-muted-foreground">Classes</p>
        </div>
        <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
          <p className="text-xl md:text-2xl font-bold text-primary">5</p>
          <p className="text-xs md:text-sm text-muted-foreground">Core Subjects</p>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[160px_200px_1fr] h-auto lg:h-[calc(100vh-480px)] lg:min-h-[400px]">
          <ClassPanel 
            selectedClassId={selectedClassId}
            onSelectClass={handleClassSelect}
          />
          <SubjectPanel 
            selectedClassId={selectedClassId}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={handleSubjectSelect}
          />
          <ContentPanel 
            selectedClassId={selectedClassId}
            selectedSubjectId={selectedSubjectId}
          />
        </div>
      </div>

      {/* Curriculum Management Dialog */}
      <CurriculumManageDialog 
        open={showCurriculumDialog}
        onOpenChange={setShowCurriculumDialog}
      />

      {/* Add Class Dialog */}
      <ClassFormDialog
        open={showAddClassDialog}
        onOpenChange={setShowAddClassDialog}
      />

      {/* Add Subject Dialog */}
      <SubjectFormDialog
        open={showAddSubjectDialog}
        onOpenChange={setShowAddSubjectDialog}
      />
    </div>
  );
};

export default Parameters;