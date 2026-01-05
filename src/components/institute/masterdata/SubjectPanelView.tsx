import { ScrollArea } from "@/components/ui/scroll-area";
import { subjects } from "@/data/mockData";
import { allCBSEChapters } from "@/data/cbseMasterData";

interface SubjectPanelViewProps {
  selectedClassId: string | null;
  selectedSubjectId: string | null;
  onSelectSubject: (subjectId: string) => void;
}

const coreSubjectIds = ['mathematics', 'physics', 'chemistry', 'history', 'hindi'];

const subjectDotColors: Record<string, string> = {
  mathematics: '#3b82f6',
  physics: '#8b5cf6',
  chemistry: '#10b981',
  biology: '#ef4444',
  history: '#f59e0b',
  hindi: '#ec4899',
  english: '#06b6d4',
  geography: '#84cc16',
  economics: '#f97316',
  political_science: '#6366f1',
};

const getSubjectDotColor = (subjectId: string): string => {
  return subjectDotColors[subjectId] || '#94a3b8';
};

export const SubjectPanelView = ({ 
  selectedClassId, 
  selectedSubjectId, 
  onSelectSubject 
}: SubjectPanelViewProps) => {
  
  const getChapterCount = (classId: string, subjectId: string) => {
    return allCBSEChapters.filter(
      ch => ch.classId === classId && ch.subjectId === subjectId
    ).length;
  };

  const filteredSubjects = subjects.filter(subject => {
    if (!selectedClassId) return coreSubjectIds.includes(subject.id);
    const hasContent = allCBSEChapters.some(
      ch => ch.classId === selectedClassId && ch.subjectId === subject.id
    );
    return hasContent || coreSubjectIds.includes(subject.id);
  });

  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    if (!selectedClassId) return 0;
    const aCount = getChapterCount(selectedClassId, a.id);
    const bCount = getChapterCount(selectedClassId, b.id);
    return bCount - aCount;
  });

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm text-foreground">Subjects</h3>
        {!selectedClassId && (
          <p className="text-xs text-muted-foreground mt-1">Select a class first</p>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedSubjects.map((subject) => {
            const chapterCount = selectedClassId 
              ? getChapterCount(selectedClassId, subject.id) 
              : 0;
            const isSelected = selectedSubjectId === subject.id;
            
            return (
              <button
                key={subject.id}
                onClick={() => onSelectSubject(subject.id)}
                disabled={!selectedClassId}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between gap-2 ${
                  isSelected 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : selectedClassId 
                      ? 'hover:bg-muted text-foreground' 
                      : 'text-muted-foreground/50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getSubjectDotColor(subject.id) }}
                  />
                  <span className="text-sm font-medium truncate">{subject.name}</span>
                </div>
                <span className={`text-xs flex-shrink-0 ${
                  chapterCount > 0 
                    ? isSelected ? 'text-primary' : 'text-muted-foreground'
                    : 'text-muted-foreground/50'
                }`}>
                  {selectedClassId ? (chapterCount > 0 ? `${chapterCount} ch` : '—') : ''}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
