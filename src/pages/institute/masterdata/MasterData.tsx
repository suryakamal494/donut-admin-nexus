import { useState } from "react";
import { Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { ClassPanelView, SubjectPanelView, ContentPanelView } from "@/components/institute/masterdata";
import { cbseDataStats } from "@/data/cbseMasterData";
import { SubjectBadge } from "@/components/subject";

const MasterData = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjectId(null);
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data"
        description="Browse the complete academic curriculum structure"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Master Data" },
        ]}
        actions={
          <Badge variant="secondary" className="gap-1.5">
            <Eye className="h-3 w-3" />
            Read-Only
          </Badge>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-foreground">{cbseDataStats.totalChapters}</div>
          <div className="text-xs text-muted-foreground">Total Chapters</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-foreground">{cbseDataStats.totalTopics}</div>
          <div className="text-xs text-muted-foreground">Total Topics</div>
        </div>
        <div className="col-span-2 bg-card rounded-lg border p-4">
          <div className="text-xs text-muted-foreground mb-2">Subject Coverage</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(cbseDataStats.subjectBreakdown).map(([subject, count]) => (
              <div key={subject} className="flex items-center gap-1.5">
                <SubjectBadge subject={subject.charAt(0).toUpperCase() + subject.slice(1)} size="sm" />
                <span className="text-xs text-muted-foreground">({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[160px_200px_1fr] gap-4 h-[calc(100vh-320px)] min-h-[400px]">
        <ClassPanelView
          selectedClassId={selectedClassId}
          onSelectClass={handleSelectClass}
        />
        <SubjectPanelView
          selectedClassId={selectedClassId}
          selectedSubjectId={selectedSubjectId}
          onSelectSubject={handleSelectSubject}
        />
        <ContentPanelView
          selectedClassId={selectedClassId}
          selectedSubjectId={selectedSubjectId}
        />
      </div>

      {/* Info Note */}
      <div className="bg-muted/50 rounded-lg border border-dashed p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This is a read-only view of the platform's academic curriculum managed by the Super Admin. 
          Hindi chapters display both Devanagari script and transliteration for accessibility.
        </p>
      </div>
    </div>
  );
};

export default MasterData;
