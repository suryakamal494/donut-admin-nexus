// Upcoming Tests Section Component
// Horizontal scroll on mobile, grid on desktop

import { ClipboardList, ChevronRight } from "lucide-react";
import { upcomingTests } from "@/data/student/dashboard";
import UpcomingTestCard from "./UpcomingTestCard";
import { useNavigate } from "react-router-dom";

const UpcomingTestsSection = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-donut-coral" />
          <h3 className="font-semibold text-foreground text-sm">Upcoming Tests</h3>
          <span className="px-2 py-0.5 bg-violet-100 text-violet-600 text-xs font-medium rounded-full">
            {upcomingTests.length}
          </span>
        </div>
        <button 
          onClick={() => navigate('/student/tests')}
          className="text-xs text-donut-coral font-medium hover:underline flex items-center gap-1"
        >
          See all
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile: Horizontal Scroll | Desktop: Grid */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible scrollbar-hide">
        {upcomingTests.map((test) => (
          <UpcomingTestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingTestsSection;
