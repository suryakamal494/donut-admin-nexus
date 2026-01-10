// Student Dashboard - Phase 1E will add full UI
// This is completely separate from other portal dashboards

import { useNavigate } from "react-router-dom";
import { studentProfile } from "@/data/student";
import { ArrowLeft, Flame } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6">
      {/* Back button */}
      <button 
        onClick={() => navigate("/student/login")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Logout</span>
      </button>

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Hi, {studentProfile.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">{studentProfile.grade}</p>
      </div>

      {/* Streak card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg shadow-orange-100/50 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-300/50">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{studentProfile.streak} Days</p>
            <p className="text-sm text-muted-foreground">Learning Streak 🔥</p>
          </div>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 text-center">
        <p className="text-muted-foreground">
          Dashboard content coming in Phase 1E
        </p>
        <p className="text-sm text-muted-foreground/70 mt-2">
          Bottom Navigation • Subject Cards • Learning Modes
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
