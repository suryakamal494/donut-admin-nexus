import { cn } from "@/lib/utils";

interface TopPerformer {
  id: string;
  studentName: string;
  rollNumber: string;
  score: number;
  maxScore: number;
  percentage: number;
}

interface TopPerformerRowProps {
  student: TopPerformer;
  index: number;
}

export const TopPerformerRow = ({ student, index }: TopPerformerRowProps) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors",
        index === 0 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-muted/50"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
        index === 0 ? "bg-amber-500 text-white" : 
        index === 1 ? "bg-gray-400 text-white" :
        index === 2 ? "bg-amber-700 text-white" : "bg-muted text-muted-foreground"
      )}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{student.studentName}</p>
        <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold">{student.score}/{student.maxScore}</p>
        <p className="text-xs text-muted-foreground">{student.percentage}%</p>
      </div>
    </div>
  );
};
