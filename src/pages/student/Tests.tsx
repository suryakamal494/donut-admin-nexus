// Student Tests Page - Placeholder
// Full implementation coming in future phases

import { Trophy } from "lucide-react";

const StudentTests = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-400/25">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Tests & Practice</h1>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/50 text-center">
        <p className="text-muted-foreground">Tests & Practice coming soon</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Compete mode • Practice tests • Challenges
        </p>
      </div>
    </div>
  );
};

export default StudentTests;
