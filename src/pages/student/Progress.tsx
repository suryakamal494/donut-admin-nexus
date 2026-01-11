import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import OverallProgressCard from "@/components/student/progress/OverallProgressCard";
import SubjectProgressList from "@/components/student/progress/SubjectProgressList";
import StreakCalendar from "@/components/student/progress/StreakCalendar";
import AchievementBadges from "@/components/student/progress/AchievementBadges";
import WeeklyActivityChart from "@/components/student/progress/WeeklyActivityChart";

// Mock data - replace with real data from API
const mockSubjectProgress = [
  { id: "1", name: "Mathematics", icon: "calculator", color: "#3B82F6", completedChapters: 8, totalChapters: 12, percentage: 67 },
  { id: "2", name: "Physics", icon: "atom", color: "#8B5CF6", completedChapters: 6, totalChapters: 10, percentage: 60 },
  { id: "3", name: "Chemistry", icon: "flask", color: "#10B981", completedChapters: 5, totalChapters: 8, percentage: 63 },
  { id: "4", name: "Biology", icon: "book", color: "#F59E0B", completedChapters: 7, totalChapters: 9, percentage: 78 },
];

const mockActiveDays = [
  new Date(2026, 0, 2),
  new Date(2026, 0, 3),
  new Date(2026, 0, 5),
  new Date(2026, 0, 6),
  new Date(2026, 0, 7),
  new Date(2026, 0, 8),
  new Date(2026, 0, 9),
  new Date(2026, 0, 10),
  new Date(2026, 0, 11),
];

const mockAchievements = [
  { id: "1", name: "First Steps", description: "Complete your first chapter", icon: "star", unlocked: true, color: "#F59E0B" },
  { id: "2", name: "Week Warrior", description: "7 day study streak", icon: "flame", unlocked: true, color: "#EF4444" },
  { id: "3", name: "Quick Learner", description: "Complete 5 chapters in one day", icon: "zap", unlocked: true, color: "#8B5CF6" },
  { id: "4", name: "Math Master", description: "Score 90%+ in 3 math tests", icon: "trophy", unlocked: true, color: "#3B82F6" },
  { id: "5", name: "Science Star", description: "Complete all science subjects", icon: "award", unlocked: false, color: "#10B981" },
  { id: "6", name: "Perfect Score", description: "Get 100% in any test", icon: "target", unlocked: false, color: "#EC4899" },
  { id: "7", name: "Bookworm", description: "Study for 100 hours total", icon: "book", unlocked: false, color: "#6366F1" },
  { id: "8", name: "Champion", description: "Rank #1 in your class", icon: "crown", unlocked: false, color: "#F59E0B" },
];

const mockWeeklyData = [
  { day: "Mon", minutes: 45, chapters: 2 },
  { day: "Tue", minutes: 60, chapters: 3 },
  { day: "Wed", minutes: 30, chapters: 1 },
  { day: "Thu", minutes: 75, chapters: 4 },
  { day: "Fri", minutes: 50, chapters: 2 },
  { day: "Sat", minutes: 90, chapters: 5 },
  { day: "Sun", minutes: 40, chapters: 2 },
];

const StudentProgress = () => {
  // Calculate totals from mock data
  const totalChapters = mockSubjectProgress.reduce((acc, s) => acc + s.totalChapters, 0);
  const completedChapters = mockSubjectProgress.reduce((acc, s) => acc + s.completedChapters, 0);
  const overallPercentage = Math.round((completedChapters / totalChapters) * 100);
  
  const totalMinutes = mockWeeklyData.reduce((acc, d) => acc + d.minutes, 0);
  const averageMinutes = Math.round(totalMinutes / mockWeeklyData.length);

  return (
    <div className="w-full pb-24 lg:pb-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-400/25">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">My Progress</h1>
          <p className="text-xs text-muted-foreground">Track your learning journey</p>
        </div>
      </motion.div>

      {/* Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <OverallProgressCard
            percentage={overallPercentage}
            totalChapters={totalChapters}
            completedChapters={completedChapters}
          />
          
          <SubjectProgressList subjects={mockSubjectProgress} />
          
          {/* Mobile: Show Weekly Chart here */}
          <div className="lg:hidden">
            <WeeklyActivityChart
              data={mockWeeklyData}
              totalMinutes={totalMinutes}
              averageMinutes={averageMinutes}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <StreakCalendar
            currentStreak={8}
            longestStreak={14}
            activeDays={mockActiveDays}
          />
          
          {/* Desktop: Show Weekly Chart here */}
          <div className="hidden lg:block">
            <WeeklyActivityChart
              data={mockWeeklyData}
              totalMinutes={totalMinutes}
              averageMinutes={averageMinutes}
            />
          </div>
          
          <AchievementBadges achievements={mockAchievements} />
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
