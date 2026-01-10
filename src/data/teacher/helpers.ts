// Date helper functions for teacher module

// Today's date for demo
export const today = new Date();

export const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Helper to get dates for current week
export const getWeekDates = () => {
  const dates: Record<string, string> = {};
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(today);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  
  dayNames.forEach((name, i) => {
    const date = new Date(d);
    date.setDate(d.getDate() + i);
    dates[name] = formatDate(date);
  });
  return dates;
};

export const weekDates = getWeekDates();
