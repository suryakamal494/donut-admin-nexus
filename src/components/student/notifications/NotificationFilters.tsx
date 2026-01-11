import { motion } from "framer-motion";
import { Video, FileText, Trophy, Bell, Filter } from "lucide-react";

export type FilterType = "all" | "class" | "test" | "achievement";

interface NotificationFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    class: number;
    test: number;
    achievement: number;
  };
}

const filters: { id: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All", icon: Filter },
  { id: "class", label: "Classes", icon: Video },
  { id: "test", label: "Tests", icon: FileText },
  { id: "achievement", label: "Achievements", icon: Trophy },
];

const NotificationFilters = ({ activeFilter, onFilterChange, counts }: NotificationFiltersProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const count = counts[filter.id];
        const IconComponent = filter.icon;
        
        return (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              whitespace-nowrap transition-all flex-shrink-0
              ${isActive 
                ? 'bg-gradient-to-r from-[hsl(var(--donut-coral))] to-[hsl(var(--donut-orange))] text-white shadow-lg shadow-orange-300/30' 
                : 'bg-white/60 text-muted-foreground hover:bg-white/80 border border-white/50'
              }
            `}
          >
            <IconComponent className="w-4 h-4" />
            <span>{filter.label}</span>
            {count > 0 && (
              <span className={`
                px-1.5 py-0.5 rounded-full text-xs font-bold
                ${isActive ? 'bg-white/20 text-white' : 'bg-muted/20 text-muted-foreground'}
              `}>
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default NotificationFilters;
