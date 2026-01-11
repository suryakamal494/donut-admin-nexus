// Section Analysis Component
// Subject-wise performance cards with visual indicators

import { memo } from "react";
import { BarChart3, Clock, Target, TrendingUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { SectionResult } from "@/data/student/testResults";
import { getSubjectColor, formatDuration } from "@/data/student/testResults";

interface SectionAnalysisProps {
  sections: SectionResult[];
  onSectionClick?: (sectionId: string) => void;
}

const SectionAnalysis = memo(function SectionAnalysis({
  sections,
  onSectionClick,
}: SectionAnalysisProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        Section-wise Analysis
      </h3>
      
      <div className="space-y-3">
        {sections.map((section, index) => {
          const colors = getSubjectColor(section.subject);
          const scorePercent = section.maxMarks > 0 
            ? Math.round((section.marksObtained / section.maxMarks) * 100) 
            : 0;
          
          return (
            <motion.button
              key={section.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => onSectionClick?.(section.id)}
              className={cn(
                "w-full p-3 sm:p-4 rounded-xl border border-border",
                "hover:border-primary/40 transition-all duration-200",
                "text-left group"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-3 h-3 rounded-full",
                    colors.bg
                  )} />
                  <span className="font-medium text-foreground">{section.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-bold",
                    scorePercent >= 70 ? "text-emerald-600" : 
                    scorePercent >= 50 ? "text-amber-600" : "text-red-600"
                  )}>
                    {section.marksObtained}/{section.maxMarks}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercent}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className={cn("h-full rounded-full", colors.bg)}
                />
              </div>
              
              {/* Stats Row */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span className="text-emerald-600 font-medium">{section.correct}</span>
                    <span>/</span>
                    <span className="text-red-600 font-medium">{section.incorrect}</span>
                    <span>/</span>
                    <span>{section.skipped}</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {section.accuracy}% accuracy
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(section.totalTime)}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

export default SectionAnalysis;
