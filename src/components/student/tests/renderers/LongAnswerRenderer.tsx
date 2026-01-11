// Long Answer Renderer
// Extended text area with word count and formatting hints

import { memo, useState, useCallback, useMemo } from "react";
import { FileText, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface LongAnswerRendererProps {
  value: string;
  onChange: (value: string) => void;
  wordLimit?: number;
  disabled?: boolean;
}

const LongAnswerRenderer = memo(function LongAnswerRenderer({
  value,
  onChange,
  wordLimit = 250,
  disabled = false,
}: LongAnswerRendererProps) {
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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          Detailed Answer
        </label>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            isOverLimit
              ? "bg-red-100 text-red-600"
              : percentUsed > 80
              ? "bg-amber-100 text-amber-600"
              : "bg-muted text-muted-foreground"
          )}
        >
          {wordCount} / {wordLimit} words
        </span>
      </div>

      {/* Hint */}
      <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Write a detailed, structured answer. Include relevant formulas, diagrams references, 
          and step-by-step explanations where applicable.
        </p>
      </div>

      {/* Text Area */}
      <div
        className={cn(
          "relative rounded-xl border-2 transition-all duration-200 overflow-hidden",
          isFocused ? "border-primary shadow-lg shadow-primary/10" : "border-border",
          isOverLimit && "border-red-300"
        )}
      >
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Write your detailed answer here. Include all relevant steps and explanations..."
          disabled={disabled}
          rows={10}
          className={cn(
            "w-full px-4 py-4 bg-transparent",
            "text-sm sm:text-base text-foreground leading-relaxed",
            "placeholder:text-muted-foreground/50",
            "focus:outline-none resize-none",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />

        {/* Word limit progress bar */}
        <div className="h-1.5 bg-muted">
          <div
            className={cn(
              "h-full transition-all duration-300",
              isOverLimit
                ? "bg-red-500"
                : percentUsed > 80
                ? "bg-amber-500"
                : "bg-gradient-to-r from-primary to-emerald-500"
            )}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {value.length} characters • {value.split("\n").filter((l) => l.trim()).length} paragraphs
        </span>

        {isOverLimit && (
          <span className="flex items-center gap-1 text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            Exceeded by {wordCount - wordLimit} words
          </span>
        )}
      </div>
    </div>
  );
});

export default LongAnswerRenderer;
