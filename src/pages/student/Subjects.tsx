// Student Subjects Page - Grid of all subjects with real-time search

import { studentSubjects } from "@/data/student";
import { StudentSubjectCard } from "@/components/student";
import { BookOpen, Search, X } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

const StudentSubjects = () => {
  const { searchQuery, setSearchQuery, filteredData } = useFilters({
    data: studentSubjects,
    searchFields: ['name'],
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-donut-coral to-donut-pink flex items-center justify-center shadow-lg shadow-donut-coral/25">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">My Subjects</h1>
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              {filteredData.length} of {studentSubjects.length} subjects
            </p>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subjects..."
          className="w-full h-12 pl-11 pr-10 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-donut-coral/30"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Subjects Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {filteredData.map((subject) => (
            <StudentSubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No subjects found</h3>
          <p className="text-sm text-muted-foreground">
            Try searching with a different term
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentSubjects;
