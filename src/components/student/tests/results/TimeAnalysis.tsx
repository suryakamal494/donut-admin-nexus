// Time Analysis Component
// Visual breakdown of time spent per question and section

import { memo, useMemo } from "react";
import { Clock, Timer, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { QuestionResult, SectionResult } from "@/data/student/testResults";
import { formatDuration, getSubjectColor } from "@/data/student/testResults";

interface TimeAnalysisProps {
  questions: QuestionResult[];
  sections: SectionResult[];
  totalTime: number;
  totalDuration: number; // in minutes
}

const TimeAnalysis = memo(function TimeAnalysis({
  questions,
  sections,
  totalTime,
  totalDuration,
}: TimeAnalysisProps) {
  // Calculate time statistics
  const timeStats = useMemo(() => {
    const times = questions.map(q => q.timeSpent);
    const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    const fastQuestions = questions.filter(q => q.timeSpent < 60).length;
    const slowQuestions = questions.filter(q => q.timeSpent > 180).length;
    
    return { avgTime, maxTime, minTime, fastQuestions, slowQuestions };
  }, [questions]);

  // Time distribution buckets
  const timeDistribution = useMemo(() => {
    const buckets = [
      { label: "< 30s", min: 0, max: 30, count: 0, color: "bg-emerald-500" },
      { label: "30s-1m", min: 30, max: 60, count: 0, color: "bg-blue-500" },
      { label: "1-2m", min: 60, max: 120, count: 0, color: "bg-amber-500" },
      { label: "2-3m", min: 120, max: 180, count: 0, color: "bg-orange-500" },
      { label: "> 3m", min: 180, max: Infinity, count: 0, color: "bg-red-500" },
    ];
    
    questions.forEach(q => {
      const bucket = buckets.find(b => q.timeSpent >= b.min && q.timeSpent < b.max);
      if (bucket) bucket.count++;
    });
    
    return buckets;
  }, [questions]);

  const maxBucketCount = Math.max(...timeDistribution.map(b => b.count));

  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Timer className="w-5 h-5 text-primary" />
        Time Analysis
      </h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Time</p>
          <p className="font-bold text-foreground">{formatDuration(totalTime)}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Avg/Question</p>
          <p className="font-bold text-foreground">{formatDuration(timeStats.avgTime)}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <Zap className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">{"Fast (< 1m)"}</p>
          <p className="font-bold text-emerald-600">{timeStats.fastQuestions}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <AlertTriangle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">{"Slow (> 3m)"}</p>
          <p className="font-bold text-amber-600">{timeStats.slowQuestions}</p>
        </div>
      </div>
      
      {/* Time Distribution Chart */}
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">Time Distribution</p>
        <div className="flex items-end gap-2 h-24">
          {timeDistribution.map((bucket, index) => (
            <div key={bucket.label} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ 
                  height: maxBucketCount > 0 
                    ? `${(bucket.count / maxBucketCount) * 100}%` 
                    : "0%" 
                }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={cn(
                  "w-full rounded-t-md min-h-[4px]",
                  bucket.color
                )}
              />
              <span className="text-[10px] text-muted-foreground text-center">
                {bucket.label}
              </span>
              <span className="text-xs font-bold text-foreground">
                {bucket.count}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Section Time Breakdown */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Time by Section</p>
        <div className="space-y-2">
          {sections.map((section, index) => {
            const colors = getSubjectColor(section.subject);
            const percent = totalTime > 0 
              ? Math.round((section.totalTime / totalTime) * 100) 
              : 0;
            
            return (
              <div key={section.id} className="flex items-center gap-3">
                <span className={cn("w-2 h-2 rounded-full shrink-0", colors.bg)} />
                <span className="text-sm text-foreground w-24 truncate">{section.name}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={cn("h-full rounded-full", colors.bg)}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {formatDuration(section.totalTime)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default TimeAnalysis;
