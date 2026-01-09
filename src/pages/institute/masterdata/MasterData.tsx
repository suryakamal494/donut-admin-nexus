import { useState, useMemo } from "react";
import { Eye, BookOpen, FileText, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassPanelView, SubjectPanelView, ContentPanelView } from "@/components/institute/masterdata";
import { SubjectBadge } from "@/components/subject";
import { assignedTracks } from "@/data/instituteData";
import { allCBSEChapters, allCBSETopics, cbseDataStats } from "@/data/cbseMasterData";
import { courseChapterMappings, courseOwnedChapters, courseOwnedChapterTopics } from "@/data/masterData";
import { cn } from "@/lib/utils";

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
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Master Data"
        description="Browse your assigned academic curriculum structure"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Master Data" },
        ]}
        actions={
          <Badge variant="secondary" className="gap-1.5 bg-muted/80">
            <Eye className="h-3 w-3" />
            Read-Only
          </Badge>
        }
      />

      {/* Track Selector Tabs */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <Tabs value={selectedTrackId} onValueChange={handleTrackChange} className="w-full">
          <TabsList className="h-auto p-1 bg-muted/50 w-full sm:w-auto inline-flex">
            {assignedTracks.map((track) => (
              <TabsTrigger
                key={track.id}
                value={track.id}
                className={cn(
                  "px-3 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm",
                  "data-[state=active]:text-primary font-medium"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />
                {track.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Chapters</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">{trackStats.totalChapters}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/10 rounded-xl border border-amber-500/10 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-muted-foreground font-medium">Topics</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">{trackStats.totalTopics}</div>
        </div>
        
        {selectedTrack.type === "curriculum" && Object.keys(trackStats.subjectBreakdown).length > 0 && (
          <div className="col-span-2 bg-card rounded-xl border p-3 sm:p-4">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Subject Coverage</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(trackStats.subjectBreakdown).map(([subject, count]) => (
                <div key={subject} className="flex items-center gap-1">
                  <SubjectBadge subject={subject.charAt(0).toUpperCase() + subject.slice(1)} size="sm" />
                  <span className="text-xs text-muted-foreground font-medium">({count as number})</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedTrack.type === "course" && (
          <div className="col-span-2 bg-gradient-to-br from-teal-500/5 to-emerald-500/10 rounded-xl border border-teal-500/10 p-3 sm:p-4">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Track Type</div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="text-xs bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-100">
                Competitive Track
              </Badge>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Curriculum chapters + exclusive content
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Panel Layout */}
      <div className="flex flex-col min-h-0 flex-1">
        {selectedTrack.hasClasses ? (
          // 3-Panel Layout for Curriculum (CBSE)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[180px_200px_1fr] gap-3 sm:gap-4 h-[50vh] sm:h-[55vh] lg:h-[calc(100vh-450px)] min-h-[300px] max-h-[600px]">
            <ClassPanelView
              selectedClassId={selectedClassId}
              onSelectClass={handleSelectClass}
            />
            <SubjectPanelView
              selectedClassId={selectedClassId}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={handleSelectSubject}
            />
            <div className="md:col-span-2 lg:col-span-1 min-h-0">
              <ContentPanelView
                selectedClassId={selectedClassId}
                selectedSubjectId={selectedSubjectId}
              />
            </div>
          </div>
        ) : (
          // 2-Panel Layout for Course (JEE Mains) - No class selection
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-3 sm:gap-4 h-[50vh] sm:h-[55vh] md:h-[calc(100vh-450px)] min-h-[300px] max-h-[600px]">
            <SubjectPanelView
              selectedClassId={null}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={handleSelectSubject}
              trackId={selectedTrack.id}
              trackType="course"
            />
            <div className="min-h-0">
              <ContentPanelView
                selectedClassId={null}
                selectedSubjectId={selectedSubjectId}
                trackId={selectedTrack.id}
                trackType="course"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info Note - Outside the flex container */}
      <div className="mt-4 bg-muted/30 rounded-xl border border-dashed p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> This is a read-only view of your assigned academic content. 
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
