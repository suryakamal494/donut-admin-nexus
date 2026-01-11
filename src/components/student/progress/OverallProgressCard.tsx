import { motion } from "framer-motion";

interface OverallProgressCardProps {
  percentage: number;
  totalChapters: number;
  completedChapters: number;
}

const OverallProgressCard = ({ percentage, totalChapters, completedChapters }: OverallProgressCardProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Overall Progress</h3>
      
      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <motion.circle
              cx="56"
              cy="56"
              r="45"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--donut-coral))" />
                <stop offset="100%" stopColor="hsl(var(--donut-orange))" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Percentage text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{percentage}%</span>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Chapters Completed</span>
            <span className="text-sm font-semibold text-foreground">{completedChapters}/{totalChapters}</span>
          </div>
          <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {totalChapters - completedChapters} chapters remaining to complete your curriculum
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OverallProgressCard;
