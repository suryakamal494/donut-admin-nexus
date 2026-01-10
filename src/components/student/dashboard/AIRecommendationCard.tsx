// AI Recommendation Card Component
// Individual card for AI-powered learning suggestions

import { ChevronRight, Play, AlertCircle, Trophy, Sparkles } from "lucide-react";
import type { AIRecommendation } from "@/data/student/dashboard";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  compact?: boolean;
}

const getIcon = (type: AIRecommendation['type']) => {
  switch (type) {
    case 'continue':
      return <Play className="w-4 h-4 text-white" />;
    case 'focus':
      return <AlertCircle className="w-4 h-4 text-white" />;
    case 'quick-win':
      return <Trophy className="w-4 h-4 text-white" />;
    default:
      return <Sparkles className="w-4 h-4 text-white" />;
  }
};

const AIRecommendationCard = ({ recommendation, compact = false }: AIRecommendationCardProps) => {
  return (
    <div 
      className={`
        bg-gradient-to-br from-donut-coral to-donut-orange rounded-2xl shadow-lg shadow-donut-coral/20 
        cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200
        ${compact ? 'p-3.5 min-w-[240px]' : 'p-4'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
          {getIcon(recommendation.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-[10px] font-medium uppercase tracking-wide mb-0.5">
            {recommendation.title}
          </p>
          <p className={`text-white font-semibold ${compact ? 'text-xs line-clamp-2' : 'text-sm'}`}>
            {recommendation.description}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1">
          <span className="text-white/90 text-xs font-medium hidden sm:block">{recommendation.action}</span>
          <ChevronRight className="w-4 h-4 text-white/60" />
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationCard;
