// AI Recommendations Carousel Component
// Horizontal swipeable carousel on mobile, grid on desktop

import { Sparkles } from "lucide-react";
import { aiRecommendations } from "@/data/student/dashboard";
import AIRecommendationCard from "./AIRecommendationCard";

const AIRecommendationsCarousel = () => {
  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="font-semibold text-foreground text-sm">AI Suggestions</h2>
      </div>

      {/* Mobile: Horizontal Scroll | Desktop: Grid */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible scrollbar-hide">
        {aiRecommendations.map((rec) => (
          <div key={rec.id} className="flex-shrink-0 w-[85%] sm:w-[280px] lg:w-auto">
            <AIRecommendationCard recommendation={rec} compact />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsCarousel;
