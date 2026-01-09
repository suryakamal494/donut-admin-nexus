import { ExamBlock } from "@/types/examBlock";
import { parseISO, getDay, addDays, format, isWithinInterval, startOfDay } from "date-fns";

const DAY_MAP: Record<string, number> = {
  'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
  'Thursday': 4, 'Friday': 5, 'Saturday': 6
};

const DAY_INDEX_TO_NAME: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday'
};

export interface BlockCheckResult {
  blocked: boolean;
  blockName?: string;
  examTypeId?: string;
  timeType?: string;
  periods?: number[];
}

/**
 * Check if a specific slot is blocked by an exam
 */
export function isSlotBlocked(
  date: Date,
  periodNumber: number,
  batchId: string | null,
  blocks: ExamBlock[]
): BlockCheckResult {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayName = DAY_INDEX_TO_NAME[getDay(date)];
  
  for (const block of blocks) {
    if (!block.isActive) continue;
    
    // Check if date matches
    let dateMatches = false;
    
    if (block.dateType === 'recurring' && block.recurringConfig) {
      const { dayOfWeek, startDate, endDate } = block.recurringConfig;
      if (dayOfWeek === dayName) {
        const rangeStart = startOfDay(parseISO(startDate));
        const rangeEnd = startOfDay(parseISO(endDate));
        const checkDate = startOfDay(date);
        
        if (isWithinInterval(checkDate, { start: rangeStart, end: rangeEnd })) {
          dateMatches = true;
        }
      }
    } else {
      dateMatches = block.dates.includes(dateStr);
    }
    
    if (!dateMatches) continue;
    
    // Check scope
    let scopeMatches = false;
    
    if (block.scopeType === 'institution') {
      scopeMatches = true;
    } else if (block.scopeType === 'batch' && batchId) {
      scopeMatches = block.scopeId === batchId;
    } else if (block.scopeType === 'course' || block.scopeType === 'class') {
      // For course/class scopes, we'd need to check batch mappings
      // For now, assume they affect all batches
      scopeMatches = true;
    }
    
    if (!scopeMatches) continue;
    
    // Check time/period
    if (block.timeType === 'full_day') {
      return {
        blocked: true,
        blockName: block.name,
        examTypeId: block.examTypeId,
        timeType: 'full_day'
      };
    }
    
    if (block.timeType === 'periods' && block.periods?.includes(periodNumber)) {
      return {
        blocked: true,
        blockName: block.name,
        examTypeId: block.examTypeId,
        timeType: 'periods',
        periods: block.periods
      };
    }
    
    // For time_range, we'd need period time mappings
    // For simplicity, treat time_range as full_day
    if (block.timeType === 'time_range') {
      return {
        blocked: true,
        blockName: block.name,
        examTypeId: block.examTypeId,
        timeType: 'time_range'
      };
    }
  }
  
  return { blocked: false };
}

/**
 * Get all blocks that affect a specific date
 */
export function getBlocksForDate(date: Date, blocks: ExamBlock[]): ExamBlock[] {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayName = DAY_INDEX_TO_NAME[getDay(date)];
  
  return blocks.filter(block => {
    if (!block.isActive) return false;
    
    if (block.dateType === 'recurring' && block.recurringConfig) {
      const { dayOfWeek, startDate, endDate } = block.recurringConfig;
      if (dayOfWeek !== dayName) return false;
      
      const rangeStart = startOfDay(parseISO(startDate));
      const rangeEnd = startOfDay(parseISO(endDate));
      const checkDate = startOfDay(date);
      
      return isWithinInterval(checkDate, { start: rangeStart, end: rangeEnd });
    }
    
    return block.dates.includes(dateStr);
  });
}
