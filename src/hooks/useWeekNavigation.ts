import { useState, useMemo, useCallback } from 'react';
import { academicWeeks, currentWeekIndex } from '@/data/academic-schedule/weeks';

interface UseWeekNavigationOptions {
  defaultWeekIndex?: number;
}

/**
 * Hook for managing week-based navigation in academic schedule views
 */
export function useWeekNavigation(options: UseWeekNavigationOptions = {}) {
  const { defaultWeekIndex = currentWeekIndex } = options;
  const [weekIndex, setWeekIndex] = useState(defaultWeekIndex);

  const navigation = useMemo(() => ({
    currentWeek: academicWeeks[weekIndex],
    weekNumber: weekIndex + 1,
    weekIndex,
    totalWeeks: academicWeeks.length,
    canGoBack: weekIndex > 0,
    canGoForward: weekIndex < academicWeeks.length - 1,
    isCurrentWeek: weekIndex === currentWeekIndex,
    isPastWeek: weekIndex < currentWeekIndex,
    isFutureWeek: weekIndex > currentWeekIndex,
  }), [weekIndex]);

  const goToWeek = useCallback((index: number) => {
    if (index >= 0 && index < academicWeeks.length) {
      setWeekIndex(index);
    }
  }, []);

  const nextWeek = useCallback(() => {
    setWeekIndex(prev => Math.min(prev + 1, academicWeeks.length - 1));
  }, []);

  const prevWeek = useCallback(() => {
    setWeekIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setWeekIndex(currentWeekIndex);
  }, []);

  return {
    ...navigation,
    goToWeek,
    nextWeek,
    prevWeek,
    goToCurrentWeek,
    allWeeks: academicWeeks,
  };
}

export default useWeekNavigation;
