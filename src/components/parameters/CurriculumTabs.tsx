import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { curriculums, getActiveCurriculums } from "@/data/masterData";
import { Curriculum } from "@/types/masterData";

interface CurriculumTabsProps {
  selectedCurriculumId: string;
  onSelectCurriculum: (curriculumId: string) => void;
  onAddCurriculum?: () => void;
}

const CurriculumTabs = ({ 
  selectedCurriculumId, 
  onSelectCurriculum,
  onAddCurriculum 
}: CurriculumTabsProps) => {
  const activeCurriculums = getActiveCurriculums();

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      {activeCurriculums.map((curriculum) => (
        <button
          key={curriculum.id}
          onClick={() => onSelectCurriculum(curriculum.id)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
            "hover:bg-accent/50",
            selectedCurriculumId === curriculum.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            {curriculum.code}
            {selectedCurriculumId === curriculum.id && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/80" />
            )}
          </span>
        </button>
      ))}
      
      {onAddCurriculum && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
          onClick={onAddCurriculum}
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      )}
    </div>
  );
};

export default CurriculumTabs;
