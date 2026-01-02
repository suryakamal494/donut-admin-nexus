import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Undo2, Redo2 } from "lucide-react";
import { TimetableAction } from "@/hooks/useTimetableHistory";
import { cn } from "@/lib/utils";

interface UndoRedoControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  lastAction?: TimetableAction;
  nextAction?: TimetableAction;
}

export const UndoRedoControls = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  lastAction,
  nextAction,
}: UndoRedoControlsProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className={cn(
                "h-8 w-8 p-0",
                !canUndo && "opacity-50"
              )}
            >
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {canUndo && lastAction 
              ? `Undo: ${lastAction.description}` 
              : 'Nothing to undo'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className={cn(
                "h-8 w-8 p-0",
                !canRedo && "opacity-50"
              )}
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {canRedo && nextAction 
              ? `Redo: ${nextAction.description}` 
              : 'Nothing to redo'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
