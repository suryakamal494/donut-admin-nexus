// Student Dashboard - Complete with all sections
// Completely separate from other portal dashboards

import { studentProfile, studentSubjects } from "@/data/student";
import { Flame, Sparkles, Clock, ChevronRight, Target, Zap } from "lucide-react";
import { StudentBottomNav } from "@/components/student/layout";
import { StudentSubjectCard } from "@/components/student";

// Mock data for today's tasks
const todaysTasks = [
  { id: 1, type: "class", title: "Chemistry - Organic Compounds", time: "10:00 AM", status: "upcoming" },
  { id: 2, type: "test", title: "Physics Quiz: Motion", time: "2:30 PM", status: "pending" },
  { id: 3, type: "homework", title: "Math Assignment Due", time: "5:00 PM", status: "pending" },
];

// Get greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const StudentDashboard = () => {
  const firstName = studentProfile.name.split(' ')[0];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-orange-50/80 to-rose-50/60 pb-28">
      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-72 h-72 bg-gradient-to-br from-donut-coral/10 to-donut-pink/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="fixed bottom-40 left-0 w-56 h-56 bg-gradient-to-tr from-amber-200/15 to-orange-200/10 rounded-full blur-2xl -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-5 pt-6">
        {/* Header with greeting */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-muted-foreground text-sm mb-0.5">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-foreground">
              Hi, {firstName}! 👋
            </h1>
          </div>
          
          {/* Streak badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg shadow-orange-300/40">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">{studentProfile.streak}</span>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
          <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-300/40">
              <Target className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">78%</p>
              <p className="text-[10px] text-muted-foreground">Overall</p>
            </div>
          </div>
          
          <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md shadow-violet-300/40">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">15</p>
              <p className="text-[10px] text-muted-foreground">XP Today</p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-300/40">
              <Clock className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">2h</p>
              <p className="text-[10px] text-muted-foreground">Study Time</p>
            </div>
          </div>
        </div>

        {/* AI Recommendation Card */}
        <div className="bg-gradient-to-br from-donut-coral/90 to-donut-pink/90 rounded-3xl p-4 mb-6 shadow-lg shadow-donut-coral/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/90 text-xs font-medium mb-0.5">AI Suggestion</p>
              <p className="text-white text-sm font-semibold">
                Focus on Physics today - you're 2 chapters behind schedule
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/60 flex-shrink-0 mt-2" />
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Today's Tasks</h2>
            <button className="text-xs text-donut-coral font-medium">See all</button>
          </div>
          
          <div className="space-y-2.5">
            {todaysTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center gap-3 p-3.5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  task.type === 'class' 
                    ? 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-300/40' 
                    : task.type === 'test'
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-300/40'
                    : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-300/40'
                } shadow-md`}>
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* My Subjects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">My Subjects</h2>
            <button className="text-xs text-donut-coral font-medium">View all</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {studentSubjects.map((subject) => (
              <StudentSubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <StudentBottomNav />
    </div>
  );
};

export default StudentDashboard;
