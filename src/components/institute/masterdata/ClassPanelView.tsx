import { ScrollArea } from "@/components/ui/scroll-area";
import { classes } from "@/data/mockData";
import { allCBSEChapters } from "@/data/cbseMasterData";

interface ClassPanelViewProps {
  selectedClassId: string | null;
  onSelectClass: (classId: string) => void;
}

export const ClassPanelView = ({ selectedClassId, onSelectClass }: ClassPanelViewProps) => {
  const getChapterCount = (classId: string) => {
    return allCBSEChapters.filter(ch => ch.classId === classId).length;
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm text-foreground">Classes</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {classes.map((cls) => {
            const chapterCount = getChapterCount(cls.id);
            const isSelected = selectedClassId === cls.id;
            
            return (
              <button
                key={cls.id}
                onClick={() => onSelectClass(cls.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between group ${
                  isSelected 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="text-sm font-medium">{cls.name}</span>
                <span className={`text-xs ${
                  chapterCount > 0 
                    ? isSelected ? 'text-primary' : 'text-muted-foreground'
                    : 'text-muted-foreground/50'
                }`}>
                  {chapterCount > 0 ? `${chapterCount} ch` : '—'}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
