interface CourseStatsProps {
  totalCourses: number;
  publishedCount: number;
  competitiveCount: number;
  selectedChapterCount: number | null;
  selectedCourseName?: string;
}

export const CourseStats = ({
  totalCourses,
  publishedCount,
  competitiveCount,
  selectedChapterCount,
  selectedCourseName,
}: CourseStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
        <p className="text-xl md:text-2xl font-bold text-primary">{totalCourses}</p>
        <p className="text-xs md:text-sm text-muted-foreground">Total Courses</p>
      </div>
      <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
        <p className="text-xl md:text-2xl font-bold text-primary">{publishedCount}</p>
        <p className="text-xs md:text-sm text-muted-foreground">Published</p>
      </div>
      <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
        <p className="text-xl md:text-2xl font-bold text-primary">{competitiveCount}</p>
        <p className="text-xs md:text-sm text-muted-foreground">Competitive</p>
      </div>
      <div className="bg-card rounded-xl p-3 md:p-4 border border-border/50 shadow-soft">
        <p className="text-xl md:text-2xl font-bold text-primary">
          {selectedChapterCount !== null ? selectedChapterCount : "—"}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">
          {selectedCourseName ? `${selectedCourseName} Chapters` : "Select a Course"}
        </p>
      </div>
    </div>
  );
};
