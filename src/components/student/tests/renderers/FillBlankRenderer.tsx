// Fill in the Blanks Renderer
// Multiple text inputs for blanks

import { memo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Blank {
  id: string;
  correctAnswer?: string;
  enteredAnswer?: string;
}

interface FillBlankRendererProps {
  blanks: Blank[];
  answers: Record<string, string>;
  onChange: (blankId: string, value: string) => void;
  disabled?: boolean;
}

const FillBlankRenderer = memo(function FillBlankRenderer({
  blanks,
  answers,
  onChange,
  disabled = false,
}: FillBlankRendererProps) {
  const [focusedBlank, setFocusedBlank] = useState<string | null>(null);

  const handleChange = useCallback(
    (blankId: string, value: string) => {
      onChange(blankId, value);
    },
    [onChange]
  );

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-4">
        Fill in the blanks with appropriate answers:
      </p>

      {blanks.map((blank, index) => {
        const isFocused = focusedBlank === blank.id;
        const value = answers[blank.id] || "";

        return (
          <div key={blank.id} className="space-y-1.5">
            {/* Blank Label */}
            <label
              htmlFor={`blank-${blank.id}`}
              className="text-sm font-medium text-muted-foreground"
            >
              Blank {index + 1}
            </label>

            {/* Input Field */}
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border-2",
                "transition-all duration-200",
                isFocused ? "border-primary bg-primary/5" : "border-border bg-white",
                disabled && "opacity-60"
              )}
            >
              {/* Blank number indicator */}
              <span
                className={cn(
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
                  "text-xs font-bold",
                  isFocused || value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>

              <input
                id={`blank-${blank.id}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(blank.id, e.target.value)}
                onFocus={() => setFocusedBlank(blank.id)}
                onBlur={() => setFocusedBlank(null)}
                placeholder={`Answer for blank ${index + 1}`}
                disabled={disabled}
                className={cn(
                  "flex-1 bg-transparent text-base",
                  "focus:outline-none placeholder:text-muted-foreground/50",
                  "text-foreground min-h-[28px]" // Touch target height
                )}
              />

              {/* Filled indicator */}
              {value && (
                <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </div>
          </div>
        );
      })}

      {/* Filled count */}
      {Object.keys(answers).filter((k) => answers[k]).length > 0 && (
        <p className="text-xs text-primary font-medium text-right mt-2">
          {Object.keys(answers).filter((k) => answers[k]).length} of {blanks.length} filled
        </p>
      )}
    </div>
  );
});

export default FillBlankRenderer;
