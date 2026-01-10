// Student Subjects Page - Grid of all subjects
// Full implementation coming in future phases

import { studentSubjects } from "@/data/student";
import { StudentBottomNav } from "@/components/student/layout";
import { StudentSubjectCard } from "@/components/student";
import { BookOpen, Search } from "lucide-react";

const StudentSubjects = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-orange-50/80 to-rose-50/60 pb-28">
      <div className="fixed top-0 right-0 w-64 h-64 bg-gradient-to-br from-donut-coral/10 to-donut-pink/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-5 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-donut-coral to-donut-pink flex items-center justify-center shadow-lg shadow-donut-coral/25">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">My Subjects</h1>
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search subjects..."
            className="w-full h-12 pl-11 pr-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-donut-coral/30"
          />
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-2 gap-3">
          {studentSubjects.map((subject) => (
            <StudentSubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>

      <StudentBottomNav />
    </div>
  );
};

export default StudentSubjects;
