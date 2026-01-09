import { useState } from "react";
import { ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { PreviousYearPaper, examTypeLabels } from "@/data/examsData";
import { PreviousYearPaperCard } from "./PreviousYearPaperCard";
import { cn } from "@/lib/utils";

interface YearAccordionProps {
  examType: string;
  yearGroups: Record<number, PreviousYearPaper[]>;
  onViewPaper?: (paper: PreviousYearPaper) => void;
  onEditPaper?: (paper: PreviousYearPaper) => void;
  onStatsPaper?: (paper: PreviousYearPaper) => void;
}

export const YearAccordion = ({ 
  examType, 
  yearGroups, 
  onViewPaper, 
  onEditPaper, 
  onStatsPaper 
}: YearAccordionProps) => {
  const years = Object.keys(yearGroups).map(Number).sort((a, b) => b - a);
  const [expandedYears, setExpandedYears] = useState<number[]>([years[0]]); // First year expanded by default
  
  const toggleYear = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };
  
  const totalPapers = years.reduce((sum, year) => sum + yearGroups[year].length, 0);
  
  // Get exam-specific styling
  const examStyles = {
    jee_main: {
      gradient: "from-donut-orange/20 to-donut-coral/10",
      border: "border-donut-orange/30",
      accent: "text-donut-orange",
      bg: "bg-donut-orange/5",
    },
    jee_advanced: {
      gradient: "from-donut-purple/20 to-donut-pink/10",
      border: "border-donut-purple/30",
      accent: "text-donut-purple",
      bg: "bg-donut-purple/5",
    },
    neet: {
      gradient: "from-donut-teal/20 to-success/10",
      border: "border-donut-teal/30",
      accent: "text-donut-teal",
      bg: "bg-donut-teal/5",
    },
  };
  
  const style = examStyles[examType as keyof typeof examStyles] || examStyles.jee_main;
  
  return (
    <div className={cn("rounded-xl sm:rounded-2xl border overflow-hidden", style.border, style.bg)}>
      {/* Exam Type Header */}
      <div className={cn("px-3 py-3 sm:px-5 sm:py-4 bg-gradient-to-r", style.gradient)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-base sm:text-lg", style.accent, "bg-card/80")}>
              {examTypeLabels[examType]?.charAt(0) || "E"}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-foreground">{examTypeLabels[examType]}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{totalPapers} Papers Available</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Year Groups */}
      <div className="divide-y divide-border/50">
        {years.map((year) => {
          const papers = yearGroups[year];
          const isExpanded = expandedYears.includes(year);
          const publishedCount = papers.filter(p => p.status === "published").length;
          
          return (
            <div key={year}>
              {/* Year Header */}
              <button
                onClick={() => toggleYear(year)}
                className="w-full flex items-center justify-between px-3 py-2 sm:px-5 sm:py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {isExpanded ? (
                    <ChevronDown className={cn("w-4 h-4 sm:w-5 sm:h-5", style.accent)} />
                  ) : (
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  )}
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm sm:text-base text-foreground">{year}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    ({papers.length} {papers.length === 1 ? "Paper" : "Papers"})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {publishedCount > 0 && (
                    <span className="text-[10px] sm:text-xs bg-success/10 text-success px-1.5 sm:px-2 py-0.5 rounded-full">
                      {publishedCount} Published
                    </span>
                  )}
                </div>
              </button>
              
              {/* Papers Grid */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-5">
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {papers.map((paper) => (
                      <PreviousYearPaperCard
                        key={paper.id}
                        paper={paper}
                        onView={onViewPaper}
                        onEdit={onEditPaper}
                        onStats={onStatsPaper}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
