import { useState, useCallback } from "react";
import { TimetableEntry } from "@/data/timetableData";

export interface TimetableAction {
  type: 'add' | 'remove' | 'update' | 'move';
  entry: TimetableEntry;
  previousEntry?: TimetableEntry; // For updates and moves
  timestamp: number;
  description: string;
}

interface TimetableHistoryState {
  entries: TimetableEntry[];
  past: TimetableAction[];
  future: TimetableAction[];
}

export const useTimetableHistory = (initialEntries: TimetableEntry[]) => {
  const [state, setState] = useState<TimetableHistoryState>({
    entries: initialEntries,
    past: [],
    future: [],
  });

  const addEntry = useCallback((entry: TimetableEntry) => {
    const action: TimetableAction = {
      type: 'add',
      entry,
      timestamp: Date.now(),
      description: `Added ${entry.subjectName} to ${entry.day} P${entry.periodNumber}`,
    };

    setState(prev => ({
      entries: [...prev.entries, entry],
      past: [...prev.past, action],
      future: [], // Clear redo stack on new action
    }));
  }, []);

  const removeEntry = useCallback((entryId: string) => {
    setState(prev => {
      const entry = prev.entries.find(e => e.id === entryId);
      if (!entry) return prev;

      const action: TimetableAction = {
        type: 'remove',
        entry,
        timestamp: Date.now(),
        description: `Removed ${entry.subjectName} from ${entry.day} P${entry.periodNumber}`,
      };

      return {
        entries: prev.entries.filter(e => e.id !== entryId),
        past: [...prev.past, action],
        future: [],
      };
    });
  }, []);

  const updateEntry = useCallback((entryId: string, updates: Partial<TimetableEntry>) => {
    setState(prev => {
      const previousEntry = prev.entries.find(e => e.id === entryId);
      if (!previousEntry) return prev;

      const updatedEntry = { ...previousEntry, ...updates };
      const action: TimetableAction = {
        type: 'update',
        entry: updatedEntry,
        previousEntry,
        timestamp: Date.now(),
        description: `Updated ${previousEntry.subjectName} at ${previousEntry.day} P${previousEntry.periodNumber}`,
      };

      return {
        entries: prev.entries.map(e => e.id === entryId ? updatedEntry : e),
        past: [...prev.past, action],
        future: [],
      };
    });
  }, []);

  const moveEntry = useCallback((entryId: string, newDay: string, newPeriod: number) => {
    setState(prev => {
      const previousEntry = prev.entries.find(e => e.id === entryId);
      if (!previousEntry) return prev;

      const updatedEntry = { ...previousEntry, day: newDay, periodNumber: newPeriod };
      const action: TimetableAction = {
        type: 'move',
        entry: updatedEntry,
        previousEntry,
        timestamp: Date.now(),
        description: `Moved ${previousEntry.subjectName} from ${previousEntry.day} P${previousEntry.periodNumber} to ${newDay} P${newPeriod}`,
      };

      return {
        entries: prev.entries.map(e => e.id === entryId ? updatedEntry : e),
        past: [...prev.past, action],
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.past.length === 0) return prev;

      const lastAction = prev.past[prev.past.length - 1];
      let newEntries = [...prev.entries];

      switch (lastAction.type) {
        case 'add':
          // Undo add = remove the entry
          newEntries = newEntries.filter(e => e.id !== lastAction.entry.id);
          break;
        case 'remove':
          // Undo remove = add back the entry
          newEntries = [...newEntries, lastAction.entry];
          break;
        case 'update':
        case 'move':
          // Undo update/move = restore previous entry
          if (lastAction.previousEntry) {
            newEntries = newEntries.map(e => 
              e.id === lastAction.entry.id ? lastAction.previousEntry! : e
            );
          }
          break;
      }

      return {
        entries: newEntries,
        past: prev.past.slice(0, -1),
        future: [lastAction, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.future.length === 0) return prev;

      const nextAction = prev.future[0];
      let newEntries = [...prev.entries];

      switch (nextAction.type) {
        case 'add':
          // Redo add = add the entry again
          newEntries = [...newEntries, nextAction.entry];
          break;
        case 'remove':
          // Redo remove = remove the entry again
          newEntries = newEntries.filter(e => e.id !== nextAction.entry.id);
          break;
        case 'update':
        case 'move':
          // Redo update/move = apply the change again
          newEntries = newEntries.map(e => 
            e.id === nextAction.entry.id ? nextAction.entry : e
          );
          break;
      }

      return {
        entries: newEntries,
        past: [...prev.past, nextAction],
        future: prev.future.slice(1),
      };
    });
  }, []);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
  const lastAction = state.past[state.past.length - 1];
  const nextAction = state.future[0];

  return {
    entries: state.entries,
    addEntry,
    removeEntry,
    updateEntry,
    moveEntry,
    undo,
    redo,
    canUndo,
    canRedo,
    lastAction,
    nextAction,
    historyLength: state.past.length,
  };
};
