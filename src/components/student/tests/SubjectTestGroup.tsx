// Subject Test Group Component
// Collapsible group of tests organized by subject
// Mobile-first with accordion behavior

import { memo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import TestCard from "./TestCard";
import { getSubjectColors, getSubjectIcon } from "@/components/student/shared/subjectColors";
import type { StudentTest } from "@/data/student/tests";
import { getSubjectDisplayName, subjectColorMap, getLiveTestsCount } from "@/data/student/tests";

interface SubjectTestGroupProps {
  subject: string;
  tests: StudentTest[];
  defaultExpanded?: boolean;
  onStartTest?: (testId: string) => void;
  onViewTest?: (testId: string) => void;
  onViewResults?: (testId: string) => void;
}

const SubjectTestGroup = memo(function SubjectTestGroup({
  subject,
  tests,
  defaultExpanded = true,
  onStartTest,
  onViewTest,
  onViewResults,
}: SubjectTestGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const colorKey = subjectColorMap[subject] || "blue";
  const colors = getSubjectColors(colorKey);
  const Icon = getSubjectIcon(subject);
  const liveCount = getLiveTestsCount(tests);

  return (
    <div className="mb-4">
      {/* Subject Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between",
          "px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl",
          "bg-gradient-to-r transition-all duration-200",
          colors.headerGradient,
          "hover:opacity-95"
        )}
      >
        <div className="flex items-center gap-2.5">
          {/* Subject Icon */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>

          {/* Subject Name & Count */}
          <div className="text-left">
            <h3 className="text-white font-semibold text-sm sm:text-base">
              {getSubjectDisplayName(subject)}
            </h3>
            <p className="text-white/70 text-xs">
              {tests.length} test{tests.length !== 1 ? "s" : ""}
              {liveCount > 0 && (
                <span className="text-white ml-1.5">• {liveCount} live</span>
              )}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="flex items-center gap-2">
          {liveCount > 0 && (
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/80" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/80" />
          )}
        </div>
      </button>

      {/* Tests List - Animated */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  onStart={onStartTest}
                  onView={onViewTest}
                  onResults={onViewResults}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default SubjectTestGroup;
