// Student Dashboard - Phase 1E will add full UI
// This is completely separate from other portal dashboards

import { studentProfile } from "@/data/student";
import { Flame } from "lucide-react";
import { StudentBottomNav } from "@/components/student/layout";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-orange-50/80 to-rose-50/60 pb-24">
      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-gradient-to-br from-donut-coral/10 to-donut-pink/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="fixed bottom-32 left-0 w-48 h-48 bg-gradient-to-tr from-amber-200/15 to-orange-200/10 rounded-full blur-2xl -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-5 pt-8">
        {/* Greeting */}
        <div className="mb-6">
          <p className="text-muted-foreground text-sm mb-1">Good morning</p>
          <h1 className="text-2xl font-bold text-foreground">
            Hi, {studentProfile.name.split(' ')[0]}! 👋
          </h1>
        </div>

        {/* Streak card - compact */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg shadow-orange-100/30 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-300/40">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{studentProfile.streak} Days</p>
              <p className="text-xs text-muted-foreground">Learning Streak 🔥</p>
            </div>
          </div>
        </div>

        {/* Placeholder content */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/50 text-center">
          <p className="text-muted-foreground text-sm">
            Full dashboard content coming in Phase 1E
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Subject Cards • Learning Modes • Today's Tasks
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <StudentBottomNav />
    </div>
  );
};

export default StudentDashboard;
