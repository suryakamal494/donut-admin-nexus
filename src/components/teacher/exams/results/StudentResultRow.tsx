import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StudentResult {
  id: string;
  studentName: string;
  rollNumber: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeTaken: number;
  rank: number;
}

interface StudentResultRowProps {
  student: StudentResult;
}

export const StudentResultRow = ({ student }: StudentResultRowProps) => {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
        student.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        #{student.rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{student.studentName}</p>
        <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold">{student.score}/{student.maxScore}</p>
        <div className="flex items-center gap-1 justify-end">
          <Progress 
            value={student.percentage} 
            className="w-16 h-1.5" 
          />
          <span className="text-xs text-muted-foreground w-8">{student.percentage}%</span>
        </div>
      </div>
      <div className="text-right text-xs text-muted-foreground shrink-0 hidden sm:block">
        <Clock className="w-3 h-3 inline mr-1" />
        {student.timeTaken}m
      </div>
    </div>
  );
};
