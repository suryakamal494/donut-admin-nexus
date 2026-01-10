// Student Subjects Page - Grid of all subjects
// Full implementation coming in future phases

import { studentSubjects } from "@/data/student";
import { StudentSubjectCard } from "@/components/student";
import { BookOpen, Search } from "lucide-react";

const StudentSubjects = () => {
  return (
    <div className="w-full">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {studentSubjects.map((subject) => (
          <StudentSubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default StudentSubjects;
