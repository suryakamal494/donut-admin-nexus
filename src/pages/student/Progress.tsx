// Student Progress Page - Placeholder
// Full implementation coming in future phases

import { TrendingUp } from "lucide-react";

const StudentProgress = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-400/25">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-foreground">My Progress</h1>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/50 text-center">
        <p className="text-muted-foreground">Progress tracking coming soon</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Subject-wise progress • Streaks • Achievements
        </p>
      </div>
    </div>
  );
};

export default StudentProgress;
