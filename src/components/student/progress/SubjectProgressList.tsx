import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calculator, FlaskConical, Globe, Atom } from "lucide-react";

interface SubjectProgress {
  id: string;
  name: string;
  icon: string;
  color: string;
  completedChapters: number;
  totalChapters: number;
  percentage: number;
}

interface SubjectProgressListProps {
  subjects: SubjectProgress[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calculator: Calculator,
  flask: FlaskConical,
  globe: Globe,
  atom: Atom,
  book: BookOpen,
};

// Memoized individual subject progress item
interface SubjectProgressItemProps {
  subject: SubjectProgress;
  index: number;
}

const SubjectProgressItem = memo(function SubjectProgressItem({ subject, index }: SubjectProgressItemProps) {
  const IconComponent = useMemo(() => iconMap[subject.icon] || BookOpen, [subject.icon]);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="flex items-center gap-4"
    >
      {/* Subject Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${subject.color}20` }}
      >
        <IconComponent className="w-5 h-5" style={{ color: subject.color }} />
      </div>

      {/* Progress Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-foreground truncate">{subject.name}</span>
          <span className="text-xs text-muted-foreground ml-2">
            {subject.completedChapters}/{subject.totalChapters}
          </span>
        </div>
        <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${subject.percentage}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
            className="h-full rounded-full"
            style={{ backgroundColor: subject.color }}
          />
        </div>
      </div>

      {/* Percentage */}
      <span className="text-sm font-semibold text-foreground w-12 text-right">
        {subject.percentage}%
      </span>
    </motion.div>
  );
});

const SubjectProgressList = memo(function SubjectProgressList({ subjects }: SubjectProgressListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Subject-wise Progress</h3>
      
      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <SubjectProgressItem key={subject.id} subject={subject} index={index} />
        ))}
      </div>
    </motion.div>
  );
});

export default SubjectProgressList;
