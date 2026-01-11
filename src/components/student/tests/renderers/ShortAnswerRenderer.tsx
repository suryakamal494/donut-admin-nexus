// Short Answer Renderer
// Text area with word count

import { memo, useState, useCallback, useMemo } from "react";
import { Type, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortAnswerRendererProps {
  value: string;
  onChange: (value: string) => void;
  wordLimit?: number;
  disabled?: boolean;
}

const ShortAnswerRenderer = memo(function ShortAnswerRenderer({
  value,
  onChange,
  wordLimit = 50,
  disabled = false,
}: ShortAnswerRendererProps) {
  const [isFocused, setIsFocused] = useState(false);

  const wordCount = useMemo(() => {
    if (!value.trim()) return 0;
    return value.trim().split(/\s+/).length;
  }, [value]);

  const isOverLimit = wordCount > wordLimit;
  const percentUsed = Math.min((wordCount / wordLimit) * 100, 100);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <Type className="w-4 h-4" />
          Your Answer
        </label>
        <span
          className={cn(
            "text-xs font-medium",
            isOverLimit ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {wordCount} / {wordLimit} words
        </span>
      </div>

      {/* Text Area */}
      <div
        className={cn(
          "relative rounded-xl border-2 transition-all duration-200 overflow-hidden",
          isFocused ? "border-primary" : "border-border",
          isOverLimit && "border-red-300"
        )}
      >
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your answer here..."
          disabled={disabled}
          rows={4}
          className={cn(
            "w-full px-4 py-3 bg-transparent",
            "text-sm sm:text-base text-foreground",
            "placeholder:text-muted-foreground/50",
            "focus:outline-none resize-none",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />

        {/* Word limit progress bar */}
        <div className="h-1 bg-muted">
          <div
            className={cn(
              "h-full transition-all duration-300",
              isOverLimit ? "bg-red-500" : percentUsed > 80 ? "bg-amber-500" : "bg-primary"
            )}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Warning if over limit */}
      {isOverLimit && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>You have exceeded the word limit by {wordCount - wordLimit} words</span>
        </div>
      )}
    </div>
  );
});

export default ShortAnswerRenderer;
