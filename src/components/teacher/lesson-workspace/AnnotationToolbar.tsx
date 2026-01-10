import { 
  Pencil, Highlighter, Circle, Square, ArrowRight, Type, 
  Eraser, Trash2, Undo, Redo, X, Camera, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { AnnotationTool } from "./types";

interface AnnotationToolbarProps {
  activeTool: AnnotationTool;
  activeColor: string;
  brushSize: number;
  onToolChange: (tool: AnnotationTool) => void;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onClose: () => void;
  onSaveScreenshot: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

const tools: { id: AnnotationTool; icon: typeof Pencil; label: string }[] = [
  { id: 'pen', icon: Pencil, label: 'Pen' },
  { id: 'highlighter', icon: Highlighter, label: 'Highlighter' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

const colors = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#FF2D55', // Pink
  '#FFFFFF', // White
  '#000000', // Black
];

export const AnnotationToolbar = ({
  activeTool,
  activeColor,
  brushSize,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onUndo,
  onRedo,
  onClear,
  onClose,
  onSaveScreenshot,
  canUndo,
  canRedo,
  isSaving,
}: AnnotationToolbarProps) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-1 bg-black/80 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/10">
      {/* Tools */}
      <div className="flex items-center gap-1 pr-2 border-r border-white/20">
        {tools.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="icon"
            onClick={() => onToolChange(id)}
            className={cn(
              "h-10 w-10 rounded-xl transition-all",
              activeTool === id 
                ? "bg-white/20 text-white" 
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      {/* Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-white/60 hover:bg-white/10 hover:text-white"
            title="Color"
          >
            <div 
              className="w-6 h-6 rounded-full border-2 border-white/50"
              style={{ backgroundColor: activeColor }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-3 bg-black/90 backdrop-blur-xl border-white/10"
          side="bottom"
        >
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                  activeColor === color ? "border-white scale-110" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <label className="text-xs text-white/60 mb-2 block">Brush Size: {brushSize}px</label>
            <Slider
              value={[brushSize]}
              onValueChange={([value]) => onBrushSizeChange(value)}
              min={2}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Divider */}
      <div className="w-px h-6 bg-white/20 mx-1" />

      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        className="h-10 w-10 rounded-xl text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30"
        title="Undo"
      >
        <Undo className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        className="h-10 w-10 rounded-xl text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30"
        title="Redo"
      >
        <Redo className="w-5 h-5" />
      </Button>

      {/* Clear */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        className="h-10 w-10 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400"
        title="Clear All"
      >
        <Trash2 className="w-5 h-5" />
      </Button>

      {/* Save Screenshot */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSaveScreenshot}
        disabled={isSaving}
        className="h-10 w-10 rounded-xl text-white/60 hover:bg-green-500/20 hover:text-green-400 disabled:opacity-50"
        title="Save Screenshot"
      >
        {isSaving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Camera className="w-5 h-5" />
        )}
      </Button>

      {/* Divider */}
      <div className="w-px h-6 bg-white/20 mx-1" />

      {/* Close Annotation Mode */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-10 w-10 rounded-xl text-white/60 hover:bg-white/10 hover:text-white"
        title="Exit Annotation Mode"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};
