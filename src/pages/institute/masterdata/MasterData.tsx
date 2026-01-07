import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassPanelView, SubjectPanelView, ContentPanelView } from "@/components/institute/masterdata";
import { SubjectBadge } from "@/components/subject";
import { assignedTracks } from "@/data/instituteData";
import { allCBSEChapters, allCBSETopics, cbseDataStats } from "@/data/cbseMasterData";
import { courseChapterMappings, courseOwnedChapters, courseOwnedChapterTopics } from "@/data/masterData";

const MasterData = () => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(assignedTracks[0]?.id || "cbse");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const selectedTrack = assignedTracks.find(t => t.id === selectedTrackId) || assignedTracks[0];

  const handleTrackChange = (trackId: string) => {
    setSelectedTrackId(trackId);
    setSelectedClassId(null);
    setSelectedSubjectId(null);
  };

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjectId(null);
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
  };

  // Calculate stats based on selected track
  const trackStats = useMemo(() => {
    if (selectedTrack.type === "curriculum") {
      return {
        totalChapters: cbseDataStats.totalChapters,
        totalTopics: cbseDataStats.totalTopics,
        subjectBreakdown: cbseDataStats.subjectBreakdown
      };
    } else {
      // Course stats
      const mappedChapters = courseChapterMappings.filter(m => m.courseId === selectedTrack.id);
      const ownedChapters = courseOwnedChapters.filter(c => c.courseId === selectedTrack.id);
      const totalChapters = mappedChapters.length + ownedChapters.length;
      
      // Count topics from owned chapters
      const ownedTopicsCount = courseOwnedChapterTopics.filter(t => 
        ownedChapters.some(c => c.id === t.chapterId)
      ).length;
      
      // Estimate topics from mapped chapters (using CBSE data)
      const mappedTopicsCount = mappedChapters.reduce((acc, mapping) => {
        const cbseTopics = allCBSETopics.filter(t => t.chapterId === mapping.chapterId);
        return acc + cbseTopics.length;
      }, 0);

      return {
        totalChapters,
        totalTopics: mappedTopicsCount + ownedTopicsCount,
        subjectBreakdown: {} // Simplified for courses
      };
    }
  }, [selectedTrack]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data"
        description="Browse your assigned academic curriculum structure"
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

      {/* Track Selector Tabs */}
      <Tabs value={selectedTrackId} onValueChange={handleTrackChange} className="w-full">
        <TabsList className="h-auto p-1 bg-muted/50">
          {assignedTracks.map((track) => (
            <TabsTrigger
              key={track.id}
              value={track.id}
              className="px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {track.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-foreground">{trackStats.totalChapters}</div>
          <div className="text-xs text-muted-foreground">Total Chapters</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-2xl font-bold text-foreground">{trackStats.totalTopics}</div>
          <div className="text-xs text-muted-foreground">Total Topics</div>
        </div>
        {selectedTrack.type === "curriculum" && Object.keys(trackStats.subjectBreakdown).length > 0 && (
          <div className="col-span-2 bg-card rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-2">Subject Coverage</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(trackStats.subjectBreakdown).map(([subject, count]) => (
                <div key={subject} className="flex items-center gap-1.5">
                  <SubjectBadge subject={subject.charAt(0).toUpperCase() + subject.slice(1)} size="sm" />
                  <span className="text-xs text-muted-foreground">({count as number})</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedTrack.type === "course" && (
          <div className="col-span-2 bg-card rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-2">Track Type</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Competitive Track</Badge>
              <span className="text-sm text-muted-foreground">
                Includes curriculum chapters + exclusive content
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Panel Layout */}
      {selectedTrack.hasClasses ? (
        // 3-Panel Layout for Curriculum (CBSE)
        <div className="grid grid-cols-1 md:grid-cols-[160px_200px_1fr] gap-4 h-[calc(100vh-380px)] min-h-[400px]">
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
      ) : (
        // 2-Panel Layout for Course (JEE Mains) - No class selection
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 h-[calc(100vh-380px)] min-h-[400px]">
          <SubjectPanelView
            selectedClassId={null}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={handleSelectSubject}
            trackId={selectedTrack.id}
            trackType="course"
          />
          <ContentPanelView
            selectedClassId={null}
            selectedSubjectId={selectedSubjectId}
            trackId={selectedTrack.id}
            trackType="course"
          />
        </div>
      )}

      {/* Info Note */}
      <div className="bg-muted/50 rounded-lg border border-dashed p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This is a read-only view of your assigned academic content. 
          {selectedTrack.type === "curriculum" 
            ? " Hindi chapters display both Devanagari script and transliteration for accessibility."
            : " Course chapters include both curriculum-linked content and exclusive course materials."
          }
        </p>
      </div>
    </div>
  );
};

export default MasterData;
