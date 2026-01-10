// Student Notifications Page - Placeholder
// Full implementation coming in future phases

import { Bell } from "lucide-react";

const StudentNotifications = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-400/25">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>
        <span className="px-2.5 py-1 bg-gradient-to-br from-red-500 to-rose-500 text-white text-xs font-bold rounded-full">
          3 new
        </span>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/50 text-center">
        <p className="text-muted-foreground">Notifications coming soon</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Class updates • Test reminders • Achievements
        </p>
      </div>
    </div>
  );
};

export default StudentNotifications;
