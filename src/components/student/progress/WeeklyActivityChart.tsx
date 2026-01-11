import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface WeeklyData {
  day: string;
  minutes: number;
  chapters: number;
}

interface WeeklyActivityChartProps {
  data: WeeklyData[];
  totalMinutes: number;
  averageMinutes: number;
}

const WeeklyActivityChart = ({ data, totalMinutes, averageMinutes }: WeeklyActivityChartProps) => {
  const maxMinutes = Math.max(...data.map(d => d.minutes));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Weekly Activity</h3>
        <span className="text-xs text-muted-foreground">This week</span>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-gradient-to-br from-[hsl(var(--donut-coral))]/10 to-[hsl(var(--donut-orange))]/10 rounded-xl p-3">
          <p className="text-xs text-muted-foreground">Total Time</p>
          <p className="text-lg font-bold text-foreground">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </p>
        </div>
        <div className="flex-1 bg-muted/10 rounded-xl p-3">
          <p className="text-xs text-muted-foreground">Daily Avg</p>
          <p className="text-lg font-bold text-foreground">{averageMinutes}m</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as WeeklyData;
                  return (
                    <div className="bg-foreground text-background px-3 py-2 rounded-lg text-xs">
                      <p className="font-medium">{data.day}</p>
                      <p>{data.minutes} minutes</p>
                      <p>{data.chapters} chapters</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="minutes" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.minutes === maxMinutes 
                    ? 'hsl(var(--donut-coral))' 
                    : 'hsl(var(--donut-coral) / 0.4)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[hsl(var(--donut-coral))]" />
          <span className="text-xs text-muted-foreground">Most active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[hsl(var(--donut-coral))]/40" />
          <span className="text-xs text-muted-foreground">Study time</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyActivityChart;
